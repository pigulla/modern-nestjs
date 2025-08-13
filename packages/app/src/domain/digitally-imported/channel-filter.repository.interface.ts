import {
  ChannelFilter,
  type ChannelFilterID,
  type ChannelFilterKey,
} from '@modern-nestjs/domain/channel-filter.js'
import type { NetworkID } from '@modern-nestjs/domain/network.js'

export abstract class IChannelFilterRepository {
  public abstract getIdOf(key: ChannelFilterKey): Promise<ChannelFilterID>
  public abstract get(id: ChannelFilterID): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract getForNetwork(id: NetworkID): Promise<ChannelFilter[]>
  public abstract insert(channelFilter: ChannelFilter): Promise<ChannelFilter>
}
