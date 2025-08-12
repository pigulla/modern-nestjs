import { type Migration } from './migration.js'

export abstract class IMigrationRepository {
  public abstract getAll(): Promise<Set<Migration>>
}
