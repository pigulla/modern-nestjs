import { type ArgumentsHost, Catch, type ExceptionFilter, NotFoundException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

import { EntityNotFoundError } from '#domain/entity-not-found.error.js'

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter<EntityNotFoundError>
{
  public override catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    super.catch(new NotFoundException(exception.message), host)
  }
}
