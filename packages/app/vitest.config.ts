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
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.config.ts',
        '**/*.dto.ts',
        '**/*.error.ts',
        '**/*.interface.ts',
        '**/*.mock.ts',
        '**/*.module.ts',
        '**/*.test.ts',
      ],
    },
  },
})
