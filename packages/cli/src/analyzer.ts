import Anthropic from '@anthropic-ai/sdk'
import type { GapReport, TestSenseConfig } from './types'

const SYSTEM_PROMPT = `You are a senior QA engineer reviewing a codebase for test coverage gaps.

Given a codebase summary, identify the TOP gaps — the most critical missing tests.
Prioritize by: user impact > data integrity risk > error path coverage.

Focus on: uncovered routes with auth checks, API routes without validation tests,
form submissions without error state tests, flows that combine multiple operations.

Do NOT suggest: trivial unit tests, testing third-party libraries, testing
configuration, or coverage that already exists.

Output valid JSON only. No markdown, no explanation outside the JSON.`

const USER_PROMPT = (context: string, top: number) => `
Find the top ${top} most critical test coverage gaps in this codebase.

For each gap output:
- title: short description of what's missing (max 80 chars)
- why: why this gap is risky (one sentence)
- flow: the user flow or API path it covers
- priority: "critical" | "high" | "medium"

Return a JSON object: { "gaps": [...] }

CODEBASE SUMMARY:
${context}
`

export async function analyzeGaps(
  context: string,
  config: TestSenseConfig,
  top = 3,
): Promise<GapReport> {
  if (!config.apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to your environment or testsense.config.ts.',
    )
  }

  const client = new Anthropic({ apiKey: config.apiKey })

  const message = await client.messages.create({
    model: config.model,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: USER_PROMPT(context, top),
      },
    ],
    system: SYSTEM_PROMPT,
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(raw)
    return {
      gaps: parsed.gaps ?? [],
      analysisTokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    }
  } catch {
    // TODO: retry with stricter prompt on JSON parse failure
    throw new Error(`LLM returned invalid JSON. Raw response:\n${raw}`)
  }
}
