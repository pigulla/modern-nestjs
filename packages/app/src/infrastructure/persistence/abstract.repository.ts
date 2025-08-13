import type { OnModuleInit } from '@nestjs/common'

import { IDatabase } from './database.interface.js'
import { type PreparedStatements, prepareStatements } from './prepare-statements.js'

export abstract class AbstractRepository<T extends string[]> implements OnModuleInit {
  protected readonly database: IDatabase

  private readonly directory: string
  private readonly fileNames: readonly string[]
  private statements: PreparedStatements<T> | null

  protected constructor(
    database: IDatabase,
    { directory, fileNames }: { directory: string; fileNames: T },
  ) {
    this.database = database
    this.directory = directory
    this.fileNames = [...fileNames]
    this.statements = null
  }

  public async onModuleInit(): Promise<void> {
    this.statements = await prepareStatements(this.database.db, this.directory, this.fileNames)
  }

  protected get stmt(): PreparedStatements<T> {
    if (this.statements === null) {
      throw new Error('Not initialized')
    }

    return this.statements
  }
}
