import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import type { Gap, TestSenseConfig } from './types'

const SYSTEM_PROMPT = `You are a senior engineer writing Playwright tests.
Output ONLY TypeScript test code. No explanation, no markdown fences.`

const USER_PROMPT = (gap: Gap) => `
Write a complete, runnable Playwright test for this gap:

Gap: ${gap.title}
Flow: ${gap.flow}
Why it matters: ${gap.why}

Rules:
- Use TypeScript and @playwright/test
- Include realistic test data (no foo/bar placeholders)
- Test the happy path AND the most important error state
- Use accessibility-first selectors (getByRole, getByLabel) over CSS selectors
- Add a comment on each assertion explaining the business rule it verifies
- Read baseURL from process.env.BASE_URL

Output ONLY the test code.
`

export async function generateStub(gap: Gap, config: TestSenseConfig): Promise<string> {
  if (!config.apiKey) return ''

  const client = new Anthropic({ apiKey: config.apiKey })

  const message = await client.messages.create({
    model: config.model,
    max_tokens: 2048,
    messages: [{ role: 'user', content: USER_PROMPT(gap) }],
    system: SYSTEM_PROMPT,
  })

  const code = message.content[0].type === 'text' ? message.content[0].text : ''

  // Write stub to testsense-output/ directory
  const outputDir = path.resolve(process.cwd(), 'testsense-output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

  const fileName = gap.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .concat('.spec.ts')

  const outputPath = path.join(outputDir, fileName)
  fs.writeFileSync(outputPath, code)

  return outputPath
}
