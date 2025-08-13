import { ChannelFilter, type ChannelFilterKey } from '@di/domain/channel-filter.js'
import type { NetworkKey } from '@di/domain/network.js'

export abstract class IChannelFilterService {
  public abstract get(key: ChannelFilterKey): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getAllForNetwork(key: NetworkKey): Promise<ChannelFilter[]>
}
