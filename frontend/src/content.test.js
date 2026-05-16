import assert from 'node:assert/strict';
import test from 'node:test';
import { pipelineStages, technologies } from './content.js';
import { minimumIncidentTextLength, validateIncidentText } from './incidentAssistant.js';

test('dashboard content describes the requested DevSecOps lifecycle', () => {
  assert.deepEqual(
    pipelineStages.map((stage) => stage.label),
    ['Install', 'Test', 'Build', 'Docker', 'Deploy'],
  );
  assert.ok(technologies.includes('Terraform'));
  assert.ok(technologies.includes('AWS EC2'));
});

test('incident assistant validation requires useful alert context', () => {
  assert.match(validateIncidentText(''), /Paste alert text/);
  assert.match(validateIncidentText('CPU high'), /at least/);
  assert.equal(
    validateIncidentText('Checkout API is returning 5xx responses after deployment.'),
    '',
  );
  assert.equal(minimumIncidentTextLength, 20);
});
