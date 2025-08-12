import type { JsonObject } from 'type-fest'
import z from 'zod'

export const networkIdSchema = z.number().int().min(1).brand('network-id')
export type NetworkID = z.infer<typeof networkIdSchema>

export const networkKeySchema = z.string().min(1).brand('network-key')
export type NetworkKey = z.infer<typeof networkKeySchema>

export function asNetworkID(value: number): NetworkID {
  return networkIdSchema.parse(value)
}

export function asNetworkKey(value: string): NetworkKey {
  return networkKeySchema.parse(value)
}

const networkSchema = z.strictObject({
  id: networkIdSchema,
  key: networkKeySchema,
  name: z.string().min(1),
  url: z.url(),
})

export class Network {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Network.name)

  public readonly id: NetworkID
  public readonly key: NetworkKey
  public readonly name: string
  public readonly url: string

  public constructor(data: { id: NetworkID; key: NetworkKey; name: string; url: string }) {
    const { id, key, name, url } = networkSchema.parse(data)

    this.id = id
    this.key = key
    this.name = name
    this.url = url
  }

  // This is an alternative, more user-friendly way to construct an instance that takes care of annoying type casts and
  // conversions. It's basically just syntactic sugar.
  public static create({
    id,
    key,
    name,
    url,
  }: {
    id: number
    key: string
    name: string
    url: string
  }): Network {
    return new Network({
      id: asNetworkID(id),
      key: asNetworkKey(key),
      name,
      url,
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      url: this.url,
    }
  }
}
