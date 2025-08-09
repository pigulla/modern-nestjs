import { join } from 'node:path'

import { Injectable, Logger } from '@nestjs/common'
import { glob } from 'glob'

import { IDefinedMigrationsProvider } from './defined-migrations-provider.interface.js'
import { asMigration, type Migration } from './migration.js'

@Injectable()
export class DefinedMigrationsProvider implements IDefinedMigrationsProvider {
  private readonly logger = new Logger(DefinedMigrationsProvider.name)

  public async getAll(): Promise<Set<Migration>> {
    const files = await glob('*.sql', {
      cwd: join(import.meta.dirname, 'migrations'),
      nodir: true,
    })
    const migrations = files
      .map(file => file.substring(0, file.length - '.sql'.length))
      .map(value => asMigration(value))

    this.logger.verbose(`A total of ${files.length} defined migration(s) found`)

    return new Set(migrations)
  }
}
