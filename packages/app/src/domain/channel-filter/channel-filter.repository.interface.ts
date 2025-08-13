import type { NetworkKey } from '../network/network.js'

import { ChannelFilter, type ChannelFilterKey } from './channel-filter.js'

export abstract class IChannelFilterRepository {
  public abstract get(key: ChannelFilterKey): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<ChannelFilter[]>
  public abstract insert(channelFilter: ChannelFilter): Promise<ChannelFilter>
}
