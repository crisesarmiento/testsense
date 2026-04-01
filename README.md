# testsense

> AI-powered test gap analysis for TypeScript codebases.

Find what you're not testing — before it finds you.

---

AI writes code. AI writes tests. But those tests only confirm what the code *does* — not what your product *should* do. `testsense` closes that gap.

It analyzes your codebase, reads your existing tests, and tells you the most important flows you're not testing — with generated Playwright stubs for the top findings.

## Quick start

```bash
npx testsense analyze
```

## How it works

1. **Parses your codebase** — maps pages, API routes, components, and hooks using TypeScript AST analysis
2. **Reads your existing tests** — builds a coverage map of what's already tested
3. **Finds what's missing** — uses Claude to identify the most critical untested flows and why they matter

## Configuration

Create a `testsense.config.ts` at your project root:

```ts
import { defineConfig } from 'testsense'

export default defineConfig({
  src: './src',
  tests: './tests',
  framework: 'playwright',
})
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=your_key_here
```

## Output formats

```bash
npx testsense analyze                    # Terminal output (default)
npx testsense analyze --output json      # JSON (for CI integration)
npx testsense analyze --output markdown  # Markdown (for PR comments)
npx testsense analyze --top 5            # Show top 5 gaps (default: 3)
npx testsense analyze --focus checkout   # Focus on a specific flow
```

## Roadmap

- [x] Gap analysis CLI
- [ ] GitHub Action — PR-triggered analysis with comment output
- [ ] MCP server — test intelligence in Claude Code / Cursor / Windsurf
- [ ] Cloud dashboard — team analytics, historical trends, Linear/Jira integration

## License

MIT © [Cristian Sarmiento](https://github.com/crisesarmiento)
