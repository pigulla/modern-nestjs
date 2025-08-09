import { Module } from '@nestjs/common'

import { ITimeProvider } from '#application/time-provider.interface.js'
import { TimeProvider } from '#infrastructure/time-provider.js'

@Module({
  providers: [{ provide: ITimeProvider, useClass: TimeProvider }],
  exports: [ITimeProvider],
})
export class UtilityModule {}
