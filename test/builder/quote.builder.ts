import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

import { Quote } from '#domain/quote/quote.js'
import { asQuoteID } from '#domain/quote/quote-id.js'

export type QuoteProperties = {
  id: number
  text: string
  createdAt: ConfigType
  updatedAt: ConfigType
}

export class QuoteBuilder {
  private properties: QuoteProperties = {
    id: 42,
    text: 'An inspiring quote.',
    createdAt: '2025-05-19T06:30:00.000Z',
    updatedAt: '2025-05-19T11:45:00.000Z',
  }

  public withId(id: number): this {
    this.properties.id = id
    return this
  }

  public withText(text: string): this {
    this.properties.text = text
    return this
  }

  public withCreatedAt(createdAt: ConfigType): this {
    this.properties.createdAt = createdAt
    return this
  }

  public withUpdatedAt(updatedAt: ConfigType): this {
    this.properties.updatedAt = updatedAt
    return this
  }

  public with(properties: Partial<QuoteProperties>): this {
    this.properties = { ...this.properties, ...properties }
    return this
  }

  public static create(properties?: Partial<QuoteProperties>): Quote {
    return new QuoteBuilder().with(properties ?? {}).build()
  }

  public static from(quote: Quote): QuoteBuilder {
    return new QuoteBuilder().with(quote)
  }

  public build(): Quote {
    return new Quote({
      id: asQuoteID(this.properties.id),
      text: this.properties.text,
      createdAt: dayjs(this.properties.createdAt),
      updatedAt: dayjs(this.properties.updatedAt),
    })
  }
}
