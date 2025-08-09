import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const fruitSchema = z.strictObject({
  name: z.string().min(1).meta({ description: 'The name of the fruit.' }),
  calories: z.number().min(0).describe('How much calories a serving has.'),
})

export class FruitDTO extends createZodDto(fruitSchema) {}
