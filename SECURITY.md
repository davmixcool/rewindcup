# Security policy

## Supported versions

Security fixes are applied to the current `main` branch and the production
deployment at https://rewindcup.com. Older forks, commits, and deployments are
not maintained by the Rewind Cup project.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability.

1. Open the repository's **Security** tab.
2. Select **Report a vulnerability** to create a private security advisory.
3. Include reproduction steps, affected URLs or commits, impact, and any
   suggested mitigation.

If private vulnerability reporting is unavailable, contact the maintainer
privately through https://x.com/iamdavidoti and request a secure reporting
channel. Do not include exploit details in the initial public message.

You should receive an acknowledgement within seven days. After triage, the
maintainer will coordinate remediation and disclosure timing with you. Please
allow a reasonable period for a fix before publishing details.

## In scope

- Cross-site scripting or injection in application-controlled content
- Exposure of non-public configuration or deployment credentials
- Authentication or authorization issues in future protected features
- Supply-chain or build behavior that affects the official deployment
- Privacy vulnerabilities involving stored preferences or analytics

## Usually out of scope

- Availability or content of externally hosted YouTube videos
- Vulnerabilities solely in third-party services with no Rewind Cup impact
- Automated reports without a reproducible security consequence
- Rate-limit or denial-of-service testing against the production site
- Social engineering, spam, or physical attacks

Please test responsibly, avoid accessing other people's data, and stop once
you have enough evidence to report the issue.
