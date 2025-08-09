import { type Migration } from './migration.js'

export abstract class IDefinedMigrationsProvider {
  public abstract getAll(): Promise<Set<Migration>>
}
