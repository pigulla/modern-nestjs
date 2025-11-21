import { z } from 'zod'

export const DATABASE_CONFIG = Symbol('database-config')

export const databaseConfig = z
  .strictObject({
    connection: z
      .strictObject({
        name: z.string().min(1),
        host: z.string().min(1),
        port: z.number().int().positive().max(65535),
        ssl: z.boolean(),
        database: z.string().min(1),
        username: z.string(),
        password: z.string(),
      })
      .readonly(),
    logQueries: z.boolean(),
    disableWarnings: z.boolean(),
  })
  .brand('database-config')
  .readonly()

export type DatabaseConfig = z.infer<typeof databaseConfig>

export function createDatabaseConfig(config: {
  connection: {
    name: string
    host: string
    port: number
    ssl: boolean
    database: string
    username: string
    password: string
  }
  logQueries: boolean
  disableWarnings: boolean
}) {
  return databaseConfig.parse(config)
}
