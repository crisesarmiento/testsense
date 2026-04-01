import type { CodebaseGraph, TestCoverageMap } from './types'

// Compresses the graph + coverage map into a compact string for the LLM
// Target: under 4,000 tokens. Do NOT send raw source code.
export function buildLLMContext(
  graph: CodebaseGraph,
  coverage: TestCoverageMap,
  focus?: string,
): string {
  const uncoveredPages = graph.pages.filter((p) => !coverage.coveredRoutes.includes(p.route))
  const uncoveredApiRoutes = graph.apiRoutes.filter(
    (r) => !coverage.coveredApiRoutes.includes(`${r.route} ${r.method}`),
  )

  // Apply focus filter if provided
  const filteredPages = focus
    ? uncoveredPages.filter((p) => p.route.toLowerCase().includes(focus.toLowerCase()))
    : uncoveredPages

  const filteredApiRoutes = focus
    ? uncoveredApiRoutes.filter((r) => r.route.toLowerCase().includes(focus.toLowerCase()))
    : uncoveredApiRoutes

  return `
CODEBASE SUMMARY:

Pages/Routes: ${graph.pages.length} total
  Covered by tests: ${coverage.coveredRoutes.length}
  NOT covered (${filteredPages.length}):
${filteredPages
  .map(
    (p) =>
      `  - ${p.route} (form:${p.hasFormSubmission}, auth:${p.hasAuthCheck}, fetch:${p.hasDataFetch})`,
  )
  .join('\n')}

API Routes: ${graph.apiRoutes.length} total
  Covered: ${coverage.coveredApiRoutes.length}
  NOT covered (${filteredApiRoutes.length}):
${filteredApiRoutes
  .map((r) => `  - ${r.method} ${r.route} (auth:${r.hasAuth}, validation:${r.hasValidation})`)
  .join('\n')}

Components: ${graph.components.length} total, ${coverage.coveredComponents.length} covered

Existing test descriptions (sample):
${coverage.testDescriptions.map((d) => `  - ${d}`).join('\n')}
`.trim()
}
