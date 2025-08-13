import {
  ChannelFilter,
  type ChannelFilterIdentifier,
} from '@modern-nestjs/domain/channel-filter.js'

export abstract class IChannelFilterRepository {
  public abstract get(id: ChannelFilterIdentifier): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
  public abstract insert(channelFilter: ChannelFilter): Promise<ChannelFilter>
}
