import { type INestApplication } from '@nestjs/common'
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

import { type OpenApiConfig } from '#infrastructure/config/open-api.config.js'

export function createOpenAPIDocument(
  app: INestApplication,
  openApiConfig: OpenApiConfig,
): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(openApiConfig.title)
      .setDescription(openApiConfig.description)
      .setVersion(openApiConfig.version)
      .setLicense(openApiConfig.license.name, openApiConfig.license.url)
      .setContact(
        openApiConfig.contact.name,
        openApiConfig.contact.url,
        openApiConfig.contact.email,
      )
      .addServer(openApiConfig.server)
      .build(),
  )
}
