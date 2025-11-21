import {
  BadRequestException,
  Body,
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

import { type AuthorID, authorIdSchema } from '#domain/author/author-id.js'
import { AuthorNotFoundError } from '#domain/author/author-not-found.error.js'
import { IAuthorRepository } from '#domain/author/author-repository.interface.js'

import { AuthorDTO, CreateAuthorDTO, fromDomain, UpdateAuthorDTO } from './author.dto.js'

@Controller('authors')
@ApiTags('Authors')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'An internal server error occurred.',
})
export class AuthorsController {
  private readonly repository: IAuthorRepository

  public constructor(repository: IAuthorRepository) {
    this.repository = repository
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors.',
    description: 'Get all authors.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [AuthorDTO],
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  public async getAll(): Promise<AuthorDTO[]> {
    const authors = await this.repository.getAll()

    return authors.map(author => fromDomain(author))
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an author.',
    description: 'Get the author with the given id, if it exists.',
  })
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthorDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The author with the given id was not found.',
  })
  public async getOne(
    @Param('id', ParseIntPipe, new ZodValidationPipe(authorIdSchema)) id: AuthorID,
  ): Promise<AuthorDTO> {
    try {
      return fromDomain(await this.repository.get(id))
    } catch (error) {
      if (error instanceof AuthorNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a author.',
    description: 'Delete the author with the given id, if it exists.',
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
    status: HttpStatus.CONFLICT,
    description: 'The author could not be deleted because at least one quote is still assigned.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No author was found.',
  })
  public async delete(
    @Param('id', ParseIntPipe, new ZodValidationPipe(authorIdSchema)) id: AuthorID,
  ): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch (error) {
      if (error instanceof AuthorNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new author.',
    description: 'Create a new author and return it.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The operation completed successfully.',
    type: AuthorDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  public async create(@Body() { firstName, lastName }: CreateAuthorDTO): Promise<AuthorDTO> {
    const result = await this.repository.create({ firstName, lastName })

    return fromDomain(result)
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiOperation({
    summary: 'Update an existing author.',
    description: 'Update an existing author, if it exists, and return it.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The operation completed successfully.',
    type: AuthorDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No author was found.' })
  public async update(
    @Param('id', ParseIntPipe, new ZodValidationPipe(authorIdSchema)) id: AuthorID,
    @Body() dto: UpdateAuthorDTO,
  ): Promise<AuthorDTO> {
    if (id !== dto.id) {
      throw new BadRequestException('The id in the payload does not match the id in the route.')
    }

    const result = await this.repository.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    })

    return fromDomain(result)
  }
}
