export class NoMigrationsFoundError extends Error {
  public constructor() {
    super('No migrations found')
  }
}
