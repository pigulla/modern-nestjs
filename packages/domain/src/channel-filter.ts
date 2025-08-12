import dayjs, { type ConfigType, type Dayjs } from 'dayjs'
import type { JsonObject } from 'type-fest'
import z from 'zod'

import { type ChannelID, channelIdSchema } from './channel.js'

export const channelFilterIdSchema = z.number().int().min(1).brand('channel-filter-id')
export type ChannelFilterID = z.infer<typeof channelFilterIdSchema>

export const channelFilterKeySchema = z.string().min(1).brand('channel-filter-key')
export type ChannelFilterKey = z.infer<typeof channelFilterKeySchema>

export function asChannelFilterID(value: number): ChannelFilterID {
  return channelFilterIdSchema.parse(value)
}

export function asChannelFilterKey(value: string): ChannelFilterKey {
  return channelFilterKeySchema.parse(value)
}

const channelFilterSchema = z
  .strictObject({
    id: channelFilterIdSchema,
    key: channelFilterKeySchema,
    name: z.string().min(1),
    channels: z.set(channelIdSchema).readonly(),
    createdAt: z
      .custom<Dayjs>(value => dayjs.isDayjs(value))
      .refine(value => value.isValid())
      .nullable(),
    updatedAt: z.custom<Dayjs>(value => dayjs.isDayjs(value)).refine(value => value.isValid()),
  })
  .readonly()
  .brand('channel-filter')

export class ChannelFilter {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: Disable structural typing.
  readonly #brand = Symbol(ChannelFilter.name)

  public readonly id: ChannelFilterID
  public readonly key: ChannelFilterKey
  public readonly name: string
  public readonly channels: ReadonlySet<ChannelID>
  public readonly createdAt: Dayjs | null
  public readonly updatedAt: Dayjs

  public constructor(data: {
    id: ChannelFilterID
    key: ChannelFilterKey
    name: string
    channels: Set<ChannelID>
    createdAt: Dayjs | null
    updatedAt: Dayjs
  }) {
    const { id, key, name, channels, createdAt, updatedAt } = channelFilterSchema.parse(data)

    this.id = id
    this.key = key
    this.name = name
    this.channels = new Set(channels)
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // This is an alternative, more user-friendly way to construct an instance that takes care of annoying type casts and
  // conversions. It's basically just syntactic sugar.
  public static create({
    id,
    key,
    name,
    channels,
    createdAt,
    updatedAt,
  }: {
    id: number
    key: string
    name: string
    channels: Iterable<ChannelID>
    createdAt: ConfigType | null
    updatedAt: ConfigType
  }): ChannelFilter {
    return new ChannelFilter({
      id: asChannelFilterID(id),
      key: asChannelFilterKey(key),
      name,
      channels: new Set(channels),
      createdAt: createdAt === null ? null : dayjs(createdAt),
      updatedAt: dayjs(updatedAt),
    })
  }

  public toJSON(): JsonObject {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      channels: [...this.channels],
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
