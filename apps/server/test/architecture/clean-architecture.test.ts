import { join } from 'node:path'

import { filesOfProject } from 'tsarch'
import { describe, expect, it } from 'vitest'

import rulesJson from './rules.json' with { type: 'json' }
import { type Component, type Exception, type Rule, rulesSchema } from './rules.schema.js'

describe('The project implements a clean architecture where', () => {
  const pathToTsConfig = join(import.meta.dirname, '..', '..', 'tsconfig.json')
  const rules = rulesSchema.parse(rulesJson)

  describe.each<[string, Rule[]]>(Object.entries(rules))('files in %s', (source, rulesMap) => {
    type TestCase = [
      Component, // source folder
      string, // exceptions string (for display purposes only)
      Component, // target folder
      Set<Exception>,
    ]

    const rules = rulesMap.flatMap(rule =>
      [...rule.mustNotImportFrom].map<TestCase>(target => [
        target,
        rule.exceptFor.size === 0 ? '' : ` (except for ${[...rule.exceptFor].join(', ')})`,
        source as Component,
        rule.exceptFor,
      ]),
    )

    it.each<TestCase>(
      rules,
    )('should not import from %s%s', async (target, _, source, exceptions) => {
      let rule = filesOfProject(pathToTsConfig)
        .inFolder(source)
        .shouldNot()
        .dependOnFiles()
        .inFolder(target)

      if (exceptions.size > 0) {
        const exceptionPattern = [...exceptions]
          .map(exception => `\\.${exception.slice(0, -1)}\\.ts`)
          .join('|')
        rule = rule.matchingPattern(`.*(?<!${exceptionPattern})$`)
      }

      await expect(rule.check()).resolves.toEqual([])
    })
  })
})
