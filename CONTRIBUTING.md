# Contributing to Rewind Cup

Thank you for helping make football history easier to explore. Contributions
to code, accessibility, documentation, tournament data, translations, design,
and highlight maintenance are welcome.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) and the repository's
[licensing boundaries](LICENSES.md) before contributing.

## Before opening an issue

- Search existing issues and pull requests for the same problem.
- For a security vulnerability, follow [SECURITY.md](SECURITY.md) instead of
  opening a public issue.
- Use the dedicated data-correction or dead-highlight issue form when it fits.
- Include the permanent Rewind Cup URL for the affected tournament, team, or
  fixture whenever possible.

## Local setup

Requirements:

- Node.js 22 is recommended; Node.js 20.9 or newer is required.
- npm
- Chromium for the Playwright suite

```bash
nvm use
npm install
npm run dev
```

The development script selects a free local port and writes it to `.dev-url`.
Playwright discovers that URL automatically. Do not commit `.dev-url`, local
environment files, Wrangler state, test artifacts, or build output.

## Development workflow

1. Fork the repository and create a focused branch from `main`.
2. Make one coherent change per pull request.
3. Add or update tests when behavior changes.
4. Run the checks relevant to your change.
5. Open a pull request using the repository template.

Keep unrelated formatting, generated output, and data rewrites out of the
same pull request. This is especially important for tournament files, where a
small correction should remain easy to verify against its sources.

## Required checks

Run these for every code change:

```bash
npm run typecheck
npm run build
```

Run the browser suite while the development server is already running:

```bash
npm run test:e2e
```

Run these after changing tournament, team, venue, fixture, event, or highlight
data:

```bash
npm run validate:data
npm run audit:journey
npm run audit:highlights
```

YouTube availability must also be checked for changed tournaments:

```bash
npm run audit:youtube-embeds -- wc-2002
```

That command makes live network requests and requires an app origin. Start the
development server first or set `YOUTUBE_EMBED_ORIGIN` explicitly.

## Tournament-data contributions

Data pull requests must include:

- a primary or reputable source for every factual correction;
- the affected tournament and fixture IDs;
- an explanation of any code, identity, or schedule normalization;
- updated notes in [DATA_SOURCES.md](DATA_SOURCES.md) when a source or
  historical interpretation changes;
- passing data, journey, and highlight audits.

Prefer FIFA's official archive for match identifiers and reports. Cross-check
scores, dates, players, events, and venues against the sources already listed
for that edition. Wikipedia can help locate a source but should not be the
only evidence for a disputed correction.

Historical identities must follow the tournament's period rather than silently
substituting a modern successor. Explain any code mapping in the relevant data
file and source notes.

Dataset contributions are accepted under CC BY-SA 4.0. By submitting them,
you confirm that the material can legally be included under that license and
that required attribution is present.

## Highlight contributions

A replacement highlight must:

- show the exact fixture and score;
- be playable in an embedded YouTube player;
- avoid blocked or disabled embeds;
- use a stable source when more than one candidate is available;
- retain the official match-report URL;
- pass `audit:highlights` and the live YouTube embed audit.

Do not download, upload, or commit match footage. Rewind Cup stores only
provider identifiers, links, and attribution labels.

## Code and interface contributions

- Keep components keyboard-operable and preserve visible focus states.
- Use semantic HTML and accessible names before adding ARIA.
- Respect reduced-motion preferences.
- Test desktop, tablet, and mobile layouts for UI changes.
- Use the project accent `#67C6FD` consistently.
- Avoid adding dependencies when the platform or existing stack is sufficient.
- Do not commit secrets or put private values in `NEXT_PUBLIC_*` variables.

## Pull-request review

Maintainers may ask for narrower scope, stronger sources, test coverage, or an
alternative implementation. Data accuracy and accessible interaction take
priority over merging quickly.

By submitting a contribution, you agree that software and documentation
portions may be distributed under MIT and dataset portions under CC BY-SA 4.0,
as described in [LICENSES.md](LICENSES.md).
