import dayjs from 'dayjs'
import z from 'zod'

export const isoDateSchema = z
  .string()
  .transform(value => dayjs(value, 'YYYY-MM-DD[T]HH:mm:ssZ'))
  .refine(value => value.isValid())
