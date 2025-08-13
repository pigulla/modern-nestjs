import { Channel, type ChannelIdentifier } from '@modern-nestjs/domain/channel.js'

export abstract class IChannelService {
  public abstract get(identifier: ChannelIdentifier): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
}
