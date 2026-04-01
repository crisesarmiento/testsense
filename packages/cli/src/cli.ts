import { Command } from 'commander'
import { loadConfig } from './config'
import { collect } from './collector'
import { parse } from './parser/index'
import { mapTestCoverage } from './test-mapper'
import { buildLLMContext } from './summarizer'
import { analyzeGaps } from './analyzer'
import { generateStub } from './generator'
import { render } from './renderer'
import type { AnalyzeOptions } from './types'

const program = new Command()

program
  .name('testsense')
  .description('AI-powered test gap analysis for TypeScript codebases')
  .version('0.1.0')

program
  .command('analyze')
  .description('Analyze your codebase and find critical test coverage gaps')
  .option('-o, --output <format>', 'output format: terminal | json | markdown', 'terminal')
  .option('-f, --focus <keyword>', 'limit analysis to flows matching keyword')
  .option('-t, --top <number>', 'number of gaps to show', '3')
  .action(async (options: AnalyzeOptions) => {
    const config = await loadConfig()
    const { sourceFiles, testFiles } = await collect(config)
    const graph = await parse(sourceFiles, config)
    const coverage = await mapTestCoverage(testFiles)
    const context = buildLLMContext(graph, coverage, options.focus)
    const report = await analyzeGaps(context, config)
    const stub = report.gaps.length > 0 ? await generateStub(report.gaps[0], config) : null
    render(report, stub, options)
  })

program
  .command('init')
  .description('Create a testsense.config.ts in the current directory')
  .action(async () => {
    // TODO: interactive prompt to create config file
    console.log('testsense init — coming soon')
  })

program.parse()
