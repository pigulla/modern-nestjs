import type { ChannelKey } from './channel.js'

export class ChannelNotFoundError extends Error {
  public constructor(key: ChannelKey) {
    super(`Channel with key "${key}" not found`)
  }
}
