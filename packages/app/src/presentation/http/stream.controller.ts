import { NowPlayingDTO, nowPlayingDtoSchema } from '@di/dto/now-playing.dto.js'

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ExecaError, execa } from 'execa'
import type { Response } from 'express'
import { ZodResponse, ZodValidationPipe } from 'nestjs-zod'

import { IChannelService } from '#application/channel.service.interface.js'
import { IStreamProvider } from '#application/stream-provider.interface.js'
import type { ChannelKey } from '#domain/channel/channel.js'
import { channelKeySchema } from '#domain/channel/channel.schema.js'
import type { NetworkKey } from '#domain/network/network.js'
import { networkKeySchema } from '#domain/network/network.schema.js'
import {
  EXTERNAL_PLAYER_CONFIG,
  type ExternalPlayerConfig,
} from '#infrastructure/config/external-player.config.js'

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
  private readonly logger = new Logger(StreamController.name)
  private readonly channelService: IChannelService
  private readonly streamProvider: IStreamProvider
  private readonly config: ExternalPlayerConfig

  public constructor(
    channelService: IChannelService,
    streamProvider: IStreamProvider,
    @Inject(EXTERNAL_PLAYER_CONFIG) config: ExternalPlayerConfig,
  ) {
    this.channelService = channelService
    this.streamProvider = streamProvider
    this.config = config
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

    // TODO: Find a better way to do this.
    return nowPlayingDtoSchema.parse({
      track: nowPlaying.track,
      network: {
        id: nowPlaying.network.id,
        key: nowPlaying.network.key,
        name: nowPlaying.network.name,
        url: nowPlaying.network.url,
      },
      channel: {
        id: nowPlaying.channel.id,
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
      'Start playback of the channel of the given network with the given key. The stream is the raw audio without any IceCast metadata. Any previously started stream is terminated.',
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
    description: 'The network or channel with the given key was not found.',
  })
  public async stream(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
    @Param('channelKey', new ZodValidationPipe(channelKeySchema))
    channelKey: ChannelKey,
    @Res() response: Response,
  ): Promise<void> {
    response.set('content-type', 'audio/aac')
    const channel = await this.channelService.get(networkKey, channelKey)
    await this.streamProvider.streamTo(channel, response)
  }

  @Post(':networkKey/:channelKey')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiParam({ name: 'channelKey', type: 'string', example: 'trance' })
  @ApiOperation({
    summary: 'Start streaming a channel to the external player.',
    description:
      'Start playback of the channel of the given network with the given key on the configured external player. The stream is the raw audio without any IceCast metadata. Any previously started stream is terminated.',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network or channel with the given key was not found.',
  })
  public async launchExternalPlayer(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
    @Param('channelKey', new ZodValidationPipe(channelKeySchema))
    channelKey: ChannelKey,
  ): Promise<void> {
    const channel = await this.channelService.get(networkKey, channelKey)
    const process = execa(this.config.path, this.config.arguments, {
      stdout: 'ignore',
      stderr: 'ignore',
    })

    await this.streamProvider.streamTo(channel, process.stdin)

    process.catch(error => {
      if (error instanceof ExecaError && error.code === 'ECANCELED') {
        this.logger.log('External player terminated because stream was closed')
      } else {
        this.logger.error(`External player threw an error: ${error.message}`, { error })
      }
    })
  }
}
