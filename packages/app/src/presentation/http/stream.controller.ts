import { ChannelDTO } from '@di/dto/channel.dto.js'
import { NowPlayingDTO, nowPlayingDtoSchema } from '@di/dto/now-playing.dto.js'

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { ZodResponse, ZodValidationPipe } from 'nestjs-zod'

import { IChannelService } from '#application/channel.service.interface.js'
import { IStreamProvider } from '#application/stream-provider.interface.js'
import type { ChannelKey } from '#domain/channel/channel.js'
import { channelKeySchema } from '#domain/channel/channel.schema.js'
import { ChannelNotFoundError } from '#domain/channel/channel-not-found.error.js'

import { channelToDTO } from './to-dto.js'

@Controller('stream')
@ApiTags('stream')
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
export class StreamController {
  private readonly channelService: IChannelService
  private readonly streamProvider: IStreamProvider

  public constructor(channelService: IChannelService, streamProvider: IStreamProvider) {
    this.channelService = channelService
    this.streamProvider = streamProvider
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Stop playback.',
    description:
      'Stop playback of the current stream (if any). Note that a client may continue playing until its local buffer is empty.',
  })
  public stop(): void {
    this.streamProvider.stop()
  }

  @Get()
  @ApiOperation({
    summary: 'Get track being streamed.',
    description: 'Get the track currently being streamed (if any).',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: NowPlayingDTO })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No channel is currently being streamed.',
  })
  public nowPlaying() {
    const channel = this.streamProvider.getChannel()
    const track = this.streamProvider.getTrack()

    if (!channel || !track) {
      throw new NotFoundException()
    }

    return nowPlayingDtoSchema.parse({
      track,
      channel: {
        key: channel.key,
        networkKey: channel.networkKey,
        name: channel.name,
        director: channel.director,
        description: channel.description,
      },
    })
  }

  @Get(':key')
  @ApiParam({ name: 'key', type: 'string', example: 'ambient' })
  @ApiOperation({
    summary: 'Start streaming a channel by key.',
    description:
      'Start playback of the channel with the given key, if it exists. The stream is the raw audio without any IceCast metadata. Any previously started stream is terminated.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: 'binary',
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The channel with the given key was not found.',
  })
  public async play(
    @Param('key', new ZodValidationPipe(channelKeySchema)) key: ChannelKey,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.set('content-type', 'audio/aac')
      const channel = await this.channelService.get(key)
      await this.streamProvider.streamTo(channel, response)
    } catch (error) {
      if (error instanceof ChannelNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
