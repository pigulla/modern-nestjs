import { Module } from '@nestjs/common'

import { IAuthorRepository } from '#domain/author/author-repository.interface.js'
import { AuthorRepository } from '#infrastructure/persistence/author/authors-repository.js'
import { DatabaseModule } from '#module/database.module.js'
import { UtilityModule } from '#module/utility.module.js'
import { AuthorsController } from '#presentation/http/author/authors.controller.js'

@Module({
  imports: [DatabaseModule, UtilityModule],
  controllers: [AuthorsController],
  providers: [{ provide: IAuthorRepository, useClass: AuthorRepository }],
})
export class AuthorModule {}
