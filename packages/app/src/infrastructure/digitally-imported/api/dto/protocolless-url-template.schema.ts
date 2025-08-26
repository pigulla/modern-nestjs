import z from 'zod'

export const protocollessUrlTemplateSchema = z.preprocess(
  value => (typeof value === 'string' && value.startsWith('//') ? `https:${value}` : value),
  z.httpUrl(),
)
