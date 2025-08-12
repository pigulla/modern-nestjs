import z from 'zod'

const migration = z.string().min(1).max(255).brand('migration')

export type Migration = z.infer<typeof migration>

export function asMigration(value: string): Migration {
  return migration.parse(value)
}
