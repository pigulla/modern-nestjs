import type { JsonObject } from 'type-fest'
import z from 'zod'

export const channelIdSchema = z.number().int().min(1).brand('channel-id')
export type ChannelID = z.infer<typeof channelIdSchema>

export const channelKeySchema = z.string().min(1).brand('channel-key')
export type ChannelKey = z.infer<typeof channelKeySchema>

export function asChannelID(value: number): ChannelID {
  return channelIdSchema.parse(value)
}

export function asChannelKey(value: string): ChannelKey {
  return channelKeySchema.parse(value)
}

const channelSchema = z
  .strictObject({
    id: channelIdSchema,
    key: channelKeySchema,
    name: z.string().min(1),
    director: z.string(),
    description: z.string(),
    similarChannels: z.set(channelIdSchema).readonly(),
  })
  .readonly()

export class Channel {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(Channel.name)

  public readonly id: ChannelID
  public readonly key: ChannelKey
  public readonly name: string
  public readonly director: string
  public readonly description: string
  public readonly similarChannels: ReadonlySet<ChannelID>

  public constructor(data: {
    id: ChannelID
    key: ChannelKey
    name: string
    director: string
    description: string
    similarChannels: Set<ChannelID>
  }) {
    const { id, key, name, director, description, similarChannels } = channelSchema.parse(data)

    this.id = id
    this.key = key
    this.name = name
    this.director = director
    this.description = description
    this.similarChannels = new Set(similarChannels)
  }

  // This is an alternative, more user-friendly way to construct an instance that takes care of annoying type casts and
  // conversions. It's basically just syntactic sugar.
  public static create({
    id,
    key,
    name,
    director,
    description,
    similarChannels,
  }: {
    id: number
    key: string
    name: string
    director: string
    description: string
    similarChannels: Iterable<ChannelID>
  }): Channel {
    return new Channel({
      id: asChannelID(id),
      key: asChannelKey(key),
      name,
      director,
      description,
      similarChannels: new Set(similarChannels),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      director: this.director,
      description: this.description,
      similarChannels: [...this.similarChannels],
    }
  }
}
