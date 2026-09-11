# Contributing

Thanks for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

1. **Fork** the repository and clone it locally.
2. Create a new branch for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes, following the guidelines below.
4. Commit your changes with a clear, descriptive message.
5. Push to your fork and open a **Pull Request** against the `main` branch.

## Reporting Bugs

Before opening a bug report, please check the existing [issues](../../issues) to avoid duplicates.

A good bug report includes:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Environment details (OS, version, relevant config)
- Logs, screenshots, or error messages if applicable

> **Note:** For security vulnerabilities, please follow the process described in [`SECURITY.md`](SECURITY.md) instead of opening a public issue.

## Suggesting Features

Feature requests are welcome! Please open an issue describing:

- The problem you're trying to solve
- Your proposed solution (if you have one)
- Any alternatives you've considered

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR is easier to review than a large, mixed change.
- Write clear commit messages (e.g. `fix: correct null check in parser`).
- Update documentation if your change affects usage or behavior.
- Add or update tests where applicable.
- Make sure existing tests pass before submitting.
- Reference related issues in your PR description (e.g. `Closes #12`).

## Code Style

- Follow the existing formatting and naming conventions used in the codebase.
- Run any available linters/formatters before committing.
- Keep functions small and readable; prefer clarity over cleverness.

## Commit Messages

Where possible, follow the [Conventional Commits](https://www.conventionalcommits.org/) style:

```
feat: add support for X
fix: resolve crash when Y is empty
docs: update installation instructions
refactor: simplify Z logic
```

## Review Process

- A maintainer will review your PR as soon as possible.
- You may be asked to make changes — this is a normal part of the process.
- Once approved, your PR will be merged by a maintainer.

## Code of Conduct

Please be respectful and constructive in all interactions. Harassment or abusive behavior will not be tolerated.

## Questions?

Feel free to open a [discussion](../../discussions) or issue if you have questions about contributing.
