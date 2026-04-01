import { Project } from 'ts-morph'
import { parsePages } from './pages'
import { parseApiRoutes } from './api-routes'
import { parseComponents } from './components'
import { parseHooks } from './hooks'
import type { CodebaseGraph, TestSenseConfig } from '../types'

export async function parse(sourceFiles: string[], config: TestSenseConfig): Promise<CodebaseGraph> {
  const project = new Project({ skipAddingFilesFromTsConfig: true })
  project.addSourceFilesAtPaths(sourceFiles)

  const [pages, apiRoutes, components, hooks] = await Promise.all([
    parsePages(project),
    parseApiRoutes(project),
    parseComponents(project),
    parseHooks(project),
  ])

  return {
    pages,
    apiRoutes,
    components,
    hooks,
    stores: [], // TODO: implement store detection
    edges: [],  // TODO: implement dependency edge analysis
  }
}
