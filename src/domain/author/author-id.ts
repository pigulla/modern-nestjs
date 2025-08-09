import z from 'zod'

export const authorIdSchema = z.number().int().min(1).brand<'author-id'>()

export type AuthorID = z.infer<typeof authorIdSchema>

export function asAuthorID(id: number): AuthorID {
  return authorIdSchema.parse(id)
}
