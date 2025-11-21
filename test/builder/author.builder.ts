import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

import { Author } from '#domain/author/author.js'
import { asAuthorID } from '#domain/author/author-id.js'

export type AuthorProperties = {
  id: number
  firstName: string
  lastName: string
  createdAt: ConfigType
  updatedAt: ConfigType
}

export class AuthorBuilder {
  private properties: AuthorProperties = {
    id: 42,
    firstName: 'Hairy',
    lastName: 'Potter',
    createdAt: '2025-05-19T06:30:00.000Z',
    updatedAt: '2025-05-19T11:45:00.000Z',
  }

  public withId(id: number): this {
    this.properties.id = id
    return this
  }

  public withFirstName(firstName: string): this {
    this.properties.firstName = firstName
    return this
  }

  public withLastName(lastName: string): this {
    this.properties.lastName = lastName
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

  public with(properties: Partial<AuthorProperties>): this {
    this.properties = { ...this.properties, ...properties }
    return this
  }

  public static create(properties?: Partial<AuthorProperties>): Author {
    return new AuthorBuilder().with(properties ?? {}).build()
  }

  public static from(author: Author): AuthorBuilder {
    return new AuthorBuilder().with(author)
  }

  public build(): Author {
    return new Author({
      id: asAuthorID(this.properties.id),
      firstName: this.properties.firstName,
      lastName: this.properties.lastName,
      createdAt: dayjs(this.properties.createdAt),
      updatedAt: dayjs(this.properties.updatedAt),
    })
  }
}
