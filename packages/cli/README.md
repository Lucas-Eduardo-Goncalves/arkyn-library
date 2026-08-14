# @arkyn/cli

Command-line tool for the Arkyn ecosystem, generates and maintains an `AGENTS.md` file so AI coding assistants (Claude Code, Cursor, Copilot, and others that read `AGENTS.md`/`CLAUDE.md`) know how to use the `@arkyn/*` packages installed in your project.

[![npm version](https://img.shields.io/npm/v/@arkyn/cli.svg)](https://www.npmjs.com/package/@arkyn/cli)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎯 What it solves

When an AI assistant works inside a project that consumes Arkyn packages, it has no built-in knowledge of which components, hooks, or utilities are available, or how to use them correctly. `@arkyn/cli` closes that gap without requiring a permanent install: it inspects your project's `package.json`, finds which `@arkyn/*` packages are installed, and wires their `AGENTS.md` docs (shipped inside each package) into your project's own `AGENTS.md`, so your AI assistant picks them up automatically.

## ✨ Features

- 🔍 **Detects installed packages**, reads `dependencies`/`devDependencies` to find every `@arkyn/*` package in your project
- 🔗 **Wires up AGENTS.md**, links to each installed package's shipped `AGENTS.md` from your project's root `AGENTS.md`
- ♻️ **Idempotent**, safe to run multiple times, it updates its own block instead of duplicating content
- ✍️ **Non-destructive**, never touches content outside its own managed block, your existing `AGENTS.md` notes are preserved
- 📦 **Zero install**, designed to be run with `npx`/`bunx`, nothing lingers in your project afterward

## 📋 Prerequisites

- **Node.js** `>=18.0.0`
- **Bun** `>=1.0.0`

## 📦 Installation

> **No installation needed.** Run it directly with `npx` or `bunx` from your project root.

```bash
npx @arkyn/cli init --agents
# or
bunx @arkyn/cli init --agents
```

If you prefer, you can still add it as a dev dependency and run it through a script:

```bash
npm install --save-dev @arkyn/cli
```

## 🚀 Quick Start

```bash
cd my-app
npx @arkyn/cli init --agents
```

```
Updated AGENTS.md with docs for: @arkyn/components, @arkyn/server
```

Re-run the same command any time you install or remove `@arkyn/*` packages, it keeps the list in `AGENTS.md` in sync.

## 📖 Commands

### `arkyn init --agents`

Creates `AGENTS.md` in the current directory if it doesn't exist, or updates it in place if it does. It:

1. Reads `package.json` in the current working directory.
2. Collects every `@arkyn/*` package listed in `dependencies` or `devDependencies`.
3. For each one, checks whether `node_modules/@arkyn/<package>/AGENTS.md` exists.
4. Writes a `<!-- arkyn:agents:start -->` / `<!-- arkyn:agents:end -->` block in your `AGENTS.md` linking to each doc found.

If no `@arkyn/*` package is installed, or none of them ship an `AGENTS.md` yet, the command logs why and exits without modifying anything.

### `arkyn --help`

Prints usage information.

## 📚 Documentation

Full documentation: [https://docs.arkyn.dev/docs/cli/introduction](https://docs.arkyn.dev/docs/cli/introduction)

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE.txt) file for details.
