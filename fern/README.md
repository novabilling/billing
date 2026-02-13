# NovaBilling SDK Generation (Fern)

This directory contains the [Fern](https://buildwithfern.com/) configuration for generating TypeScript and Python SDKs from the NovaBilling OpenAPI spec.

## Prerequisites

Install the Fern CLI globally:

```bash
npm install -g fern-api
```

## Usage

### 1. Export the OpenAPI spec

Make sure the backend is running, then Down:

### 2. Generate SDKs locally

This outputs the TypeScript SDK to `../sdks/typescript` and the Python SDK to `../sdks/python`:

```bash
fern generate --group local
```

### 3. Publish to package registries

To publish the SDKs to npm and PyPI, set the `NPM_TOKEN` and `PYPI_TOKEN` environment variables, then run:

```bash
fern generate --group publish
```
