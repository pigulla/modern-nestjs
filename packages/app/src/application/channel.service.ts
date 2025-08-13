import { Channel, type ChannelIdentifier } from '@modern-nestjs/domain/channel.js'

import { Injectable } from '@nestjs/common'

import { IChannelRepository } from '#domain/digitally-imported/channel.repository.interface.js'

import type { IChannelService } from './channel.service.interface.js'

@Injectable()
export class ChannelService implements IChannelService {
  private readonly repository: IChannelRepository

  public constructor(repository: IChannelRepository) {
    this.repository = repository
  }

  public get(identifier: ChannelIdentifier): Promise<Channel> {
    return this.repository.get(identifier)
  }

  public getAll(): Promise<Channel[]> {
    return this.repository.getAll()
  }
}
