import { Channel, type ChannelKey } from '@modern-nestjs/domain/channel.js'

export abstract class IChannelService {
  public abstract getByKey(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
}
