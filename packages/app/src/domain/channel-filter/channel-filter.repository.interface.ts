import {
  ChannelFilter,
  type ChannelFilterID,
  type ChannelFilterKey,
} from '#domain/channel-filter/channel-filter.js'
import type { NetworkID } from '#domain/network/network.js'

export abstract class IChannelFilterRepository {
  public abstract getIdOf(key: ChannelFilterKey): Promise<ChannelFilterID>
  public abstract get(id: ChannelFilterID): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getAllForNetwork(id: NetworkID): Promise<ChannelFilter[]>
  public abstract insert(channelFilter: ChannelFilter): Promise<ChannelFilter>
}
