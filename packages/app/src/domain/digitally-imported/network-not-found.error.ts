import type { NetworkIdentifier } from '@modern-nestjs/domain/network.js'

export class NetworkNotFoundError extends Error {
  public constructor(identifier: NetworkIdentifier) {
    super(
      `Network with ${'key' in identifier ? 'key' : 'id'} "${'key' in identifier ? identifier.key : identifier.id}" not found`,
    )
  }
}
