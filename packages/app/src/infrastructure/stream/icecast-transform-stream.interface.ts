import { Transform } from 'node:stream'

export type TrackChangeCallback = (track: string) => void

export abstract class IIcecastTransformStream extends Transform {
  public abstract onTrackChange(callback: TrackChangeCallback): void
}
