import { EventEmitter } from 'node:events'
import { Transform, type TransformCallback } from 'node:stream'

import { Injectable, Logger } from '@nestjs/common'

import type { TrackChangeCallback } from '#infrastructure/stream/icecast-transform-stream.interface.js'

import { trimTrailingZeroBytes } from './trim-trailing-zero-bytes.js'

// See https://stackoverflow.com/questions/4911062/pulling-track-info-from-an-audio-stream-using-php/4914538#4914538

export const TRACK_CHANGED = Symbol('track-changed')

const HEADER_BODY_SEPARATOR = '\r\n\r\n'
const META_INTERVAL_HEADER = 'icy-metaint'
const META_SIZE_FIELD_WIDTH = 1
const META_SIZE_MULTIPLIER = 16
const MAX_META_SIZE_BYTES = 256 ** META_SIZE_FIELD_WIDTH * META_SIZE_MULTIPLIER

@Injectable()
export class IcecastTransformStream extends Transform {
  private readonly logger = new Logger(IcecastTransformStream.name)
  private readonly eventEmitter: EventEmitter
  private metaDataIntervalBytes: number
  private headersReceived: boolean
  private buffer: Buffer

  public constructor() {
    super()

    this.eventEmitter = new EventEmitter()
    this.metaDataIntervalBytes = Number.POSITIVE_INFINITY
    this.headersReceived = false
    this.buffer = Buffer.allocUnsafe(0)
  }

  private getMetaIntervalFromHeaders(headers: string[]): number {
    const metaIntHeader = headers
      .map<[string, number]>(header => [header, header.indexOf(':')])
      .filter(([, index]) => index !== -1)
      .map(
        ([header, index]) =>
          [header.substring(0, index).toLowerCase(), header.substring(index + 1).trim()] as const,
      )
      .find(([key, _value]) => key === META_INTERVAL_HEADER)

    if (!metaIntHeader || !metaIntHeader[1].match(/^\d+$/)) {
      throw new Error(`Header '${META_INTERVAL_HEADER}' is missing or has an invalid value`)
    }

    return Number.parseInt(metaIntHeader[1], 10)
  }

  private processBufferAsHeaderChunk(): void {
    const index = this.buffer.indexOf(HEADER_BODY_SEPARATOR)

    if (index === -1) {
      // Headers not fully received yet, just keep buffering.
      return
    }

    const header = this.buffer.subarray(0, index).toString()
    const [statusLine, ...headers] = header.split('\r\n')

    const matches = /^HTTP\/1\.0\s(\d{3})\s/.exec(statusLine)

    if (!matches) {
      throw new Error('Missing status line in response')
    }
    if (matches[1] !== '200') {
      throw new Error(`Expected status code 200 but got ${matches[1]}`)
    }

    // Copy the response body into the buffer.
    this.buffer = this.buffer.subarray(index + Buffer.byteLength(HEADER_BODY_SEPARATOR))

    this.metaDataIntervalBytes = this.getMetaIntervalFromHeaders(headers)
    this.headersReceived = true

    this.logger.debug(`Metadata expected every ${this.metaDataIntervalBytes} bytes`)
  }

  private getTitleFromMetadata(metadata: string): string {
    const string = trimTrailingZeroBytes(metadata)
    const matches = /^StreamTitle='(.*)';$/.exec(string)

    if (!matches) {
      throw new Error('StreamTitle not found')
    }

    return matches[1]
  }

  // When called, the buffer is expected to be large enough so that the interleaved metadata is guaranteed to be
  // contained in it. We extract the metadata chunk and process it and then return the payload before it.
  private processBuffer(): Buffer {
    const metaDataLength = this.buffer[this.metaDataIntervalBytes] * META_SIZE_MULTIPLIER

    if (metaDataLength > 0) {
      const metadata = this.buffer
        .subarray(
          this.metaDataIntervalBytes + META_SIZE_FIELD_WIDTH,
          this.metaDataIntervalBytes + META_SIZE_FIELD_WIDTH + metaDataLength,
        )
        .toString()

      const title = this.getTitleFromMetadata(metadata)
      this.logger.debug(`New title in metadata received: "${title}"`)

      this.eventEmitter.emit(TRACK_CHANGED, title)
    }

    const data = Buffer.copyBytesFrom(this.buffer, 0, this.metaDataIntervalBytes)
    this.buffer = this.buffer.subarray(
      this.metaDataIntervalBytes + META_SIZE_FIELD_WIDTH + metaDataLength,
    )

    return data
  }

  /**
   * Return true iff enough data is buffered so that it necessarily contain both the metadata size field and the metadata
   * itself.
   */
  private isBufferReady(): boolean {
    return (
      this.buffer.length >= this.metaDataIntervalBytes + META_SIZE_FIELD_WIDTH + MAX_META_SIZE_BYTES
    )
  }

  public onTrackChange(callback: TrackChangeCallback): void {
    this.eventEmitter.on(TRACK_CHANGED, callback)
  }

  public override _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    // Append data to existing buffer.
    this.buffer = Buffer.concat([this.buffer, chunk])

    try {
      if (!this.headersReceived) {
        this.processBufferAsHeaderChunk()
        callback()
      } else if (this.isBufferReady()) {
        callback(null, this.processBuffer())
      } else {
        callback()
      }
    } catch (error) {
      callback(error as Error)
    }
  }
}
