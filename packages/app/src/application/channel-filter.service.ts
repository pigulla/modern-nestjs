import type {
  ChannelFilter,
  ChannelFilterIdentifier,
} from '@modern-nestjs/domain/channel-filter.js'

import { Injectable } from '@nestjs/common'

import { IChannelFilterRepository } from '#domain/digitally-imported/channel-filter.repository.interface.js'

import type { IChannelFilterService } from './channel-filter.service.interface.js'

@Injectable()
export class ChannelFilterService implements IChannelFilterService {
  private readonly repository: IChannelFilterRepository

  public constructor(repository: IChannelFilterRepository) {
    this.repository = repository
  }

  public get(identifier: ChannelFilterIdentifier): Promise<ChannelFilter> {
    return this.repository.get(identifier)
  }

  public getAll(): Promise<ChannelFilter[]> {
    return this.repository.getAll()
  }
}
