import { join } from 'node:path'

import { Module } from '@nestjs/common'
import { type Database } from '@nestjs-cls/transactional-adapter-pg-promise'

import {
  DB_CONNECTION,
  IConnectionProvider,
} from '#infrastructure/persistence/connection-provider.interface.js'
import { ConnectionProvider } from '#infrastructure/persistence/connection-provider.js'
import { IDefinedMigrationsProvider } from '#infrastructure/persistence/migration/defined-migrations-provider.interface.js'
import {
  DefinedMigrationsProvider,
  MIGRATIONS_DIRECTORY,
} from '#infrastructure/persistence/migration/defined-migrations-provider.js'
import { IMigrationRepository } from '#infrastructure/persistence/migration/migration-repository.interface.js'
import { MigrationRepository } from '#infrastructure/persistence/migration/migration-repository.js'
import { IPendingMigrationsChecker } from '#infrastructure/persistence/migration/pending-migrations-checker.interface.js'
import { PendingMigrationsChecker } from '#infrastructure/persistence/migration/pending-migrations-checker.js'

import { ConfigModule } from './config.module.js'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MIGRATIONS_DIRECTORY,
      useFactory(): string {
        return join(import.meta.dirname, '..', '..', 'migrations')
      },
    },
    { provide: IConnectionProvider, useClass: ConnectionProvider },
    { provide: IMigrationRepository, useClass: MigrationRepository },
    { provide: IDefinedMigrationsProvider, useClass: DefinedMigrationsProvider },
    { provide: IPendingMigrationsChecker, useClass: PendingMigrationsChecker },
    {
      provide: DB_CONNECTION,
      inject: [IConnectionProvider],
      useFactory(postgresConnectionProvider: IConnectionProvider): Database {
        return postgresConnectionProvider.database
      },
    },
  ],
  exports: [IConnectionProvider, IPendingMigrationsChecker, DB_CONNECTION],
})
export class DatabaseModule {}
