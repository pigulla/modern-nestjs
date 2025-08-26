import { EntityNotFoundError } from '../entity-not-found.error.js'

import type { ChannelFilterID, ChannelFilterKey } from './channel-filter.js'

export class ChannelFilterNotFoundError extends EntityNotFoundError {
  public constructor(identifier: ChannelFilterID | ChannelFilterKey) {
    super(
      `Channel Filter with ${typeof identifier === 'number' ? 'id' : 'key'} "${identifier}" not found`,
    )
  }
}
