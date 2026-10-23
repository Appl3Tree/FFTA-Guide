import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ACQUISITION_GOALS, GLOBAL_MISSABLES, getAcquisitionCounts } from "../src/acquisitions.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "docs/acquisition-audit.md");
const counts = getAcquisitionCounts();
const escape = (value) => String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ");
const refs = (goal) => goal.references.map((ref) => `[${escape(ref.label)}](${ref.url})`).join(", ") || "—";
const sources = (goal) => [...goal.sources, ...goal.extraMissionSources].map((source) => {
  const mission = source.missions.length ? source.missions.map((number) => `#${String(number).padStart(3, "0")}`).join(", ") : "un-numbered event";
  const target = source.target ? `; ${source.target}` : "";
  const qualifiers = [source.rarity, source.hidden ? "Hidden item" : undefined].filter(Boolean).join(", ");
  return `${mission}${target}; ${source.method}${qualifiers ? `; ${escape(qualifiers)}` : ""}; availability: ${escape(source.availability)} (record ${source.recordId}) — ${escape(source.note)}`;
}).join("<br />") || "No mission source in legacy record; see the item-specific assessment.";
const lines = [
  "# Acquisition audit",
  "",
  "> Generated from `src/acquisitions.ts` by `npm run audit:acquisitions`. Each canonical goal is listed once; all original records, item spellings, source encounters, and current warnings are retained in the data model.",
  "",
  "## Scope and current counts",
  "",
  `- ${GLOBAL_MISSABLES.length} original record IDs and ${GLOBAL_MISSABLES.reduce((sum, record) => sum + record.missable.length, 0)} original item/opportunity entries map to ${ACQUISITION_GOALS.length} canonical acquisition goals. Qualifiers such as [Hidden] and (Rare) are source metadata, not separate ownership goals.`,
  `- Permanent missables: ${counts.permanent}. These alone contribute to the permanent-missables tracker.`,
  `- Recommended acquisitions: ${counts.recommended}. They remain in chronological mission notices and do not inflate the permanent count.`,
  `- Conditional / unverified: ${counts.conditional}. These remain visible with conservative risk language.`,
  `- Optional / repeatable: ${counts.optional}. This group only receives a goal when a recovery opportunity is documented.`,
  "- The categories above partition goals for presentation. Missability, priority, and verification are separate fields; a recommended goal can still have unverified endgame availability.",
  "- A goal marked `unverified` is not represented as safe. The audit did not exhaustively verify every shop, mission-prize, treasure, or enemy source for all 51 unique steal goals; those rows keep a conservative warning and explicitly list the remaining gap.",
  "",
  "## Corrections and source rules",
  "",
  "- **Wyrmstone / Pallanza:** the old note said A Dragon's Aid (#066) consumes Wyrmstone. The Quest Guide marks that required item unused, so #066 does not consume it. Ruby Red (#031) is listed as a source; carrying Wyrmstone to a mission that does not use it is the recruitment path.",
  "- **Ezel:** the old warning emphasized an unverified linked-mission bug. The Secret Character FAQ's documented cutoff is the final story battle: Ezel is the only secret character recruited before finishing the story.",
  "- **Lutia Mop-Up / Angel Rings:** the Quest Guide lists mission #072 as non-repeatable. The earlier farming claim used a flee/reaccept failure loop, which is excluded as a normal single-player alternative.",
  "- **Type 6 rewards:** Chill Rod and Sword Breaker are listed in the Type 6 random pool. The mission-by-mission repeatability of the reward missions was not established, so this pool is not presented as a safe renewable path.",
  "- **Limited treasure layouts:** Tulwar and Zeus Mace have conditional treasure-hunt paths. Layout and limited special-treasure placements prevent a blanket safe classification; both remain conditional warnings. Silver Coat is flagged by the Thieves' Guild guide, but its complete alternative source set remains unresolved.",
  "- **Recruitment offers:** Littlevilli's Clan League (#043) mission repeats. Elda's Cup, Hero Gaol, Snake Shield, and Wyrmstone are modeled as carried mission items rather than as generic encounter completion.",
  "",
  "## Walkthrough timing and remaining conditions",
  "",
  "Chapter counters include canonical goals linked to missions listed in that progression interval, with numbered mission prerequisites checked against earlier intervals and earlier mission entries in the same interval. A source gated by a later numbered mission is not counted in an earlier mission row. Non-numbered requirements such as calendar or pub eligibility, map placements, required items, and cutscenes are retained on the mission reference; chapter counters do not infer whether the player has satisfied those conditions. Follow the displayed mission prerequisites before relying on a listed opportunity.",
  "",
  "## Source references",
  "",
  "The links below are the guide references used for the classifications in this audit. They are community-authored game guides; claims are limited to what the cited entries establish, and unresolved paths stay marked unresolved.",
  "",
  "- [Quest Guide (Terence)](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/27277)",
  "- [Stealing Guide (Nyst)](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/25875)",
  "- [Thieves' Guild Guide](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/27821)",
  "- [Gameplay Guide (Crono09)](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/62342)",
  "- [Secret Character FAQ](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/26023)",
  "- [Mission Prizes FAQ](https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/26849)",
  "",
  "## Goal-by-goal record",
  "",
  "| Canonical goal | Group / missability | Priority / verification | Original record IDs | Current sources and documented alternatives | Rationale | References |",
  "| --- | --- | --- | --- | --- | --- | --- |",
];
for (const goal of ACQUISITION_GOALS) {
  const risk = goal.missability === "permanent" ? "permanent" : goal.missability === "recoverable" ? "recoverable path documented" : "unverified risk";
  const sourcesAndAlternatives = [sources(goal), `Alternatives: ${escape(goal.alternatives.join(" "))}`].join("<br /><br />");
  lines.push(`| ${escape(goal.item)} | ${escape(goal.group)} / ${escape(risk)} | ${escape(goal.priority)} / ${escape(goal.verification)} | ${goal.recordIds.join(", ")} | ${sourcesAndAlternatives} | ${escape(goal.rationale || goal.summary)} | ${refs(goal)} |`);
}
lines.push(
  "",
  "## Progress compatibility",
  "",
  "The existing `miss-global:<id>` keys remain in local storage, exported saves, imported saves, and Firestore data. They are displayed as historical encounter checks and are never converted into item ownership because the old checkbox could represent a whole encounter containing several items. New ordinary acquisition checkboxes use `acquired:<canonical-goal-id>`. Goblin Punch / Dragon Force continue to use `blue:<name>` and Goblin / Thundrake continue to use `cap:<name>`, so the Reference panels, chronological notices, and global checklist share one state. No one-time migration rewrites saved data; old saves remain readable and new keys merge as ordinary checked-map entries.",
  "",
  "## Verification limitations",
  "",
  "The audit records the current mission/target/method stated by each legacy entry and adds mission-item sources where the cited recruitment guide identifies them. For a large set of stealable equipment, the cited guides establish the original encounter but this pass did not prove every possible shop, mission reward, map layout, or later steal source. Those goals remain `unverified` for permanent missability and stay visible as recommended acquisitions or conditional risks. The guide does not claim that the 48 recommended goals are all safely renewable.",
  "",
);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, lines.join("\n"), "utf8");
console.log(`Wrote ${output}`);
