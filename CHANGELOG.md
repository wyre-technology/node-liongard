## [Unreleased]

### BREAKING CHANGES

- **Removed `AlertsResource`.** The Liongard public API has no REST endpoint
  for alerts — alerts are delivered exclusively via webhooks. Subscribe to the
  `alerts.created` / `alerts.updated` webhook events instead. The `client.alerts`
  property, the `AlertsResource` class, and the `Alert` type have all been removed.
- **Removed `AgentsResource.generateInstaller()` / `AgentInstaller` type.**
  `POST /api/v2/agent-installer` is not part of the public Liongard API
  (not present in the official Postman collection). Agent installers must be
  generated via the Liongard web UI.
- **`AgentsResource.delete(id)` is now per-id, not bulk.** It now calls
  `DELETE /api/v1/agents/{id}` and accepts a single numeric `id` instead of an
  array of IDs.
- **`DetectionsResource.list()` signature changed.** Now calls
  `GET /api/v1/detections` (instead of `POST /api/v2/detections`) and accepts
  `{ conditions?, fields? }` query options. Returns a plain `Detection[]` array,
  not a paginated envelope. `listAll()` has been removed; a new `get(id)` helper
  was added.

### Bug Fixes

- Corrected v2 endpoint paths to use slash-delimited segments (multi-source
  verified against the official Liongard Postman collection):
  - `/environments-count` → `/environments/count`
  - `/environments/{id}/relatedentities` → `/environments/{id}/relatedEntities`
  - `/view-agents` → `/view/agents`
  - `/inventory-identities-query` → `/inventory/identities/query`
  - `/inventory-identities/{id}` → `/inventory/identities/{id}`
  - `/inventory-device-profiles-query` → `/inventory/device-profiles/query`
  - `/inventory-device-profiles/{id}` → `/inventory/device-profiles/{id}`
  - `/timelines-query` → `/timelines/query`

## [1.0.2](https://github.com/wyre-technology/node-liongard/compare/v1.0.1...v1.0.2) (2026-04-06)


### Bug Fixes

* prevent double body read on error responses ([690ebd0](https://github.com/wyre-technology/node-liongard/commit/690ebd0f8a39c422a13748850cd4e08c6e86a0c9))

## [1.0.1](https://github.com/wyre-technology/node-liongard/compare/v1.0.0...v1.0.1) (2026-04-06)


### Bug Fixes

* add trailing slashes to API paths to prevent 301 redirect auth stripping ([c8ce7d7](https://github.com/wyre-technology/node-liongard/commit/c8ce7d7fb8bb4723081caacb607a7dad8bc7fd24))

# 1.0.0 (2026-02-16)


### Features

* initial implementation of node-liongard client library ([8f0972e](https://github.com/wyre-technology/node-liongard/commit/8f0972ea70ab7509ae35946305366e3ed76cc3a5))
