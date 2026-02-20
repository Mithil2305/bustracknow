# Contributing to BusTrackNow

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/bustracknow.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Start the dev server: `npx expo start`

## Code Style

- Use **Prettier** with the project `.prettierrc` config
- Follow **ESLint** rules (run `npx expo lint`)
- Use the design tokens from `design/tokens.js` for all colors, spacing, and radii
- Components follow the `PascalCase.jsx` naming convention
- Hooks follow the `useCamelCase.js` convention

## Commit Messages

Use conventional commits:

```
feat: add wallet redemption flow
fix: correct spoofing detection threshold
docs: update API reference
test: add points system integration tests
```

## Pull Request Process

1. Ensure all lint checks pass
2. Add tests for new logic modules
3. Update documentation if adding new screens or APIs
4. Request review from a maintainer

## Architecture

See `docs/ARCHITECTURE.md` for the full system overview.

## Security

If you discover a security vulnerability, please email the maintainers directly instead of opening a public issue.
