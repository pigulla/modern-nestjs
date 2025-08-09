<p align="center">
  <img src="./logo.png" width="200" alt="Logo" />
</p>
<p align="center">A simple skeleton for modern <a href="https://nestjs.com/">NestJS</a> applications.</p>


## Synopsis

This repository provides a highly opinionated, basic setup for modern NestJS applications. It's not intended to be a turnkey solution but a solid starting point for the most common use cases. You can, should and will need to tweak and adapt it to your needs and personal preferences. 

## Key Features
- 🦠 Use [Biome](https://biomejs.dev/) instead of [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Biome hasn't yet reached feature parity compared to a fully pimped out ESLint setup, but it causes orders of magnitude fewer headaches. It's also roughly ten billion times faster.
- 🕵️‍♀️ Validate DTOs, route and query parameters with [Zod](https://github.com/colinhacks/zod) instead of [Class Validator](https://github.com/typestack/class-validator) (powered by [`nestjs-zod`](https://github.com/BenLorantfy/nestjs-zod) - this currently requires the [v5 beta](https://github.com/BenLorantfy/nestjs-zod/discussions/148)). 
- ✅ Validate OpenAPI documentation with [Redocly](https://redocly.com/redocly-cli). It can also [generate](https://redocly.com/docs/cli/commands/build-docs) reasonably pretty HTML docs.
- 🧑‍🔧 Use [Vitest](https://vitest.dev/) instead of [Jest](https://vitest.dev/).
- 🏚 Comes with [architecture tests](./test/architecture) powered by [TSArch](https://github.com/ts-arch/ts-arch). The tests currently assert the core ideas of a [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). Feel free to [configure](./test/architecture/rules.json) it to your liking.
- 🔬 Extended linting with [`depcheck`](https://github.com/depcheck/depcheck), [`npm-package-json-lint`](https://npmpackagejsonlint.org/) and [`lockfile-lint`](https://github.com/lirantal/lockfile-lint/tree/main).
- ✨ Run TypeScript files with [jiti](https://github.com/unjs/jiti) instead of [ts-node](https://typestrong.org/ts-node/).
- 📜 Logging is based on [pino](https://getpino.io/#/) (courtesy of [`nestjs-pino`](https://github.com/iamolegga/nestjs-pino)).
- ⚙️ Configuration is done with [config](https://github.com/node-config/node-config) because it is awesome.
- 📚 Use [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) for aliases (see [here](https://dev.to/vitalets/setting-up-subpath-imports-in-a-typescript-project-4i0a#update-typescript-configuration) for more details). No more `tsconfig-paths`.
- 🚀 Did I mention that the package itself is ESM? Because it is.
- 🧰 Use [`@tsconfig/bases`](https://github.com/tsconfig/bases) for TypeScript configuration.
- 💁‍♂️ Preconfigured for [commitizen](https://commitizen.github.io/cz-cli/).

### Missing Features
- We can _almost_ run the code natively using [type stripping](https://nodejs.org/api/typescript.html#type-stripping). To make this work we need the [`rewriteRelativeImportExtensions`](https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/) option introduced in TypeScript 5.7 - unfortunately this doesn't play well with subpath imports because those are absolute. Guess we have to either wait for TypeScript to fix this or get rid of the subpath imports.
- Maybe add linting for Markdown ([`markdownlint`](https://github.com/DavidAnson/markdownlint) looks nice enough),

### Other Notes
- We use abstract classes instead of interfaces solely because they can then double as injection tokens (interfaces don't exist at runtime, abstract classes do). Note that the concretions don't `extend` but `implement` them.
