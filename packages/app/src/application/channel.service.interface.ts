import { Channel, type ChannelKey } from '@di/domain/channel.js'

export abstract class IChannelService {
  public abstract get(key: ChannelKey): Promise<Channel>
  public abstract getAll(): Promise<Channel[]>
}
