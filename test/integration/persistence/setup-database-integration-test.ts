import { join } from 'node:path'

import type { ModuleMetadata } from '@nestjs/common'
import { Test, type TestingModuleBuilder } from '@nestjs/testing'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise'
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { runner } from 'node-pg-migrate'
import { txMode } from 'pg-promise'

import { createDatabaseConfig, DATABASE_CONFIG } from '#infrastructure/config/database.config.js'
import { DB_CONNECTION } from '#infrastructure/persistence/postgres-connection-provider.interface.js'
import { ConfigModule } from '#module/config.module.js'
import { DatabaseModule } from '#module/database.module.js'

export function setupDatabaseIntegrationTest(): {
  beforeAll: () => Promise<void>
  beforeEach: () => Promise<void>
  afterEach: () => Promise<void>
  afterAll: () => Promise<void>
  createModule: (options?: ModuleMetadata & { testName?: string }) => TestingModuleBuilder
} {
  const migrationsDirectory = join(
    import.meta.dirname,
    '..',
    '..',
    '..',
    'src',
    'infrastructure',
    'persistence',
    'migration',
    'migrations',
  )
  const migrationsTable = 'pgmigrations'

  let postgresContainer: StartedPostgreSqlContainer

  async function beforeAll(): Promise<void> {
    postgresContainer = await new PostgreSqlContainer('postgres:17').start()
  }

  async function afterAll(): Promise<void> {
    await postgresContainer?.stop()
  }

  async function beforeEach(): Promise<void> {
    await runner({
      migrationsTable,
      dir: migrationsDirectory,
      count: Number.POSITIVE_INFINITY,
      direction: 'up',
      ignorePattern: '\\..*',
      databaseUrl: postgresContainer.getConnectionUri(),
      log: () => {},
    })
  }

  async function afterEach(): Promise<void> {
    await runner({
      migrationsTable,
      dir: migrationsDirectory,
      count: Number.POSITIVE_INFINITY,
      direction: 'down',
      ignorePattern: '\\..*',
      databaseUrl: postgresContainer.getConnectionUri(),
      log: () => {},
    })
  }

  function createModule(options?: ModuleMetadata & { testName?: string }): TestingModuleBuilder {
    return Test.createTestingModule({
      imports: [
        ConfigModule,
        DatabaseModule,
        LoggerModule.forRoot({
          pinoHttp: {
            enabled: false,
          },
        }),
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              imports: [DatabaseModule],
              adapter: new TransactionalAdapterPgPromise({
                dbInstanceToken: DB_CONNECTION,
                defaultTxOptions: {
                  mode: new txMode.TransactionMode({ tiLevel: txMode.isolationLevel.serializable }),
                },
              }),
            }),
          ],
        }),
        ...(options?.imports ?? []),
      ],
      providers: options?.providers ?? [],
    })
      .overrideProvider(DATABASE_CONFIG)
      .useValue(
        createDatabaseConfig({
          connection: {
            // biome-ignore lint/style/noProcessEnv: no other way to get this value
            name: `${options?.testName ?? 'test'}::${process.env.VITEST_WORKER_ID}`,
            host: postgresContainer.getHost(),
            port: postgresContainer.getPort(),
            ssl: false,
            database: postgresContainer.getDatabase(),
            username: postgresContainer.getUsername(),
            password: postgresContainer.getPassword(),
          },
          logQueries: false,
          disableWarnings: true,
        }),
      )
  }

  return { createModule, beforeAll, beforeEach, afterEach, afterAll }
}
