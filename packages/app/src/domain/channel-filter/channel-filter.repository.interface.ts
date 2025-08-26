import type { NetworkID } from '../network/network.js'

import { ChannelFilter, type ChannelFilterID, type ChannelFilterKey } from './channel-filter.js'

export abstract class IChannelFilterRepository {
  public abstract getByID(id: ChannelFilterID): Promise<ChannelFilter>
  public abstract getByKeyForNetwork(
    networkId: NetworkID,
    key: ChannelFilterKey,
  ): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getAllForNetwork(id: NetworkID): Promise<ChannelFilter[]>
  public abstract insert(channelFilter: ChannelFilter): Promise<ChannelFilter>
}
