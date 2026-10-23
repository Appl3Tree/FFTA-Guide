import assert from "node:assert/strict";
import test from "node:test";
import {
  ACQUISITION_GOALS,
  GLOBAL_MISSABLES,
  acquisitionDataDiagnostics,
  acquisitionProgressKey,
  canonicalAcquisitionId,
  getAcquisitionCounts,
  getAcquisitionGoalByRecordId,
  getAcquisitionGoalsForMission,
} from "../src/acquisitions.ts";

const byId = new Map(ACQUISITION_GOALS.map((goal) => [goal.id, goal]));

test("all legacy records and their individual entries resolve to canonical goals", () => {
  const report = acquisitionDataDiagnostics();
  assert.equal(report.records, 71);
  assert.equal(report.entries, 104);
  assert.equal(report.goals, 72);
  assert.deepEqual(report.duplicateIds, []);
  assert.deepEqual(report.duplicateRecordIds, []);
  assert.deepEqual(report.missingRecordIds, []);
  assert.deepEqual(report.unmappedEntries, []);
  assert.deepEqual(report.invalidMissionNumbers, []);
  for (const record of GLOBAL_MISSABLES) {
    for (const item of record.missable) {
      assert.ok(byId.has(canonicalAcquisitionId(item)), `missing ${record.id}: ${item}`);
    }
  }
});

test("canonicalization collapses qualifiers and spelling variants without merging distinct items", () => {
  assert.equal(canonicalAcquisitionId("Chill Rod [Hidden]"), "chill-rod");
  assert.equal(canonicalAcquisitionId("Cactus Stick (Rare) [Hidden]"), "cactus-stick");
  assert.equal(canonicalAcquisitionId("Steal Weapon ability"), canonicalAcquisitionId("Steal Weapon Ability"));
  assert.equal(canonicalAcquisitionId("Iceprism Sword (Rare)"), "iceprism-sword");
  assert.notEqual(canonicalAcquisitionId("Goblin"), canonicalAcquisitionId("Goblin Punch"));
});

test("duplicate encounter appearances share one goal and one progress key", () => {
  const madu = byId.get("madu");
  assert.ok(madu);
  assert.deepEqual(madu.recordIds, [18, 55, 66, 67]);
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.id === "madu").length, 1);
  assert.equal(getAcquisitionGoalsForMission(19).filter((goal) => goal.id === "madu").length, 1);
  assert.equal(acquisitionProgressKey(madu), "acquired:madu");
});

test("permanent missables are distinct, verified goals; recommended steals stay out of that count", () => {
  const counts = getAcquisitionCounts();
  assert.deepEqual(counts, { permanent: 7, recommended: 48, conditional: 16, optional: 1 });
  const permanent = ACQUISITION_GOALS.filter((goal) => goal.group === "permanent");
  assert.deepEqual(permanent.map((goal) => goal.id).sort(), [
    "dragon-force", "eldena", "ezel", "goblin", "goblin-punch", "quin", "thundrake",
  ]);
  assert.ok(permanent.every((goal) => goal.verification === "verified" && goal.missability === "permanent"));
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.kind === "steal" && goal.group === "recommended").length, 48);
  assert.ok(ACQUISITION_GOALS.filter((goal) => goal.group === "recommended").every((goal) => goal.group !== "permanent"));
});

test("high-risk gear and unresolved sources are not silently marked safe", () => {
  for (const id of ["tulwar", "zeus-mace", "silver-coat", "chill-rod", "steal-weapon-ability"]) {
    const goal = byId.get(id);
    assert.ok(goal, `missing ${id}`);
    assert.equal(goal.missability, "unverified");
    assert.notEqual(goal.group, "optional");
    assert.ok(goal.alternatives.length > 0);
  }
  assert.deepEqual(acquisitionDataDiagnostics().permanentGoalsWithoutVerifiedEvidence, []);
});

test("mission links resolve and repeated opportunities reuse goal state", () => {
  const chill = getAcquisitionGoalsForMission(45).find((goal) => goal.id === "chill-rod");
  assert.ok(chill);
  assert.equal(getAcquisitionGoalsForMission(61).filter((goal) => goal.id === "chill-rod").length, 1);
  assert.ok(getAcquisitionGoalsForMission(123).some((goal) => goal.id === "eldena"));
  assert.ok(getAcquisitionGoalsForMission(168).some((goal) => goal.id === "eldena"));
  assert.ok(getAcquisitionGoalsForMission(62).some((goal) => goal.id === "lini"));
  assert.ok(getAcquisitionGoalsForMission(165).some((goal) => goal.id === "cheney"));
});

test("Blue Magic and captures reuse their existing completion keys", () => {
  assert.equal(acquisitionProgressKey(byId.get("goblin-punch")), "blue:Goblin Punch");
  assert.equal(acquisitionProgressKey(byId.get("dragon-force")), "blue:Dragon Force");
  assert.equal(acquisitionProgressKey(byId.get("goblin")), "cap:Goblin");
  assert.equal(acquisitionProgressKey(byId.get("thundrake")), "cap:Thundrake");
  assert.equal(getAcquisitionGoalByRecordId(13).id, "goblin-punch");
  assert.equal(getAcquisitionGoalByRecordId(14).id, "thundrake");
});

test("the corrected Wyrmstone and Lutia Mop-Up notes remain in the source records", () => {
  const pallanzaRecord = GLOBAL_MISSABLES.find((record) => record.id === 3);
  const lutiaRecord = GLOBAL_MISSABLES.find((record) => record.id === 69);
  assert.match(pallanzaRecord.note, /UNUSED/i);
  assert.match(lutiaRecord.note, /one-time/i);
  assert.match(lutiaRecord.note, /not treated as a normal/i);
});
