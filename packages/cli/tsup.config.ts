import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  target: 'node18',
  banner: {
    js: '#!/usr/bin/env node',
  },
})
