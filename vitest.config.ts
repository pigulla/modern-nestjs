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
      '#application': resolve(__dirname, 'src/application'),
      '#domain': resolve(__dirname, 'src/domain'),
      '#infrastructure': resolve(__dirname, 'src/infrastructure'),
      '#module': resolve(__dirname, 'src/module'),
      '#presentation': resolve(__dirname, 'src/presentation'),
      '#util': resolve(__dirname, 'src/util'),
    },
  },
})
