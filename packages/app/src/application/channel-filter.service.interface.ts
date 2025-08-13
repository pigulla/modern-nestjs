import {
  ChannelFilter,
  type ChannelFilterIdentifier,
} from '@modern-nestjs/domain/channel-filter.js'

export abstract class IChannelFilterService {
  public abstract get(identifier: ChannelFilterIdentifier): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
}
