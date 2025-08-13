import type { NetworkID, NetworkKey } from '@modern-nestjs/domain/network.js'

export class NetworkNotFoundError extends Error {
  public constructor(identifier: { id: NetworkID } | { key: NetworkKey }) {
    super(
      `Network with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
