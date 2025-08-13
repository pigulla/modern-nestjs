import type { ChannelID, ChannelKey } from '@di/domain/channel.js'

export class ChannelNotFoundError extends Error {
  public constructor(identifier: { id: ChannelID } | { key: ChannelKey }) {
    super(
      `Channel with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
