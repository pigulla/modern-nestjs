import type { Channel } from '#domain/channel/channel.js'
import type { ChannelFilter } from '#domain/channel-filter/channel-filter.js'
import type { Network, NetworkID } from '#domain/network/network.js'

export abstract class IAudioAddictAPI {
  public abstract getNetworks(): Promise<Network[]>
  public abstract getChannels(id: NetworkID): Promise<Channel[]>
  public abstract getChannelFilters(id: NetworkID): Promise<ChannelFilter[]>
}
