import assert from "node:assert/strict";
import test from "node:test";
import {
  ACQUISITION_GOALS,
  GLOBAL_MISSABLES,
  acquisitionCheckedKey,
  acquisitionDataDiagnostics,
  acquisitionProgressKey,
  canonicalAcquisitionId,
  getAcquisitionCounts,
  getAcquisitionGoalByRecordId,
  getAcquisitionGoalsForChapter,
  getAcquisitionPreparationsForMission,
  getAcquisitionGoalsForMission,
  getAcquisitionProgressCounts,
  getAcquisitionPlayerCopy,
  getAcquisitionSourceMissions,
  getChronologicallyAvailableMissionNumbers,
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

test("chapter membership uses only sources available in the chapter and deduplicates repeated goals", () => {
  const firstOpportunity = getAcquisitionGoalsForChapter([45]);
  const laterOpportunity = getAcquisitionGoalsForChapter([61]);
  assert.equal(firstOpportunity.filter((goal) => goal.id === "chill-rod").length, 1);
  assert.ok(!firstOpportunity.some((goal) => goal.id === "longbarrel"));
  assert.equal(laterOpportunity.filter((goal) => goal.id === "chill-rod").length, 1);
  assert.ok(laterOpportunity.some((goal) => goal.id === "longbarrel"));
  assert.deepEqual(getAcquisitionSourceMissions(byId.get("chill-rod"), [45]), [45]);
  assert.deepEqual(getAcquisitionSourceMissions(byId.get("chill-rod"), [61]), [61]);
  assert.ok(!getAcquisitionGoalsForChapter([31]).some((goal) => goal.id === "pallanza"), "obtaining the setup item does not prematurely count Pallanza as acquired");
  assert.equal(getAcquisitionPreparationsForMission(31).find(({ goal }) => goal.id === "pallanza")?.source.method, "Obtain Wyrmstone as a mission item");
  assert.deepEqual(getAcquisitionSourceMissions(byId.get("pallanza"), [31]), [], "setup-item source does not link as the recruitment source");
  assert.equal(getAcquisitionGoalsForChapter([45], [17]).filter((goal) => goal.id === "chill-rod").length, 1, "source and legacy record references remain one canonical goal");
  assert.ok(getAcquisitionGoalsForChapter([], [7]).some((goal) => goal.id === "ezel"), "manual cutoff record remains assigned to its endgame chapter");
});

test("chronology filters mission acquisition sources until numbered prerequisites are available", () => {
  const prerequisites = new Map([
    [31, ["Completed Wyrms Awaken (#102)"]],
    [45, ["Completed Mission (#044)"]],
    [32, ["Obtained The Hero Gaol", "Bardmoon only"]],
  ]);
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([31], [17], prerequisites), []);
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([45], [], prerequisites), []);
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([45], [44], prerequisites), [45]);
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([31, 102, 66], [17], new Map([
    [31, ["Completed Wyrms Awaken (#102)"]],
    [66, ["Completed Wyrms Awaken (#102)"]],
  ])), [102, 66], "a prerequisite later in the same block does not expose its acquisition early");
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([102, 31, 66], [17], new Map([
    [31, ["Completed Wyrms Awaken (#102)"]],
    [66, ["Completed Wyrms Awaken (#102)"]],
  ])), [102, 31, 66], "same-interval prerequisite can be completed before the gated source mission");
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([31, 31], [102], prerequisites), [31]);
  assert.deepEqual(getChronologicallyAvailableMissionNumbers([32], [], prerequisites), [32], "non-numeric requirements stay attached to their mission rather than being guessed");
  const earlyMissionSources = getChronologicallyAvailableMissionNumbers([45], [], prerequisites);
  assert.ok(!getAcquisitionGoalsForChapter(earlyMissionSources).some((goal) => goal.id === "chill-rod"));
});

test("canonical progress counts are exclusive and respond to check and uncheck", () => {
  const chill = byId.get("chill-rod");
  const ezel = byId.get("ezel");
  const angelRings = byId.get("angel-rings");
  const littlevilli = byId.get("littlevilli");
  const goals = [chill, ezel, angelRings, littlevilli, chill];
  const key = acquisitionCheckedKey(chill);
  assert.equal(key, "acquired-chill-rod");

  const checked = { [key]: true, "quest-global-45": true, "miss-global-7": true };
  const completed = getAcquisitionProgressCounts(goals, checked);
  assert.deepEqual(completed.total, { permanent: 1, recommended: 1, conditional: 1, optional: 1 });
  assert.deepEqual(completed.completed, { permanent: 0, recommended: 1, conditional: 0, optional: 0 });
  assert.deepEqual(getAcquisitionProgressCounts(goals, {}), {
    total: { permanent: 1, recommended: 1, conditional: 1, optional: 1 },
    completed: { permanent: 0, recommended: 0, conditional: 0, optional: 0 },
  });
  assert.equal(getAcquisitionProgressCounts([chill], { "quest-global:45": true }).completed.recommended, 0, "mission completion alone never implies item ownership");
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.group === "permanent").length, 7);
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.group === "recommended").length, 48);
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.group === "conditional").length, 16);
  assert.equal(ACQUISITION_GOALS.filter((goal) => goal.group === "optional").length, 1);
});

test("source rarity and hidden-item qualifiers remain visible metadata", () => {
  const hiddenChill = byId.get("chill-rod").sources.find((source) => source.missions.includes(45));
  const rareCactus = byId.get("cactus-stick").sources.find((source) => source.missions.includes(10));
  assert.equal(hiddenChill.hidden, true);
  assert.equal(rareCactus.rarity, "Rare");
  assert.equal(rareCactus.hidden, true);
});

test("player-facing guidance covers all 72 goals without exposing audit language", () => {
  const missionName = (number) => `Mission #${String(number).padStart(3, "0")}`;
  const prohibited = /verification|verified|unverified|documented|assessment|legacy record|repeatability|source confidence|audit/i;
  assert.equal(ACQUISITION_GOALS.length, 72);
  for (const goal of ACQUISITION_GOALS) {
    const copy = getAcquisitionPlayerCopy(goal, missionName);
    assert.ok(copy.label, `${goal.id} needs a player-facing label`);
    assert.ok(copy.instruction, `${goal.id} needs an actionable instruction`);
    assert.ok(!copy.instruction.startsWith("Check this opportunity"), `${goal.id} needs item-specific guidance`);
    assert.ok(!prohibited.test(JSON.stringify(copy)), `${goal.id} exposes research terminology`);
  }
});

test("source citations stay with the research data, outside player-facing copy", () => {
  const chill = byId.get("chill-rod");
  const copy = getAcquisitionPlayerCopy(chill);
  assert.ok(chill.references.length > 0, "research references remain available internally");
  assert.equal(Object.hasOwn(copy, "references"), false);
});

test("recruitment instructions do not turn cutoff missions into false acquisition alternatives", () => {
  for (const id of ["eldena", "pallanza", "quin", "littlevilli", "iceprism-sword", "r4-anti-law", "free-bervenia-087"]) {
    const copy = getAcquisitionPlayerCopy(byId.get(id));
    assert.deepEqual(copy.otherOpportunities, [], `${id} should not repeat its own mission as another opportunity`);
  }
  const goblin = getAcquisitionPlayerCopy(byId.get("goblin"), (n) => `Quest ${n}`);
  assert.deepEqual(goblin.otherOpportunities, ["Quest 32", "Quest 37", "Quest 44", "Quest 49", "Quest 55"]);
});

test("player copy gives contextual steal targets, timing, and cautious later alternatives", () => {
  const missionName = (number) => ({
    10: "Emerald Keep (#010)",
    12: "Jagd Hunt (#012)",
    14: "The Big Find (#014)",
    23: "Over the Hill (#023)",
    45: "Frosty Mage (#045)",
    61: "Hit Again! (#061)",
  }[number] ?? `Mission #${String(number).padStart(3, "0")}`);
  const chillRod = byId.get("chill-rod");
  const chillGlobal = getAcquisitionPlayerCopy(chillRod, missionName);
  assert.equal(chillGlobal.label, "Strongly Recommended");
  assert.match(chillGlobal.instruction, /Steal from Nu Mou Black Mage during Frosty Mage/);
  assert.match(chillGlobal.note, /later Type 6 mission reward is random/i);
  assert.match(chillGlobal.otherOpportunities.join(" "), /Hit Again! \(#061\)/);
  const chillLaterMission = getAcquisitionPlayerCopy(chillRod, missionName, 61);
  assert.match(chillLaterMission.instruction, /Hit Again! \(#061\)/);
  assert.doesNotMatch(chillLaterMission.instruction, /hidden/i);

  const tulwar = getAcquisitionPlayerCopy(byId.get("tulwar"), missionName, 12);
  assert.match(tulwar.instruction, /Steal from Blue Mage during Jagd Hunt/);
  assert.match(tulwar.note, /map layout/i);
  const angelRing = getAcquisitionPlayerCopy(byId.get("angel-rings"), missionName, 72);
  assert.equal(angelRing.label, "Optional");
  assert.match(angelRing.instruction, /Steal from Black Mage/);
  assert.match(angelRing.note, /do not rely on repeating/i);
  const littlevilli = getAcquisitionPlayerCopy(byId.get("littlevilli"), missionName);
  assert.equal(littlevilli.label, "Optional");
  assert.match(littlevilli.instruction, /replay the mission/i);
  assert.equal(littlevilli.note, undefined, "the instruction already tells the player how to try again");

  const aegis = getAcquisitionPlayerCopy(byId.get("aegis-shield"), missionName);
  assert.match(aegis.instruction, /Emerald Keep \(#010\)/);
  assert.deepEqual(aegis.otherOpportunities, [
    "Steal from Paladin during Mission #060 (Rare).",
    "Steal from Soldier during Mission #104 (Rare).",
  ], "global guidance puts the earliest listed chance first and orders later chances chronologically");
});

test("Lutia Mop-Up acquisition targets are modeled as steals, not generic mission rewards", () => {
  for (const [id, target] of [["angel-rings", "Black Mage"], ["bracers", "Sniper"], ["hades-bows", "Sniper"]]) {
    const goal = byId.get(id);
    assert.equal(goal.kind, "steal");
    assert.equal(goal.sources[0].target, target);
    assert.deepEqual(goal.sources[0].missions, [72]);
  }
});

test("Blue Magic and captures reuse their existing completion keys", () => {
  const goblinPunch = byId.get("goblin-punch");
  const goblin = byId.get("goblin");
  assert.equal(acquisitionProgressKey(goblinPunch), "blue:Goblin Punch");
  assert.equal(acquisitionProgressKey(byId.get("dragon-force")), "blue:Dragon Force");
  assert.equal(acquisitionProgressKey(goblin), "cap:Goblin");
  assert.equal(acquisitionProgressKey(byId.get("thundrake")), "cap:Thundrake");
  const sharedCheckedState = {
    [acquisitionCheckedKey(goblinPunch)]: true,
    [acquisitionCheckedKey(goblin)]: true,
  };
  const sharedCounts = getAcquisitionProgressCounts([goblinPunch, goblin], sharedCheckedState);
  assert.equal(sharedCounts.total.permanent, 2);
  assert.equal(sharedCounts.completed.permanent, 2, "learning/capturing in their existing trackers completes the linked goal");
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
