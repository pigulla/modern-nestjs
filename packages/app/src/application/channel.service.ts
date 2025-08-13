import { Channel, type ChannelKey } from '@modern-nestjs/domain/channel.js'

import { Injectable } from '@nestjs/common'

import { IChannelRepository } from '#domain/digitally-imported/channel.repository.interface.js'

import type { IChannelService } from './channel.service.interface.js'

@Injectable()
export class ChannelService implements IChannelService {
  private readonly repository: IChannelRepository

  public constructor(repository: IChannelRepository) {
    this.repository = repository
  }

  public async get(key: ChannelKey): Promise<Channel> {
    const id = await this.repository.getIdOf(key)
    return this.repository.get(id)
  }

  public getAll(): Promise<Channel[]> {
    return this.repository.getAll()
  }
}
