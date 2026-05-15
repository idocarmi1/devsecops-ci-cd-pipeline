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

