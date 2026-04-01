import { z } from 'zod'
import path from 'path'
import type { TestSenseConfig } from './types'

const ConfigSchema = z.object({
  src: z.string().default('./src'),
  tests: z.string().default('./tests'),
  framework: z.enum(['playwright', 'vitest', 'jest']).default('playwright'),
  model: z.string().default('claude-sonnet-4-5'),
  apiKey: z.string().optional(),
  ignore: z.array(z.string()).default(['node_modules', '.next', 'dist', '.git']),
  maxFiles: z.number().default(300),
})

export async function loadConfig(): Promise<TestSenseConfig> {
  const configPath = path.resolve(process.cwd(), 'testsense.config.ts')

  try {
    // TODO: use ts-node/esm to dynamically import the config file
    // For now, return defaults
    return ConfigSchema.parse({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  } catch {
    // No config file found — return defaults
    return ConfigSchema.parse({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
}
