import { describe, it, expect } from 'vitest'
import { mapTestCoverage } from '../src/test-mapper'

describe('mapTestCoverage', () => {
  it('returns empty coverage when no test files provided', async () => {
    const coverage = await mapTestCoverage([])
    expect(coverage.coveredRoutes).toHaveLength(0)
    expect(coverage.totalTests).toBe(0)
  })

  // TODO: add fixture-based tests once test-mapper implementation is complete
  // See tests/fixtures/nextjs-app/ for sample codebases
})
