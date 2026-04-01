import type { Project } from 'ts-morph'
import type { ComponentNode } from '../types'

// Detects reusable React components (not pages, not hooks)
export async function parseComponents(project: Project): Promise<ComponentNode[]> {
  const components: ComponentNode[] = []

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath()

    // Skip pages, API routes, hooks, config files
    if (/\/(pages|app)\//.test(filePath)) continue
    if (/\/api\//.test(filePath)) continue
    if (/\/use[A-Z]/.test(filePath)) continue

    // TODO: find exported functions that return JSX
    // TODO: extract prop types from function parameters
    // TODO: detect useState usage
    // TODO: detect useEffect usage
  }

  return components
}
