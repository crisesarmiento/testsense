import chalk from 'chalk'
import type { GapReport, OutputFormat } from './types'

const PRIORITY_COLOR = {
  critical: chalk.red.bold,
  high: chalk.yellow.bold,
  medium: chalk.cyan,
}

// Renders the final gap report — pipeline progress is handled by Listr2 in cli.ts
export function render(
  report: GapReport,
  stubPath: string | null,
  options: { output: OutputFormat; top: number },
): void {
  switch (options.output) {
    case 'json':
      renderJSON(report)
      break
    case 'markdown':
      renderMarkdown(report, stubPath)
      break
    default:
      renderTerminal(report, stubPath)
  }
}

function renderTerminal(report: GapReport, stubPath: string | null): void {
  if (report.gaps.length === 0) {
    console.log(chalk.green('\n✓ No critical test gaps found.\n'))
    return
  }

  console.log('')
  for (const gap of report.gaps) {
    const color = PRIORITY_COLOR[gap.priority]
    console.log(chalk.gray('─'.repeat(60)))
    console.log(`  ${color(gap.priority.toUpperCase())}  ${chalk.white.bold(gap.title)}`)
    console.log(chalk.gray('─'.repeat(60)))
    console.log(`  ${chalk.gray('Flow:')} ${gap.flow}`)
    console.log(`  ${gap.why}`)
    console.log('')
  }

  if (stubPath) {
    console.log(chalk.gray('─'.repeat(60)))
    console.log(`  ${chalk.green('→ Generated:')} ${stubPath}`)
  }

  console.log(chalk.gray(`\n  Tokens used: ${report.analysisTokensUsed}\n`))
}

function renderJSON(report: GapReport): void {
  console.log(JSON.stringify(report, null, 2))
}

function renderMarkdown(report: GapReport, stubPath: string | null): void {
  const lines: string[] = ['## TestSense Gap Report', '']

  for (const gap of report.gaps) {
    lines.push(`### [${gap.priority.toUpperCase()}] ${gap.title}`)
    lines.push(`**Flow**: ${gap.flow}`)
    lines.push(`**Why**: ${gap.why}`)
    lines.push('')
  }

  if (stubPath) {
    lines.push(`**Generated test stub**: \`${stubPath}\``)
  }

  console.log(lines.join('\n'))
}
