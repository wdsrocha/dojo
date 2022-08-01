# DOJO App (front-end)

Table of contents:

- [Development](#development)
  - [Set environment variables](#set-environment-variables)
  - [Run the development server](#run-the-development-server)
- [Troubleshooting](#troubleshooting)
  - [[WSL] Nothing shows up on <http://localhost:3000>](#wsl-nothing-shows-up-on-httplocalhost3000)

## Development

Check the development section in the [main README file](../../README.md#development) before reading this one.

⚠️ All commands displayed below are meant to be executed inside `packages/app` unless explicitly said otherwise.

### Set environment variables

Create a `.env` file and set the following environment variables:

| Variable                   | Description                      |
| -------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of your back-end server |

All variables without a default value are **required**.

You can use the following `.env` sample as a starting point for local development.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:2000
```

### Run the development server

```bash
yarn dev
```

Open <http://localhost:3000> with your browser to see the result.

## Troubleshooting

### [WSL] Nothing shows up on <http://localhost:3000>

[Current workaround: run `ipconfig /flushdns` and restart the computer](https://github.com/microsoft/WSL/issues/4636#issuecomment-874531956).
