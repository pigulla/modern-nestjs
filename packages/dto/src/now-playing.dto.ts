import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { channelDtoSchema } from './channel.dto.js'
import { networkDtoSchema } from './network.dto.js'

export const nowPlayingDtoSchema = z.strictObject({
  track: z.string(),
  network: networkDtoSchema,
  channel: channelDtoSchema,
})

export class NowPlayingDTO extends createZodDto(nowPlayingDtoSchema) {}
