import { type Author } from './author.js'
import { type AuthorID } from './author-id.js'

export abstract class IAuthorRepository {
  public abstract delete(id: AuthorID): Promise<void>
  public abstract getAll(): Promise<Author[]>
  public abstract get(id: AuthorID): Promise<Author>
  public abstract create(data: { firstName: string; lastName: string }): Promise<Author>
  public abstract update(
    id: AuthorID,
    data: { firstName: string; lastName: string },
  ): Promise<Author>
}
