import { connect } from 'node:net'
import type { Writable } from 'node:stream'

import { Inject, Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { IStreamProvider } from '#application/stream-provider.interface.js'
import type { Channel } from '#domain/channel/channel.js'
import type { Network } from '#domain/network/network.js'
import { INetworkRepository } from '#domain/network/network.repository.interface.js'

import { AUDIO_ADDICT_CONFIG, type AudioAddictConfig } from '../config/audio-addict.config.js'

import { IIcecastTransformStream } from './icecast-transform-stream.interface.js'

@Injectable()
export class StreamProvider implements IStreamProvider, OnApplicationShutdown {
  private readonly logger = new Logger(StreamProvider.name)
  private readonly listeningKey: string
  private readonly moduleRef: ModuleRef
  private readonly networkRepository: INetworkRepository
  private active: { network: Network; channel: Channel; stream: Writable; track: string } | null

  public constructor(
    networkRepository: INetworkRepository,
    @Inject(AUDIO_ADDICT_CONFIG) config: AudioAddictConfig,
    moduleRef: ModuleRef,
  ) {
    this.networkRepository = networkRepository
    this.listeningKey = config.listeningKey
    this.moduleRef = moduleRef
    this.active = null
  }

  public onApplicationShutdown(_signal?: string): void {
    this.stop()
  }

  public stop(): void {
    if (this.active === null || this.active.stream.closed || this.active.stream.destroyed) {
      return
    }

    this.logger.log('Closing stream')
    this.active.stream.destroy()
  }

  public getNowPlaying(): { network: Network; channel: Channel; track: string } | null {
    return this.active
      ? {
          network: this.active.network,
          channel: this.active.channel,
          track: this.active.track,
        }
      : null
  }

  public async streamTo(channel: Channel, stream: Writable): Promise<void> {
    const icecastTransformStream = await this.moduleRef.resolve(IIcecastTransformStream)
    const path = `/${channel.key}?${this.listeningKey}`

    this.stop()
    this.active = {
      channel,
      network: await this.networkRepository.getByID(channel.networkId),
      track: '',
      stream: stream.once('close', () => {
        this.logger.debug('Stream closed')
        this.active = null
      }),
    }

    icecastTransformStream.onTrackChange(track => {
      if (this.active) {
        this.active.track = track
      }
    })

    this.logger.log('Starting stream', { channel: channel.key })

    // TODO: Get host/port from PLS file?
    const socket = connect(80, 'prem2.di.fm', () => {
      socket.pipe(icecastTransformStream).pipe(stream)
      socket.write([`GET ${path} HTTP/1.0`, 'Icy-MetaData:1', '', ''].join('\r\n'))
    })
  }
}
