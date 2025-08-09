import { join } from 'node:path'

import * as pgPromise from 'pg-promise'
import type { SnakeCase } from 'type-fest'

type QueryFiles<T extends string[]> = {
  [k in T[number] as Uppercase<SnakeCase<k>>]: pgPromise.QueryFile
}

export function queryFiles<T extends string[]>(directory: string, files: T): QueryFiles<T> {
  // biome-ignore lint/style/noProcessEnv: Not an issue when running tests.
  const noWarnings = process.env.VITEST !== undefined

  return Object.fromEntries(
    files.map(name => [
      name.toUpperCase().replaceAll('-', '_'),
      new pgPromise.default.QueryFile(join(directory, `${name}.sql`), {
        minify: true,
        noWarnings,
      }),
    ]),
  ) as QueryFiles<T>
}
