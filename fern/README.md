# SDK generation (Fern)

SDKs are generated from the committed OpenAPI spec, `backend/openapi/openapi.json`.
Pull-request CI only checks that the spec matches the code; SDKs are built on
releases and on request by the **SDKs** workflow (`.github/workflows/sdks.yml`).

| Group | Languages | When |
|---|---|---|
| `tier1` | TypeScript, Python, PHP | Every release |
| `tier2` | Go, Java, Ruby, C# | On request (workflow dispatch) |

There is no Dart, Swift or browser SDK: billing calls need the secret API key,
which must stay on a server. Mobile and web apps call their own backend.

## After changing the API

```bash
cd backend
npm run openapi:export   # rewrites openapi/openapi.json; commit it with your change
```

## Generate locally

Needs Docker and a `FERN_TOKEN`:

```bash
cd fern
npx fern-api generate --local --group tier1   # output in ../sdks/ (not committed)
```
