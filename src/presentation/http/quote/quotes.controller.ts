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

import { type QuoteID, quoteIdSchema } from '#domain/quote/quote-id.js'
import { QuoteNotFoundError } from '#domain/quote/quote-not-found.error.js'
import { IQuoteRepository } from '#domain/quote/quote-repository.interface.js'

import { CreateQuoteDTO, fromDomain, QuoteDTO, UpdateQuoteDTO } from './quote.dto.js'

@Controller('quotes')
@ApiTags('Quotes')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'An internal server error occurred.',
})
export class QuotesController {
  private readonly repository: IQuoteRepository

  public constructor(repository: IQuoteRepository) {
    this.repository = repository
  }

  @Get('random')
  @ApiOperation({
    summary: 'Get a random quote.',
    description: 'Get a randomly selected quote, it at least one exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: QuoteDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No quote was found.',
  })
  public async getRandom(): Promise<QuoteDTO> {
    const quote = await this.repository.getRandom()

    if (!quote) {
      throw new NotFoundException()
    }

    return fromDomain(quote)
  }
  @Get()
  @ApiOperation({
    summary: 'Get all quotes.',
    description: 'Get all quotes.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [QuoteDTO],
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  public async getAll(): Promise<QuoteDTO[]> {
    const authors = await this.repository.getAll()

    return authors.map(author => fromDomain(author))
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a quote.',
    description: 'Get the quote with the given id, if it exists.',
  })
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiResponse({
    status: HttpStatus.OK,
    type: QuoteDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The quote with the given id was not found.',
  })
  public async getOne(
    @Param('id', ParseIntPipe, new ZodValidationPipe(quoteIdSchema)) id: QuoteID,
  ): Promise<QuoteDTO> {
    try {
      return fromDomain(await this.repository.get(id))
    } catch (error) {
      if (error instanceof QuoteNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a quote.',
    description: 'Delete the quote with the given id, if it exists.',
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
    description: 'No quote was found.',
  })
  public async delete(
    @Param('id', ParseIntPipe, new ZodValidationPipe(quoteIdSchema)) id: QuoteID,
  ): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch (error) {
      if (error instanceof QuoteNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new quote.',
    description: 'Create a new quote and return it.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The operation completed successfully.',
    type: QuoteDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  public async create(@Body() { text, authorId }: CreateQuoteDTO): Promise<QuoteDTO> {
    const result = await this.repository.create({ text, authorId })

    return fromDomain(result)
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'number', format: 'int', example: 42 })
  @ApiOperation({
    summary: 'Update an existing quote.',
    description: 'Update an existing quote, if it exists, and return it.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The operation completed successfully.',
    type: QuoteDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No quote was found.' })
  public async update(
    @Param('id', ParseIntPipe, new ZodValidationPipe(quoteIdSchema)) id: QuoteID,
    @Body() dto: UpdateQuoteDTO,
  ): Promise<QuoteDTO> {
    if (id !== dto.id) {
      throw new BadRequestException('The id in the payload does not match the id in the route.')
    }

    const result = await this.repository.update(id, { text: dto.text, authorId: dto.authorId })

    return fromDomain(result)
  }
}
