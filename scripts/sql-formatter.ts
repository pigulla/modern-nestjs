import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import { join, resolve } from 'node:path'

import { globIterate } from 'glob'
import { type FormatOptionsWithLanguage, format as formatSQL } from 'sql-formatter'

import options from '../.sql-formatter.json' with { type: 'json' }

const root = join(import.meta.dirname, '..')

const Color = {
  OFF: '\x1b[0m',
  RED: '\x1b[0;41m',
  GREEN: '\x1b[0;42m',
} as const

async function* sqlFiles(): AsyncGenerator<{
  source: string
  relativePath: string
  absolutePath: string
}> {
  for await (const relativePath of globIterate('**/*.sql', {
    cwd: root,
    nodir: true,
    ignore: ['node_modules/**', 'dist/**'],
  })) {
    const source = await readFile(join(root, relativePath), 'utf8')
    yield { source, relativePath, absolutePath: resolve(root, relativePath) }
  }
}

async function lint(): Promise<void> {
  const hash = createHash('md5')

  for await (const { source, relativePath } of sqlFiles()) {
    const before = hash.copy().update(source).digest('hex')
    const formatted = formatSQL(source, options as FormatOptionsWithLanguage)
    const after = hash.copy().update(formatted).digest('hex')

    if (before === after) {
      process.stdout.write(`${Color.GREEN}[   OK   ]${Color.OFF} ${relativePath}${EOL}`)
    } else {
      process.exitCode = 1
      process.stdout.write(`${Color.RED}[ FAILED ]${Color.OFF} ${relativePath}${EOL}`)
    }
  }
}

async function format(): Promise<void> {
  for await (const { source, relativePath, absolutePath } of sqlFiles()) {
    const formatted = formatSQL(source, options as FormatOptionsWithLanguage)

    process.stdout.write(`${relativePath}${EOL}`)
    await writeFile(absolutePath, formatted)
  }
}

async function main(command: string): Promise<void> {
  if (command === 'lint') {
    await lint()
  } else if (command === 'format') {
    await format()
  } else {
    throw new Error(`Expected either "lint" or "format"`)
  }
}

if (process.argv.length !== 3) {
  throw new Error('Expected exactly one argument')
}
main(process.argv[2]).catch(error => {
  process.stderr.write(error)
  process.exitCode = 1
})
