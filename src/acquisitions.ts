export type GlobalMissable = {
  id: number;
  type: string;
  missable: string[];
  warning?: string;
  mission?: number[];
  note: string;
};

export const GLOBAL_MISSABLES: GlobalMissable[] = [
 {
  id: 1,
  type: "Recruiting-Related Missions",
  missable: ["Eldena"],
  warning: "Do NOT complete Caravan Guard (#168) or discard Elda's Cup before recruiting Eldena.",
  note: "If you complete this mission before recruiting Eldena, you will lose Elda's Cup and miss the opportunity to recruit Eldena.",
  mission: [168]
 },
 {
  id: 2,
  type: "Recruiting-Related Missions",
  missable: ["Lini"],
  warning: "Do NOT discard the Hero Gaol before recruiting Lini.",
  note: "If you discard the Hero Gaol before recruiting Lini, you will miss the opportunity to recruit Lini.",
  mission: []
 },
 {
  id: 3,
  type: "Recruiting-Related Missions",
  missable: ["Pallanza"],
  warning: "Keep Wyrmstone until Pallanza joins; A Dragon's Aid (#066) lists it as unused.",
  note: "Wyrmstone is listed as UNUSED in A Dragon's Aid. Carry it to a mission that does not consume it to trigger Pallanza's recruitment opportunity.",
  mission: [66]
 },
 {
  id: 4,
  type: "Recruiting-Related Missions",
  missable: ["Quin"],
  warning: "Save before starting Missing Professor (#63).",
  note: "If Quin doesn't offer to join, reset because this is the only chance to recruit Quin.",
  mission: [63]
 },
 {
  id: 5,
  type: "Recruiting-Related Missions",
  missable: ["Cheney"],
  warning: "Do NOT discard the Snake Shield before recruiting Cheney.",
  note: "If you discard the Snake Shield before recruiting Cheney, you will miss the opportunity to recruit Cheney."
 },
 {
  id: 6,
  type: "Recruiting-Related Missions",
  missable: ["Littlevilli"],
  warning: "Save before starting the Clan League (#043) mission.",
  note: "Not \"technically\" missable as the mission repeats. Just to save your time, reset if Littlevilli doesn't request to join.",
  mission: [43],
 },
 {
  id: 7,
  type: "Recruiting-Related Missions",
  missable: ["Ezel"],
  warning: "Recruit Ezel before the final story battle.",
  note: "The old combined-mission bug report remains unverified; the documented cutoff is the end of the story.",
 },
 {
  id: 8,
  type: "Recruiting-Related Missions",
  missable: ["Ritz"],
  warning: "Do NOT complete \"Reconciliation\" alongside \"Left Behind\" or \"A Maiden's Cry\".",
  note: "Possible bug can cause issues."
 },
 {
  id: 9,
  type: "Recruiting-Related Missions",
  missable: ["Babus"],
  warning: "Do NOT complete \"Left Behind\" alongside \"A Maiden's Cry\" or \"Reconciliation\" and do NOT move on map before signing up for \"With Babus\".",
  note: "Possible bug can cause issues."
 },
 {
  id: 10,
  type: "Recruiting-Related Missions",
  missable: ["Shara"],
  warning: "Do NOT complete \"A Maiden's Cry\" alongside \"Left Behind\" \"Reconciliation\" and do NOT move on map before signing up for \"With Babus\".",
  note: "Possible bug can cause issues."
 },
 {
  id: 11,
  type: "Recruiting-Related Missions",
  missable: ["Cid"],
  warning: "Do NOT miss anything anything that can cause you to miss one of the 300 numbered quests.",
  note: "You must complete all 300 numbered missions to recruit Cid."
 },
 {
  id: 12,
  type: "Monster Bank",
  missable: ["Goblin"],
  warning: "The blue Goblins disappear later in the game.",
  note: "Capture ASAP. Available in A Lost Ring (#049), Snow in Lutia (#044), White Flowers (#055), Village Hunt (#037), and Tower Ruins (#032).",
  mission: [49,44,55,37,32]
 },
 {
  id: 13,
  type: "Blue Magic",
  missable: ["Goblin Punch"],
  warning: "The blue Goblins disappear later in the game.",
  note: "Learn ASAP. Available in A Lost Ring (#049), Snow in Lutia (#044), White Flowers (#055), Village Hunt (#037), and Tower Ruins (#032).",
  mission: [49,44,55,37,32]
 },
 {
  id: 14,
  type: "Monster Bank",
  missable: ["Thundrake"],
  warning: "Thundrakes disappear later in the game.",
  note: "Capture ASAP. Can capture in Pale Company (#011), Wyrm's Awaken (#102), A Dragon's Aid (#066), Ruby Red (#031), and To Amberavle (#022).",
  mission: [11,102,66,31,22]
 },
 {
  id: 15,
  type: "Blue Magic",
  missable: ["Dragon Force"],
  warning: "Thundrakes disappear later in the game.",
  note: "Learn ASAP. Can learn in Wind Sigil (#079), Magewrym (#034), The Worldwyrm (#088), Wyrm's Awaken (#102), A Dragon's Aid (#066), Ruby Red (#031), and To Amberavle (#022).",
  mission: [79,34,88,102,66,31,22]
 },
 {
  id: 16,
  type: "Important Steals",
  missable: ["Steal Weapon ability"],
  warning: "Target: Thief",
  note: "Can be obtained in Diaghilev Godeye (#027).",
  mission: [27]
 },
 {
  id: 17,
  type: "Important Steals",
  missable: ["Chill Rod [Hidden]"],
  warning: "Target: Nu Mou Black Mage",
  note: "Can be obtained in Frosty Mage (#045) [Hidden] or Hit Again! (#061) [Not Hidden].",
  mission: [45, 61]
 },
 {
  id: 18,
  type: "Important Steals",
  missable: ["Madu"],
  warning: "Target: Red Mage",
  note: "Can be obtained in Nubswood Base (#071).",
  mission: [71]
 },
 {
  id: 19,
  type: "Important Steals",
  missable: ["Cinqueda [Hidden]"],
  warning: "Target: Thief (Zorlin Shape)",
  note: "Can be obtained in Magic Wood (#009).",
  mission: [9]
 },
 {
  id: 20,
  type: "Important Steals",
  missable: ["Lotus Mace", "Mirage Vest", "Aegis Shield (Rare)"],
  warning: "Target: Babus",
  note: "Can be obatained in Emerald Keep (#010).",
  mission: [10]
 },
 {
  id: 21,
  type: "Important Steals",
  missable: ["Mandragora", "Cactus Stick (Rare) [Hidden]"],
  warning: "Target: Alchemist",
  note: "Can be obtained in Emerald Keep (#010).",
  mission: [10]
 },
 {
  id: 22,
  type: "Important Steals",
  missable: ["Stopshot Ability"],
  warning: "Target: Gunner",
  note: "Can be obtained in Emerald Keep (#010).",
  mission: [10]
 },
 {
  id: 23,
  type: "Important Steals",
  missable: ["Steal Weapon Ability"],
  warning: "Target: Moogle Thief",
  note: "Can be obtained in Fire Sigil (#076).",
  mission: [76]
 },
 {
  id: 24,
  type: "Important Steals",
  missable: ["Tulwar (Very Rare) [Hidden]", "Mirage Vest"],
  warning: "Target: Blue Mage",
  note: "Can be obtained in Jagd Hunt (#012).",
  mission: [12]
 },
 {
  id: 25,
  type: "Important Steals",
  missable: ["Genji Armlets (Rare)", "Dark Gear", "Petalchaser"],
  warning: "Target: Ninja",
  note: "Can be obtained in Jagd Hunt (#012).",
  mission: [12]
 },
 {
  id: 26,
  type: "Important Steals",
  missable: ["Gupti Aga [Hidden]"],
  warning: "Target: Red Mage",
  note: "Can be obtained in The Bounty (#013).",
  mission: [13]
 },
 {
  id: 27,
  type: "Important Steals",
  missable: ["Vigilante"],
  warning: "Target: Paladin",
  note: "Can be obtained in The Bounty (#013).",
  mission: [13]
 },
 {
  id: 28,
  type: "Important Steals",
  missable: ["Sword Breaker"],
  warning: "Target: Moogle Thief",
  note: "Can be obtained in Wanted! Gabbama Brothers (#026).",
  mission: [26]
 },
 {
  id: 29,
  type: "Important Steals",
  missable: ["Longbarrel"],
  warning: "Target: Gunner",
  note: "Can be obtained in Hit Again (#061).",
  mission: [61]
},
{
  id: 30,
  type: "Important Steals",
  missable: ["Zeus Mace [Hidden]"],
  warning: "Target: Alchemist",
  note: "Can be obtained in Golden Clock (#014).",
  mission: [14]
 },
 {
  id: 31,
  type: "Important Steals",
  missable: ["Genji Armor"],
  warning: "Target: Templar",
  note: "Can be obtained in Scouring Time (#015).",
  mission: [15]
 },
 {
  id: 32,
  type: "Important Steals",
  missable: ["Lordly Robe", "Lotus Mace"],
  warning: "Target: Babus",
  note: "Can be obtained in Scouring Time (Exodus) (#015). Solo battle - equip Steal on Marche.",
  mission: [15]
 },
 {
  id: 33,
  type: "Important Steals",
  missable: ["Master Bow", "Cachusha", "Dark Gear"],
  warning: "Target: Assassin Celia",
  note: "Can be obtained in Free Muscadet! (#082).",
  mission: [82]
 },
 {
  id: 34,
  type: "Important Steals",
  missable: ["Masamune", "Genji Shield", "Dark Gear", "Genji Armlets"],
  warning: "Target: Assassin Redy",
  note: "Can be obtained in Free Muscadet! (#082).",
  mission: [82]
 },
 {
  id: 35,
  type: "Important Steals",
  missable: ["Steal Weapon Ability"],
  warning: "Target: Moogle Thief",
  note: "Can be obtained in The Big Find (#016).",
  mission: [16]
 },
 {
  id: 36,
  type: "Important Steals",
  missable: ["Adaman Blade (Rare) [Hidden]"],
  warning: "Target: Fighter",
  note: "Can be obtained in The Big Find (#016).",
  mission: [16]
 },
 {
  id: 37,
  type: "Important Steals",
  missable: ["Genji Armlets"],
  warning: "Target: Moogle Thief",
  note: "Can be obtained in the Stolen Scoop (#104).",
  mission: [104]
 },
 {
  id: 38,
  type: "Important Steals",
  missable: ["Aegis Shield (Rare)"],
  warning: "Target: Soldier",
  note: "Can be obtained in the Stolen Scoop (#104).",
  mission: [104]
 },
 {
  id: 39,
  type: "Important Steals",
  missable: ["Master Bow"],
  warning: "Target: Hunter",
  note: "Can be obtained in the Smuggler Bust (#105).",
  mission: [105]
 },
 {
  id: 40,
  type: "Important Steals",
  missable: ["Outsider", "Calling Gun (Very Rare) [Hidden]"],
  warning: "Target: Gunner",
  note: "Can be obtained in Flesh & Bones (#053).",
  mission: [53]
 },
 {
  id: 41,
  type: "Important Steals",
  missable: ["Cachusha"],
  warning: "Target: Archer",
  note: "Can be obtained in Flesh & Bones (#053).",
  mission: [53]
 },
 {
  id: 42,
  type: "Important Steals",
  missable: ["Mirror Mail"],
  warning: "Target: Soldier",
  note: "Can be obtained in Desert Patrol (#017).",
  mission: [17]
 },
 {
  id: 43,
  type: "Important Steals",
  missable: ["Venus Blade"],
  warning: "Target: Gladiator",
  note: "Can be obtained in Desert Patrol (#017).",
  mission: [17]
 },
 {
  id: 44,
  type: "Important Steals",
  missable: ["Spring Staff", "Cheer Staff [Hidden]"],
  warning: "Target: Bishop",
  note: "Can be obtained in Desert Patrol (#017).",
  mission: [17]
 },
 {
  id: 45,
  type: "Important Steals",
  missable: ["Arch Sword [Hidden]"],
  warning: "Target: Defender",
  note: "Can be obtained in Desert Patrol (#017).",
  mission: [17]
 },
 {
  id: 46,
  type: "Important Steals",
  missable: ["Genji Shield (Rare)", "Genji Armor (Rare)"],
  warning: "Target: Dragoon",
  note: "Can be obtained in A Dragon's Aid (#066).",
  mission: [66]
 },
 {
  id: 47,
  type: "Important Steals",
  missable: ["Save the Queen", "Maximillian", "Bangaa Helm"],
  warning: "Target: Llednar",
  note: "Can be obtained in Quiet Sands (#018). Very short battle (two rounds), quickly steal what you can/need.",
  mission: [18]
 },
 {
  id: 48,
  type: "Important Steals",
  missable: ["Genji Shield (Rare)"],
  warning: "Target: Assassin",
  note: "Can be obtained in Showdown! (#060).",
  mission: [60]
 },
 {
  id: 49,
  type: "Important Steals",
  missable: ["Aegis Shield (Rare)", "Save the Queen [Hidden]"],
  warning: "Target: Paladin",
  note: "Can be obtained in Showdown! (#060).",
  mission: [60]
 },
 {
  id: 50,
  type: "Important Steals",
  missable: ["Masamune", "Genji Armlets"],
  warning: "Target: Assassin",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 51,
  type: "Important Steals",
  missable: ["Ribbon (Very Rare)"],
  warning: "Target: Elementalist",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 52,
  type: "Important Steals",
  missable: ["Nike Bow", "Bone Plate"],
  warning: "Target: Sniper",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 53,
  type: "Important Steals",
  missable: ["Mirage Vest", "Full-Life Ability"],
  warning: "Target: White Mage",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 54,
  type: "Important Steals",
  missable: ["Cheer Staff"],
  warning: "Target: Summoner",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 55,
  type: "Important Steals",
  missable: ["Madu", "Brint Set"],
  warning: "Target: Red Mage",
  note: "Can be obtained in Materite Now! (#019).",
  mission: [19]
 },
 {
  id: 56,
  type: "Important Steals",
  missable: ["Materia Blade [Hidden]"],
  warning: "Target: Mog Knight",
  note: "Can be obtained in Present Day (#020).",
  mission: [20]
 },
 {
  id: 57,
  type: "Important Steals",
  missable: ["Life Crosier", "Scorpion Tail [Hidden]"],
  warning: "Target: Alchemist",
  note: "Can be obtained in Present Day (#020).",
  mission: [20]
 },
 {
  id: 58,
  type: "Important Steals",
  missable: ["Save the Queen", "Maximillian", "Bangaa Helm"],
  warning: "Target: Llednar",
  note: "Can be obtained in Present Day (Llednar Variant) (#020). Very short solo battle (five rounds) - equip Steal on Marche.",
  mission: [20]
 },
 {
  id: 59,
  type: "Important Steals",
  missable: ["Mirage Vest"],
  warning: "Target: Blue Mage",
  note: "Can be obtained in Hidden Vein (#021).",
  mission: [21]
 },
 {
  id: 60,
  type: "Important Steals",
  missable: ["Orichalcum", "Bone Plate"],
  warning: "Target: Juggler",
  note: "Can be obtained in Hidden Vein (#021).",
  mission: [21]
 },
 {
  id: 61,
  type: "Important Steals",
  missable: ["Scorpion Tail"],
  warning: "Target: Sage",
  note: "Can be obtained in Hidden Vein (#021).",
  mission: [21]
 },
 {
  id: 62,
  type: "Important Steals",
  missable: ["Femme Fatale (Very Rare)", "Brint Set", "Ribbon"],
  warning: "Target: Ritz",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 63,
  type: "Important Steals",
  missable: ["Seventh Heaven", "Galmia Set", "Ribbon"],
  warning: "Target: Shara",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 64,
  type: "Important Steals",
  missable: ["Max's Oathbow"],
  warning: "Target: Assassin",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 65,
  type: "Important Steals",
  missable: ["Nirvana Staff", "Silver Coat"],
  warning: "Target: Summoner",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 66,
  type: "Important Steals",
  missable: ["Madu"],
  warning: "Target: Fencer",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 67,
  type: "Important Steals",
  missable: ["Madu"],
  warning: "Target: Elementalist",
  note: "Can be obtained in Over the Hill (#023).",
  mission: [23]
 },
 {
  id: 68,
  type: "Miscellaneous",
  missable: ["Iceprism Sword (Rare)"],
  warning: "Can be missed according to decision made.",
  note: "Successfully negotiate in Snow Fairy (#109)and give Ice Cream (Cyril Ice from (Malboro Hunt #225))",
  mission: [109]
 },
 {
  id: 69,
  type: "Miscellaneous",
  missable: ["Bracers", "Hades Bows", "Angel Rings"],
  note: "Lutia Mop-Up (#072) is a one-time listed source. The former repeatable-farming note relied on a flee/reaccept failure loop, which is not treated as a normal single-player alternative.",
  mission: [72]
 },
 {
  id: 70,
  type: "Miscellaneous",
  missable: ["R4 Anti-Law"],
  warning: "Failure results in R3 Anti-Law.",
  note: "Successfully negotiate in Resistance (#106) to receive the R4 Anti-Law.",
  mission: [106]
 },
 {
  id: 71,
  type: "Miscellaneous",
  missable: ["Free Bervenia (#087)"],
  warning: "If failed, may not reappear.",
  note: "SAVE before attempting.",
  mission: [87]
 },
];

export type Missability = "permanent" | "recoverable" | "unverified";
export type AcquisitionPriority = "essential" | "strongly-recommended" | "recommended" | "optional";
export type AcquisitionGroup = "permanent" | "recommended" | "conditional" | "optional";
export type VerificationStatus = "verified" | "partial" | "unresolved";
export type AcquisitionSource = {
  recordId: number;
  missions: number[];
  target?: string;
  rarity?: "Rare" | "Very Rare";
  hidden?: boolean;
  method: string;
  availability: string;
  warning?: string;
  note: string;
};
export type AcquisitionGoal = {
  id: string;
  item: string;
  kind: "recruit" | "capture" | "blue-magic" | "steal" | "mission" | "reward";
  group: AcquisitionGroup;
  missability: Missability;
  priority: AcquisitionPriority;
  verification: VerificationStatus;
  sources: AcquisitionSource[];
  extraMissionSources: AcquisitionSource[];
  recordIds: number[];
  summary: string;
  details: string[];
  alternatives: string[];
  rationale: string;
  references: { label: string; url: string }[];
};

export type AcquisitionPlayerCopy = {
  label: string;
  instruction: string;
  note?: string;
  details: string[];
  otherOpportunities: string[];
  expandable: boolean;
};

type EditorialGuidance = {
  instruction?: string;
  note?: string;
  details?: string[];
};

// Player copy is kept separate from the evidence and audit fields below. Add
// item-specific instructions here when the route involves choices or timing.
const playerGuidance: Partial<Record<string, EditorialGuidance>> = {
  "angel-rings": {
    instruction: "Steal Angel Rings from the Black Mage during Lutia Mop-Up (#072).",
    note: "One normal clear gives you one chance; do not rely on repeating the mission to stock up.",
  },
  babus: {
    instruction: "After the story, complete Left Behind, then go straight to the pub and accept With Babus.",
    note: "To be safe, do not travel around the map or complete A Maiden's Cry with Left Behind before accepting With Babus.",
  },
  bracers: {
    instruction: "Steal Bracers from the Sniper during Lutia Mop-Up (#072).",
    note: "One normal clear gives you one chance; do not rely on repeating the mission to stock up.",
  },
  cheney: {
    instruction: "Get Snake Shield in Hundred-Eye (#165). Keep it, then carry it into a mission that does not use it to recruit Cheney.",
    note: "If you lose Snake Shield before Cheney joins, no reliable replacement is known.",
  },
  cid: {
    instruction: "Complete all 300 numbered missions. Then visit Bervenia Palace and finish Cleanup Time to recruit Cid.",
    note: "Some missed quests may be difficult to recover, so keep working through the numbered mission list.",
  },
  "dragon-force": {
    instruction: "Have a Blue Mage learn Dragon Force from a Thundrake before its encounters are gone.",
    note: "The Thundrake must cast Dragon Force while a Blue Mage is able to learn it.",
    details: ["Control or Charm can help make the Thundrake use Dragon Force."],
  },
  eldena: {
    instruction: "Get Elda's Cup in Hungry Ghost (#123), then recruit Eldena before Caravan Guard (#168).",
    note: "Caravan Guard consumes the cup.",
  },
  ezel: {
    instruction: "After To Ambervale (#022), complete Resistance (#106) and New Antilaw (#056). Choose Gossip at Cadoan's Card Shop, then complete Reconciliation to recruit Ezel.",
    note: "Recruit Ezel before Royal Valley (#024), the final story battle.",
  },
  "free-bervenia-087": {
    instruction: "Save before Free Bervenia! (#087), then complete the mission.",
    note: "Failure may keep this mission from returning.",
  },
  goblin: {
    instruction: "Capture a Goblin in any of the listed encounters before Goblins disappear from regular missions.",
    note: "Capture one before finishing the remaining Goblin encounters if you want to complete the Monster Bank.",
  },
  "goblin-punch": {
    instruction: "Have a Blue Mage learn Goblin Punch from a Goblin before its regular-mission encounters are gone.",
    note: "The Goblin must use Goblin Punch while your Blue Mage can learn it.",
    details: ["Control or Charm can help prompt an enemy to use an ability. The listed Paladin source is difficult to rely on, so use one of the Goblin encounters when possible."],
  },
  "hades-bows": {
    instruction: "Steal Hades Bow from the Sniper during Lutia Mop-Up (#072).",
    note: "One normal clear gives you one chance; do not rely on repeating the mission to stock up.",
  },
  "iceprism-sword": {
    instruction: "In Snow Fairy (#109), negotiate successfully and bring Ice Cream from Malboro Hunt (#225).",
    note: "The reward depends on both the negotiation and having Ice Cream; no reliable alternate route is known.",
  },
  lini: {
    instruction: "Get Hero Gaol in Oasis Frogs (#062). Keep it, then take it to a mission that does not use it to recruit Lini.",
    note: "If Hero Gaol is lost, no reliable replacement is known.",
  },
  littlevilli: {
    instruction: "Recruit Littlevilli during Clan League (#043). If the offer does not appear, replay the mission.",
  },
  pallanza: {
    instruction: "Get Wyrmstone in Ruby Red (#031), then carry it into A Dragon's Aid (#066) to recruit Pallanza.",
    note: "A Dragon's Aid does not use Wyrmstone, so keep it until Pallanza joins.",
  },
  quin: {
    instruction: "Save before Missing Professor (#063). Recruit Quin if the offer appears; otherwise reset and try again before leaving the mission.",
    note: "This is Quin's only listed recruitment chance, and the offer is random.",
  },
  "r4-anti-law": {
    instruction: "Negotiate successfully in Resistance (#106) to receive R4 Anti-Law.",
    note: "Failing the negotiation gives R3 Anti-Law instead; no reliable way to recover R4 is known.",
  },
  ritz: {
    instruction: "After the story, complete Mortal Snow. Ritz offers to join when the mission ends; Old Friends (#107) must be complete first.",
    note: "To be safe, finish Mortal Snow before completing Reconciliation with Left Behind or A Maiden's Cry. If you decline, Ritz's Offer gives you another chance.",
  },
  shara: {
    instruction: "After the story, complete A Maiden's Cry during Huntmoon, then visit a town to recruit Shara.",
    note: "If you are also recruiting Babus, accept With Babus after Left Behind before travelling around the map.",
  },
  thundrake: {
    instruction: "Capture a Thundrake in any listed encounter before its regular-mission appearances are gone.",
    note: "Capture one before finishing the remaining Thundrake encounters if you want to complete the Monster Bank.",
  },
  tulwar: {
    note: "Worth stealing now: a later treasure hunt depends on your map layout.",
  },
  "zeus-mace": {
    note: "Worth stealing now: later treasure hunts depend on your map layout.",
  },
  "silver-coat": {
    note: "Worth taking now if you want one; no reliable later route is known.",
  },
  "chill-rod": {
    note: "Worth getting now: a later Type 6 mission reward is random.",
    details: ["Chill Rod can also appear in a Type 6 random mission reward. Do not rely on that reward being available when you need it."],
  },
  "steal-weapon-ability": {
    note: "Learning it early gives your Thief access to another useful stealing technique.",
    details: ["Sword Breaker can also appear in a Type 6 random mission reward; that reward is not a dependable alternative."],
  },
};

const playerLabel = (goal: AcquisitionGoal) => {
  if (goal.group === "permanent") return "Missable";
  if (goal.group === "optional") return "Optional";
  if (goal.priority === "strongly-recommended") return "Strongly Recommended";
  if (goal.priority === "recommended") return "Recommended";
  return "Optional";
};

const formatPlayerOpportunity = (
  goal: AcquisitionGoal,
  source: AcquisitionSource,
  missionName: (mission: number) => string,
) => {
  const missions = [...source.missions].sort((a, b) => a - b).map(missionName).join(", ");
  const target = source.target ? ` from ${source.target}` : "";
  const method = goal.kind === "steal" ? "Steal" : "Available";
  const qualifiers = [source.rarity, source.hidden ? "hidden" : undefined].filter(Boolean).join(" · ");
  return `${method}${target} during ${missions || "this opportunity"}${qualifiers ? ` (${qualifiers})` : ""}.`;
};

/** Build concise gameplay copy without exposing audit, confidence, or migration fields. */
export const getAcquisitionPlayerCopy = (
  goal: AcquisitionGoal,
  missionName: (mission: number) => string = (mission) => `Mission #${String(mission).padStart(3, "0")}`,
  missionContext?: number,
): AcquisitionPlayerCopy => {
  const editorial = playerGuidance[goal.id];
  const orderedSources = [...goal.sources].sort((a, b) =>
    (a.missions.length ? Math.min(...a.missions) : Number.MAX_SAFE_INTEGER) -
    (b.missions.length ? Math.min(...b.missions) : Number.MAX_SAFE_INTEGER),
  );
  const sources = missionContext === undefined
    ? orderedSources
    : orderedSources.flatMap((source) => source.missions.includes(missionContext)
      ? [{ ...source, missions: [missionContext] }]
      : []);
  const primarySource = sources[0];
  const instruction = primarySource && goal.kind === "steal"
    ? formatPlayerOpportunity(goal, primarySource, missionName)
    : editorial?.instruction ?? "Check this opportunity before moving on.";
  const otherOpportunities = goal.kind === "steal"
    ? sources.slice(1).map((source) => formatPlayerOpportunity(goal, source, missionName))
    : missionContext === undefined && (goal.kind === "capture" || goal.kind === "blue-magic")
      ? [...new Set(sources.flatMap((source) => source.missions))].sort((a, b) => a - b).map(missionName)
      : [];
  const details = editorial?.details ?? [];
  const expandable = details.length > 0 || otherOpportunities.length > 0;
  return {
    label: playerLabel(goal),
    instruction,
    note: editorial?.note,
    details,
    otherOpportunities,
    expandable,
  };
};

const refs = {
  quest: { label: "Quest Guide (Terence)", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/27277" },
  steal: { label: "Stealing Guide (Nyst)", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/25875" },
  guild: { label: "Thieves' Guild Guide", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/27821" },
  play: { label: "Gameplay Guide (Crono09)", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/62342" },
  chars: { label: "Secret Character FAQ", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/26023" },
  prizes: { label: "Mission Prizes FAQ", url: "https://gamefaqs.gamespot.com/gba/560436-final-fantasy-tactics-advance/faqs/26849" },
};

const canonicalLabel = (value: string) => {
  const cleaned = value.replace(/\s*\[Hidden\]/gi, "").replace(/\s*\((?:Very Rare|Rare)\)/gi, "").replace(/\s+/g, " ").trim();
  return /^steal weapon ability$/i.test(cleaned) ? "Steal: Weapon Ability" : cleaned;
};
export const canonicalAcquisitionId = (value: string) => canonicalLabel(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const extraMissionSources: Record<string, AcquisitionSource[]> = {
  eldena: [{ recordId: 1, missions: [123], target: "Mission reward", method: "Obtain Elda's Cup as a mission item", availability: "Repeatability not verified", note: "Hungry Ghost (#123) is the listed source; recruit Eldena before Caravan Guard (#168) consumes the cup." }],
  lini: [{ recordId: 2, missions: [62], target: "Mission reward", method: "Obtain Hero Gaol as a mission item", availability: "Repeatability not verified", note: "Hero Gaol (#062) is the listed source. Keep it and carry it to a mission that does not consume it." }],
  pallanza: [{ recordId: 3, missions: [31], target: "Mission reward", method: "Obtain Wyrmstone as a mission item", availability: "Repeatability not verified", note: "Ruby Red (#031) is listed as a Wyrmstone source. Quest Guide marks it UNUSED in A Dragon's Aid (#066)." }],
  cheney: [{ recordId: 5, missions: [165], target: "Mission reward", method: "Obtain Snake Shield as a mission item", availability: "Repeatability not verified", note: "Snake Shield is listed at Hundred-Eye (#165). Keep it and carry it to a mission that does not consume it." }],
};

type Assessment = Partial<Omit<AcquisitionGoal, "id" | "item" | "kind" | "sources" | "extraMissionSources" | "recordIds" | "references">> & { references?: (keyof typeof refs)[] };
const assessment = (group: AcquisitionGroup, missability: Missability, priority: AcquisitionPriority, verification: VerificationStatus, summary: string, details: string[] = [], alternatives: string[] = [], rationale = "", references: (keyof typeof refs)[] = ["quest"]) => ({ group, missability, priority, verification, summary, details, alternatives, rationale, references });
const assessments: Record<string, Assessment> = {
  eldena: assessment("permanent", "permanent", "essential", "verified", "Recruit before Caravan Guard (#168) uses Elda's Cup.", ["Elda's Cup comes from Hungry Ghost (#123).", "Caravan Guard (#168) consumes the cup if Eldena has not joined."], ["No later source for Elda's Cup was found in the cited recruitment references."], "The cup is a one-time recruitment item and the later mission consumes it.", ["play", "chars", "quest"]),
  lini: assessment("conditional", "unverified", "recommended", "partial", "Keep Hero Gaol; recovery after losing it is unverified.", ["Hero Gaol is listed at #062 Oasis Frogs.", "Carry it to a mission that does not consume it to trigger Lini's offer."], ["No repeatable replacement for Hero Gaol was verified."], "Recruitment depends on retaining a mission item; safe recovery after losing it is not established.", ["chars", "quest"]),
  pallanza: assessment("conditional", "recoverable", "recommended", "verified", "Carry Wyrmstone to an unrelated mission; #066 does not consume it.", ["Wyrmstone is listed at Ruby Red (#031).", "Quest Guide marks Wyrmstone UNUSED in A Dragon's Aid (#066)."], ["Carry the item to another mission that does not require it; the recruitment guide documents this recruitment pattern."], "Corrects the old warning that A Dragon's Aid consumes Wyrmstone.", ["quest", "chars", "play"]),
  quin: assessment("permanent", "permanent", "essential", "verified", "Recruit during Missing Professor (#063); this is Quin's sole listed offer.", ["The offer is random; reset if Quin does not request to join."], ["No later recruitment mission is documented."], "The cited recruitment guide identifies one recruitment opportunity.", ["chars", "quest"]),
  cheney: assessment("conditional", "unverified", "recommended", "partial", "Keep Snake Shield; recovery after losing it is unverified.", ["Snake Shield is listed at #165 Hundred-Eye.", "Carry it to a mission that does not consume it to trigger Cheney's offer."], ["No repeatable replacement for Snake Shield was verified."], "No safe replacement path for the mission item was established.", ["chars", "quest"]),
  littlevilli: assessment("optional", "recoverable", "recommended", "verified", "Clan League (#043) repeats; retry the random join offer.", ["The offer is random. Saving and resetting is a convenience, not protection from permanent loss."], ["Repeat Clan League (#043) until the offer appears."], "A missed offer can be retried because the mission repeats.", ["quest", "chars"]),
  ezel: assessment("permanent", "permanent", "essential", "verified", "Complete Reconciliation before the final story battle.", ["The character FAQ says Ezel is the only secret character recruitable before finishing the game.", "It places the card-shop Gossip and Reconciliation steps just before the endgame."], ["No postgame Ezel recruitment path is documented."], "The main cutoff is the end of the story; the old warning focused on a reported mission-order bug.", ["chars"]),
  ritz: assessment("conditional", "unverified", "recommended", "partial", "Postgame recruitment is available; reported mission-order bugs remain unresolved.", ["The secret-character guide lists Ritz among postgame recruits and describes recurring mission availability.", "The old linked-mission warning is retained as conditional, not treated as proven permanent loss."], ["Recurring postgame mission appearances are documented; order-related bug reports were not reproduced."], "The usual path appears recoverable, but a reported ordering edge case remains uncertain.", ["chars", "quest"]),
  babus: assessment("conditional", "unverified", "recommended", "partial", "Postgame recruitment is available; retain the old order warning as unresolved.", ["The secret-character guide lists Babus among postgame recruits and describes timed mission availability.", "The With Babus sign-up warning has not been independently reproduced."], ["Recurring postgame appearances are documented; the order-related bug report remains unverified."], "The usual path appears recoverable while a reported edge case remains unresolved.", ["chars", "quest"]),
  shara: assessment("conditional", "unverified", "recommended", "partial", "Postgame recruitment is available; the linked-mission warning remains unresolved.", ["The secret-character guide lists Shara among postgame recruits and describes timed mission availability.", "The old combined-mission warning has not been independently reproduced."], ["Recurring postgame appearances are documented; the order-related bug report remains unverified."], "The usual path appears recoverable while a reported edge case remains unresolved.", ["chars", "quest"]),
  cid: assessment("conditional", "unverified", "recommended", "partial", "Recruitment depends on all 300 numbered missions; missed-quest recovery is unresolved.", ["The existing guide says Cid joins after all numbered missions.", "This audit did not establish whether every quest can be recovered after failure or a missed prerequisite."], ["No blanket safe-recovery claim is made for missed quests."], "The full-quest requirement is retained conservatively.", ["quest"]),
  goblin: assessment("permanent", "permanent", "essential", "verified", "Capture a Goblin before the listed regular-mission encounters are exhausted.", ["The gameplay guide says Goblins occur in regular missions and may be missed after those encounters are completed."], ["No later repeatable source was documented."], "The capture opportunity is tied to a finite set of encounters.", ["play", "quest"]),
  "goblin-punch": assessment("permanent", "permanent", "essential", "verified", "Learn Goblin Punch before the listed Goblin encounters are exhausted.", ["A Goblin must use the ability while a Blue Mage is eligible to learn it.", "A difficult Paladin source is also listed but is not a verified renewable safeguard."], ["Listed Goblin encounters; the difficult Paladin source is not established as repeatable."], "Known sources are encounter-limited; do not count the alternate as renewable.", ["play"]),
  thundrake: assessment("permanent", "permanent", "essential", "verified", "Capture a Thundrake before its listed regular-mission encounters are exhausted.", ["The gameplay guide says Thundrakes can be missed if not captured before those missions are completed."], ["No later repeatable capture source was documented."], "The capture opportunities are encounter-limited.", ["play", "quest"]),
  "dragon-force": assessment("permanent", "permanent", "essential", "verified", "Learn Dragon Force from a Thundrake before its listed encounters are exhausted.", ["A Thundrake must use Dragon Force while a Blue Mage can learn it.", "The gameplay guide recommends Control or Charm to make the enemy cast."], ["No later repeatable source was documented."], "Sources are encounter-limited and require the enemy to cast the ability.", ["play"]),
  tulwar: assessment("conditional", "unverified", "strongly-recommended", "partial", "Steal now; treasure-hunt availability depends on map layout and limited special-item placements.", ["The treasure-hunt path has region requirements; the guide says only five of six special treasure items fit a layout.", "Exact layout guarantees for Tulwar remain unresolved."], ["Conditional treasure hunt; exhaustive map-layout coverage was not established."], "The Thieves' Guild guide flags Tulwar as easy to miss.", ["guild", "play"]),
  "zeus-mace": assessment("conditional", "unverified", "strongly-recommended", "partial", "Steal now; treasure-hunt availability depends on map layout and limited special-item placements.", ["The treasure-hunt path requires Fields and Mountains; the chosen layout limits special treasure placement.", "Exact layout guarantees remain unresolved."], ["Conditional treasure hunt; exhaustive map-layout coverage was not established."], "The later treasure path is conditional and the item is flagged as easy to miss.", ["guild", "play"]),
  "silver-coat": assessment("conditional", "unverified", "strongly-recommended", "partial", "Steal now; a later source has not been verified.", ["The Thieves' Guild guide flags Silver Coat among items a player can miss by endgame.", "Shops, mission prizes, and all other steal sources were not independently cross-checked."], ["No later guaranteed or repeatable alternative is established here."], "The source guide warns of risk, so no safe status is assigned without a verified replacement.", ["guild", "steal"]),
  "steal-weapon-ability": assessment("recommended", "unverified", "strongly-recommended", "partial", "Steal from the listed encounters; the later Type 6 reward is random and repeatability is unresolved.", ["The legacy guide lists fixed Moogle Thief encounters #016, #027, and #076.", "Sword Breaker teaches Steal: Weapon and appears in the Type 6 random mission reward pool; no repeatable Type 6 mission was verified."], ["Other fixed encounters #016, #027, #076; Sword Breaker from Type 6 random rewards (repeatability unverified)."], "Early access adds stealing opportunities; do not count the random reward as a safe renewable path.", ["steal", "prizes", "quest"]),
  "chill-rod": assessment("recommended", "unverified", "strongly-recommended", "partial", "Take either listed steal; Type 6 reward availability is not counted as safely repeatable.", ["The legacy guide lists Frosty Mage (#045) and Hit Again (#061).", "Chill Rod appears in the Type 6 random reward pool, but no named repeatable source was verified."], ["A later Type 6 random reward is documented; mission-by-mission repeatability remains unresolved."], "The alternative is random and its repeatable availability is not established.", ["guild", "quest", "prizes"]),
  "iceprism-sword": assessment("conditional", "unverified", "recommended", "partial", "The #109 negotiation and Ice Cream condition affect this reward; alternate recovery is unverified.", ["Snow Fairy (#109) is tied to Ice Cream from Malboro Hunt (#225).", "Recovery after the relevant decision was not established."], ["No alternate source was verified."], "Keep the warning while the decision path is unresolved.", ["quest"]),
  "r4-anti-law": assessment("conditional", "unverified", "recommended", "partial", "Negotiate successfully in Resistance (#106); recovery after failure is unverified.", ["The legacy guide states failure gives R3 Anti-Law instead."], ["No alternate R4 source was verified."], "Reward depends on a conditional outcome and no safe retry path is documented.", ["quest"]),
  "free-bervenia-087": assessment("conditional", "unverified", "recommended", "partial", "The report that failed Free Bervenia (#087) may not return remains unverified.", ["The old guide recommends saving before attempting the mission.", "Failure behavior has not been verified across versions and prerequisites."], ["No guaranteed reappearance after failure is established."], "Keep the conservative warning while availability remains uncertain.", ["quest", "play"]),
  "angel-rings": assessment("conditional", "unverified", "optional", "partial", "Lutia Mop-Up (#072) is one listed source; the repeatable-farming claim is incorrect.", ["The quest listing marks the mission non-repeatable.", "The flee-and-reaccept approach is an exploit/failure loop and is not counted as a normal source."], ["No normal repeatable alternative was verified."], "The old note treated a failure exploit as repeatable farming.", ["quest", "guild"]),
  bracers: assessment("conditional", "unverified", "optional", "partial", "Steal from the Sniper during Lutia Mop-Up (#072); no later route is established.", ["The Sniper carries Bracers during the one-time mission.", "Do not count the flee-and-reaccept loop as a normal repeatable source."], ["No normal repeatable alternative was verified."], "Keep the single listed opportunity available to players without presenting the flee loop as safe farming.", ["quest", "guild"]),
  "hades-bows": assessment("conditional", "unverified", "optional", "partial", "Steal Hades Bow from the Sniper during Lutia Mop-Up (#072); no later route is established.", ["The Sniper carries Hades Bow during the one-time mission.", "Do not count the flee-and-reaccept loop as a normal repeatable source."], ["No normal repeatable alternative was verified."], "Keep the single listed opportunity available to players without presenting the flee loop as safe farming.", ["quest", "guild"]),
};

const kindFor = (record: GlobalMissable): AcquisitionGoal["kind"] => {
  if (record.id === 69) return "steal";
  if (record.type === "Recruiting-Related Missions") return "recruit";
  if (record.type === "Monster Bank") return "capture";
  if (record.type === "Blue Magic") return "blue-magic";
  if (record.type === "Important Steals") return "steal";
  if (/Anti-Law|Free Bervenia/i.test(record.missable.join(" "))) return "mission";
  return "reward";
};
const grouped = new Map<string, { item: string; records: GlobalMissable[] }>();
for (const record of GLOBAL_MISSABLES) for (const raw of record.missable) {
  const item = canonicalLabel(raw);
  const id = canonicalAcquisitionId(item);
  const entry = grouped.get(id) ?? { item, records: [] };
  if (!entry.records.some((source) => source.id === record.id)) entry.records.push(record);
  grouped.set(id, entry);
}
const fallback = (kind: AcquisitionGoal["kind"], sourceCount: number): Assessment => ({
  group: kind === "steal" ? "recommended" : "conditional",
  missability: "unverified",
  priority: kind === "steal" ? "recommended" : "optional",
  verification: "unresolved",
  summary: kind === "steal" ? sourceCount > 1 ? `${sourceCount} listed steal encounters; their repeatability and other later sources are unverified.` : "Recommended at this steal; later availability has not been established." : "Keep the source warning visible; alternate availability remains unresolved.",
  details: ["No later source is treated as guaranteed or repeatable until its mission availability is verified."],
  alternatives: [],
  rationale: "Conservative classification: the original source is preserved and unverified alternatives do not establish safety.",
  references: [kind === "steal" ? "steal" : "quest"],
});
const makeSource = (record: GlobalMissable, item: string): AcquisitionSource => {
  const kind = kindFor(record);
  const annotatedItem = record.missable.find((raw) => canonicalAcquisitionId(raw) === canonicalAcquisitionId(item)) ?? "";
  const rarity = annotatedItem.match(/\((Very Rare|Rare)\)/i)?.[1];
  const lutiaTarget = record.id === 69
    ? item.toLowerCase().includes("angel") ? "Black Mage" : "Sniper"
    : undefined;
  const availability = record.id === 6
    ? "Repeatable mission; join offer is random"
    : record.id === 69
      ? "One-time mission; Quest Guide lists it as non-repeatable"
      : "Mission repeatability not verified";
  return {
    recordId: record.id,
    missions: [...new Set(record.mission ?? [])],
    target: lutiaTarget ?? record.warning?.match(/^Target:\s*(.+)$/i)?.[1],
    rarity: rarity ? rarity.toLowerCase() === "very rare" ? "Very Rare" : "Rare" : undefined,
    hidden: /\[Hidden\]/i.test(annotatedItem),
    method: kind === "steal" ? "Steal" : kind === "capture" ? "Capture" : kind === "blue-magic" ? "Learn Blue Magic" : kind === "recruit" ? "Recruitment opportunity / mission item" : kind === "mission" ? "Mission outcome" : "Mission reward / opportunity",
    availability,
    warning: record.warning,
    note: record.note,
  };
};
export const ACQUISITION_GOALS: AcquisitionGoal[] = [...grouped.entries()].map(([id, value]) => {
  const kind = kindFor(value.records[0]);
  const a = assessments[id] ?? fallback(kind, value.records.length);
  const goalSources = value.records.flatMap((record) => {
    const source = makeSource(record, value.item);
    // The first Chill Rod steal is hidden; the later mission's copy is visible.
    // Keep the two locations distinct so mission cards do not inherit the wrong qualifier.
    if (id === "chill-rod" && source.missions.includes(45) && source.missions.includes(61)) {
      return [
        { ...source, missions: [45], hidden: true, note: "Steal the hidden Chill Rod from a Nu Mou Black Mage." },
        { ...source, missions: [61], hidden: false, note: "Steal Chill Rod from a Nu Mou Black Mage; this copy is not hidden." },
      ];
    }
    return [source];
  });
  const alternatives = a.alternatives?.length ? a.alternatives : (value.records.length > 1
    ? [`This guide lists ${value.records.length} fixed encounter sources above. Their repeatability and any additional shop/mission/treasure sources were not verified.`]
    : ["No sufficiently verified alternate acquisition path is recorded."]);
  return {
    id, item: value.item, kind,
    group: a.group ?? (kind === "steal" ? "recommended" : "conditional"),
    missability: a.missability ?? "unverified", priority: a.priority ?? "recommended", verification: a.verification ?? "unresolved",
    sources: goalSources, extraMissionSources: extraMissionSources[id] ?? [],
    recordIds: value.records.map((record) => record.id),
    summary: a.summary ?? "", details: a.details ?? [], alternatives, rationale: a.rationale ?? "",
    references: (a.references ?? []).map((key) => refs[key]),
  };
}).sort((a, b) => a.item.localeCompare(b.item));

export const getAcquisitionGoalsForMission = (mission: number) => ACQUISITION_GOALS.filter((goal) => [...goal.sources, ...goal.extraMissionSources].some((source) => source.missions.includes(mission)));
export const getAcquisitionGoalsForDirectMission = (mission: number) => ACQUISITION_GOALS.filter((goal) => goal.sources.some((source) => source.missions.includes(mission)));
export const getAcquisitionPreparationsForMission = (mission: number) => ACQUISITION_GOALS.flatMap((goal) =>
  goal.extraMissionSources.filter((source) => source.missions.includes(mission)).map((source) => ({ goal, source })),
);
export const getAcquisitionGoalByRecordId = (recordId: number) => ACQUISITION_GOALS.find((goal) => goal.recordIds.includes(recordId));
export const getAcquisitionGoalsByRecordIds = (recordIds: number[]) => [...new Set(recordIds.map(getAcquisitionGoalByRecordId).filter((goal): goal is AcquisitionGoal => !!goal))];
export const acquisitionProgressKey = (goal: AcquisitionGoal) => goal.kind === "blue-magic" ? `blue:${goal.item}` : goal.kind === "capture" ? `cap:${goal.item}` : `acquired:${goal.id}`;
export const acquisitionCheckedKey = (goal: AcquisitionGoal) =>
  acquisitionProgressKey(goal).toLowerCase().replace(/[^a-z0-9]+/g, "-");

export type AcquisitionGroupCounts = Record<AcquisitionGroup, number>;
export type AcquisitionProgressCounts = { total: AcquisitionGroupCounts; completed: AcquisitionGroupCounts };

const emptyAcquisitionGroupCounts = (): AcquisitionGroupCounts => ({
  permanent: 0,
  recommended: 0,
  conditional: 0,
  optional: 0,
});

const uniqueGoals = (goals: AcquisitionGoal[]) => [...new Map(goals.map((goal) => [goal.id, goal])).values()];

export const getAcquisitionGoalsForMissions = (missionNumbers: readonly number[], goals = ACQUISITION_GOALS) => {
  const missionSet = new Set(missionNumbers);
  return uniqueGoals(goals.filter((goal) =>
    goal.sources.some((source) => source.missions.some((mission) => missionSet.has(mission))),
  ));
};

/**
 * Resolves the canonical goals available in one chronological walkthrough block.
 * Only sources whose mission is part of that block count; later sources in the
 * same goal remain available to their own later mission blocks.
 */
export const getAcquisitionGoalsForChapter = (
  missionNumbers: readonly number[],
  recordIds: readonly number[] = [],
  goals = ACQUISITION_GOALS,
) => {
  const missionSet = new Set(missionNumbers);
  const recordSet = new Set(recordIds);
  return uniqueGoals(goals.filter((goal) =>
    goal.recordIds.some((recordId) => recordSet.has(recordId)) ||
    goal.sources.some((source) => source.missions.some((mission) => missionSet.has(mission))),
  ));
};

/**
 * Filters a walkthrough interval's missions using explicit numbered mission
 * prerequisites. A prerequisite listed earlier in the current interval is
 * allowed because the player can complete that mission first; a prerequisite
 * listed later or in a later interval keeps the acquisition out of the
 * earlier mission row. Non-mission
 * conditions (calendar, placement, cutscene, or required item) remain visible
 * on the mission reference itself and are not guessed here.
 */
export const getChronologicallyAvailableMissionNumbers = (
  missionNumbers: readonly number[],
  previouslyAvailableMissionNumbers: readonly number[],
  prerequisitesByMission: ReadonlyMap<number, readonly string[]>,
) => {
  const candidates = [...new Set(missionNumbers)];
  const available = new Set(previouslyAvailableMissionNumbers);
  const chronologicallyAvailable: number[] = [];
  for (const missionNumber of candidates) {
    const prerequisites = prerequisitesByMission.get(missionNumber) ?? [];
    const referencedMissions = prerequisites.flatMap((prerequisite) =>
      [...prerequisite.matchAll(/\(#(\d+)\)/g)].map((match) => Number(match[1])),
    );
    if (referencedMissions.every((prerequisiteMission) => available.has(prerequisiteMission))) {
      chronologicallyAvailable.push(missionNumber);
      available.add(missionNumber);
    }
  }
  return chronologicallyAvailable;
};

export const getAcquisitionSourceMissions = (goal: AcquisitionGoal, missionNumbers?: readonly number[]) => {
  const sources = new Set(goal.sources.flatMap((source) => source.missions));
  if (missionNumbers) return [...new Set(missionNumbers.filter((mission) => sources.has(mission)))];
  return [...sources];
};

export const getAcquisitionProgressCounts = (
  goals: AcquisitionGoal[],
  checked: Record<string, boolean>,
): AcquisitionProgressCounts => {
  const unique = uniqueGoals(goals);
  const total = emptyAcquisitionGroupCounts();
  const completed = emptyAcquisitionGroupCounts();
  for (const goal of unique) {
    total[goal.group] += 1;
    if (checked[acquisitionCheckedKey(goal)]) completed[goal.group] += 1;
  }
  return { total, completed };
};

export const getAcquisitionCounts = (goals = ACQUISITION_GOALS) => {
  const counts = emptyAcquisitionGroupCounts();
  for (const goal of uniqueGoals(goals)) counts[goal.group] += 1;
  return counts;
};

export const acquisitionDataDiagnostics = () => {
  const ids = ACQUISITION_GOALS.map((goal) => goal.id);
  const recordIds = GLOBAL_MISSABLES.map((record) => record.id);
  const entries = GLOBAL_MISSABLES.flatMap((record) => record.missable.map((item) => ({ record, item })));
  const missions = [...new Set(ACQUISITION_GOALS.flatMap((goal) => [...goal.sources, ...goal.extraMissionSources].flatMap((source) => source.missions)))];
  return {
    records: GLOBAL_MISSABLES.length,
    entries: entries.length,
    goals: ACQUISITION_GOALS.length,
    duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
    duplicateRecordIds: recordIds.filter((id, index) => recordIds.indexOf(id) !== index),
    missingRecordIds: Array.from({ length: GLOBAL_MISSABLES.length }, (_, index) => index + 1).filter((id) => !recordIds.includes(id)),
    unmappedEntries: entries.filter(({ item }) => !ACQUISITION_GOALS.some((goal) => goal.id === canonicalAcquisitionId(item))).map(({ record, item }) => `${record.id}:${item}`),
    invalidMissionNumbers: missions.filter((mission) => mission < 1 || mission > 300),
    permanentGoalsWithoutVerifiedEvidence: ACQUISITION_GOALS.filter((goal) => goal.group === "permanent" && goal.verification !== "verified").map((goal) => goal.id),
    verifiedRecoveryGoals: ACQUISITION_GOALS.filter((goal) => goal.missability === "recoverable" && goal.verification === "verified").map((goal) => goal.id),
  };
};
