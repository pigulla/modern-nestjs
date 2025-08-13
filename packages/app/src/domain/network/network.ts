import type { JsonObject } from 'type-fest'
import z from 'zod'

import { asNetworkKey, networkKeySchema, networkSchema } from './network.schema.js'

export type NetworkKey = z.infer<typeof networkKeySchema>

export class Network {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Network.name)

  public readonly key: NetworkKey
  public readonly name: string
  public readonly url: string

  public constructor(data: { key: NetworkKey; name: string; url: string }) {
    const { key, name, url } = networkSchema.parse(data)

    this.key = key
    this.name = name
    this.url = url
  }

  public static create({ key, name, url }: { key: string; name: string; url: string }): Network {
    return new Network({
      key: asNetworkKey(key),
      name,
      url,
    })
  }

  public toJSON(): JsonObject {
    return {
      key: this.key,
      name: this.name,
      url: this.url,
    }
  }
}
