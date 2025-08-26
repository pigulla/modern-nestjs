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
import type { NetworkKey } from '#domain/network/network.js'
import { networkKeySchema } from '#domain/network/network.schema.js'

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
    const nowPlaying = this.streamProvider.getNowPlaying()

    if (!nowPlaying) {
      throw new NotFoundException('No channel is currently being streamed')
    }

    return nowPlayingDtoSchema.parse({
      track: nowPlaying.track,
      network: {
        id: nowPlaying.network.id,
        key: nowPlaying.network.key,
        name: nowPlaying.network.name,
        url: nowPlaying.network.url,
      },
      channel: {
        key: nowPlaying.channel.key,
        networkId: nowPlaying.channel.networkId,
        name: nowPlaying.channel.name,
        director: nowPlaying.channel.director,
        description: nowPlaying.channel.description,
      },
    })
  }

  @Get(':networkKey/:channelKey')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiParam({ name: 'channelKey', type: 'string', example: 'trance' })
  @ApiOperation({
    summary: 'Start streaming a channel.',
    description:
      'Start playback of the channel of the given network with the given key, if it exists. The stream is the raw audio without any IceCast metadata. Any previously started stream is terminated.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The operation completed successfully.',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The channel with the given key was not found.',
  })
  public async play(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
    @Param('channelKey', new ZodValidationPipe(channelKeySchema))
    channelKey: ChannelKey,
    @Res() response: Response,
  ): Promise<void> {
    try {
      response.set('content-type', 'audio/aac')
      const channel = await this.channelService.get(networkKey, channelKey)
      await this.streamProvider.streamTo(channel, response)
    } catch (error) {
      if (error instanceof ChannelNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
