import type { Project } from 'ts-morph'
import type { PageNode } from '../types'

// Detects Next.js pages (app router + pages router) and React route components
export async function parsePages(project: Project): Promise<PageNode[]> {
  const pages: PageNode[] = []

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath()

    // Tier 1: Next.js app router pages (app/**/page.tsx)
    const isAppRouterPage = /\/app\/.*\/page\.(tsx?|jsx?)$/.test(filePath)
    // Tier 1: Next.js pages router (pages/**/*.tsx, excluding _app, _document)
    const isPagesRouterPage =
      /\/pages\/.*\.(tsx?|jsx?)$/.test(filePath) && !/\/_/.test(filePath)

    if (!isAppRouterPage && !isPagesRouterPage) continue

    // TODO: extract route from file path
    // TODO: detect form submissions (look for onSubmit handlers, form elements)
    // TODO: detect auth checks (look for useSession, getServerSession, middleware calls)
    // TODO: detect data fetching (look for fetch, axios, useQuery, getServerSideProps)
    // TODO: detect error boundaries

    pages.push({
      filePath,
      route: filePathToRoute(filePath),
      imports: [],
      hasFormSubmission: false,
      hasAuthCheck: false,
      hasDataFetch: false,
      hasErrorBoundary: false,
    })
  }

  return pages
}

function filePathToRoute(filePath: string): string {
  // TODO: convert file path to URL route
  // e.g. /app/dashboard/page.tsx → /dashboard
  // e.g. /pages/checkout/index.tsx → /checkout
  return filePath
}
