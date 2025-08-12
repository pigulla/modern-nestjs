import type { ChannelID, ChannelKey } from '@modern-nestjs/domain/channel.js'

export class ChannelNotFoundError extends Error {
  public constructor(data: { key: ChannelKey } | { id: ChannelID }) {
    super(
      `Channel with ${'key' in data ? 'data' : 'key'} "${'key' in data ? data.key : data.id}" not found`,
    )
  }
}
