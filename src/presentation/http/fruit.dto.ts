import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { Fruit, fruitNameSchema } from '#domain/fruit.js'

export const fruitDtoSchema = z.strictObject({
  name: fruitNameSchema.meta({ description: 'The name of the fruit.' }),
  calories: z.number().min(0).describe('How much calories a serving has.'),
})

export class FruitDTO extends createZodDto(fruitDtoSchema) {}

export function domainToDTO(fruit: Fruit): FruitDTO {
  return fruitDtoSchema.parse({
    name: fruit.name,
    calories: fruit.calories,
  })
}

export function dtoToDomain({ name, calories }: FruitDTO): Fruit {
  return new Fruit({ name, calories })
}
