import type { NetworkKey } from '@di/domain/network.js'
import { networkKeySchema } from '@di/domain/network.schema.js'
import { domainToDTO, NetworkDTO } from '@di/dto/network.dto.js'

import { Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'

import { INetworkService } from '#application/network.service.interface.js'
import { NetworkNotFoundError } from '#domain/digitally-imported/network-not-found.error.js'

@Controller('networks')
@ApiTags('network')
@ApiSecurity({})
export class NetworkController {
  private readonly networkService: INetworkService

  public constructor(networkService: INetworkService) {
    this.networkService = networkService
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
  })
  public async getAll(): Promise<NetworkDTO[]> {
    const networks = await this.networkService.getAll()
    return networks.map(network => domainToDTO(network))
  }

  @Get(':key')
  @ApiOperation({
    summary: 'Get a network by key.',
    description: 'Get the network with the given key, if it exists.',
  })
  @ApiParam({ name: 'key', type: 'string', example: 'ambient' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: NetworkDTO,
    description: 'The operation completed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'A query or route parameter, the payload or a header was malformed and did not pass validation.',
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
      return domainToDTO(network)
    } catch (error) {
      if (error instanceof NetworkNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw error
    }
  }
}
