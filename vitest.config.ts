import { resolve } from 'node:path'

import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    environment: 'node',
    include: ['src/**/*\\.test\\.ts', 'test/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.config.ts',
        '**/*.dto.ts',
        '**/*.interface.ts',
        '**/*.mock.ts',
        '**/*.module.ts',
        '**/*.test.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '#application': resolve(import.meta.dirname, 'src/application'),
      '#domain': resolve(import.meta.dirname, 'src/domain'),
      '#infrastructure': resolve(import.meta.dirname, 'src/infrastructure'),
      '#module': resolve(import.meta.dirname, 'src/module'),
      '#presentation': resolve(import.meta.dirname, 'src/presentation'),
      '#util': resolve(import.meta.dirname, 'src/util'),
    },
  },
})
