import { EntityNotFoundError } from '../entity-not-found.error.js'

import type { ChannelID, ChannelKey } from './channel.js'

export class ChannelNotFoundError extends EntityNotFoundError {
  public constructor(identifier: ChannelID | ChannelKey) {
    super(`Channel with ${typeof identifier === 'number' ? 'id' : 'key'} "${identifier}" not found`)
  }
}
