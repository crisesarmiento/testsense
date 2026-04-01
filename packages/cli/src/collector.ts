import fs from 'fs'
import path from 'path'
import type { TestSenseConfig } from './types'

interface CollectedFiles {
  sourceFiles: string[]
  testFiles: string[]
}

const TEST_PATTERNS = [/\.test\.(ts|tsx|js|jsx)$/, /\.spec\.(ts|tsx|js|jsx)$/, /\/e2e\//]
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

export async function collect(config: TestSenseConfig): Promise<CollectedFiles> {
  const srcDir = path.resolve(process.cwd(), config.src)
  const testDir = path.resolve(process.cwd(), config.tests)

  const allFiles = walkDir(srcDir, config.ignore)
  const extraTestFiles = fs.existsSync(testDir) ? walkDir(testDir, config.ignore) : []

  const sourceFiles: string[] = []
  const testFiles: string[] = []

  for (const file of [...allFiles, ...extraTestFiles]) {
    if (!SOURCE_EXTENSIONS.includes(path.extname(file))) continue
    if (TEST_PATTERNS.some((p) => p.test(file))) {
      testFiles.push(file)
    } else {
      sourceFiles.push(file)
    }
  }

  // Apply maxFiles limit — prioritize by directory depth (closer to root = higher signal)
  const limited = sourceFiles
    .sort((a, b) => a.split('/').length - b.split('/').length)
    .slice(0, config.maxFiles)

  return { sourceFiles: limited, testFiles }
}

function walkDir(dir: string, ignore: string[]): string[] {
  // TODO: implement recursive directory walk respecting ignore patterns
  return []
}
