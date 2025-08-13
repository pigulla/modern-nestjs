import { ChannelFilterDTO } from '@di/dto/channel-filter.dto.js'

import { Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'

import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import type { ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import { channelFilterKeySchema } from '#domain/channel-filter/channel-filter.schema.js'
import { ChannelFilterNotFoundError } from '#domain/channel-filter/channel-filter-not-found.error.js'

import { channelFilterToDTO } from './to-dto.js'

@Controller('channel-filters')
@ApiTags('channel-filters')
@ApiSecurity({})
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description:
    'A query or route parameter, the payload or a header was malformed and did not pass validation.',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'An unexpected error occurred.',
})
export class ChannelFilterController {
  private readonly channelFilterService: IChannelFilterService

  public constructor(channelFilterService: IChannelFilterService) {
    this.channelFilterService = channelFilterService
  }

  @Get()
  @ApiOperation({
    summary: 'Get all channel filters.',
    description: 'Get all channel filters.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ChannelFilterDTO],
    description: 'The operation completed successfully.',
  })
  public async getAll(): Promise<ChannelFilterDTO[]> {
    const channels = await this.channelFilterService.getAll()
    return channels.map(channel => channelFilterToDTO(channel))
  }

  @Get(':key')
  @ApiParam({ name: 'key', type: 'string', example: 'ambient' })
  @ApiOperation({
    summary: 'Get a channel filter by key.',
    description: 'Get the channel filter with the given key, if it exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChannelFilterDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The channel filter with the given key was not found.',
  })
  public async getOne(
    @Param('key', new ZodValidationPipe(channelFilterKeySchema)) key: ChannelFilterKey,
  ): Promise<ChannelFilterDTO> {
    try {
      const channel = await this.channelFilterService.get(key)
      return channelFilterToDTO(channel)
    } catch (error) {
      if (error instanceof ChannelFilterNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
