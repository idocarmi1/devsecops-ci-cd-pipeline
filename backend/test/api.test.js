import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../src/app.js';

function listenOnRandomPort() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('GET /api/health returns API health metadata', async (t) => {
  const server = await listenOnRandomPort();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.service, 'portfolio-devsecops-api');
  assert.equal(body.status, 'ok');
});

test('GET /api/message returns portfolio context', async (t) => {
  const server = await listenOnRandomPort();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/message`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(body.message, /DevSecOps portfolio API/);
  assert.ok(body.focusAreas.includes('CI/CD automation'));
});

test('POST /api/analyze-incident returns a structured mock AI incident analysis', async (t) => {
  const server = await listenOnRandomPort();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/analyze-incident`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      incidentText:
        'Critical outage: checkout API is returning 5xx errors for all users after the latest Docker image deployment.',
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(body.summary, /Incident signal detected/);
  assert.equal(body.severity, 'Critical');
  assert.match(body.possibleRootCause, /deployment|runtime image/i);
  assert.ok(Array.isArray(body.recommendedChecks));
  assert.ok(body.recommendedChecks.length >= 3);
  assert.match(body.escalationMessage, /NOC escalation/);
});

test('POST /api/analyze-incident rejects a missing incidentText value', async (t) => {
  const server = await listenOnRandomPort();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/analyze-incident`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(body.error, /required/);
});

test('POST /api/analyze-incident rejects incidentText that is too short', async (t) => {
  const server = await listenOnRandomPort();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/analyze-incident`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incidentText: 'CPU high' }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.match(body.error, /at least/);
});
