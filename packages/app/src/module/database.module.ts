import { Module } from '@nestjs/common'

import { IDatabase } from '#infrastructure/persistence/database.interface.js'
import { Database } from '#infrastructure/persistence/database.js'

@Module({
  providers: [
    {
      provide: IDatabase,
      useClass: Database,
    },
  ],
  exports: [IDatabase],
})
export class DatabaseModule {}
