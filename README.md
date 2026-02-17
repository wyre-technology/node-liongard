# @wyre-technology/node-liongard

A Node.js client library for the [Liongard](https://www.liongard.com/) API. Supports both v1 and v2 API endpoints.

## Installation

```bash
npm install @wyre-technology/node-liongard
```

> **Note:** This package is published to [GitHub Packages](https://github.com/wyre-technology/node-liongard/packages). You'll need to configure your `.npmrc`:
>
> ```
> @wyre-technology:registry=https://npm.pkg.github.com
> ```

## Usage

```typescript
import { LiongardClient } from "@wyre-technology/node-liongard";

const client = new LiongardClient({
  url: "https://your-instance.liongard.com",
  accessKey: "your-access-key",
  accessSecret: "your-access-secret",
});

// List inspectors
const inspectors = await client.inspectors.list();
```

## Authentication

Liongard uses API key authentication via the `X-ROAR-API-KEY` header. Rate limit: 300 requests/minute.

## API Coverage

- Inspectors
- Systems
- Metrics & Timelines
- Alerts
- Users & Groups
- Environments
- Integrations
- Agents

## License

[Apache-2.0](LICENSE)
