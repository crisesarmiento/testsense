import { Command } from 'commander'
import { Listr } from 'listr2'
import { loadConfig } from './config'
import { collect } from './collector'
import { parse } from './parser/index'
import { mapTestCoverage } from './test-mapper'
import { buildLLMContext } from './summarizer'
import { analyzeGaps } from './analyzer'
import { generateStub } from './generator'
import { render } from './renderer'
import type { AnalyzeOptions, CodebaseGraph, GapReport, TestCoverageMap, TestSenseConfig } from './types'

interface PipelineContext {
  config: TestSenseConfig
  files: { sourceFiles: string[]; testFiles: string[] }
  graph: CodebaseGraph
  coverage: TestCoverageMap
  llmContext: string
  report: GapReport
  stubPath: string | null
}

async function runPipeline(options: AnalyzeOptions): Promise<PipelineContext> {
  const ctx: PipelineContext = {} as PipelineContext

  ctx.config = await loadConfig()
  ctx.files = await collect(ctx.config)
  ctx.graph = await parse(ctx.files.sourceFiles, ctx.config)
  ctx.coverage = await mapTestCoverage(ctx.files.testFiles)
  ctx.llmContext = buildLLMContext(ctx.graph, ctx.coverage, options.focus)
  ctx.report = await analyzeGaps(ctx.llmContext, ctx.config, Number(options.top))
  ctx.stubPath = ctx.report.gaps.length > 0 ? await generateStub(ctx.report.gaps[0], ctx.config) : null

  return ctx
}

async function runPipelineWithProgress(options: AnalyzeOptions): Promise<PipelineContext> {
  const tasks = new Listr<PipelineContext>(
    [
      {
        title: 'Loading config',
        task: async (ctx: PipelineContext) => {
          ctx.config = await loadConfig()
        },
      },
      {
        title: 'Collecting files',
        task: async (ctx: PipelineContext, task) => {
          ctx.files = await collect(ctx.config)
          task.title = `Collected ${ctx.files.sourceFiles.length} source files, ${ctx.files.testFiles.length} test files`
        },
      },
      {
        title: 'Parsing codebase',
        task: async (ctx: PipelineContext, task) => {
          ctx.graph = await parse(ctx.files.sourceFiles, ctx.config)
          task.title = `Parsed — ${ctx.graph.pages.length} pages, ${ctx.graph.apiRoutes.length} API routes, ${ctx.graph.components.length} components`
        },
      },
      {
        title: 'Mapping test coverage',
        task: async (ctx: PipelineContext, task) => {
          ctx.coverage = await mapTestCoverage(ctx.files.testFiles)
          task.title = `Coverage — ${ctx.coverage.totalTests} test files, ${ctx.coverage.coveredRoutes.length} routes covered`
        },
      },
      {
        title: 'Analyzing gaps',
        task: async (ctx: PipelineContext, task) => {
          ctx.llmContext = buildLLMContext(ctx.graph, ctx.coverage, options.focus)
          ctx.report = await analyzeGaps(ctx.llmContext, ctx.config, Number(options.top))
          task.title = `Found ${ctx.report.gaps.length} gap${ctx.report.gaps.length !== 1 ? 's' : ''}`
        },
      },
      {
        title: 'Generating test stub',
        skip: (ctx: PipelineContext) => ctx.report.gaps.length === 0,
        task: async (ctx: PipelineContext, task) => {
          ctx.stubPath = await generateStub(ctx.report.gaps[0], ctx.config)
          task.title = `Generated — ${ctx.stubPath}`
        },
      },
    ],
    { ctx: { stubPath: null } as PipelineContext },
  )

  return tasks.run()
}

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
    const isMachineOutput = options.output === 'json' || options.output === 'markdown'

    // Skip progress UI for machine-readable output — spinners would pollute piped JSON/markdown
    const ctx = isMachineOutput
      ? await runPipeline(options)
      : await runPipelineWithProgress(options)

    render(ctx.report, ctx.stubPath, options)
  })

program
  .command('init')
  .description('Create a testsense.config.ts in the current directory')
  .action(async () => {
    // TODO: interactive prompt to create config file
    console.log('testsense init — coming soon')
  })

program.parse()
