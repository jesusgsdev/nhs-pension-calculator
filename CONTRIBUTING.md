# Contributing

Thanks for helping improve the NHS Pension Calculator!

## Setup

```bash
npm ci
npm run dev
```

## Before opening a pull request

```bash
npm run test:coverage   # tests must pass
npm run build           # type-checks and builds
```

- Keep changes focused; one topic per PR.
- Add or update tests in `tests/` for any change to calculation logic in `src/engine` or `src/data`.
- When changing pay scales, contribution tiers or tax rates, link the official source (NHS Employers, NHSBSA, HMRC) in the PR description.

## Reporting calculation errors

Please include your inputs (band, step, scheme, schedule, retirement age), the result you got, and the result you expected with a source.

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
