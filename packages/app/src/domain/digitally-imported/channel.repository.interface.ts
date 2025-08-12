import type { Channel, ChannelID, ChannelKey } from '@modern-nestjs/domain/channel.js'

export abstract class IChannelRepository {
  public abstract getByID(id: ChannelID): Promise<Channel>
  public abstract getByKey(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract insert(channel: Channel): Promise<Channel>
}
