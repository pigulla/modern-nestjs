import type { ChannelIdentifier } from '@modern-nestjs/domain/channel.js'

export class ChannelNotFoundError extends Error {
  public constructor(identifier: ChannelIdentifier) {
    super(
      `Channel with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
