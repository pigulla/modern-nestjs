import type { Writable } from 'node:stream'

import type { Channel } from '#domain/channel/channel.js'

export abstract class IStreamProvider {
  public abstract stop(): void
  public abstract getChannel(): Channel | null
  public abstract getTrack(): string | null
  public abstract streamTo(channel: Channel, stream: Writable): Promise<void>
}
