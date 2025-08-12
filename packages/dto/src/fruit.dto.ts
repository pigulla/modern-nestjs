import { Fruit, fruitIdSchema } from '@modern-nestjs/domain/fruit.js'

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const fruitDtoSchema = z.strictObject({
  id: fruitIdSchema,
  name: z.string().min(1),
  calories: z.number().min(0),
})

export class FruitDTO extends createZodDto(fruitDtoSchema) {}

export function domainToDTO(fruit: Fruit): FruitDTO {
  return fruitDtoSchema.parse({
    id: fruit.id,
    name: fruit.name,
    calories: fruit.calories,
  })
}

export function dtoToDomain({ id, name, calories }: FruitDTO): Fruit {
  return new Fruit({ id, name, calories })
}
