import test from 'node:test';
import assert from 'node:assert/strict';
import { introFrame, enterProgress } from '../motion.js';

test('the opening logo starts small and grows as the pinned scene is scrolled', () => {
  const start = introFrame(0, 3);
  const middle = introFrame(0.5, 3);
  const end = introFrame(0.8, 3);
  assert.ok(start.scale < 1);
  assert.ok(middle.scale > start.scale * 2);
  assert.equal(end.scale, 3);
  assert.equal(start.opacity, 1);
  assert.equal(middle.opacity, 1);
});

test('the logo stays visible while pinned, then fades as the scene leaves', () => {
  assert.equal(introFrame(1, 3).opacity, 1);
  assert.equal(introFrame(1.65, 3).opacity, 0);
  assert.deepEqual(introFrame(-1, 3), introFrame(0, 3));
  assert.deepEqual(introFrame(3, 3), introFrame(2, 3));
  assert.ok(introFrame(1.4, 3).opacity < introFrame(1.1, 3).opacity);
  assert.ok(introFrame(0.2, 3).scale < introFrame(0.7, 3).scale);
});

test('narrow screens can cap the logo without changing the animation timing', () => {
  assert.equal(introFrame(0.8, 1.5).scale, 1.5);
  assert.ok(Number.isFinite(introFrame(Number.NaN, 0).scale));
});

test('connectors and screenshots are complete before reaching the reading area', () => {
  assert.equal(enterProgress(1000, 800), 0);
  assert.equal(enterProgress(400, 800), 1);
  assert.ok(enterProgress(650, 800) > 0);
  assert.ok(enterProgress(650, 800) < 1);
  assert.equal(enterProgress(-200, 800), 1);
  assert.equal(enterProgress(100, 0), 0);
});
