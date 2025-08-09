export class MissingMigrationsTableError extends Error {
  public readonly tableName: string

  public constructor(tableName: string) {
    super('Migrations table is missing')

    this.tableName = tableName
  }
}
