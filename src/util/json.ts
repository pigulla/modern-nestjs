export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [property: string]: JsonValue }
