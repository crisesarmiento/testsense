import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { parsePages } from '../src/parser/pages'
import { parseApiRoutes } from '../src/parser/api-routes'

describe('parsePages', () => {
  it('detects Next.js app router pages', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    project.createSourceFile(
      '/project/app/dashboard/page.tsx',
      `export default function DashboardPage() { return <div>Dashboard</div> }`,
    )

    const pages = await parsePages(project)
    expect(pages).toHaveLength(1)
    expect(pages[0].route).toBe('/dashboard')
  })

  it('detects form submissions', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    project.createSourceFile(
      '/project/app/checkout/page.tsx',
      `export default function CheckoutPage() {
        return <form onSubmit={handleSubmit}><button type="submit">Pay</button></form>
      }`,
    )

    const pages = await parsePages(project)
    expect(pages[0].hasFormSubmission).toBe(true)
  })

  it('ignores non-page files', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    project.createSourceFile('/project/src/components/Button.tsx', `export const Button = () => <button />`)

    const pages = await parsePages(project)
    expect(pages).toHaveLength(0)
  })
})

describe('parseApiRoutes', () => {
  it('detects Next.js app router API routes', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    project.createSourceFile(
      '/project/app/api/orders/route.ts',
      `export async function GET() { return Response.json([]) }`,
    )

    const routes = await parseApiRoutes(project)
    expect(routes).toHaveLength(1)
    expect(routes[0].route).toContain('/api/orders')
  })
})
