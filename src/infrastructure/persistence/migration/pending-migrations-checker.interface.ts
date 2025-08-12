export abstract class IPendingMigrationsChecker {
  public abstract assertNoPendingMigrations(): Promise<void>
}
