import type { Channel, ChannelIdentifier } from '@modern-nestjs/domain/channel.js'

export abstract class IChannelRepository {
  public abstract get(id: ChannelIdentifier): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
  public abstract insert(channel: Channel): Promise<Channel>
}
