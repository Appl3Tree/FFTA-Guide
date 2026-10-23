import assert from "node:assert/strict";
import test from "node:test";
import { buildProgressSave, parseProgressSave } from "../src/progressSave.ts";

test("v1 saves remain importable without rewriting their checked progress", () => {
  const legacy = {
    format: "ffta-progress-v1",
    slot: 1,
    checked: ["acquired-chill-rod", "blue-goblin-punch", "cap-goblin", "miss-global-17", "quest-global-45"],
  };
  const parsed = parseProgressSave(JSON.stringify(legacy));
  assert.equal(parsed.version, 1);
  assert.deepEqual(Object.keys(parsed.checked).sort(), legacy.checked.sort());
  assert.equal(parsed.checked["acquired-chill-rod"], true);
  assert.equal(parsed.expanded, undefined);
  assert.equal(parsed.panelView, undefined);
});

test("v2 export and import preserve acquisition keys and panel/block expansion", () => {
  const checked = {
    "acquired-chill-rod": true,
    "acquired-eldena": true,
    "blue-goblin-punch": true,
    "cap-goblin": true,
    "miss-global-17": true,
    "quest-global-45": true,
    "acquired-not-checked": false,
  };
  const exported = buildProgressSave(checked, { "post-006": true, "001": false }, { "panel:global:acquisitions:recommended": true });
  assert.equal(exported.format, "ffta-progress-v2");
  assert.deepEqual(exported.checked.sort(), [
    "acquired-chill-rod", "acquired-eldena", "blue-goblin-punch", "cap-goblin", "miss-global-17", "quest-global-45",
  ].sort());
  const parsed = parseProgressSave(JSON.stringify(exported));
  assert.equal(parsed.version, 2);
  assert.deepEqual(parsed.expanded, { "post-006": true });
  assert.deepEqual(parsed.panelView, { "panel:global:acquisitions:recommended": true });
  assert.equal(parsed.checked["acquired-chill-rod"], true);
  assert.equal(parsed.checked["blue-goblin-punch"], true);
  assert.equal(parsed.checked["cap-goblin"], true);
  assert.equal(parsed.checked["miss-global-17"], true);
  assert.equal(parsed.checked["quest-global-45"], true);
});

test("malformed or unsupported saves fail without returning partial progress", () => {
  assert.throws(() => parseProgressSave("{}"), /Invalid save format/);
  assert.throws(() => parseProgressSave(JSON.stringify({ format: "ffta-progress-v3", slot: 1, checked: [], expanded: [] })), /Invalid save format/);
  assert.throws(() => parseProgressSave(JSON.stringify({ format: "ffta-progress-v2", slot: 1, checked: [], expanded: [true] })), /Invalid save format/);
});
