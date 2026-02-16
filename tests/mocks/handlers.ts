/**
 * MSW request handlers for Liongard API mocking
 */

import { http, HttpResponse } from 'msw';

const BASE_V1 = 'https://test-instance.app.liongard.com/api/v1';
const BASE_V2 = 'https://test-instance.app.liongard.com/api/v2';

function paginatedResponse<T>(data: T[], page = 1, pageSize = 50) {
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  return {
    Data: pageData,
    Pagination: {
      TotalRows: totalRows,
      HasMoreRows: page < totalPages,
      CurrentPage: page,
      TotalPages: totalPages,
      PageSize: pageSize,
    },
  };
}

// Sample data
const environments = [
  { ID: 1, Name: 'Acme Corp', Description: 'Main client', Status: 'Active', Visible: true, Tier: 'Gold', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
  { ID: 2, Name: 'Widgets Inc', Description: null, Status: 'Active', Visible: true, Tier: null, CreatedOn: '2024-02-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
  { ID: 3, Name: 'Test Env', Description: 'Testing', Status: 'Inactive', Visible: false, Tier: null, CreatedOn: '2024-03-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const agents = [
  { ID: 1, Name: 'Agent-01', Status: 'Online', Version: '4.2.0', LastHeartbeat: '2024-06-01T12:00:00Z', IPAddress: '10.0.0.1', EnvironmentID: 1, CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
  { ID: 2, Name: 'Agent-02', Status: 'Offline', Version: '4.1.0', LastHeartbeat: null, IPAddress: null, EnvironmentID: 2, CreatedOn: '2024-02-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const systems = [
  { ID: 1, Name: 'DC01', InspectorID: 1, LaunchpointID: 1, EnvironmentID: 1, Status: 'Active', LastInspection: '2024-06-01T10:00:00Z', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
  { ID: 2, Name: 'FW-01', InspectorID: 2, LaunchpointID: 2, EnvironmentID: 1, Status: 'Active', LastInspection: null, CreatedOn: '2024-02-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const inspectors = [
  { ID: 1, Name: 'Active Directory', Description: 'AD Inspector', Icon: null, Category: 'Identity', Version: '3.0', Status: 'Active', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
  { ID: 2, Name: 'Meraki Firewall', Description: null, Icon: null, Category: 'Network', Version: '2.0', Status: 'Active', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const launchpoints = [
  { ID: 1, Name: 'Acme AD', InspectorID: 1, EnvironmentID: 1, AgentID: 1, Schedule: '0 */6 * * *', Status: 'Active', LastRun: '2024-06-01T10:00:00Z', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const detections = [
  { ID: 1, Type: 'Change', Severity: 'Medium', SystemID: 1, EnvironmentID: 1, Description: 'New user added', DetectedOn: '2024-06-01T10:00:00Z', ResolvedOn: null, Status: 'Open' },
];

const alerts = [
  { ID: 1, Name: 'High Severity Alert', Type: 'Detection', Severity: 'High', Status: 'Active', EnvironmentID: 1, SystemID: 1, TriggeredOn: '2024-06-01T10:00:00Z', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const metrics = [
  { ID: 1, Name: 'User Count', Description: 'Total AD users', Type: 'Count', Status: 'Active', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const timelineEntries = [
  { ID: 1, Type: 'Inspection', Action: 'Completed', Description: 'Inspection completed', EntityType: 'Launchpoint', EntityID: 1, UserID: null, CreatedOn: '2024-06-01T10:00:00Z' },
];

const webhooks = [
  { ID: 1, Name: 'Slack Notifications', URL: 'https://hooks.slack.com/test', Events: ['detection.created'], Status: 'Active', Secret: null, CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const identities = [
  { ID: 1, Name: 'John Doe', Email: 'john@acme.com', Type: 'User', Status: 'Active', EnvironmentID: 1, LastSeen: '2024-06-01T10:00:00Z', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

const deviceProfiles = [
  { ID: 1, Name: 'DC01', Type: 'Server', Status: 'Active', EnvironmentID: 1, IPAddress: '10.0.0.10', LastSeen: '2024-06-01T10:00:00Z', CreatedOn: '2024-01-01T00:00:00Z', UpdatedOn: '2024-06-01T00:00:00Z' },
];

export const handlers = [
  // ── Environments (v2) ──
  http.get(`${BASE_V2}/environments`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50');
    return HttpResponse.json(paginatedResponse(environments, page, pageSize));
  }),

  http.get(`${BASE_V2}/environments-count`, () => {
    return HttpResponse.json(environments.length);
  }),

  http.get(`${BASE_V2}/environments/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const env = environments.find(e => e.ID === id);
    if (!env) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(env);
  }),

  http.post(`${BASE_V2}/environments`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: 4, ...body, CreatedOn: new Date().toISOString(), UpdatedOn: new Date().toISOString() }, { status: 201 });
  }),

  http.put(`${BASE_V2}/environments/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    const env = environments.find(e => e.ID === id);
    if (!env) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...env, ...body, UpdatedOn: new Date().toISOString() });
  }),

  http.delete(`${BASE_V2}/environments/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const env = environments.find(e => e.ID === id);
    if (!env) return new HttpResponse(null, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE_V2}/environments/:id/relatedentities`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    return HttpResponse.json({
      ID: id,
      Launchpoints: [{ ID: 1, Name: 'Acme AD' }],
      Agents: [{ ID: 1, Name: 'Agent-01' }],
      IntegrationMappings: [],
      ChildEnvironments: [],
    });
  }),

  // Environment Groups
  http.get(`${BASE_V2}/environment-groups`, () => {
    return HttpResponse.json([{ ID: 1, Name: 'Production', Description: null, EnvironmentIDs: [1, 2] }]);
  }),

  http.post(`${BASE_V2}/environment-groups`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: 2, ...body }, { status: 201 });
  }),

  http.put(`${BASE_V2}/environment-groups/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: id, ...body });
  }),

  http.delete(`${BASE_V2}/environment-groups`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Agents (v2) ──
  http.post(`${BASE_V2}/view-agents`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    const page = pagination?.Page ?? 1;
    const pageSize = pagination?.PageSize ?? 50;
    return HttpResponse.json(paginatedResponse(agents, page, pageSize));
  }),

  http.delete(`${BASE_V2}/agents`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE_V2}/agent-installer`, () => {
    return HttpResponse.json({ URL: 'https://download.liongard.com/installer', Token: 'install-token-123' });
  }),

  // ── Systems (v1) ──
  http.get(`${BASE_V1}/systems`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50');
    return HttpResponse.json(paginatedResponse(systems, page, pageSize));
  }),

  http.get(`${BASE_V1}/systems/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const system = systems.find(s => s.ID === id);
    if (!system) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(system);
  }),

  // ── Inspectors (v1) ──
  http.get(`${BASE_V1}/inspectors`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50');
    return HttpResponse.json(paginatedResponse(inspectors, page, pageSize));
  }),

  http.get(`${BASE_V1}/inspectors/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const inspector = inspectors.find(i => i.ID === id);
    if (!inspector) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(inspector);
  }),

  // ── Launchpoints (v1) ──
  http.get(`${BASE_V1}/launchpoints`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50');
    return HttpResponse.json(paginatedResponse(launchpoints, page, pageSize));
  }),

  http.get(`${BASE_V1}/launchpoints/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const lp = launchpoints.find(l => l.ID === id);
    if (!lp) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(lp);
  }),

  http.post(`${BASE_V1}/launchpoints`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: 2, ...body, Status: 'Active', LastRun: null, CreatedOn: new Date().toISOString(), UpdatedOn: new Date().toISOString() }, { status: 201 });
  }),

  http.put(`${BASE_V1}/launchpoints/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    const lp = launchpoints.find(l => l.ID === id);
    if (!lp) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...lp, ...body, UpdatedOn: new Date().toISOString() });
  }),

  http.post(`${BASE_V1}/launchpoints/:id/run`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // ── Detections (v2) ──
  http.post(`${BASE_V2}/detections`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    const page = pagination?.Page ?? 1;
    const pageSize = pagination?.PageSize ?? 50;
    return HttpResponse.json(paginatedResponse(detections, page, pageSize));
  }),

  // ── Alerts (v1) ──
  http.get(`${BASE_V1}/alerts`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '50');
    return HttpResponse.json(paginatedResponse(alerts, page, pageSize));
  }),

  http.get(`${BASE_V1}/alerts/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const alert = alerts.find(a => a.ID === id);
    if (!alert) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(alert);
  }),

  // ── Metrics (v2) ──
  http.get(`${BASE_V2}/metrics`, () => {
    return HttpResponse.json(metrics);
  }),

  http.get(`${BASE_V2}/metrics/:id/relatedenvironments`, () => {
    return HttpResponse.json([{ ID: 1, Name: 'Acme Corp' }]);
  }),

  http.post(`${BASE_V2}/metrics-evaluate`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    return HttpResponse.json(paginatedResponse(
      [{ MetricID: 1, SystemID: 1, EnvironmentID: 1, Value: 42, EvaluatedOn: '2024-06-01T10:00:00Z' }],
      pagination?.Page ?? 1,
      pagination?.PageSize ?? 50,
    ));
  }),

  http.post(`${BASE_V2}/metrics-evaluate-systems`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    return HttpResponse.json(paginatedResponse(
      [{ MetricID: 1, SystemID: 1, EnvironmentID: 1, Value: 42, EvaluatedOn: '2024-06-01T10:00:00Z' }],
      pagination?.Page ?? 1,
      pagination?.PageSize ?? 50,
    ));
  }),

  // ── Timeline (v2) ──
  http.post(`${BASE_V2}/timelines-query`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    return HttpResponse.json(paginatedResponse(timelineEntries, pagination?.Page ?? 1, pagination?.PageSize ?? 50));
  }),

  // ── Webhooks (v2) ──
  http.get(`${BASE_V2}/webhooks`, () => {
    return HttpResponse.json(webhooks);
  }),

  http.get(`${BASE_V2}/webhooks/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const wh = webhooks.find(w => w.ID === id);
    if (!wh) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wh);
  }),

  http.post(`${BASE_V2}/webhooks`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: 2, ...body, Status: 'Active', Secret: null, CreatedOn: new Date().toISOString(), UpdatedOn: new Date().toISOString() }, { status: 201 });
  }),

  http.put(`${BASE_V2}/webhooks/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ID: id, ...body, UpdatedOn: new Date().toISOString() });
  }),

  http.delete(`${BASE_V2}/webhooks/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE_V2}/webhooks-auth`, () => {
    return HttpResponse.json({ Key: 'signing-key-abc123' });
  }),

  // ── Inventory (v2) ──
  http.post(`${BASE_V2}/inventory-identities-query`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    return HttpResponse.json(paginatedResponse(identities, pagination?.Page ?? 1, pagination?.PageSize ?? 50));
  }),

  http.get(`${BASE_V2}/inventory-identities/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const identity = identities.find(i => i.ID === id);
    if (!identity) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(identity);
  }),

  http.put(`${BASE_V2}/inventory-identities/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    const identity = identities.find(i => i.ID === id);
    if (!identity) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...identity, ...body, UpdatedOn: new Date().toISOString() });
  }),

  http.post(`${BASE_V2}/inventory-device-profiles-query`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const pagination = body['Pagination'] as { Page: number; PageSize: number } | undefined;
    return HttpResponse.json(paginatedResponse(deviceProfiles, pagination?.Page ?? 1, pagination?.PageSize ?? 50));
  }),

  http.get(`${BASE_V2}/inventory-device-profiles/:id`, ({ params }) => {
    const id = parseInt(params['id'] as string);
    const device = deviceProfiles.find(d => d.ID === id);
    if (!device) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(device);
  }),

  http.put(`${BASE_V2}/inventory-device-profiles/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'] as string);
    const body = await request.json() as Record<string, unknown>;
    const device = deviceProfiles.find(d => d.ID === id);
    if (!device) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...device, ...body, UpdatedOn: new Date().toISOString() });
  }),

  // ── Dataprints (v2) ──
  http.post(`${BASE_V2}/dataprints-evaluate-systemdetailid`, () => {
    return HttpResponse.json({ Value: { users: ['admin', 'jdoe'] } });
  }),
];
