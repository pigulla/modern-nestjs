import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { IFruitService } from '#application/fruit.service.interface.js'

import { FruitDTO } from './fruit.dto.js'

@Controller('fruits')
export class FruitController {
  private readonly fruitService: IFruitService

  public constructor(fruitService: IFruitService) {
    this.fruitService = fruitService
  }

  @ApiOperation({
    summary: 'Get a random fruit.',
    description: 'Return a randomly selected fruit.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The operation completed successfully.',
    type: FruitDTO,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'The operation failed unexpectedly.',
  })
  @Get('random')
  public random(): FruitDTO {
    return this.fruitService.getRandom()
  }
}
