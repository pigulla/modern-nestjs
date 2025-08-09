import { type AuthorID } from './author-id.js'

export class AuthorNotFoundError extends Error {
  public readonly id: AuthorID

  public constructor(id: AuthorID) {
    super('Author not found')

    this.id = id
  }
}
