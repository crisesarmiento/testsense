import type { Project } from 'ts-morph'
import type { ApiRouteNode } from '../types'

// Detects Next.js API routes (app router route handlers + pages/api)
export async function parseApiRoutes(project: Project): Promise<ApiRouteNode[]> {
  const routes: ApiRouteNode[] = []

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath()

    // App router: app/**/route.ts exports GET, POST, etc.
    const isAppRouterRoute = /\/app\/.*\/route\.(tsx?|jsx?)$/.test(filePath)
    // Pages router: pages/api/**/*.ts
    const isPagesApiRoute = /\/pages\/api\/.*\.(tsx?|jsx?)$/.test(filePath)

    if (!isAppRouterRoute && !isPagesApiRoute) continue

    // TODO: for app router — detect exported HTTP method functions (GET, POST, etc.)
    // TODO: for pages router — detect req.method switches
    // TODO: detect auth middleware (NextAuth, Clerk, custom middleware)
    // TODO: detect input validation (zod, yup, joi)
    // TODO: infer return type from response shape

    routes.push({
      filePath,
      method: 'GET', // placeholder
      route: filePathToApiRoute(filePath),
      hasAuth: false,
      hasValidation: false,
      returnType: 'unknown',
    })
  }

  return routes
}

function filePathToApiRoute(filePath: string): string {
  // TODO: convert file path to API route
  // e.g. /app/api/orders/route.ts → /api/orders
  // e.g. /pages/api/users/[id].ts → /api/users/:id
  return filePath
}
