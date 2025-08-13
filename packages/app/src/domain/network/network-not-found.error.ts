import type { NetworkKey } from './network.js'

export class NetworkNotFoundError extends Error {
  public constructor(key: NetworkKey) {
    super(`Network with key "${key}" not found`)
  }
}
