// Core types shared across all pipeline stages

export interface TestSenseConfig {
  src: string
  tests: string
  framework: 'playwright' | 'vitest' | 'jest'
  model: string
  apiKey?: string
  ignore: string[]
  maxFiles: number
}

// --- Codebase Graph ---

export interface PageNode {
  filePath: string
  route: string
  imports: string[]
  hasFormSubmission: boolean
  hasAuthCheck: boolean
  hasDataFetch: boolean
  hasErrorBoundary: boolean
}

export interface ApiRouteNode {
  filePath: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  route: string
  hasAuth: boolean
  hasValidation: boolean
  returnType: string
}

export interface ComponentNode {
  filePath: string
  name: string
  props: string[]
  hasState: boolean
  hasEffects: boolean
}

export interface HookNode {
  filePath: string
  name: string
  returnType: string
}

export interface StoreNode {
  filePath: string
  name: string
  stateShape: string[]
}

export interface DependencyEdge {
  from: string
  to: string
  type: 'import' | 'uses'
}

export interface CodebaseGraph {
  pages: PageNode[]
  apiRoutes: ApiRouteNode[]
  components: ComponentNode[]
  hooks: HookNode[]
  stores: StoreNode[]
  edges: DependencyEdge[]
}

// --- Test Coverage Map ---

export interface TestCoverageMap {
  coveredRoutes: string[]
  coveredApiRoutes: string[]
  coveredComponents: string[]
  testDescriptions: string[]
  totalTests: number
  testFiles: string[]
}

// --- Gap Report ---

export type GapPriority = 'critical' | 'high' | 'medium'

export interface Gap {
  title: string
  why: string
  flow: string
  priority: GapPriority
}

export interface GapReport {
  gaps: Gap[]
  analysisTokensUsed: number
}

// --- Output ---

export type OutputFormat = 'terminal' | 'json' | 'markdown'

export interface AnalyzeOptions {
  output: OutputFormat
  focus?: string
  top: number
}
