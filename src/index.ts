import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { createOpenAPIDocument } from './create-openapi-document.js'
import { OPEN_API_CONFIG, type OpenApiConfig } from './infrastructure/config/open-api.config.js'
import { SERVER_CONFIG, type ServerConfig } from './infrastructure/config/server.config.js'
import { MainModule } from './module/main.module.js'

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, { bufferLogs: true })

  const server = app.get<ServerConfig>(SERVER_CONFIG)
  const openApi = app.get<OpenApiConfig>(OPEN_API_CONFIG)
  const logger = app.get(Logger)

  app.useLogger(logger)

  if (openApi.swagger.enabled) {
    const document = createOpenAPIDocument(app, openApi)
    SwaggerModule.setup(openApi.swagger.path, app, () => document)
  }

  await app.enableShutdownHooks().listen(server.port, server.hostname, async () => {
    const url = await app.getUrl()
    logger.log(`Server listening on ${url}`)
  })
}

void bootstrap()
