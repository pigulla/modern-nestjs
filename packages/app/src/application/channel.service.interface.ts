import { Channel, type ChannelKey } from '@di/domain/channel.js'
import type { NetworkKey } from '@di/domain/network.js'

export abstract class IChannelService {
  public abstract get(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<Channel[]>
}
