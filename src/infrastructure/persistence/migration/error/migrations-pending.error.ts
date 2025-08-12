export class MigrationsPendingError extends Error {
  public readonly defined: ReadonlySet<string>
  public readonly applied: ReadonlySet<string>

  public constructor({ defined, applied }: { defined: Set<string>; applied: Set<string> }) {
    super('Migrations are pending')

    this.defined = new Set(defined)
    this.applied = new Set(applied)
  }
}
