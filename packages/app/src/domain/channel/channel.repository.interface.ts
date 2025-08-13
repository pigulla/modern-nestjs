import type { Channel, ChannelID, ChannelKey } from '@di/domain/channel.js'
import type { NetworkID } from '@di/domain/network.js'

export abstract class IChannelRepository {
  public abstract getIdOf(key: ChannelKey): Promise<ChannelID>
  public abstract get(id: ChannelID): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract getAllForNetwork(id: NetworkID): Promise<Channel[]>
  public abstract insert(channel: Channel): Promise<Channel>
}
