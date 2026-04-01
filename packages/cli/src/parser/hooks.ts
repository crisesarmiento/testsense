import type { Project } from 'ts-morph'
import type { HookNode } from '../types'

// Detects custom React hooks (files/functions starting with "use")
export async function parseHooks(project: Project): Promise<HookNode[]> {
  const hooks: HookNode[] = []

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath()

    // TODO: find exported functions named use* that aren't test utilities
    // TODO: extract return type signature
    // TODO: detect if the hook wraps an API call (important for gap analysis)
  }

  return hooks
}
