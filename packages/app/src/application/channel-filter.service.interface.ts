import { ChannelFilter, type ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import type { NetworkKey } from '#domain/network/network.js'

export abstract class IChannelFilterService {
  public abstract get(key: ChannelFilterKey): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<ChannelFilter[]>
}
