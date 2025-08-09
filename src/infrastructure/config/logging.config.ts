import { LOG_LEVELS } from '@nestjs/common'
import { z } from 'zod'

export const LOGGING_CONFIG = Symbol('logging-config')

export const loggingConfig = z
  .strictObject({
    enabled: z.boolean(),
    pretty: z.boolean(),
    level: z.union(LOG_LEVELS.map(level => z.literal(level))),
    requestResponse: z.boolean(),
  })
  .readonly()
  .brand('logging-config')

export type LoggingConfig = z.infer<typeof loggingConfig>
