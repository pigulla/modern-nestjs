import type { ChannelFilterIdentifier } from '@modern-nestjs/domain/channel-filter.js'

export class ChannelFilterNotFoundError extends Error {
  public constructor(identifier: ChannelFilterIdentifier) {
    super(
      `Channel filter with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
