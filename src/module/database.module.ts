import { Module } from '@nestjs/common'
import { type Database } from '@nestjs-cls/transactional-adapter-pg-promise'

import { IDefinedMigrationsProvider } from '#infrastructure/persistence/migration/defined-migrations-provider.interface.js'
import { DefinedMigrationsProvider } from '#infrastructure/persistence/migration/defined-migrations-provider.js'
import { IMigrationRepository } from '#infrastructure/persistence/migration/migration-repository.interface.js'
import { MigrationRepository } from '#infrastructure/persistence/migration/migration-repository.js'
import { IPendingMigrationsChecker } from '#infrastructure/persistence/migration/pending-migrations-checker.interface.js'
import { PendingMigrationsChecker } from '#infrastructure/persistence/migration/pending-migrations-checker.js'
import {
  DB_CONNECTION,
  IPostgresConnectionProvider,
} from '#infrastructure/persistence/postgres-connection-provider.interface.js'
import { PostgresConnectionProvider } from '#infrastructure/persistence/postgres-connection-provider.js'

import { ConfigModule } from './config.module.js'

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: IPostgresConnectionProvider, useClass: PostgresConnectionProvider },
    { provide: IMigrationRepository, useClass: MigrationRepository },
    { provide: IDefinedMigrationsProvider, useClass: DefinedMigrationsProvider },
    { provide: IPendingMigrationsChecker, useClass: PendingMigrationsChecker },
    {
      provide: DB_CONNECTION,
      inject: [IPostgresConnectionProvider],
      useFactory(postgresConnectionProvider: IPostgresConnectionProvider): Database {
        return postgresConnectionProvider.database
      },
    },
  ],
  exports: [IPostgresConnectionProvider, IPendingMigrationsChecker, DB_CONNECTION],
})
export class DatabaseModule {}
