import type { DuckDBConnection } from '@duckdb/node-api'

export abstract class IDatabase {
  public abstract db: DuckDBConnection
}
