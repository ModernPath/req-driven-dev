import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const auditor = fileURLToPath(new URL('../skills/rdd-audit/audit-citations.mjs', import.meta.url));

function audit(t, document, extraFiles = {}, args = ['claims.md']) {
  const dir = mkdtempSync(join(tmpdir(), 'rdd-citation-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  execFileSync('git', ['init', '-q', dir]);
  const files = {
    'claims.md': document,
    'behavior.test.ts': 'function checksBehavior() {}\nfunction TestParent() { test("Subtest", () => {}); }\ntest("rejects invalid input", () => {});\nfunction x() {}\n',
    'spec.md': '# Contract\n## Follow-Up\n',
    ...extraFiles,
  };
  for (const [path, content] of Object.entries(files)) {
    const target = join(dir, path);
    mkdirSync(join(target, '..'), { recursive: true });
    writeFileSync(target, content);
  }
  execFileSync('git', ['add', '.'], { cwd: dir });
  const result = spawnSync(process.execPath, [auditor, ...args], { cwd: dir, encoding: 'utf8' });
  assert.ifError(result.error);
  return { status: result.status, output: result.stdout + result.stderr };
}

test('a nonexistent canonical TEST file fails instead of checking nothing', t => {
  const result = audit(t, 'Required evidence: TEST:absent/behavior.test.ts:checksBehavior');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /no such file/);
});

test('valid canonical TEST references are actually checked', t => {
  const result = audit(t, 'TEST:behavior.test.ts:checksBehavior');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /1\/1 citations resolve/);
  assert.match(result.output, /checked=1/);
});

test('missing test name fails even when its file exists', t => {
  const result = audit(t, 'TEST:behavior.test.ts:checksAnotherBehavior');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /no such test or symbol/);
});

test('a matching name prefix does not satisfy the cited identity', t => {
  const result = audit(t, 'TEST:behavior.test.ts:checksBehav');
  assert.equal(result.status, 1, result.output);
});

test('short names and complete hierarchical test names are checked', t => {
  const result = audit(t, 'TEST:behavior.test.ts:x\nTEST:behavior.test.ts:TestParent/Subtest');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /2\/2 citations resolve/);
});

test('a missing subtest is not silently truncated to its existing parent', t => {
  const result = audit(t, 'TEST:behavior.test.ts:TestParent/MissingSubtest');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /MissingSubtest/);
});

test('quoted test names with spaces resolve', t => {
  const result = audit(t, 'TEST:behavior.test.ts:"rejects invalid input"');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /checked=1/);
});

test('CODE, bare line ranges and DOC references still resolve', t => {
  const result = audit(t, 'CODE:behavior.test.ts:checksBehavior\n`behavior.test.ts:1,3-4`\nDOC:spec.md#Follow-Up');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /3\/3 citations resolve/);
});

test('a missing line in the end of a compound range fails', t => {
  const result = audit(t, '`behavior.test.ts:1,3-400`');
  assert.equal(result.status, 1, result.output);
});

test('short CODE symbols cannot degrade to file-only checks', t => {
  const result = audit(t, 'CODE:behavior.test.ts:y');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /no such test or symbol/);
});

test('unsupported CODE extensions are visible', t => {
  const result = audit(t, 'CODE:behavior.wat:checksBehavior');
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /unsupported=1/);
});

test('missing quoted test names do not pass on a neighboring string', t => {
  const result = audit(t, 'TEST:behavior.test.ts:"rejects invalid"');
  assert.equal(result.status, 1, result.output);
});

test('an unsupported TEST suffix is not truncated into a pass', t => {
  const result = audit(t, 'TEST:behavior.test.ts:TestParent/');
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /unsupported=1/);
});

test('unsupported canonical reference is visible beside passing references', t => {
  const result = audit(t, 'CODE:behavior.test.ts:checksBehavior\nTEST:behavior.test.ts');
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /unsupported=1/);
});

test('no citations is not a successful validation', t => {
  const result = audit(t, '# No checkable claims');
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /no citations checked/i);
});

test('a missing requested root is not silently ignored', t => {
  const result = audit(t, 'CODE:behavior.test.ts:checksBehavior', {}, ['claims.md', 'absent-docs']);
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /absent-docs/);
});

test('example-only input is exempt, never counted as a successful check', t => {
  const result = audit(t, '```text example-citation\nTEST:absent.test.ts:example\nDOC:absent.md#Example\n```');
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /exempt=2/);
  assert.match(result.output, /checked=0/);
});

test('known gaps remain separate from checked citations', t => {
  const result = audit(t, 'No CODE:missing.ts exists.\nTEST:behavior.test.ts:checksBehavior');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /gaps=1/);
  assert.match(result.output, /checked=1/);
});

test('elided canonical TEST paths fail', t => {
  const result = audit(t, 'TEST:.../behavior.test.ts:checksBehavior');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /1 elided path/);
});
