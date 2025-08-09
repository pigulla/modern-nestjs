import { Injectable, type OnModuleInit } from '@nestjs/common'

import { NoMigrationsFoundError } from '#infrastructure/persistence/migration/error/no-migrations-found.error.js'

import { IDefinedMigrationsProvider } from './defined-migrations-provider.interface.js'
import { MigrationsPendingError } from './error/migrations-pending.error.js'
import { IMigrationRepository } from './migration-repository.interface.js'
import { type IPendingMigrationsChecker } from './pending-migrations-checker.interface.js'

@Injectable()
export class PendingMigrationsChecker implements IPendingMigrationsChecker, OnModuleInit {
  private readonly migrationsRepository: IMigrationRepository
  private readonly definedMigrationsProvider: IDefinedMigrationsProvider

  public constructor(
    repository: IMigrationRepository,
    definedMigrationsProvider: IDefinedMigrationsProvider,
  ) {
    this.migrationsRepository = repository
    this.definedMigrationsProvider = definedMigrationsProvider
  }

  public async onModuleInit(): Promise<void> {
    await this.assertNoPendingMigrations()
  }

  public async assertNoPendingMigrations(): Promise<void> {
    const [defined, applied] = await Promise.all([
      this.definedMigrationsProvider.getAll().then(migrations => new Set(migrations)),
      this.migrationsRepository.getAll().then(migrations => new Set(migrations)),
    ])

    if (defined.size === 0) {
      // This is most likely an error (e.g. the migrations directory was not configured directly).
      throw new NoMigrationsFoundError()
    }

    if (defined.size !== applied.size || [...applied].some(name => !defined.has(name))) {
      // Technically there isn't necessarily a pending migration. It could also be the case that there are fewer
      // defined than applied migrations (or a migration was renamed after it was applied) - but that should almost
      // never happen so we just handwave it.
      throw new MigrationsPendingError({ defined, applied })
    }
  }
}
