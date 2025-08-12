import type { DuckDBConnection, DuckDBPreparedStatement } from '@duckdb/node-api'

export abstract class IDatabase {
  public abstract db: DuckDBConnection

  public abstract loadSQL(name: string): Promise<DuckDBPreparedStatement>
}
