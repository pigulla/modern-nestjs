import type { ChannelFilterKey } from './channel-filter.js'

export class ChannelFilterNotFoundError extends Error {
  public constructor(key: ChannelFilterKey) {
    super(`Channel filter with key "${key}" not found`)
  }
}
