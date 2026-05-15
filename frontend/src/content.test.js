import assert from 'node:assert/strict';
import test from 'node:test';
import { pipelineStages, technologies } from './content.js';

test('dashboard content describes the requested DevSecOps lifecycle', () => {
  assert.deepEqual(
    pipelineStages.map((stage) => stage.label),
    ['Install', 'Test', 'Build', 'Docker', 'Deploy'],
  );
  assert.ok(technologies.includes('Terraform'));
  assert.ok(technologies.includes('AWS EC2'));
});

