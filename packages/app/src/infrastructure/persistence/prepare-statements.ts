import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { DuckDBConnection, DuckDBPreparedStatement } from '@duckdb/node-api'
import type { SnakeCase } from 'type-fest'

export type PreparedStatements<T extends readonly string[]> = {
  [k in T[number] as Uppercase<SnakeCase<k>>]: DuckDBPreparedStatement
}

export async function prepareStatements<T extends readonly string[]>(
  db: DuckDBConnection,
  directory: string,
  files: T,
): Promise<PreparedStatements<T>> {
  const entries = await Promise.all(
    files.map(
      async name =>
        [
          name.toUpperCase().replaceAll('-', '_'),
          await readFile(join(directory, `${name}.sql`), 'utf8').then(buffer =>
            db.prepare(buffer.toString()),
          ),
        ] as const,
    ),
  )

  return Object.fromEntries(entries) as PreparedStatements<T>
}
