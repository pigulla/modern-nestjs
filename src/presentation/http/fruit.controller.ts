import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'

import { IFruitService } from '#application/fruit.service.interface.js'
import { FruitAlreadyExistsError } from '#domain/error/fruit-already-exists.error.js'
import { FruitNotFoundError } from '#domain/error/fruit-not-found.error.js'
import { type FruitID, fruitIdSchema } from '#domain/fruit.js'

import { domainToDTO, dtoToDomain, FruitDTO } from './fruit.dto.js'

@Controller('fruits')
@ApiTags('fruit')
export class FruitController {
  private readonly fruitService: IFruitService

  public constructor(fruitService: IFruitService) {
    this.fruitService = fruitService
  }

  @Get('random')
  @ApiOperation({
    summary: 'Get a random fruit.',
    description: 'Return a randomly selected fruit.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The operation completed successfully.',
    type: FruitDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No fruits were found so a random fruit could not be returned.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'The operation failed unexpectedly.',
  })
  public random(): FruitDTO {
    const fruit = this.fruitService.getRandom()

    if (!fruit) {
      throw new NotFoundException()
    }

    return domainToDTO(fruit)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a fruit.',
    description: 'Get the fruit with the given id, if it exists.',
  })
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FruitDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The fruit with the given id was not found.',
  })
  public get(
    @Param('id', ParseIntPipe, new ZodValidationPipe(fruitIdSchema)) id: FruitID,
  ): FruitDTO {
    try {
      return domainToDTO(this.fruitService.get(id))
    } catch (error) {
      if (error instanceof FruitNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a fruit.',
    description: 'Delete the fruit with the given id, if it exists.',
  })
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The fruit with the given id was not found.',
  })
  public delete(
    @Param('id', ParseIntPipe, new ZodValidationPipe(fruitIdSchema)) id: FruitID,
  ): void {
    try {
      this.fruitService.delete(id)
    } catch (error) {
      if (error instanceof FruitNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a fruit.',
    description: 'Update the fruit with the given id, if it exists.',
  })
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The fruit with the given id was not found.',
  })
  public update(
    @Param('id', ParseIntPipe, new ZodValidationPipe(fruitIdSchema)) id: FruitID,
    @Body() dto: FruitDTO,
  ): FruitDTO {
    if (id !== dto.id) {
      throw new BadRequestException('Route parameter does not match payload.')
    }

    const fruit = dtoToDomain(dto)

    try {
      return domainToDTO(this.fruitService.update(fruit))
    } catch (error) {
      if (error instanceof FruitNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a fruit.',
    description: 'Create a new fruit.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FruitDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A fruit with the given id already exists.',
  })
  public create(@Body() dto: FruitDTO): FruitDTO {
    const fruit = dtoToDomain(dto)

    try {
      return domainToDTO(this.fruitService.create(fruit))
    } catch (error) {
      if (error instanceof FruitAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw error
    }
  }
}
