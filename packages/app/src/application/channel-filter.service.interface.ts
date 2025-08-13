import { ChannelFilter, type ChannelFilterKey } from '@modern-nestjs/domain/channel-filter.js'

export abstract class IChannelFilterService {
  public abstract get(key: ChannelFilterKey): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
}
