import type { Channel, ChannelID, ChannelKey } from '@di/domain/channel.js'

export abstract class IChannelRepository {
  public abstract getIdOf(key: ChannelKey): Promise<ChannelID>
  public abstract get(id: ChannelID): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract insert(channel: Channel): Promise<Channel>
}
