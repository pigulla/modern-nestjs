import type { ChannelFilter, ChannelFilterKey } from '@modern-nestjs/domain/channel-filter.js'

import { Injectable } from '@nestjs/common'

import { IChannelFilterRepository } from '#domain/digitally-imported/channel-filter.repository.interface.js'

import type { IChannelFilterService } from './channel-filter.service.interface.js'

@Injectable()
export class ChannelFilterService implements IChannelFilterService {
  private readonly repository: IChannelFilterRepository

  public constructor(repository: IChannelFilterRepository) {
    this.repository = repository
  }

  public async get(key: ChannelFilterKey): Promise<ChannelFilter> {
    const id = await this.repository.getIdOf(key)
    return this.repository.get(id)
  }

  public getAll(): Promise<ChannelFilter[]> {
    return this.repository.getAll()
  }
}
