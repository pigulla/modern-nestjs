import type { Writable } from 'node:stream'

import type { Channel } from '#domain/channel/channel.js'
import type { Network } from '#domain/network/network.js'

export abstract class IStreamProvider {
  public abstract stop(): void
  public abstract getNowPlaying(): {
    track: string
    channel: Channel
    network: Network
  } | null
  public abstract streamTo(channel: Channel, stream: Writable): Promise<void>
}
