import { ChannelDTO } from '@di/dto/channel.dto.js'

import { Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'

import { IChannelService } from '#application/channel.service.interface.js'
import type { ChannelKey } from '#domain/channel/channel.js'
import { channelKeySchema } from '#domain/channel/channel.schema.js'
import { ChannelNotFoundError } from '#domain/channel/channel-not-found.error.js'

import { channelToDTO } from './to-dto.js'

@Controller('channels')
@ApiTags('channel')
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
export class ChannelController {
  private readonly channelService: IChannelService

  public constructor(channelService: IChannelService) {
    this.channelService = channelService
  }

  @Get()
  @ApiOperation({
    summary: 'Get all channels.',
    description: 'Get all channels.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ChannelDTO],
    description: 'The operation completed successfully.',
  })
  public async getAll(): Promise<ChannelDTO[]> {
    const channels = await this.channelService.getAll()
    return channels.map(channel => channelToDTO(channel))
  }

  @Get(':key')
  @ApiParam({ name: 'key', type: 'string', example: 'ambient' })
  @ApiOperation({
    summary: 'Get a channel by key.',
    description: 'Get the channel with the given key, if it exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChannelDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The channel with the given key was not found.',
  })
  public async getOne(
    @Param('key', new ZodValidationPipe(channelKeySchema)) key: ChannelKey,
  ): Promise<ChannelDTO> {
    try {
      const channel = await this.channelService.get(key)
      return channelToDTO(channel)
    } catch (error) {
      if (error instanceof ChannelNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
