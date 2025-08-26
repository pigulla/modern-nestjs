import { ChannelDTO } from '@di/dto/channel.dto.js'
import { ChannelFilterDTO } from '@di/dto/channel-filter.dto.js'
import { NetworkDTO } from '@di/dto/network.dto.js'

import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ZodResponse, ZodValidationPipe } from 'nestjs-zod'

import { IChannelService } from '#application/channel.service.interface.js'
import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import { INetworkService } from '#application/network.service.interface.js'
import type { ChannelKey } from '#domain/channel/channel.js'
import { channelKeySchema } from '#domain/channel/channel.schema.js'
import type { ChannelFilterKey } from '#domain/channel-filter/channel-filter.js'
import { channelFilterKeySchema } from '#domain/channel-filter/channel-filter.schema.js'
import type { NetworkKey } from '#domain/network/network.js'
import { networkKeySchema } from '#domain/network/network.schema.js'

import { channelFilterToDTO, channelToDTO, networkToDTO } from './to-dto.js'

@Controller('networks')
@ApiTags('network')
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
export class NetworkController {
  private readonly networkService: INetworkService
  private readonly channelService: IChannelService
  private readonly channelFilterService: IChannelFilterService

  public constructor(
    networkService: INetworkService,
    channelService: IChannelService,
    channelFilterService: IChannelFilterService,
  ) {
    this.networkService = networkService
    this.channelService = channelService
    this.channelFilterService = channelFilterService
  }

  @Get()
  @ApiOperation({
    summary: 'Get all networks.',
    description: 'Get all networks.',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: [NetworkDTO] })
  public async getAll() {
    const networks = await this.networkService.getAll()
    return networks.map(network => networkToDTO(network))
  }

  @Get(':networkKey')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiOperation({
    summary: 'Get a network by key.',
    description: 'Get the network with the given key, if it exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: NetworkDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network with the given key was not found.',
  })
  public async getOne(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
  ): Promise<NetworkDTO> {
    const network = await this.networkService.get(networkKey)
    return networkToDTO(network)
  }

  @Get(':networkKey/channels')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiOperation({
    summary: 'Get all channels of a network.',
    description: 'Get all channels of the network with the given key, if it exists.',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: [ChannelDTO] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network with the given key was not found.',
  })
  public async getChannelsForNetwork(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
  ) {
    const channels = await this.channelService.getAllForNetwork(networkKey)
    return channels.map(channel => channelToDTO(channel))
  }

  @Get(':networkKey/channels/:channelKey')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiParam({ name: 'channelKey', type: 'string', example: 'trance' })
  @ApiOperation({
    summary: 'Get the channel with the given key.',
    description: 'Get the channels with the given key for the given network, if it exists.',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: ChannelDTO })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network or channel with the given key was not found.',
  })
  public async getChannelForNetwork(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
    @Param('channelKey', new ZodValidationPipe(channelKeySchema))
    channelKey: ChannelKey,
  ) {
    const channel = await this.channelService.get(networkKey, channelKey)
    return channelToDTO(channel)
  }

  @Get(':networkKey/channel-filters')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiOperation({
    summary: 'Get all channel filters of a network.',
    description: 'Get all channel filters of the network with the given key, if it exists.',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: [ChannelFilterDTO] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network with the given key was not found.',
  })
  public async getChannelFiltersForNetwork(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
  ) {
    const channelFilters = await this.channelFilterService.getAllForNetwork(networkKey)
    return channelFilters.map(channelFilter => channelFilterToDTO(channelFilter))
  }

  @Get(':networkKey/channel-filters/:channelFilterKey')
  @ApiParam({ name: 'networkKey', type: 'string', example: 'di' })
  @ApiParam({ name: 'channelFilterKey', type: 'string', example: 'popular' })
  @ApiOperation({
    summary: 'Get the channel filters with the given key.',
    description: 'Get the channel filters with the given key for the given network, if it exists.',
  })
  @ZodResponse({ description: 'The operation completed successfully.', type: ChannelFilterDTO })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network or channel filter with the given key was not found.',
  })
  public async getChannelFilterForNetwork(
    @Param('networkKey', new ZodValidationPipe(networkKeySchema)) networkKey: NetworkKey,
    @Param('channelFilterKey', new ZodValidationPipe(channelFilterKeySchema))
    channelFilterKey: ChannelFilterKey,
  ) {
    const channelFilter = await this.channelFilterService.get(networkKey, channelFilterKey)
    return channelFilterToDTO(channelFilter)
  }
}
