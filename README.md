# 🥋 DOJO Online Judge Orchestrator

DOJO is an online judge that orchestrates other online judges, so you can simulate [ICPC-like competitions](https://en.wikipedia.org/wiki/International_Collegiate_Programming_Contest) with problems from multiple sources, like [Codeforces](http://codeforces.com/), [Online Judge (old UVa)](https://onlinejudge.org/), [URI](https://www.urionlinejudge.com.br/) and more. It's similar to [Virtual Judge](https://vjudge.net/).

🚧 Currently under development 🚧

Table of contents:

- [Development](#development)
  - [Requirements](#requirements)

## Development

This repository is a [yarn workspaces mono-repo](https://classic.yarnpkg.com/en/docs/workspaces/) with both back-end and front-end inside the packages folder.

### Requirements

- [Node >=v12.13.0](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Docker >=v20.10.7](https://www.docker.com/get-started)

You'll also need to install the project's dependencies. To do this, run `yarn install` on the root directory.

After the step above, check each package's README file for more instructions.

- [Server package (back-end) README](packages/server/README.md)
- [App package (front-end) README](packages/app/README.md)
