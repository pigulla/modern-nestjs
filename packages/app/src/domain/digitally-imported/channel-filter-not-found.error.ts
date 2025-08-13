import type { ChannelFilterID, ChannelFilterKey } from '@modern-nestjs/domain/channel-filter.js'

export class ChannelFilterNotFoundError extends Error {
  public constructor(identifier: { id: ChannelFilterID } | { key: ChannelFilterKey }) {
    super(
      `Channel filter with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
