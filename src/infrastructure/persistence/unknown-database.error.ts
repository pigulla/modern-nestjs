export class UnknownDatabaseError extends Error {
  public readonly cause: Error

  public constructor(cause: Error) {
    super('A database error occurred')

    this.cause = cause
  }
}
