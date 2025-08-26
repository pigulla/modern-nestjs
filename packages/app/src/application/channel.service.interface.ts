import { Channel, type ChannelKey } from '#domain/channel/channel.js'
import type { NetworkKey } from '#domain/network/network.js'

export abstract class IChannelService {
  public abstract get(networkKey: NetworkKey, channelKey: ChannelKey): Promise<Channel>
  public abstract getAllForNetwork(networkKey: NetworkKey): Promise<Channel[]>
}
