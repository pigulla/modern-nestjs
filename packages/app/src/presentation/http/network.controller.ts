import { ChannelDTO } from '@di/dto/channel.dto.js'
import { ChannelFilterDTO } from '@di/dto/channel-filter.dto.js'
import { NetworkDTO } from '@di/dto/network.dto.js'

import { Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'

import { IChannelService } from '#application/channel.service.interface.js'
import { IChannelFilterService } from '#application/channel-filter.service.interface.js'
import { INetworkService } from '#application/network.service.interface.js'
import type { NetworkKey } from '#domain/network/network.js'
import { networkKeySchema } from '#domain/network/network.schema.js'
import { NetworkNotFoundError } from '#domain/network/network-not-found.error.js'

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
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NetworkDTO],
    description: 'The operation completed successfully.',
  })
  public async getAll(): Promise<NetworkDTO[]> {
    const networks = await this.networkService.getAll()
    return networks.map(network => networkToDTO(network))
  }

  @Get(':key')
  @ApiParam({ name: 'key', type: 'string', example: 'di' })
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
    @Param('key', new ZodValidationPipe(networkKeySchema)) key: NetworkKey,
  ): Promise<NetworkDTO> {
    try {
      const network = await this.networkService.get(key)
      return networkToDTO(network)
    } catch (error) {
      if (error instanceof NetworkNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Get(':key/channels')
  @ApiParam({ name: 'key', type: 'string', example: 'di' })
  @ApiOperation({
    summary: 'Get all channels of a network.',
    description: 'Get all channels of the network with the given key, if it exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ChannelDTO],
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network with the given key was not found.',
  })
  public async getChannelsForNetwork(
    @Param('key', new ZodValidationPipe(networkKeySchema)) key: NetworkKey,
  ): Promise<ChannelDTO[]> {
    try {
      const channels = await this.channelService.getAllForNetwork(key)
      return channels.map(channel => channelToDTO(channel))
    } catch (error) {
      if (error instanceof NetworkNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }

  @Get(':key/channel-filters')
  @ApiParam({ name: 'key', type: 'string', example: 'di' })
  @ApiOperation({
    summary: 'Get all channel filters of a network.',
    description: 'Get all channel filters of the network with the given key, if it exists.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ChannelFilterDTO],
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The network with the given key was not found.',
  })
  public async getChannelFiltersForNetwork(
    @Param('key', new ZodValidationPipe(networkKeySchema)) key: NetworkKey,
  ): Promise<ChannelFilterDTO[]> {
    try {
      const channelFilters = await this.channelFilterService.getAllForNetwork(key)
      return channelFilters.map(channelFilter => channelFilterToDTO(channelFilter))
    } catch (error) {
      if (error instanceof NetworkNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
