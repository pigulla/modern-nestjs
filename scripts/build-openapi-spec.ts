import { NestFactory } from '@nestjs/core'

import { OPEN_API_CONFIG, type OpenApiConfig } from '#infrastructure/config/open-api.config.js'
import { MainModule } from '#module/main.module.js'

import { createOpenAPIDocument } from '../src/create-openapi-document.js'

async function buildOpenApiSpec(): Promise<void> {
  const app = await NestFactory.create(MainModule, {
    logger: false,
    abortOnError: false,
  })

  const openApi = app.get<OpenApiConfig>(OPEN_API_CONFIG)
  const document = createOpenAPIDocument(app, openApi)

  process.stdout.write(JSON.stringify(document, null, 4))
}

void buildOpenApiSpec()
