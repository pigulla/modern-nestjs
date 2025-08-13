import { ChannelFilter, type ChannelFilterKey } from '@di/domain/channel-filter.js'

export abstract class IChannelFilterService {
  public abstract get(key: ChannelFilterKey): Promise<ChannelFilter>
  public abstract getAll(): Promise<ChannelFilter[]>
}
