import React, { useMemo, useState, useId, useRef } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import mapGif from "./assets/ffta-map.gif";

const keyify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

type Row = Record<string, unknown>;

type Column<T extends Row> = {
  key: keyof T;
  header: string;
  className?: string;
  cell?: (value: T[keyof T], row: T, rowIndex: number) => React.ReactNode;
};

type CollapsibleTwoTablesProps<L extends Row, R extends Row> = {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (next: boolean) => void;

  // layout classes
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;

  // table data
  leftTitle: string;
  leftRows: ReadonlyArray<L>;
  leftColumns: ReadonlyArray<Column<L>>;
  rightTitle: string;
  rightRows: ReadonlyArray<R>;
  rightColumns: ReadonlyArray<Column<R>>;

  // NEW: styling controls (match Panel style approach)
  tone?: "neutral" | "blue" | "green" | "red" | "amber" | "purple";
  border?: string;          // e.g. "border-green-600"
  text?: string;            // e.g. "text-green-200"
  rowBg?: string;           // e.g. "bg-green-950/10"
  headerBg?: string;        // e.g. "bg-green-900/10"
  divider?: string;         // e.g. "divide-white/10"
};


const toneDefaults = {
  neutral: {
    border: "border-zinc-200 dark:border-zinc-700/50",
    text: "text-zinc-100",
    rowBg: "bg-zinc-900/20",
    headerBg: "bg-zinc-900/20",
    divider: "divide-white/10",
  },
  green: {
    border: "border-green-600/40",
    text: "text-green-100",
    rowBg: "bg-green-950/10",
    headerBg: "bg-green-900/10",
    divider: "divide-white/10",
  },
  blue:   { border: "border-blue-600/40",  text: "text-blue-100",  rowBg: "bg-blue-950/10",  headerBg: "bg-blue-900/10",  divider: "divide-white/10" },
  red:    { border: "border-red-600/40",   text: "text-red-100",   rowBg: "bg-red-950/10",   headerBg: "bg-red-900/10",   divider: "divide-white/10" },
  amber:  { border: "border-amber-600/40", text: "text-amber-100", rowBg: "bg-amber-950/10", headerBg: "bg-amber-900/10", divider: "divide-white/10" },
  purple: { border: "border-purple-600/40",text: "text-purple-100",rowBg: "bg-purple-950/10",headerBg: "bg-purple-900/10",divider: "divide-white/10" },
} as const;

function CollapsibleTwoTables<L extends Row, R extends Row>({
  title,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  leftTitle,
  leftRows,
  leftColumns,
  rightTitle,
  rightRows,
  rightColumns,
  tone = "neutral",
  border,
  text,
  rowBg,
  headerBg,
  divider,
}: CollapsibleTwoTablesProps<L, R>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const contentId = useId();
  const toggle = () => (isControlled ? onToggle?.(!open) : setUncontrolledOpen(!open));

  const d = toneDefaults[tone];
  const borderCls  = border  ?? d.border;
  const textCls    = text    ?? d.text;
  const rowBgCls   = rowBg   ?? d.rowBg;
  const headerBgCls= headerBg?? d.headerBg;
  const dividerCls = divider ?? d.divider;

  return (
    <div className={`rounded-xl border ${borderCls} ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={toggle}
        className={`flex w-full items-center justify-between px-4 py-2 font-semibold text-center ${textCls} ${headerBgCls} ${headerClassName}`}
      >
        <span>{title}</span>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div id={contentId} className={`p-4 ${bodyClassName}`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TableSection
              title={leftTitle}
              rows={leftRows}
              columns={leftColumns}
              borderCls={borderCls}
              textCls={textCls}
              rowBgCls={rowBgCls}
              headerBgCls={headerBgCls}
              dividerCls={dividerCls}
            />
            <TableSection
              title={rightTitle}
              rows={rightRows}
              columns={rightColumns}
              borderCls={borderCls}
              textCls={textCls}
              rowBgCls={rowBgCls}
              headerBgCls={headerBgCls}
              dividerCls={dividerCls}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TableSection<T extends Row>({
  title,
  rows,
  columns,
  borderCls,
  textCls,
  rowBgCls,
  headerBgCls,
  dividerCls,
}: {
  title: string;
  rows: ReadonlyArray<T>;
  columns: ReadonlyArray<Column<T>>;
  borderCls: string;
  textCls: string;
  rowBgCls: string;
  headerBgCls: string;
  dividerCls: string;
}) {
  return (
    <section className={`overflow-x-auto rounded-lg border ${borderCls}`}>
      <header className={`px-3 py-2 text-sm font-semibold text-center ${textCls} ${headerBgCls}`}>
        {title}
      </header>
      <table className="min-w-full table-fixed">
        <thead className={`${headerBgCls}`}>
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={`px-3 py-2 text-left text-sm font-semibold ${textCls} ${c.className ?? ""}`}
                scope="col"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-transparent ${dividerCls}`}>
          {rows.length === 0 ? (
            <tr>
              <td className={`px-3 py-3 text-sm ${textCls}/70`} colSpan={columns.length}>
                No entries.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr key={(row as any).id ?? rowIdx} className={`${textCls}`}>
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={`px-3 py-2 align-top whitespace-normal break-words min-w-0 ${rowBgCls}`}
                  >
                    {c.cell ? c.cell(row[c.key], row, rowIdx) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

// Affection data
const leftRows = [
  { id: 1, affection: "0-29", response: "Grrurr... (What are you looking at?)" },
  { id: 2, affection: "30-79", response: "(Gimmie food.)" },
  { id: 3, affection: "80-99", response: "(Thanks for dropping by.)" },
  { id: 4, affection: "100", response: "(I love you, Marche. No, really, I love you!)" },
];

const rightRows = [
  { id: 1, item: "Potion", affection: "1", max: "29" },
  { id: 2, item: "Hi-Potion", affection: "2", max: "29" },
  { id: 3, item: "X-Potion", affection: "2", max: "79" },
  { id: 4, item: "Ether", affection: "4", max: "100" },
  { id: 5, item: "Elixir", affection: "10", max: "100" },
  { id: 6, item: "Antidote", affection: "2", max: "79" },
  { id: 7, item: "Eye Drops", affection: "2", max: "79" },
  { id: 8, item: "Echo Screen", affection: "2", max: "79" },
  { id: 9, item: "Maiden Kiss", affection: "3", max: "79" },
  { id: 10, item: "Soft", affection: "3", max: "79" },
  { id: 11, item: "Holy Water", affection: "4", max: "79" },
  { id: 12, item: "Bandage", affection: "1", max: "79" },
  { id: 13, item: "Cureall", affection: "5", max: "100" },
  { id: 14, item: "Phoenix Down", affection: "10", max: "79" },
];

const leftColumns = [
  { key: "affection", header: "Affection" },
  { key: "response", header: "Response" },
] as const;

const rightColumns = [
  { key: "item", header: "Item" },
  { key: "affection", header: "Affection" },
  { key: "max", header: "Max" },
] as const;

type RefSource = { type: "Clan" | "Mission" | "Turf" | "Area"; name: string };

type BlueRef = {
  name: string;
  mp: number | string;
  desc?: string;
  from: string[];
  sources: RefSource[];
  notes?: string;
};

type CapRef = {
  monster: string;
  family: string;
  clans?: string[];
  missions: string[];
  areas?: string[];
  enjoys?: { item: string; aff: number }[];
  spits?: { item: string; aff: number }[];
  notes: string;
};

type Block = {
  key: string;
  kind: "story" | "between";
  title: string;
  subtitle?: string;
  strategy?: string;
  placements?: string[];
  blue?: string[];
  caps?: string[];
  recruits?: string[];
  missables?: number[];
  sidequests?: number[];
};

type QuestRef = {
  number: number;
  name: string;
  description: string;
  strategy?: string;
  type: "Capture" | "Dispatch" | "Encounter" | "Engagement";
  cost?: string;
  location?: string;
  prerequisites?: string[];
  reward?: string[];
  available_for?: string;
  difficulty?:
    | "Very Easy"
    | "Easy"
    | "Medium"
    | "Slightly Hard"
    | "Hard"
    | "Very Hard";
  req_items?: string[];
  req_job?: string;
  dispatch_time?: string;
  enemies?: string[];
};

const MISSION_REF: QuestRef[] = [
  {
    number: -1,
    name: `Snowball Fight`,
    description: ``,
    type: `Engagement`,
    difficulty: `Very Easy`,
    enemies: [`Nurse`, `D.J. (Guiness)`, `PE Head (Colin)`, `PE Head (Lyle)`],
    strategy: `This opening fight functions more as a tutorial than a true battle.
At the start, Mr. Leslaie (your teacher) will offer a quick lesson on how snowball fights work, with Ritz volunteering to assist.
Pay attention to the brief explanation, and once the lesson ends, choose “No” to proceed.

When control shifts to you, take a moment to experiment—move around and toss snowballs freely.
(Don’t worry about the job titles shown; they aren’t relevant here.)
There’s no way to actually win or lose this encounter, and no one can be knocked out.
After the second round begins—or once Mewt’s HP reaches zero—he’ll start to run off.
The other boys see this as their cue to start teasing him again.
`,
  },
{
    number: 0,
    name: `Bangaas`,
    description: ``,
    type: `Engagement`,
    difficulty: `Very Easy`,
    enemies: [`White Monk`, `Warrior`],
    strategy: `Marche soon realizes that the term “Engage” simply means to enter a battle. The Moogle responds with a humorous confirmation before explaining that the armored figure nearby is a Judge, responsible for enforcing daily combat laws. Today’s law prohibits the use of items, and the Moogle advises Marche to always review the law before fighting. Before long, it’s your turn to act.

Think back to the Snowball Fight — an engagement works almost the same way. You currently play as a Soldier equipped with a Shortsword. Move toward the Bangaa, ideally attacking from the side or rear to improve your hit rate, and select “Fight.” The Moogle — whose name you’ll soon learn is Montblanc — fights as a Black Mage and will cast elemental spells. This encounter is straightforward: defeat both Bangaas to claim victory.

During the fight, you’ll also be introduced to Judge Points. Montblanc will explain that these points let you perform combo attacks alongside your allies, though later in the game, they’ll serve another purpose related to Totemas.
`,
  },
{
    number: 1,
    name: `Herb Picking`,
    description: `Looking for people to gather the fever-reducing herb muscamaloi on the Giza Plain. No experience necessary. ~ Ivalice Pharmacists Guild`,
    type: `Engagement`,
    cost: `300 Gil`,
    location: `Giza Plain`,
    prerequisites: [
      `Any Pub at beginning of game. Only mission available`,
      `Seen Joining Clan Nutsy Cutscene`,
    ],
    reward: [`600 Gil`, `Lutia Pass placement`],
    difficulty: `Very Easy`,
    enemies: [`Goblin x3`, `Red Cap`, `Sprite`],
    strategy: `When you arrive at the Giza Plains, Marche and Montblanc will enter the area together. Almost immediately, Marche spots a group of monsters and realizes they’ll need to be cleared out. You can bring up to four additional clan members into this battle — essentially your entire current roster.

This fight is quite manageable, so there’s no need to rush. The Goblins are weak and easily defeated, but keep an eye on the Red Cap, as it can pose a bit more of a challenge. Have Montblanc target it with Black Magic to take it down efficiently. Save the Sprite for last — it doesn’t use any special abilities and its regular attacks cause very little damage.

Once every enemy is defeated, you’ll officially complete your first mission!
`,
  },
  {
    number: 2,
    name: `Thesis Hunt`,
    description: `I search for my master the late Dr. Dalilei's thesis. It was taken from me by bandits as I crossed the Lutia Pass. ~ Dr. Coleman, Geologist`,
    type: `Engagement`,
    cost: `900 Gil`,
    location: `Lutia Pass`,
    prerequisites: [
      `After placement of the Lutia Pass symbol`,
    ],
    reward: [`4000 Gil`, `x1 Random Item`],
    difficulty: `Medium`,
    enemies: [`Archer`, `Soldier x2`, `Thief x2`, `White Mage`],
    strategy: `This encounter is a noticeable difficulty spike compared to the previous “Monster Mash.” Instead of facing simple Goblins, you’ll now battle a group of skilled thieves who come equipped with a few tricks of their own.

At the top of the battlefield are a White Mage and a level 4 Thief. You won’t be able to reach them immediately, but make them your priority once you can. The stronger Thief possesses the Reaction ability *Counter*, which may be new to you. To avoid triggering it, rely on ranged attacks such as Montblanc’s Black Magic or your Archer’s shots.

The Soldiers in this fight tend to use *Mug* and standard sword attacks — their strikes can deal solid damage, but it’s best to save them for last. Focus on eliminating the Archer early before it can start using *Aim: Arm* or *Aim: Legs* to disable your party members. Once all enemies have been defeated, the mission will be complete and Dalilei’s thesis will be safely recovered.
`,
  },
  {
    number: 3,
    name: `The Cheetahs`,
    description: `There's a price on the heads of the band of conmen calling themselves the "Cheetahs." Word is they were seen in Nubswood! ~ Bratt, Steetear`,
    type: `Engagement`,
    cost: `1200 Gil`,
    location: `Nubswood`,
    prerequisites: [
      `After placement of the Nubswood symbol`,
      `Seen Bartender's Clan Warning Cutscene`,
    ],
    reward: [`6000 Gil`, `x2 Random Items`],
    difficulty: `Easy`,
    enemies: [`Thief`, `White Monk`, `Fighter`, `Archer`, `Black Mage`],
    strategy: `When you enter Nubswood, Marche bumps into his old friend Ritz—and a Viera named Shara. A clan calling itself the “Cheetahs” is already on the field. After a quick reunion, the fight kicks off with Ritz and Shara on your side, which makes this one much smoother.

You probably don’t need a White Mage here. You can bring one if you’re unsure about your lineup, but knockouts are unlikely if you play cleanly. You only get three additional clan slots, so use them wisely. Open by eliminating the enemy White Mage. Next, remove the Archer before it starts locking down your team with immobilize or disable shots. The Thief and Fighter look scary but aren’t much of a threat in this encounter. After the Archer, shift attention to the White Monk, then mop up the rest at your pace. Overall, it’s a relaxed win.
`,
  },
  {
    number: 4,
    name: `Desert Peril`,
    description: `There's been a rash of attacks by crazed monsters in the Eluut Sands area recently. Will pay for research & removal. ~ Eluut Civilian Militia`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Eluut Sands`,
    prerequisites: [
      `After placement of the Eluut Sands symbol`,
      `Seen Montblanc Asks About Ritz Cutscene`,
    ],
    reward: [`7000 Gil`, `x1 Random Item`],
    difficulty: `Slightly Hard`,
    enemies: [`Cream`, `Red Panther x2`, `Antlion`, `Coeurl`],
    strategy: `When Marche and Montblanc enter the area, they’re immediately confronted by a pack of monsters—so there’s no choice but to engage them in battle.

This fight can be challenging given how early it appears in the game. At this stage, your available jobs are likely still basic ones such as Soldier and Archer. The biggest threats here are the Panther-type enemies: two Red Panthers and one Coeurl, which is the stronger blue variant. All three have high attack and defense stats, so handle them carefully. If your Archer has learned *Aim: Arm*, use it on the Coeurl to disable its attacks temporarily.

You’ll also encounter a creature called a Cream, which resists most physical damage. Instead, target it with Fire-based spells — it’s weak to fire, and a single cast from a Black Mage can either defeat it outright or leave it on the brink. Once the Panthers are eliminated, the rest of the battle will be much easier. Keep chipping away at the remaining monsters until victory is yours.
`,
  },
  {
    number: 5,
    name: `Twisted Flow`,
    description: `I've seen the Ulei River bending and warping most strangely, but no one else can see anything! Please find out the truth. ~ Jura, Time Mage Adept`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Ulei River`,
    prerequisites: [
      `After placement of the Ulei River symbol`,
    ],
    reward: [`8000 Gil`, `x2 Random Items`],
    difficulty: `Hard`,
    enemies: [`Totema (Famfrit)`, `Floateye x2`, `Ahriman x2`],
    strategy: `Marche cautiously steps into the Ulei River area and, after a brief look around, decides that nothing appears out of the ordinary. Suddenly, a dark vortex materializes in the center of the field. Instinctively, Marche readies himself, but before he can react, the warp pulls him in and transports him to a mysterious temple-like place.

Disoriented, Marche surveys his surroundings until his eyes land on a glowing crystal ahead. Just as he begins to approach, a commanding voice echoes through the air, demanding to know his name. Nervously, Marche responds — and from the crystal emerges a strange being who identifies himself as Famfrit, the Totema guarding this first crystal. Though he doesn’t seem openly hostile at first, Famfrit quickly summons two Floateyes and two Ahrimans to defend the area and challenges Marche to battle.

Your objective is to defeat the boss, Famfrit. If your team is at a decent level, the fight should go smoothly. A good tactic is to inflict Sleep on Famfrit early, then focus on eliminating the lesser monsters while he’s incapacitated. Once the field is clear, have Marche or your strongest attacker close in to strike Famfrit — you’ll even land a free hit as he wakes. Be aware that one of the Ahrimans knows the *Roulette* ability, which can instantly KO a random unit on either side. Stay persistent, manage your positioning carefully, and chip away at Famfrit’s HP until he finally falls.
`,
  },
  {
    number: 6,
    name: `Antilaws`,
    description: `An alchemist named "Ezel" claims he's found a way to nullify laws! Looking for information about him and his "antilaws." * Numerous Requests`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Cadoan`,
    prerequisites: [
      `After placement of the Cadoan symbol`,
      `Seen Antilaw Rumor Cutscene`,
    ],
    reward: [`9000 Gil`, `R2 Antilaw`, `2x Random Items`],
    difficulty: `Medium`,
    enemies: [
      `Gladiator`,
      `Illusionist`,
      `Hunter`,
      `Ninja`,
      `Fighter`,
      `Defender`,
    ],
    strategy: `It turns out that the suspicious Nu Mou you previously encountered in Cadoan is now in serious trouble. Marche, ever the well-meaning hero, decides to step in and help — even though it might not be the smartest move to rush to the aid of a complete stranger. Whether this Nu Mou is a criminal or just caught in the wrong place at the wrong time remains to be seen.

This fight pits your clan against six enemies. You’ll soon learn that the Nu Mou’s name is Ezel Berbier, a renowned Hermetic. He’ll assist you in battle, though he doesn’t actually attack directly. His special ability, *Azoth*, can inflict Sleep on every opponent — but since you can’t control him, whether or not he uses it is unpredictable. You’ll also encounter a new unit type here: the Illusionist. Illusionists use *Phantasm* spells that strike every target on the battlefield without needing to aim manually.

The encounter can be difficult, but manageable with the right priorities. If your team has low Magic Resistance, take out the Illusionist first to reduce the field-wide damage. If your squad struggles with physical defense, make the Fighter and Defender your initial targets instead. The Hunter and Ninja positioned toward the back should be dealt with last. Keep your attacks consistent, maintain awareness of your formation, and above all — make sure Ezel survives the battle.
`,
  },
  {
    number: 7,
    name: `Diamond Rain`,
    description: `Word is, diamonds are falling in the rain in Aisenfield. If it's true, we'll be rich! ~ Geyna, Streetear`,
    type: `Engagement`,
    cost: `1400 Gil`,
    location: `Aisenfield`,
    prerequisites: [
      `After placement of the Aisenfield symbol`,
    ],
    reward: [`10600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Bomb`, `Lamia`, `Ice Flan`, `Icedrake`],
    strategy: `Check the enemy lineup for this mission — it’s entirely made up of monsters, many of which have valuable skills that a Blue Mage or Morpher can learn. Because of this, it’s a good idea to bring along a Beastmaster (with a Blue Mage to capture abilities) or a Hunter to help manage them. That said, don’t underestimate the fight; it’s tougher than it looks, so field your strongest units alongside your skill-learners.

Most of the enemies are standard monsters, but the Ice Flan stands out. As with all Flan types, physical attacks barely hurt it, so rely on magic instead — specifically Fire spells, which it’s weak against. One of your Black Mages should already know *Fire*, making quick work of it. The two Icedrakes are especially dangerous, each with distinct skills: one uses *Ice Breath* (a Dragoon-style attack), while the other has *Mighty Guard*. Both pack a serious punch, so approach them carefully.

Start the battle by targeting the Lamia and Ice Flan with ranged Fire attacks. Once they’re down, focus on eliminating the first Icedrake, then move on to the second. The Bomb poses little threat and can be saved for last — it doesn’t offer anything useful for learning or loot. Once the Ice Flan and Icedrakes are gone, the rest of the encounter plays out like a standard monster brawl.
`,
  },
  {
    number: 8,
    name: `Hot Awakening`,
    description: `The Roda Volcano has been active lately. The Royal Mage Academy wants to hire researchers. No experience needed, must like heat. ~ Ramda, Geology Labs`,
    type: `Engagement`,
    cost: `1600 Gil`,
    location: `Roda Volcano`,
    prerequisites: [
      `After placement of the Roda Volcano symbol`,
    ],
    reward: [`11400 Gil`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Ultima Crystal x8`],
    strategy: `When Marche reaches the Roda Volcano, he immediately starts complaining about the heat. Suddenly, the ground shakes violently, and a dark warp materializes at the center of the area. Marche quickly realizes that this must mean another crystal is nearby—but before he can react, the warp expands and pulls him in.

When the scene fades back in, everything looks completely different from the first crystal encounter. The gloomy, gray tones of the previous temple are replaced with vibrant colors and fluttering butterflies. Marche even comments on how beautiful and peaceful it feels compared to before. But just as he approaches the crystal, several glowing Ultima Crystals appear around him. It seems this won’t be as simple as he hoped.

These Ultima Crystals are the Totema themselves, though they differ greatly from Famfrit. They can’t move at all and act more like stationary defenses for the crystal. Their main ability, *Logos*, can Charm units and lower both Attack and Defense, making it extremely irritating to deal with.

Fortunately, there’s a simple strategy to make this battle easy. Move one of your units directly adjacent to an Ultima Crystal while staying out of range of the others. The Crystals won’t use *Logos* unless your character is at least one tile away, so standing right next to them forces them to rely on their weak physical attack instead. As long as you assign only one unit to each Crystal, they won’t resort to *Logos*.

Focus on taking down one Crystal at a time while keeping your team spread out to avoid overlapping attack ranges. The first one you destroy will likely be the most difficult since safe positions are limited, but once it’s gone, the rest will fall easily. Keep your formation disciplined and avoid bunching up, and you’ll clear the battle smoothly with minimal damage to your team.
`,
  },
  {
    number: 9,
    name: `Magic Wood`,
    description: `Trespassers have been cutting down trees in the Koringwood for their magical properties. They must be stopped! ~ Guillaume, Ranger Captain`,
    type: `Engagement`,
    cost: `1600 Gil`,
    location: `Koringwood`,
    prerequisites: [
      `After placement of the Koringwood symbol`,
    ],
    reward: [`12600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Archer`, `Time Mage`, `Black Mage`, `Thief x2`, `Summoner`],
    strategy: `Deep within Koringwood, a band of illegal lumberjacks is cutting down enchanted trees to sell for profit. Fortunately, Marche arrives just in time to put a stop to their scheme—so it’s time to engage.

You’ll be facing seven enemies in this mission, all fairly strong in their own ways. With only five of your own units (including Marche), you’ll be at a numerical disadvantage. That said, if you focus on the biggest threats first, the fight becomes much more manageable. It’s also worth dedicating one slot to a White Mage for healing support.

At the start of the battle, the two Thieves will likely move first. They’re not particularly dangerous, so you can safely ignore them early on unless you’re worried about stolen items—in which case, inflicting Blind on them is a good precaution. The Sniper can deal some damage but doesn’t have many abilities to worry about. The Archer, however, should be taken out quickly to prevent her from using debilitating attacks like *Aim: Arm* or *Aim: Legs*.

The remaining enemies are all magic users, which gives you a big tactical opening. If possible, bring a Templar or anyone capable of casting Silence. The Time Mage, Summoner, and Black Mage become completely harmless once Silenced, so keep that status effect active while you focus on other targets. Deal with the melee units first, then clean up the spellcasters once the field is under control.

Although you’re outnumbered, smart use of status effects can easily turn the tide. Rely on Blind, Silence, and other disabling abilities to keep enemies locked down for several turns. With careful planning and steady control, this battle becomes much smoother—and victory is well within reach.
`,
  },
  {
    number: 10,
    name: `Emerald Keep`,
    description: `The Royal Mage Academy has given up their search for the giant emerald crystal of Salika Keep. Treasure hunters, now's your chance! ~ Levey, Search Team Member`,
    type: `Engagement`,
    cost: `1800 Gil`,
    location: `Salikawood`,
    prerequisites: [
      `After placement of the Salikawood symbol`,
    ],
    reward: [`13600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [
      `Bishop`,
      `Gunner`,
      `Alchemist`,
      `Templar x2`,
      `Runeseeker (Babus`,
    ],
    strategy: `Marche cautiously enters the Salika Keep, searching for the rumored giant emerald crystal. As he climbs the steps, he begins to suspect that this might be one of the sacred crystals he’s been seeking. Suddenly, a voice calls out from ahead, and as the camera pans, it becomes clear that Babus has arrived under direct orders from Prince Mewt. Babus accuses Marche of being a threat to the Prince, and though Marche tries to deny it, his own conscience betrays him. When he admits he didn’t realize this world belonged to Mewt, Babus immediately understands the truth. With that, his forces prepare for combat—and so must you.

You can field five additional units alongside Marche for this battle. The fight ahead is one of the tougher ones so far, so make sure you deploy your strongest team.

Babus the Runeseeker is the biggest challenge in this encounter. His unique skillset includes Explode, a powerful area attack similar to the Sage’s Giga Flare; Stillness, which inflicts Stop; and Quarter, which removes one-fourth of a target’s HP. He also has the Counter reaction ability, making him risky to engage up close.

Backing him up are two Templars, a Bishop, an Alchemist, and a Moogle Gunner. The Templars are dangerous physical fighters. One uses Rasp to drain MP, Cheer to raise Attack, and Haste, along with the Bonecrusher reaction ability. The other Templar has Astra to block status effects, Warcry to lower Speed, Cheer again to raise Attack, and the Weapon Atk+ support ability.

The Bishop is a balanced unit capable of healing allies, removing buffs with Dispel, and dealing damage. Taking him out early will cut off their healing options. The Alchemist is much more offensive, using Flare and Frog—silence or eliminate him quickly before he causes trouble. The Moogle Gunner stays toward the back and relies on Stopshot paired with Concentrate; Blinding him early helps neutralize that threat.

Your main goal is to defeat Babus. If your team is strong enough, focus entirely on him to end the battle quickly. Otherwise, remove the supporting enemies first to make things safer. Keep your party spread out to avoid Babus’s area attacks and use status effects like Silence or Stop to limit his magic. With good positioning and focused attacks, you’ll bring down Babus and complete the mission at Salika Keep.
`,
  },
  {
    number: 11,
    name: `Pale Company`,
    description: `A spirit or ghost was seen going into Nargai Cave, and is making low moaning noises. We can't sleep. Please investigate. ~ Nargai Area Residents`,
    type: `Engagement`,
    cost: `1900 Gil`,
    location: `Nargai Cave`,
    prerequisites: [
      `After placement of the Nargai Cave symbol`,
    ],
    reward: [`15000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Icedrake`, `Firewrym`, `Thundrake`, `Totema (Adrammelech)`],
    strategy: `For this next story mission, Marche ventures into the Nargai Cave to investigate rumors of a ghost. A small glowing orb appears before him, and instead of fear, he feels strangely calm. “Funny,” he says, “here I am looking at a ghost, but I don’t feel scared at all.” The orb begins to move deeper into the cave, and Marche, curious, follows it—only to be caught off guard when a warp suddenly engulfs him.

When the scene fades back in, Marche finds himself in another temple—clearly the site of another crystal. The ghost briefly vanishes, then reappears near the crystal. From it emerges the Totema Adrammelech, who absorbs the ghost and declares that no one may approach his masters’ domain. Unfazed, Marche readies himself for battle as Adrammelech summons his dragon minions.

This fight is a significant jump in difficulty compared to the earlier Totema encounters. Bring a strong party of six, including a White Mage or similar support unit. The dragons don’t have high Speed, so you’ll likely move first, but their power should not be underestimated.

You’ll face three dragons: a Firewyrm, Icedrake, and Thundrake. Each uses its respective elemental breath attack—*Fire Breath*, *Ice Breath*, and *Bolt Breath*. The Icedrake may also use *Mighty Guard* to boost its allies’ defenses. Some dragons have *Geomancy* or *Weapon Atk+* to enhance their magic or physical strength, but they’re manageable if controlled early.

Adrammelech himself is the real threat. His signature move, *Firestream*, deals massive fire-elemental damage—roughly twice as strong as Famfrit’s *Breath of God*. He also uses *Lightspeed* to ignore reaction abilities, *Howl of Rage* to reduce Speed for nearby units, and *Soul Sphere* to drain MP, so keep your spellcasters at a distance.

To gain control of the battle, open by inflicting Disable, Immobilize, or Blind on the dragons to keep them from interfering. Once they’re under control, direct your full attention to Adrammelech. Concentrate your strongest melee attackers on him while your support units focus on healing and buffs. With steady pressure and a few well-timed strikes, you’ll bring down this formidable Bangaa Totema and claim victory over the crystal.
`,
  },
  {
    number: 12,
    name: `Jagd Hunt`,
    description: `On my brand-new airship's maiden flight, she was damaged in a hit- and-run! The criminal is in Jagd Dorsa, kupo! Get him! ~ Nono, Machinist Apprentice`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Jagd Dorsa`,
    prerequisites: [
      `After placement of the Jagd Dorsa symbol`,
      `Seen Nono's Loss Cutscene`,
    ],
    reward: [`16000 Gil`, `2x Random Item`, `1x Random Card`],
    difficulty: `Hard`,
    enemies: [`Ninja`, `Hunter`, `Antlion`],
    strategy: `Here we are, Jagd Dorsa. Remember, this is a Jagd zone, so if any of your units are KOed and left on the ground, they’re gone for good. Keep that in mind before starting this difficult fight against Nono’s enemy bandits.

Because of the danger here, it’s smart to bring a White Mage or another unit capable of reviving allies. Phoenix Downs are also essential. Make sure your team has strong defenses—Paladins or Defenders are perfect for this battle. You’ll want to play carefully and avoid unnecessary risks.

The enemies here are mostly clan units, with a few monsters mixed in. Right in front of you are a Ninja, a Blue Mage, and a Hunter. The Ninja uses Metal Veil, Water Veil, and Double Sword, letting him strike twice in one turn. The Blue Mage knows a wide range of powerful techniques, including Mighty Guard, Night, Hastebreak, White Wind, and several monster-based skills. The Hunter has solid attack stats and uses Sonic Boom, Advice, and Aim: Vitals, which can inflict random status effects.

To your left is an Assassin, easily one of the most dangerous enemies in the group. She uses Shadowbind to immobilize targets, Aphonia to silence, Oblivion to cause Addle, and Last Breath to instantly KO her target—a deadly ability in a Jagd. Avoid targeting her with arrows, as she can reflect them back.

There’s also an Antlion and a Toughskin among the enemy ranks. The Antlion can use LV3 Def-less to lower the defenses of units whose levels are divisible by three and Sandstorm to inflict Blind. The Toughskin isn’t too threatening, relying mostly on Resonate and Matra Magic, both of which are manageable.

Your best move is to take down the Assassin and Ninja first, as they pose the greatest threat. Watch for Last Breath in particular—it’s an instant KO, and in a Jagd, that means permanent loss if you don’t revive in time. After that, focus on the Hunter to prevent status ailments, then eliminate the Blue Mage. This battle is tough, so don’t worry if you need a few tries to get it right. It’s your first real Jagd mission, and surviving it is an accomplishment in itself.
`,
  },
  {
    number: 13,
    name: `The Bounty`,
    description: `Looking for information about that bounty the palace is offering. Give us a shout if you see us. We're around. ~ Clan Ox`,
    type: `Encounter`,
    cost: `2900 Gil`,
    prerequisites: [
      `After placement of the Kudik Peaks symbol`,
      `Seen Nono's Trade Idea Cutscene`,
    ],
    reward: [`17200 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Fighter`, `Time Mage`, `Black Mage`],
    strategy: `You know the routine by now—track down the unknown wanderer on the world map. When you arrive on the battlefield, you’ll come face to face with Clan Ox. At first, things seem calm, but one of their members suddenly recognizes Marche, saying he looks exactly like the bounty they’ve been hunting. Turns out, you’re the target.

So much for helping them out—since surrender isn’t an option, it’s time to fight your way through. Hopefully, you brought a healer and maybe some ranged attackers, because this group is no joke.

Your enemies include a Sage, Paladin, Fighter, Red Mage, Time Mage, and Black Mage. The Paladin may seem like the biggest threat with his strong attack power, but his skillset is limited—he only uses *Saint Cross* and *Drop Weapon*. He can heal, though he rarely bothers to.

The Fighter is much more dangerous physically. His high Weapon Attack and standard Fighter techniques make him a prime candidate to take down early. On the magical side, the Black Mage is the most destructive. With Magic Power around the 200 range and access to “-aga” level spells, he can hit incredibly hard if left alone.

The Sage could have been trouble, but this one’s weaker than most. Thankfully, he doesn’t know *Giga Flare*. He does have *Reflex*, which blocks basic Fight attacks, so make sure to use abilities or magic to deal with him. The Red Mage isn’t much of a problem either—she lacks *Doublecast* and doesn’t have the stats to make an impact. The Time Mage can be annoying, though, especially if he uses *Quicken* to speed up the Fighter right after you’ve taken damage. That combo can turn deadly fast.

Your best opening move is to Disable the Fighter and Paladin to neutralize their melee threat. After that, Silence the casters to limit their magic output. A utility unit that can inflict those conditions will make this battle far easier, supported by your strongest physical and magical attackers, plus a healer for backup.

If you play carefully and avoid rushing in, this fight isn’t too difficult, especially for a story mission. But if you charge in without a plan, Clan Ox will quickly overwhelm you. Stay composed, control the field, and you’ll walk away from this one without much trouble.
`,
  },
  {
    number: 14,
    name: `Golden Clock`,
    description: `Someone has been selling phoney copies of our "Golden Sandclock (tm)" in the Jeraw Sands area. Please investigate. ~ Belta Clockworks Co. `,
    type: `Engagement`,
    cost: `2200 Gil`,
    location: `Jeraw Sands`,
    prerequisites: [
      `After placement of the Jeraw Sands symbol`,
    ],
    reward: [`18000 Gil`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Alchemist`, `Time Mage`],
    strategy: `Marche enters the area and spots Shara stepping out from a corner. Ritz appears behind him, and they greet each other. Marche asks if she knows about the bounty on his head, and Ritz reassures him that she would never turn him in. They’re here for another reason entirely.

Ritz calls out the Golden Clock forgers, revealing your next fight. Once again, you’ll be battling alongside Ritz and Shara. With both of them on your side and only four enemies to face, this mission should be fairly easy. Bring three extra units and begin the battle.

The enemies include an Alchemist, a Juggler, a Time Mage, and a Gadgeteer. The Alchemist can use Meteor for heavy damage, Poison to slowly drain HP, and Toad to turn units into frogs. The Juggler uses Hurl to throw items, Firebomb to cause Berserk, and Ball to inflict Confusion.

The Time Mage can be troublesome if left unchecked. Demi deals strong damage against high-HP units, Quicken grants free turns to allies, and Slow or Stop can leave your team helpless if you aren’t careful.

The Gadgeteer’s attacks are random and risky for both sides. Red Spring can cast Haste on a random team, Blue Screw removes buffs with Dispel, and Green Gear inflicts Poison—all based on chance. Its Damage > MP ability also makes it more resistant to direct attacks.

Thanks to Ritz and Shara’s high levels and strong skills, this battle shouldn’t give you much trouble. Just stay alert—if either of them is KOed, things can turn quickly. Stay focused, finish the enemies off, and the mission will be over before long.
`,
  },
  {
    number: 15,
    name: `Scouring Time`,
    description: `By order of Her Majesty Queen Remedi we will be searching each town for the boy wanted by the palace. ~ Bervenia Palace and Judges`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Muscadet`,
    prerequisites: [
      `After placement of the Muscadet symbol`,
      `Seen Ezel's Warning Cutscene`,
    ],
    reward: [`19600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Gunner`, `Templar x2`, `Mog Knight x2`, `Avatar x8 (Exodus Fruit)`, `Runeseeker (Babus)`],
    strategy: `As you enter Muscadet, an engagement is about to occur. Marche and Montblanc 
appear in the area and witness some Judges and officers of the law bringing 
in random units for questioning. A particular arguement between a Moogle and a
Judge will appear on-screen. The Moogle will ask why he is to be brought in, 
and Judge responds with that the human they are looking for has been seen 
with a Moogle. Unable to take this injustice, Marche runs in...

The first thing he does is exclaim that he is the one Prince Mewt is looking 
for. While the Judge is a bit disbelieving, he still brings in units to 
capture this supposed boy. Units begin to move in, and you will note that you 
are a bit outnumbered. Bring in three extra units with addition to Marche and 
Montblanc and begin the battle with the odds of 5 vs. 7 stacked against you.

Your enemies consist of some powerful units, but the most dangerous of them 
all would be the Paladin or the two Templars. If you care to steal anything, 
you will definitely want the Dragon Mail or Genji Armor. The first enemy unit 
to move will probably be the enemy Paladin or either Mog Knight, but if you 
brought in swift units, you should be able to move first for the most part. 

The two Templars are dangerous with both of them holding the R-Ability, 
Bonecrusher. In addition, both Templars can terrorize you with Astra, Warcry, 
Rasp, Haste, and Lifebreak which can deal incredible damage when you knock off 
a lot of that Templar's HP. The second most dangerous, the Paladin lacks in 
numbers of abilities, but don't let that get your guard off. Holy Blade does 
incredible damage, and Drop Weapon can become annoying.

Also included are two Mog Knights, a Gunner, and a Sage. The Mog Knights are 
pretty much standard issue and shouldn't provide much problems with only Mog 
Attack, Mog Guard, Mog Rush, Mog Lance, Mog Shield, and Mog Aid. By now, you 
should already have many ways to counter-act these kind of abilities. The Sage
is almost laughable with only Drain, Aero, and Bio. Finally, the Gunner isn't 
dangerous as it hasn't learned Concentrate.

At the beginning, begin Disabling and/or Immobilizing the Templar and Bishop 
immediately. Using status ailments can easily turn the tide of battle with 
you. Following, you will want to Blind the Gunner. Deal with the opponents as 
you see fit, but you should try to set up an attack which you know won't fail 
before you attempt something rash. 

But the battle isn't over just yet...

Afterwards, Judgemaster Cid appears on the scene, and begins to question you.
Pretty sure that the boy is the boy, Cid brings him to the prison. There, 
Babus will run in and confirm that the boy is indeed Marche. Now that they 
know, Marche demands that Judgemaster Cid let the others go. Cid will ask 
Marche if he is the one destroying the crystals. Marche confirms, and a seam 
appears mysteriously. Somehow...

The fourth crystal is weak... But you have no access to your clan as of now. 
Babus and Cid are also in the area, and they aren't about to let you destroy 
these crystals in which they had so willingly defended. You guessed it, it's 
another fight with Runeseeker Babus, and this time, he's even more tough. The 
only opposition you will receive here is from Babus. The Totema is weak, and
it can't attack. Since Cid is a Judgemaster (obviously), he will play as Judge 
to make sure the Laws are enforced. Babus is no laughing matter however. This 
battle is a one vs. one... Babus vs. Marche.

Babus's abilities consist of Explode, a deadly Fire elemental move, Stillness, 
which Stops Marche right in his tracks, and Demi which cuts off half of your 
HP right off the bat. In addition, Counter and Weapon Def+ makes him even more 
of an adversary. The key here is to avoid his first move, and follow-up with a 
heavy damage move which you should have at this point for a physical character 
as Marche. Holy Blade or Beatdown would work. However, if you don't have 
access to them, you might have to pick away at Babus's health continuously and
use X-Potions constantly. Defeat Babus and the Fruits to win. 
`,
  },
  {
    number: 16,
    name: `The Big Find`,
    description: `Even after the historical finds in the Uladon Bog, the Royal Mage Academy says there might be more lying hidden out there... ~ Azare, Streetear`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Uladon Bog`,
    prerequisites: [
      `After placement of the Uladon Bog symbol`,
      `Seen Mewt's New Retainer Cutscene`,
    ],
    reward: [`20400 Gil`, `2x Random Item`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Thief x2`, `Bishop x2`, `Fighter x2`],
    strategy: `This time, the story doesn’t open with Marche entering the area. Instead, the camera pans over the battlefield where a short exchange takes place between a group of Fighters and their companions. One of them mentions something about a kid being late, hinting that an ambush is about to unfold. A scout Thief soon arrives and announces that their “pot of gold” has shown up.

Right on cue, Marche walks in — and of course, he’s the target. Despite being surrounded by six enemies, he barely reacts, muttering only a casual “Huh?” before the fight begins. You’ll be facing six opponents this time, so bring five reliable, well-balanced units and get ready for battle.

Your enemies include two Fighters, two Thieves, and two Bishops. It’s a straightforward mix, but you’ll still need to be cautious. Strikeback and Bonecrusher are the two abilities that can punish reckless attacks, so avoid hitting when your accuracy is low. A missed swing could mean taking heavy counter damage.

The Fighters come with a range of attacks: Rush, Air Render, Far Fist, Wild Swing, Beatdown, and Blitz. Fortunately, these skills are divided between the two of them. If you take down the Fighter with *Wild Swing*, *Far Fist*, and *Beatdown* early, those threats are gone for good.

The Thieves are more troublesome due to *Steal: Weapon* and *Steal: Ability*. Losing a weapon or skill mid-battle can make things far harder than necessary. Try to disable or immobilize them from a distance before they get close enough to steal. Other than that, they don’t deal much direct damage.

Lastly, the Bishops use low-tier spells like *Water* and *Aero*, with *Holy* being their only significant source of damage. They can also heal with *Cura* and drain JP, but their offense isn’t especially threatening.

The safest plan is to deal with the Thieves first so you don’t lose gear or abilities. Once they’re down, turn your focus to the Fighters, who will probably be pressing your front line by then. Leave the Bishops for last since they don’t pose a major threat. Defeat all enemies to complete the mission.
`,
  },
  {
    number: 17,
    name: `Desert Patrol`,
    description: `The famed Mirage of Gotor is drawing big crowds, and big crowds draw thieves and pickpockets. Please help us patrol! ~ Ivalice Tourism Board`,
    type: `Engagement`,
    cost: `2500 Gil`,
    location: `Gotor Sands`,
    prerequisites: [
      `After placement of the Gotor Sands symbol`,
    ],
    reward: [`21400 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Bishop`, `Defender`, `Gladiator`, `White Monk`, `Soldier x2`],
    strategy: `As you arrive at Gotor Sands for the Desert Patrol mission, Marche spots someone who looks strangely familiar. Moving closer, he realizes it’s his brother, Doned. Overjoyed, Marche calls out to him, but Doned stays silent and runs off. When Marche follows, he finds Doned speaking with a group of strangers—only to realize, in shock, that his brother has just turned him in for a bounty.

The palace still wants you captured, and this enemy clan has come to collect. Since there’s no talking your way out of this, you’ll have to fight through. Bring six units for this battle; your enemies consist of Bangaa and Humans. Apart from the Bishop, the enemy party is entirely physical, so consider bringing some strong magic users like Morphers or Sages. They’ll have enough defense to survive melee hits while exploiting the enemies’ weaker magic resistance.

The White Monk at the front uses techniques such as Whirlwind, Air Render, Earth Render, and Far Fist. While his abilities can cover a lot of ground, his weapon attack is low, so his standard hits won’t do much damage. Behind him, a Gladiator uses the elemental Spellblade attacks—Fire Sword, Bolt Sword, and Ice Sword—each adding magical damage to his strikes.

Two Soldiers make up the human side of the group. The first uses the typical “Break” skills—Powerbreak, Mindbreak, and Magicbreak—and can Berserk your units with Provoke. The other Soldier is less threatening, with only Powerbreak, Mindbreak, and Speedbreak, plus Mug, which steals Gil while dealing light damage.

At the center is a Defender, who looks intimidating but isn’t too dangerous once you understand his moves. Tremor pushes back nearby units, Drop Weapon can disarm your characters, and Mow Down deals area damage but leaves him exposed afterward by dropping his Evade to zero. The Dragoon is stronger and more annoying, with Lancet to absorb HP and elemental breath attacks like Fire Breath and Bolt Breath.

The Bishop is the group’s only magic user. His spells include Water for damage, Dispel to remove buffs, and Break to inflict Petrify. Once the Bishop falls, the enemy loses their only source of healing aside from items.

Start by taking down the Bishop first to eliminate magic and healing threats. After that, shift to the physical attackers—especially the Gladiator and Dragoon. Since most of your enemies have higher weapon defense than magic resistance, magic-based attacks are very effective here. Keep an eye out for the Bishop’s Return Magic ability, though, as it can reflect your spells. Once you stabilize the fight, the remaining enemies will fall quickly, and you’ll come out on top.
`,
  },
  {
    number: 18,
    name: `Quiet Sands`,
    description: `The famed "Barking Sands" in the Delia Dunes have stopped barking, and tour cancellations are rising. Please investigate. ~ Acamel Tours Office`,
    type: `Engagement`,
    cost: `4000 Gil`,
    location: `Delia Dunes`,
    prerequisites: [
      `After placement of the Delia Dunes symbol`,
    ],
    reward: [`22600 Gil`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Templar x2`, `Titania x2`, `Vampire x4`, `Totema (Mateus)`],
    strategy: `As you enter the Delia Dunes, the area is eerily quiet. Marche comments on the strange lack of sound, but before he can leave, a mysterious figure appears—Llednar. Marche has never seen him before and is unsure what to make of this imposing stranger. With a calm but commanding tone, Llednar tells Marche to leave. Before Marche can react, a seam opens in the air nearby.

It’s the location of the fifth and final crystal. Llednar disappears briefly, but as Marche moves forward, he reappears and orders Marche not to proceed any further. When Marche refuses, Llednar strikes, and the battle begins. Just as things look grim, Judgemaster Cid arrives and intervenes. Using an antilaw, Cid bans Llednar’s strongest attack, Omega, but the fight continues regardless. You’ll now have to face Biskmatar Llednar himself.

Llednar summons two Templars and two Titanias, while you can deploy five of your own units. The Templars are dangerous front-line fighters with high attack power. Watch for their use of *Silence*, *Soul Sphere*, and *Rasp*, which drain MP. They can also cast *Astra* to nullify status effects, *Lifebreak* to deal damage based on missing HP, and *Warcry* to lower Speed.

The Titanias aren’t as physically strong, but their spell *LV?D Holy* can be deadly. If the day of the month matches a unit’s level, that unit will take heavy Holy damage. They can also use *Angel Whisper* to heal and revive allies with Auto-Life.

Llednar himself is the greatest threat. His attack power is incredibly high, and even without Omega, he’s devastating. His abilities include *Abyss* (deals damage and inflicts Poison), *Life Render* (deals damage and inflicts Doom), *Heart Render* (damages MP), *Ripcircle* (damages nearby units), and *Furycircle* (damages and knocks back surrounding units). However, no matter how much damage you deal, Llednar cannot be killed. The only way to win is to defeat his allies and survive until Cid steps in to banish Llednar with a Red Card.

Once Llednar disappears, Marche continues deeper into the dunes, where the final crystal awaits.

Judgemaster Cid gives Marche a chance to leave, but Marche refuses, determined to finish what he started. As he steps into the final chamber, the Totema Mateus appears—the Totema of the Humans. Mateus shifts forms, appearing first as Ritz, then Doned, then Mewt, and finally as Marche himself. Recognizing the illusion, Marche steels himself for battle.

The illusionary forms transform into four Vampires, while Mateus remains at the center. This is the toughest Totema battle yet, so prepare carefully. Bring a White Mage to counter the Vampires’ status effects and strong physical attackers to handle Mateus.

The Vampires use dangerous abilities, including *LV? S-Flare*, which deals heavy damage to all units sharing the same last digit in their level. They also use *Zombify* to turn allies into the undead and *Miasma* to poison and damage your team.

Mateus herself is extremely powerful, boasting both HP and Weapon Attack in the 400s. She can easily KO weaker units in one hit. Her moves include *Spellbind* (damage and Slow), *Breath of God* (large area attack), *Star Cross* (Holy-element field damage), and *Thundaga* for direct magical strikes.

Before the fight, cast *Protect* and *Shell* on your team to reduce incoming damage. It’s best to ignore the Vampires if possible—Blind or Disable them to keep them occupied, then focus entirely on Mateus. This battle is a test of endurance and precision rather than strategy. Stay healed, keep your buffs up, and hit hard. With patience and persistence, you’ll finally bring down the last Totema.
`,
  },
  {
    number: 19,
    name: `Materite Now!`,
    description: `Materite is getting hard to find with Audience Day near. I need some for my experiments! Search the Materiwood -- ore will do. ~ Pallas, Alchemist`,
    type: `Engagement`,
    cost: `2700 Gil`,
    location: `Materiwood`,
    prerequisites: [
      `After placement of the Materiwood symbol`,
      `Seen Gift Day Gossip Cutscene`,
    ],
    reward: [`23400 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Summoner`, `White Mage`],
    strategy: `Marche discovers a piece of Materite deep within the Materiwood, and for a moment, everything seems to be going smoothly. Just as he starts to relax, a group of Viera bandits appears from behind. Somehow, they knew he was there—and it turns out Doned was the one who tipped them off. There’s no turning back now; it’s time to fight.

You can bring six units into this battle. It’s best to equip gear that protects against status effects, especially instant KO. The Assassin is the most dangerous enemy here thanks to her abilities *Shadowbind* and *Last Breath*. *Shadowbind* inflicts Stop, freezing your unit in place, while *Last Breath* causes an instant KO—something you’ll want to avoid at all costs.

The Sniper can also be troublesome with her precision attacks. She uses *Aim: Armor*, *Aim: Weapon*, and *Aim: Wallet* to destroy your gear, and *Aim: Weapon* is particularly dangerous since it permanently removes your weapon from battle. If her HP drops too low, she may use *Doom Archer*, dealing damage equal to her lost HP and also draining MP. To avoid this, either defeat her quickly or disable her before she can act.

Several magic users make up the rest of the Viera clan. The Elementalist uses a variety of Spirit Magic attacks that combine elemental damage with status effects. *Shining Air* deals Wind damage and causes Blind, *Evil Gaze* deals Dark damage and Confuses, *Heavy Dust* uses Earth damage and Immobilizes, and *Sliprain* inflicts Water damage and Slows its target. Unless you have a Status law active, expect her to cause serious disruption.

Behind her is a Red Mage capable of *Doublecast*, allowing her to cast two spells per turn. However, if you steal her Madu (Rapier), she’ll lose access to Doublecast entirely since she hasn’t mastered it yet. Even if she keeps it, her spells—*Fire*, *Thunder*, *Sleep*, and *Poison*—aren’t overly threatening. Take her down whenever convenient.

The Summoner can devastate clustered units. Her summons affect a large area—two tiles horizontally and vertically, plus one tile diagonally—so avoid grouping up. Her most dangerous summon is *Madeen*, which deals heavy Holy damage. Finally, the White Mage supports the group with *Curaga* for healing, *Esuna* to remove status effects, *Auto-Life* for revival, and *Shell* for protection.

It’s up to you how to handle the battle, but a strong approach is to defeat the Assassin first to prevent instant KOs, then target the White Mage to eliminate the enemy’s healing and revival options. After that, focus on the casters and ranged units as needed. If you want to have some fun, lure the enemies toward the northwest cliff—knocking them off deals heavy damage and makes for an easy cleanup.
`,
  },
  {
    number: 20,
    name: `Present Day`,
    description: `Security at the palace is tight as ever with the public audiences today. Come pay your respects to the prince and queen. ~ Bervenia Spokesman`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Bervenia Palace`,
    prerequisites: [
      `After placement of the Bervenia Palace symbol`,
    ],
    reward: [`25000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Templar`, `Alchemist`, `Gladiator x2`, `Biskmatar (Llednar)`],
    strategy: `After the tense encounter with Doned, Marche and Montblanc still manage to get Nono to craft a special gift in time for Present Day. As the two approach the palace, Montblanc reassures Marche that the palace likely won’t even recognize him. Confident, they proceed forward—Nono’s invention, the “Lugaborg,” should grant them entry without issue.

Inside the palace waiting room, Marche starts to complain about how long they’ve been waiting. Montblanc suggests that something might be wrong, and before long, their suspicions prove correct. A group of palace guards bursts through the door—it seems they’ve learned who you really are. The informant, of course, is none other than Doned.

This fight takes place in a very cramped arena, so positioning will be tricky for both sides. The lack of space makes area-based magic attacks extremely effective. A Summoner works wonders here—once the enemies group up, unleash *Madeen* or *Ifrit* to hit multiple targets at once. Just make sure you don’t crowd your own units, or you’ll pay for it.

Leading the charge is a Bangaa Templar, one of the toughest enemies on the field. He boasts high Weapon Attack and Defense, so disable him early if you can. Avoid physical attacks because of his *Bonecrusher* reaction, which counterattacks for 1.5× damage. His other skills include *Astra* (blocks the next status effect), *Warcry* (lowers nearby Speed), *Rasp* (MP damage), and *Haste*.

The two Gladiators hit hard as well. Their *Spellblade* attacks (Fire Sword, Bolt Sword, and Ice Sword) mix physical and elemental damage, while *Rush*, *Beatdown*, and *Blitz* round out their offense. Don’t engage them directly—*Strikeback* will nullify your attack and counter immediately. With Weapon Attack values in the mid-300s, that’s not something you want to risk.

The lone Moogle Mog Knight isn’t as dangerous but can still be a nuisance. He uses *Mog Attack*, *Mog Lance*, *Mog Rush*, *Mog Shield*, and *Mog Aid* to push, damage, and heal. Thankfully, he lacks Ultima Charge or a Reaction Ability, so he’s easier to handle.

The Alchemist is the only true caster here, and he’s the one to watch out for. *Death* can instantly KO a unit, but if he hasn’t mastered it, stealing his *Life Crosier* removes his access to it entirely. His other abilities include *Flare*, *Poison*, and *Toad*.

Because the battlefield is small, use radius-based attacks and magic to your advantage. The Templar will likely cast *Haste* on allies early, so prioritize disabling or silencing him. The three Bangaa enemies pose the biggest threat due to their high Weapon Attack, so eliminate them first. Once they’re gone, the rest of the fight is straightforward.

After defeating the guards, reinforcements arrive, and things seem hopeless—until Babus appears. Instead of attacking, he uses *Stop* on the guards, halting their advance. Confused, Marche asks why he’s helping, and Babus explains that he wants to understand what’s really happening with these two “worlds.”

Babus teleports Marche to the prince’s throne room, where Mewt paces nervously. When Babus brings Marche forward, Mewt is furious. Marche tries to reason with him, but it’s too late—Remedi appears, consoles her son, and teleports him away, leaving Marche behind.

Llednar reappears soon after, summoned to eliminate Marche. Babus offers to help, but Marche tells him to find Mewt and the Queen instead. You’ll face Llednar alone, and his damage barrier is still active—making him invincible. The goal here isn’t to win, but to survive five turns.

Llednar will likely act first. If your Speed is high—such as from leveling as a Thief or Ninja—you might get the opening turn. If not, hope he doesn’t use *Omega* immediately, as it will end the fight instantly. Keep your distance at all times, since *Omega* only works at close range.

If you survive the opening, move to the farthest possible spot to force Llednar into using *Abyss*, which deals damage and inflicts Poison—something easily cured with items. Continue running for five turns until Judgemaster Cid arrives to stop the fight, ending the encounter.
`,
  },
  {
    number: 21,
    name: `Hidden Vein`,
    description: `Most say the Tubola Cave mines were depleted during the 1st Mythril Rush, but my grandfather's will says otherwise. Please check! ~ Cruu, Mine Foreman`,
    type: `Engagement`,
    cost: `2800 Gil`,
    location: `Tubola Cave`,
    prerequisites: [
      `After placement of the Tubola Cave symbol`,
      `Seen Royal Vacation Gossip Cutscene`,
    ],
    reward: [`26200 Gil`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`White Monk`],
    strategy: `Now that mythril hunting is underway, it’s no surprise that Doned decides to interfere again. Marche enters Tubola Cave, pretending to be searching for mythril, when a voice suddenly echoes through the cavern—“Stop! Thief!” Confused, Marche looks around as a group of enemies confronts him, accusing him of stealing their mythril. It quickly becomes clear that Doned has sold him out once more. With no escape route, Marche has no choice but to fight.

When deploying your team, spread them out to cover both sides of the field—three units on each flank—since enemies will attack from both directions. The first to act is likely the Moogle Juggler, who wields one of the strongest knives in the game. You can easily neutralize him by stealing his weapon. Be cautious of *Dagger*, which damages and inflicts Disable, *Firebomb*, which causes Berserk and deals damage, and *Smile*, which grants an ally an immediate extra turn.

The Sage is the biggest magical threat. His *Giga Flare* spell is one of the most powerful in the game—second only to Ultima Blow—and can devastate multiple units if they’re grouped together. Keep your formation loose to minimize damage. On the same side, the Mog Knight relies mostly on defensive and support skills like *Mog Guard* for protection, *Mog Shield* to nullify a status ailment, *Mog Peek* to reveal hidden items, *Mog Rush* for high damage at low accuracy, and *Mog Aid* for healing.

To the west, a Bangaa White Monk leads the enemy charge. His *Earth Render* attack hits every unit in a straight line ahead, so avoid lining up your characters. He can also revive fallen allies with *Revive*. Supporting him is a Moogle Animist, whose *Tail Wag* can Charm targets and *Friend* produces random effects—some beneficial, some harmful. Rounding out the group is a Blue Mage, capable of several dangerous skills: *Twister* halves HP instantly, *Bad Breath* inflicts multiple status effects, *Roulette* randomly KOs a unit, and *White Wind* heals allies based on the user’s remaining HP.

Overall, this fight isn’t especially difficult, but the Sage and Blue Mage can cause trouble if ignored. To neutralize them, use Law Cards—ban *Color Magic* to cripple the Blue Mage, or ban *Skills* to prevent the Sage from using his Sagacity abilities. Once they’re disabled, the rest of the battle is straightforward. The real challenges, as Marche will soon learn, are still to come.
`,
  },
  {
    number: 22,
    name: `To Ambervale`,
    description: `Mewt and Remedi have gone to the Ambervale. Before you follow, come to the Deti Plains, I have a request to ask of you. ~ Judgemaster Cid`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Deti Plains`,
    prerequisites: [
      `After placement of the Deti Plains symbol`,
      `Seen Go To Deti Plains Cutscene`,
    ],
    reward: [`27000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Coeurl`],
    strategy: `On the road to the Deti Plains, Marche encounters a group of monsters blocking the path. You should know the drill by now—bring five more units alongside Marche and prepare for a fight. Before reaching Judgemaster Cid, you’ll have to deal with this monster threat first. Since this is a story mission, expect the enemies to be stronger than those in standard encounters, but nothing unmanageable if you stay focused.

The first enemy you’ll see is a Coeurl, standing ready near the front. Its main ability, *Blaster*, is dangerous because it can Petrify a unit from range. Keeping your distance doesn’t guarantee safety, so it’s best to eliminate the Coeurl early before it can act. Its regular attacks also hit hard, so removing it from the field will make moving forward much safer.

As you progress toward the bottom area near the waterfall, you’ll likely run into a Jawbreaker. These creatures love to slow you down, and their *LV3 Def-less* and *LV5 Death* abilities can be deadly if your units’ levels match those numbers. *LV3 Def-less* lowers both Defense and Resistance, while *LV5 Death* instantly KOs all affected units. Both have perfect accuracy when the condition is met, so check your levels before entering.

Moving west and climbing the steps to the higher level, you’ll encounter a Big Malboro. Its infamous *Bad Breath* attack can inflict multiple status ailments at once, while *Soundwave* removes your buffs. Above that area, a Lilith waits. Her *Twister* ability hits for heavy damage, *Poison Frog* both poisons and transforms a unit, and *Kiss* can inflict Doom or Charm—so keep your distance and take her down quickly.

It’s best to clear this mission in order, working from front to back. The monsters generally stay in their sections of the map, so advancing steadily will keep you from getting overwhelmed. Unless you have Galmia Shoes—which let you jump the cliff—you’ll have to take the winding path anyway. Finish the battle by defeating the Thundrake, who uses *Bolt Breath* and *Geomancy* for magic-based damage. By that point, if most of your team is still standing, it should go down easily and wrap up the fight.
`,
  },
  {
    number: 23,
    name: `Over The Hill`,
    description: `I want you to find me some amber in the Siena Gorge. Amber contains the power of the sun, essential in making the antilaw I need. ~ Judgemaster Cid`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Siena Gorge`,
    prerequisites: [
      `After placement of the Siena Gorge symbol`,
    ],
    reward: [`28600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Summoner`],
    strategy: `Our final stop before heading to Ambervale is Siena Gorge, where we need to collect amber for Judgemaster Cid so he can craft the next antilaw. As Marche enters the gorge, he spots a pink-haired girl standing proudly atop a high ridge—Ritz, with Shara by her side. With a hint of amusement, Ritz remarks that facing Marche in battle feels oddly fitting.

It’s a long-awaited confrontation. Ritz never wanted to return home, so this clash was inevitable. Marche realizes there’s no avoiding what’s about to happen: for this mission, the two are no longer allies. Bring five additional units and prepare for an emotional, challenging engagement.

This is your first real fight against Ritz’s clan, which is composed entirely of Viera. Her team has a strong balance between physical and magical units, so it’s smart to mirror that setup. At the start, advance up the hill but stop short of the wooden bridge—if you move too far, you’ll risk clogging the path and losing maneuverability. Hold your ground and let Ritz’s team close the distance.

The Assassin will likely move first. With 200 Speed and Ninja Tabi boosting her movement by six tiles, she can strike fast and far. Don’t let her get behind you—her *Last Breath* attack causes instant KOs. *Aphonia* Silences magic users, *Rockseal* Petrifies, and *Oblivion* inflicts Addle, disabling skill use. Neutralize her early before she can start picking your units off.

Next comes the Fencer, who isn’t too threatening. Her *Swallowtail* attack hits surrounding targets, *Piercethrough* stabs two units in a line, and *Nighthawk* provides a ranged strike. She’s manageable if you keep your defenses up.

The Summoner is much more dangerous. Her *Madeen* summon inflicts massive Holy damage over a wide radius—two tiles in every direction plus one diagonally—so never bunch your units together. Spread out and take her down before she gets too many casts off.

The Elementalist can also make things difficult with her status-inflicting elemental spells. *Fire Whip* damages and Disables, *Shining Air* deals Wind damage and causes Blind, and *Heavy Dust* delivers Earth damage and Immobilizes. *Elementalshift* is especially dangerous, as it alters elemental affinities and can leave your units weak to follow-up attacks.

Ritz’s right-hand fighter is a Sniper with powerful ranged attacks. Her *Death Sickle* causes Doom, *Doom Archer* inflicts damage based on lost HP, and *Aim: Weapon* or *Aim: Armor* permanently destroy your gear. If possible, use a Law Card to ban missile attacks entirely—otherwise, focus her down early to protect your equipment.

Finally, there’s Ritz herself, serving as a Red Mage. She won’t rely on physical attacks; instead, her *Doublecast* ability allows her to chain two spells per turn—*Fire*, *Thunder*, or *Blizzard*—with enhanced damage thanks to *Magic Pow+*. Watch for her “Sleep + Magic” combo, which can easily wipe out vulnerable units. Silencing her won’t help, as her *Ribbon* makes her immune to status ailments.

The goal here is simple: defeat Ritz. She starts near the front, so rushing her is a viable strategy. However, you might want to take the time to Steal some of the rare gear in this fight, including Max’s Oathbow, SeventhHeaven, and Ritz’s Femme Fatale—all excellent items worth acquiring.

When Ritz finally falls, the gorge will fall silent. The path to Ambervale—and your next step toward ending this world—now lies open.
`,
  },
  {
    number: 24,
    name: `Royal Valley`,
    description: `Thank you for waiting, Marche, I can leave for the Ambervale any time. Let's go as soon as you are ready.`,
    type: `Engagement`,
    cost: `0 Gil`,
    location: `Ambervale`,
    prerequisites: [
      `After placement of the Ambervale symbol`,
    ],
    reward: [`End of game`],
    difficulty: `Very Hard`,
    enemies: [`Ninja`, `Gunner`, `Alchemist`, `Illusionist`],
    strategy: `After overcoming countless challenges, Marche finally arrives at Ambervale, the Royal Valley. As he walks through the palace alongside Judgemaster Cid, he admires the beauty of the place. The peace doesn’t last long, though—up ahead, they find Babus lying unconscious. A familiar voice echoes through the hall, revealing that he’s not dead… yet. It’s Llednar.

Llednar stands in their way once again, ready for battle. Cid immediately uses a special Law Card to cancel the laws protecting him, shattering his barrier and making him vulnerable for the first time. This time, there’s no running—Marche has to defeat him. You can bring three additional units, and it’s smart to include a White Mage for healing support.

Llednar’s team includes a Ninja, Gunner, Assassin, Alchemist, and Illusionist. The Ninja is the biggest threat with Double Sword, striking twice with powerful Katanas. He also uses elemental Veils—Fire, Earth, and Water—to cause Confusion, Slow, and Silence. Oblivion can Addle a unit, preventing it from using any actions. The Gunner can inflict Charm, Blind, Silence, or Stop, but he’s not too dangerous since he lacks Concentrate. The Assassin can still be troublesome with Nightmare and Rockseal but doesn’t have Last Breath, making her easier to handle.

The Alchemist can instantly KO with Death or cause major damage with Flare and Toad, which turns units into frogs. The Illusionist attacks everyone at once using Phantasm Magic like Prominence, Tempest, Stardust, Soil Evidence, and Wild Tornado—all dealing elemental damage to every unit on the field.

Now that Llednar can actually be hurt, the real challenge begins. He carries Excalibur and wears the rare Peytral armor. His attacks are devastating—Omega can instantly wipe out a unit, Life Render inflicts Doom, and Furycircle damages and pushes back surrounding units. Focus your efforts on surviving his heavy hits and striking him hard between turns. Once Llednar is defeated, he finally falls for good.

After the fight, Babus wakes up. Marche helps him up, but Babus is too weak to continue and stays behind as Marche and Cid head deeper into the palace. Inside, they find Queen Remedi, who reminds Marche that this world is still an illusion. Marche admits that he likes this world but knows it isn’t real. Suddenly, Mewt’s voice rings out, and he appears in the statue’s hand, unwilling to leave.

Remedi transforms into her Battle Queen form, summoning two Dephs—Famfrit and Adrammelech—to fight for her. The recreated Famfrit uses Breath of God for massive damage, Lightspeed to bypass reactions, and Demi to cut HP in half. Adrammelech uses Firestream to scorch everything in front of him, Howl of Rage to lower Speed, and hard-hitting physical attacks that can drop units quickly.

Remedi herself is physically strong but has no special abilities in this form. Focus on defeating Famfrit and Adrammelech first, then turn all your attacks on her. When she falls, it seems the fight is finally over—but it’s not.

Queen Remedi rises again, revealing her true self—Li-Grim, the embodiment of the world’s illusion. She summons two Mateuses to aid her in the final battle. The Mateuses use Spellbind to Slow and damage, Breath of God for massive area damage, Star Cross for Holy attacks, and Thundaga for powerful lightning strikes.

Li-Grim herself uses unpredictable abilities. Lawshift changes the laws mid-battle, Amber Gleam dispels your buffs, and Ricca attacks with both Omega and Alpha, the latter being even stronger. She can also summon random Totema with Descent or unleash Magi for extreme damage.

To win, focus all your attacks on Li-Grim. The Mateuses are dangerous, but wasting time on them gives her more chances to use Omega and Alpha. This final fight is about endurance and strength. Defeat Li-Grim—and the illusionary world will finally dissolve.
`,
  },
  {
    number: 25,
    name: `Wanted!`,
    description: `This Month's Wanted! Black Mage Dolce: 4600 Gil [] Dangerous magic use [] Eating and running [] Assorted misdemeanors [] Last spotted in forest`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Nubswood`,
    prerequisites: ["Kingmoon only"],
    reward: [`4600 Gil`, `Flower Vase`, `1x Random Item`],
    difficulty: `Medium`,
    enemies: [`White Monk`, `Soldier`, `White Mage`, `Black Mage (Dolce)`],
  },
  {
    number: 26,
    name: `Wanted!`,
    description: `This Month's Wanted! Gabbana Brothers: 13600 Gil [] Thief (4 counts) [] Rosiotti slaying [] Always together [] Target desert travelers`,
    type: `Engagement`,
    cost: `1800il`,
    location: `Jeraw Sands`,
    reward: [`13600 Gil`, `2x Random Item`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Thief`, `Time Mage`, `White Monk`],
  },
  {
    number: 27,
    name: `Wanted!`,
    description: `This Month's Wanted! Diaghilev Godeye: 2800 Gil [] Using alchemy to make counterfeit Gil [] Rumored to have a third eye.`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Giza Plains`,
    prerequisites: [
      "Madmoon only",
    ],
    reward: [`2800 Gil`, `1x Random Item`],
    difficulty: `Medium`,
    enemies: [`Archer`, `Thief`, `Gladiator`, `Alchemist (Diaghilev)`],
  },
  {
    number: 28,
    name: `Wanted!`,
    description: `This Month's Wanted! Swampking Kanan: 18000 Gil [] Ex-palace guard (AWOL) [] Raiding local towns from a camp in the Uladon Bog`,
    type: `Engagement`,
    cost: `2200 Gil`,
    location: `Uladon Bog`,
    prerequisites: ["Sagemoon only"],
    reward: [`18000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Archer`, `Bishop`, `Summoner`, `Templar (Kenan)`],
  },
  {
    number: 29,
    name: `Wanted!`,
    description: `This Month's Wanted! Killer Rayne: 45000 Gil [] Fearsome female assassin [] Said to know all the skills of her trade [] Hiding in Jagd Helje`,
    type: `Engagement`,
    cost: `4800 Gil`,
    location: `Jagd Helje`,
    prerequisites: [
      "Completed Den of Evil (#064)",
      "Huntmoon only"
    ],
    reward: [
      `45000 Gil`,
      `Secret Item (Zanmato)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Gunner`],
  },
  {
    number: 30,
    name: `Wanted!`,
    description: `This Month's Wanted! Dark Duke Lodion: 22600 Gil [Warning: Very Dangerous] [] Powerful magic [] Numerous followers [] Active in Jagd Alhi`,
    type: `Engagement`,
    cost: `2700 Gil`,
    location: `Jagd Alhi`,
    prerequisites: [
      "Completed Wanted! (#025)",
      "Completed Exploration (#065)",
      "Kingmoon only"
    ],
    reward: [`22600 Gil`, `Onlyone`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Archer`, `Fighter`, `Gladiator`, `Illusionist (Lodion)`],
  },
  {
    number: 31,
    name: `Ruby Red`,
    description: `Our family heirloom, the fiery ruby known as the "Dragon's Eye," has been stolen. Please retrieve. ~ Viscount Rashie`,
    type: `Engagement`,
    cost: `3300 Gil`,
    location: `Baguba Port`,
    prerequisites: [
      "Completed Wyrms Awaken (#102)",
    ],
    reward: [`16000 Gil`, `Wyrmstone`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Archer`, `Hunter`, `Icedrake`],
  },
  {
    number: 32,
    name: `Tower Ruins`,
    description: `Gaol, the knight of the amber eyes, was out with the moogle Lini when they heard tales of a red-armed fiend in the Koringwood. ~ "The Hero Gaol," Chapter 1`,
    type: `Engagement`,
    cost: `2000 Gil`,
    location: `Koringwood`,
    prerequisites: ["Obtained The Hero Gaol"],
    reward: [`0 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Bomb`, `Goblin`, `Icedrake`],
  },
  {
    number: 33,
    name: `Battle In Aisen`,
    description: `Gaol, himself one of the Aisen 13, was adventuring with Lini the moogle when they heard that Aisen Keep had been attacked! ~ "The Hero Gaol," Chapter 2`,
    type: `Engagement`,
    cost: `2000 Gil`,
    location: `Aisenfield`,
    prerequisites: [
      "Completed Tower Ruins (#032)",
    ],
    reward: [`0 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Fighter`, `Archer x2`],
  },
  {
    number: 34,
    name: `Magewyrm`,
    description: `Gaol, wielder of the twin sword "Ayvuir," was out with Lini the moogle when they were asked to drive a magewyrm out of Delia. ~ "Ther Hero Gaol," Chapter 3`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Eluut Sands`,
    prerequisites: [
      "Completed Battle In Aisen (#033)",
    ],
    reward: [`0 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Bomb`, `Antlion`, `Icedrake`, `Red Panther`],
  },
  {
    number: 35,
    name: `Salika Keep`,
    description: `Gaol, lover of the moon maiden Evelyn, was out with Lini the moogle when the keeplord of Salika invited them... to die! ~ "The Hero Gaol," Chapter 4`,
    type: `Engagement`,
    cost: `1700 Gil`,
    location: `Salikawood`,
    prerequisites: [
      "Completed Magewyrm (#034)",
    ],
    reward: [`0 Gil`, `Ayvuir Red`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Time Mage`, `White Mage`, `Defender x2`],
  },
  {
    number: 36,
    name: `Twin Swords`,
    description: `Seeing Gaol die horribly before his very eyes, Lini too his sword into the Eluut Sands to await the one worthy to wield it. ~ "The Hero Gaol," Epilogue`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Eluut Sands`,
    prerequisites: ["Completed Village Hunt (#037)", "Obtained The Hero Gaol"],
    reward: [
      `0 Gil`,
      `Ayvuir Blue`,
      `1x Random Item`,
      `Req. Skills: Combat/Lvl.10`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Gunner`, `Time Mage`, `Black Mage`, `Mog Knight x2`],
  },
  {
    number: 37,
    name: `Village Hunt`,
    description: `Participants wanted for a survey of the Eluut Sands. We will cross Antlion nests to find a legendary Moogle's hidden village. ~ Barba, Junior Researcher`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Eluut Sands`,
    reward: [`4200 Gil`, `1x Random Item`],
    difficulty: `Medium`,
    enemies: [`Coeurl`, `Goblin`, `Antlion x3`],
  },
  {
    number: 38,
    name: `Fire! Fire!`,
    description: `[Breaking News] Fire on Grasgreen Street! Need help to quence the spreading blaze. ~ Cyril Fire Chief`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Cyril`,
    reward: [
      `3600 Gil`,
      `Sprinkler`,
      `1x Random Item`,
    ],
    difficulty: `Medium`,
    enemies: [`Bomb x4`],
  },
  {
    number: 39,
    name: `The Wanderer`,
    description: `The body of a viera was found last night with several knife wounds. Anyone with information should contact us. ~ Meiral, Palace Guard`,
    type: `Engagement`,
    cost: `2400 Gil`,
    location: `Muscadet`,
    prerequisites: ["Muscadet Pub only"],
    reward: [`11400 Gil`, `Tonberrian`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Tonberry x2`],
  },
  {
    number: 40,
    name: `Battle Tourney`,
    description: `Battle tourney to be held at Bervenia Palace! Who will gain the honor of victory? [Note] Special laws will be in effect. ~ Bervenia Events Office`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Bervenia Palace`,
    prerequisites: ["Kingmoon only"],
    reward: [
      `7000 Gil`,
      `Sequence`,
      `1x Random Item`,
      `Secret Item (1x Random`,
      `Card)`,
    ],
    difficulty: `Medium`,
    enemies: [`Defender`, `Illusionist`],
  },
  {
    number: 41,
    name: `Mage Tourney`,
    description: `Mage tourney to be held at Bervenia Palace! Join in the battle for magical supremacy! [Note] Special laws will be in effect.`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Bervenia Palace`,
    prerequisites: ["Madmoon only"],
    reward: [
      `7000 Gil`,
      `Sapere Aude`,
      `1x Random Item`,
      `Secret Item (1x`,
      `Random Card)`,
    ],
    difficulty: `Medium`,
    enemies: [`White Mage`, `Black Mage`],
  },
  {
    number: 42,
    name: `Swimming Meet`,
    description: `Swimming tourney to be held at Bervenia Palace! Who will be the speediest in Ivalice? [Note] Special laws will be in effect. ~ Bervenia Events Office`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Bervenia Palace`,
    prerequisites: ["Huntmoon only"],
    reward: [
      `7000 Gil`,
      `Acadia Hat`,
      `1x Random Item`,
      `Secret Item (1x`,
      `Random Card)`,
    ],
    difficulty: `Medium`,
    enemies: [`Archer`, `Gladiator`, `White Mage`],
  },
  {
    number: 43,
    name: `Clan League`,
    description: `Clan League finals to be held in the Bervenia Palace courtyard! See the favorites, the Brown Rabbits, go agains Clan [Your Clan Name]. [Special laws in effect.] ~ Bervenia Events Office`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Bervenia Palace`,
    prerequisites: [
      "Completed White Kupos [League]",
    ],
    reward: [
      `22600 Gil`,
      `Peytral`,
      `1x Random Item`,
      `1x Random Card`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Summoner`],
  },
  {
    number: 44,
    name: `Snow in Lutia`,
    description: `Would you please take my children to play in the snow on Lutia Pass? I'll make you lunch! Please watch out for monsters. ~ Auntie Larsu`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Lutia Pass`,
    reward: [`3600 Gil`, `1x Random Item`],
    difficulty: `Slightly Hard`,
    enemies: [`Goblin`, `Red Panther x2`],
  },
  {
    number: 45,
    name: `Frosty Mage`,
    description: `I saw a bad wizard doing something up in the snow mountains. He's up to no good, I know it! He was making all this ice! ~ Laudy, Shopkeeper's Son`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Lutia Pass`,
    prerequisites: [
      "Completed Snow in Lutia (#044)",
    ],
    reward: [`4000 Gil`, `2x Random Items`],
    difficulty: `Slightly Hard`,
    enemies: [`Floateye`, `Red Panther x2`, `Black Mage (Gelato)`],
  },
  {
    number: 46,
    name: `Prof in Trouble`,
    description: `Please find Prefessor Auggie. He's been gone to the Lutia Pass for three days now. Maybe he's lost, or buried in an avalanche! ~ Dag, Research Assistant`,
    type: `Engagement`,
    cost: `900 Gil`,
    location: `Lutia Pass`,
    prerequisites: [
      "Completed Snow in Lutia (#044)",
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Ice Flan x2`, `Zombie x2 (Colin`],
  },
  {
    number: 47,
    name: `Hot Recipe`,
    description: `I need to make a super hot dish to compete with the restaurant across the street! Please get the "stuff" at Roda Volcano. ~ Rolana, The Chocobo's Kweh`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Roda Volcano`,
    reward: [
      `7000 Gil`,
      `Gedegg Soup`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Bomb x3`, `Firewyrm x2`],
  },
  {
    number: 48,
    name: `S.O.S.`,
    description: `Emergency flares in the pattern green-red-green were spotted over the Koringwood. Clan Ritz is in trouble! Please assist. ~ Clan Center`,
    type: `Engagement`,
    cost: `1500 Gil`,
    location: `Koringwood`,
    reward: [
      `7800 Gil`,
      `Secret Item (Topaz Armring)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
      `Req. Skills: Tracking/Lvl.7`,
    ],
    difficulty: `Easy`,
    enemies: [`Sprite x2`, `Zombie x2`],
  },
  {
    number: 49,
    name: `A Lost Ring`,
    description: `I dropped my ring in the Ulei River! It was a gift from by beau... Please find it before he finds out I lost it! ~ Clea, the Ice Cream Man's Girl`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Ulei River`,
    difficulty: `Medium`,
    enemies: [`Goblin`, `Sprite`, `Lamia x2`],
  },
  {
    number: 50,
    name: `Staring Eyes`,
    description: `I found out who's got the Ahriman eye, and he's a real bad egg. Seem he's making the Ahriman chase after girls in Cyril. ~ Bran, Streetear`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Cyril`,
    prerequisites: [
      "Completed Watching You (#113)",
    ],
    reward: [
      `4600 Gil`,
      `Vesper`,
      `1x Random Item`,
    ],
    difficulty: `Easy`,
    enemies: [`Floateye x2`, `Ahriman`],
  },
  {
    number: 51,
    name: `Desert Rose`,
    description: `Three days' walk into the Gotor Sands I found a beautiful rose by an oasis. Yet it soon wilted... If only I'd had a vase. ~ Delman, Pub Customer`,
    type: `Engagement`,
    cost: `1800 Gil`,
    location: `Gotor Sands`,
    reward: [
      `0 Gil`,
      `Blue Rose`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Sprite`, `Antlion x2`, `Red Panther x2`],
  },
  {
    number: 52,
    name: `Friend Trouble`,
    description: `Arr, them mountain beasts have been coming down to the lowlands of late, and one took a bite out of me! Find me a good hunter! ~ Cheney, Hunter`,
    type: `Engagement`,
    cost: `1800 Gil`,
    location: `Kudik Peaks`,
    reward: [
      `9000 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Easy`,
    enemies: [`Cream`, `Coeurl`, `Red Panther x3`, `a Cream`, `and a Coeurl`],
  },
  {
    number: 53,
    name: `Flesh & Bones`,
    description: `There's a shop called the "Flesh & Bones" that buys poachers' catches at good prices. Just say you're on street patrol and drop in. ~ Gayle, Baguba Streetear`,
    type: `Engagement`,
    cost: `3600 Gil`,
    location: `Baguba Port`,
    prerequisites: [
      "Completed Smuggle Bust (#105)",
    ],
    reward: [
      `18000 Gil`,
      `Tiger Hide`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Gunner`, `Archer`, `Thief x2`, `Hunter x2`],
  },
  {
    number: 54,
    name: `For A Song`,
    description: `There's a song I wish to sing to an old friend. Can you come find her with me? She lives in the Materiwood. ~ Leanan, Inn Songstress`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Materiwood`,
    reward: [
      `16000 Gil`,
      `Trichord`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Sprite`, `Red Panther`],
  },
  {
    number: 55,
    name: `White Flowers`,
    description: `Please bring me some of the flowers I planted on the Giza Plains. They're the only way to cheer my sister up since mom died. ~ Temil, Town Youth`,
    type: `Engagement`,
    cost: `200 Gil`,
    location: `Giza Plains`,
    reward: [
      `1600 Gil`,
      `White Flowers`,
      `1x Random Item`,
    ],
    difficulty: `Easy`,
    enemies: [`Antlion x3`, `Goblin`, `Red Cap`],
  },
  {
    number: 56,
    name: `New Antilaw`,
    description: `Inspiration has struck! Fetch me some amber from the Siena Gorge -- I'll need it to make my new, super-powerful antilaw! ~ Ezel`,
    type: `Engagement`,
    cost: `5000 Gil`,
    location: `Siena Gorge`,
    prerequisites: [
      "Gossip with Ezel at Cadoan Card Keeper.",
    ],
    reward: [`34000 Gil`, `Amber`, `1x Random Item`, `Allmighty Card`],
    difficulty: `Slightly Hard`,
    enemies: [`Ninja`, `Gunner`, `Defender`, `Time Mage`],
  },
  {
    number: 57,
    name: `Prison Break`,
    description: `Help me break out of prison, just for one day, please! All I have to do is deliver a birthday present to my wife! ~ Julian, Troubled Inmate`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Sprohm`,
    reward: [
      `7000 Gil`,
      `Secret Item (Helje Key)`,
      `1x Random Item`,
      `1x`,
      `Random Card`,
    ],
    difficulty: `Medium`,
    enemies: [`Templar x2`, `Defender x2`],
  },
  {
    number: 58,
    name: `Royal Ruins`,
    description: `There are some ruins in Nargai Cave that date from when golden gil was still in currency! Just think, what if some is left? ~ Meena, Streetear Courier`,
    type: `Engagement`,
    cost: `1500 Gil`,
    location: `Nargai Cave`,
    prerequisites: [
      "Completed Golden Gil (#114)",
    ],
    reward: [
      `7000 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Lamia`, `Odd Statue x2`],
  },
  {
    number: 59,
    name: `Sketchy Thief`,
    description: `We were playing on the Deti Plains, and some weirdo took Laudy's favorite sketchbook! Please get it back! ~ Estia, Friend of Laudy`,
    type: `Engagement`,
    cost: `2400 Gil`,
    location: `Deti Plains`,
    reward: [
      `18000 Gil`,
      `Sketchbook`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Archer`, `Thief x2`],
  },
  {
    number: 60,
    name: `Showdown!`,
    description: `The showdown with the Gertai Band is upon us! Date: 10 days from now. Place: Ozmon. Looking for a few good soldiers! ~ Roodog, Bardo Band Head`,
    type: `Engagement`,
    cost: `4000 Gil`,
    location: `Ozmonfield`,
    prerequisites: ["Completed A Dragon (#066)"],
    reward: [
      `36000 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Summoner`, `Alchemist`],
  },
  {
    number: 61,
    name: `Hit Again`,
    description: `They got me again, kupo... And they went running off to Jagd Dorsa again, too, kupo... I give up, kupo... ~ Nono, Once Again`,
    type: `Engagement`,
    cost: `900 Gil`,
    location: `Jagd Dorsa`,
    reward: [`7000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Thief`, `Ninja`, `Gunner`, `Black Mage`],
  },
  {
    number: 62,
    name: `Oasis Frogs`,
    description: `I haven't been hearing the frogs from the town oasis lately. Hope nobody is eating them! Would you stand watch till night? ~ Donya, Pub Customer`,
    type: `Engagement`,
    cost: `900 Gil`,
    location: `Cadoan`,
    reward: [`4600 Gil`, `Secret Item (The Hero Gaol)`, `1x Random Item`],
    difficulty: `Medium`,
    enemies: [`Lamia x3`],
  },
  {
    number: 63,
    name: `Missing Prof`,
    description: `Help! Professor Auggie has gome missing during his investigation of the cave at Tubola! He was last seen near a statue. ~ Quin, Search Party Member`,
    type: `Engagement`,
    cost: `2400 Gil`,
    location: `Gotor Sands`,
    prerequisites: [
      "Completed Prof In Trouble (#046)",
    ],
    reward: [
      `18000 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Bomb`, `Ahriman`, `Odd Statue x2`],
  },
  {
    number: 64,
    name: `Den of Evil`,
    description: `There's a place free of laws beyond Tubola Cave, but you need a pass to get in. Paradise or Purgatory? You find out! ~ Da'aye, Streetear`,
    type: `Engagement`,
    cost: `2400 Gil`,
    location: `Tubola Cave`,
    reward: [
      `22600 Gil`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Bishop`, `Time Mage`, `White Mage`, `Black Mage`],
  },
  {
    number: 65,
    name: `Exploration`,
    description: `[] Exploration Tour Want to travel to unspoilt wilderness where not even desert dwellers fare? Just 1,000 at the pub! ~ Ivalice Tourism Board`,
    type: `Engagement`,
    cost: `900 Gil`,
    location: `Gotor Sands`,
    reward: [`0 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Coeurl`, `Ice Flan`, `Coeurl`, `an Ice Flan`],
  },
  {
    number: 66,
    name: `A Dragon's Aid`,
    description: `A dragon is attacking Baguba, and only the Delia Wyrms can stop it! They'll talk to me if I bring them the Wyrmstone! ~ Kita, Baguba Watch Chief`,
    type: `Engagement`,
    cost: `6300 Gil`,
    location: `Cyril`,
    prerequisites: [
      "Completed Wyrms Awaken (#102)",
    ],
    reward: [
      `31600 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Icedrake`, `Dragoon x2`],
  },
  {
    number: 67,
    name: `Missing Meow`,
    description: `Please find my pet. His name is "meow" because he goes "meow meow." He likes rabbit tails. Thank you! ~ Amelie, Owner of Meow`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Deti Plains`,
    prerequisites: [
      "Completed Lucky Charm (#191)",
      
    ],
    reward: [
      `27000 Gil`,
      `Ally Finder2`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Coeurl (Meow)`],
  },
  {
    number: 68,
    name: `Fowl Thief`,
    description: `A thief has been coming in the night and stealing our chickens! Please, catch him for us! ~ Kariena, Little Girl`,
    type: `Engagement`,
    cost: `600 Gil`,
    location: `Cyril`,
    reward: [`3600 Gil`, `2x Random Items`],
    difficulty: `Medium`,
    enemies: [`Thief (Dabarosa)`],
  },
  {
    number: 69,
    name: `Free Sprohm!`,
    description: `One of the Borzoi Capos is in the mountain town of Sprohm! Keep an eye on him until we and the Sprohm Watch are ready! ~ Cyril Town Watch`,
    type: `Capture`,
    cost: `400 Gil`,
    location: `Sprohm`,
    prerequisites: [
      "Read Thief Exposed",
    ],
    reward: [`2400 Gil`, `2x Random Items`],
    difficulty: `Medium`,
    enemies: [`White Mage`, `Thief (Warose)`],
  },
  {
    number: 70,
    name: `Raven's Oath`,
    description: `Think you can push Clan Borzoi and its allies around? Next time, you face me: Dread Raven! ~ Raven, Borzoi Capo`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Giza Plains`,
    prerequisites: [
      "Read Area Freed!",
    ],
    reward: [`6400 Gil`, `2x Random Items`],
    difficulty: `Slightly Hard`,
    enemies: [`Black Mage`],
  },
  {
    number: 71,
    name: `Nubswood Base`,
    description: `We've discovered a Borzoi Base in the Nubswood. Help us root this evil out of our lands forever! ~ Sprohm Town Watch`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Nubswood`,
    prerequisites: ["Read Borzoi's Plan"],
    reward: [`7000 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [
      `White Mage (Batalise)`,
      `Black Mage (Golitaire)`,
      `a Black Mage`,
    ],
  },
  {
    number: 72,
    name: `Lutia Mop-up`,
    description: `We found another nest of those Borzoi worms in Lutia Pass! We've got four of their capos already, only three to go! ~ Sprohm Town Watch`,
    type: `Engagement`,
    cost: `800 Gil`,
    location: `Lutia Pass`,
    prerequisites: [
      "Sprohm Pub only",
      "Completed Nubswood Base (#071)",
    ],
    reward: [
      `6000 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Hard`,
    enemies: [`Black Mage`, `Time Mage (Steraiz)`],
  },
  {
    number: 73,
    name: `Borzoi Falling`,
    description: `The Clan Borzoi boss, Gukko, has turned up in Cyril, and he plans on escaping overseas. Now's our chance to get him! ~ Cyril Town Watch`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Cyril`,
    prerequisites: [
      "Completed Lutia Mop-up.", "Cyril Pub only",
    ],
    reward: [
      `7200 Gil`,
      `Secret Item (Shijin Shield)`,
      `2x Random Cards`,
      `Req. Skills: Combat/Lvl. 12`,
    ],
    difficulty: `Hard`,
    enemies: [`White Monk`, `White Mage`, `Fighter (Gukko)`],
  },
  {
    number: 74,
    name: `Cadoan Watch`,
    description: `There's a bomb infestation near the town of Cadoan! Please help us drive them back before Cadoan burns to the ground! ~ Cadoan Town Watch`,
    type: `Engagement`,
    cost: `1500 Gil`,
    location: `Cadoan`,
    prerequisites: [
      "Read Foreign Ship",
      "Read Crime Ring",
      "Cadoan Pub only",
    ],
    reward: [`8200 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Easy`,
    enemies: [`Bomb x4`, `Bomb`],
  },
  {
    number: 75,
    name: `Free Cadoan!`,
    description: `The Redwings have reared their ugly head in Cyril. Help us and the Sprohm Town Watch drive them out! ~ Cadoan Town Watch`,
    type: `Capture`,
    cost: `600 Gil`,
    location: `Cyril`,
    prerequisites: [
      "Completed Cadoan Watch (#074)",
      "Read The Redwings",
    ],
    reward: [`2400 Gil`, `Secret Item (Red Robe)`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Mog Knight x2`],
  },
  {
    number: 76,
    name: `Fire Sigil`,
    description: `Marilith Serpent, Falgabird of fire and brimstone, has been seen at Roda Volcano. Your duty is clear! Godspeed. ~ The Mysterious Minstrel `,
    type: `Engagement`,
    cost: `1200 Gil`,
    location: `Roda Volcano`,
    prerequisites: [
      "Read Falgabird",
    ],
    reward: [
      `4600 Gil`,
      `Fire Sigil`,
      `Secret Item (Random Item)`,
      `2x Random`,
      `Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Mog Knight x3`, `Lamia (Marilis)`],
  },
  {
    number: 77,
    name: `Free Baguba!`,
    description: `Redwings calling themselves the "Magus Sisters" have turned up in Baguba. Help us fight this new menace to our people! ~ Baguba Town Watch`,
    type: `Capture`,
    cost: `600 Gil`,
    location: `Baguba Port`,
    prerequisites: [
      "Read The Spiritstone",
    ],
    reward: [
      `2400 Gil`,
      `Secret Item (Delta Fang)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Naga x3`],
  },
  {
    number: 78,
    name: `Water Sigil`,
    description: `Kraken Bolum, Falgabird of wave and water, has been seen at Nargai Cave. Your duty is clear! Godspeed. ~ The Mysterious Minstrel`,
    type: `Engagement`,
    cost: `1200 Gil`,
    location: `Nargai Cave`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `18000 Gil`,
      `Water Sigil`,
      `Secret Item (Random Item)`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Mog Knight x3`, `Ice Flan (Kraken)`, `Flan`],
  },
  {
    number: 79,
    name: `Wind Sigil`,
    description: `Tiamat Dragoa, Falgabird of wind and storm, was seen in the Koringwood. Your duty is clear! Godspeed. ~ The Mysterious Minstrel`,
    type: `Engagement`,
    cost: `1200 Gil`,
    location: `Koringwood`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `18000 Gil`,
      `Wind Sigil`,
      `Secret Item (Random Item)`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Mog Knight x3`],
  },
  {
    number: 80,
    name: `Earth Sigil`,
    description: `Lich De Mort, Falgabird of earth and stone, has been seen at Aisen Plains. Your duty is clear! Godspeed. ~ The Mysterious Minstrel`,
    type: `Engagement`,
    cost: `1200 Gil`,
    location: `Aisenfield`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `18000 Gil`,
      `Earth Sigil`,
      `Secret Item (Random Item)`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Hard`,
    enemies: [`Mog Knight x3`],
  },
  {
    number: 81,
    name: `The Redwings`,
    description: `The Redwings base has been found in the Salikawood. Dark Knight Grissom, the Redwings boss is there. Godspeed. ~ The Mysterious Minstrel `,
    type: `Engagement`,
    cost: `4000 Gil`,
    location: `Salikawood`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `22600 Gil`,
      `Secret Item (Reaper Cloak)`,
      `2x Random Cards`,
    ],
    difficulty: `Hard`,
    enemies: [`Defender x2`, `Mog Knight x2`],
  },
  {
    number: 82,
    name: `Free Muscadet!`,
    description: `Some Clan Borzoi leftovers have turned up in the town of Muscadet. Help us beat some sense into them! ~ Muscadet Town Watch`,
    type: `Capture`,
    cost: `600 Gil`,
    location: `Muscadet`,
    prerequisites: [
      "Read Weird Minstrel",
    ],
    reward: [`2400 Gil`, `Secret Item (Hanya Helm)`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
    enemies: [`Assassin x2 (Celia`],
  },
  {
    number: 83,
    name: `Foreign Fiend`,
    description: `A giant snake is attacking our traveling merchants! We can't make our rounds like this. Someone please stop that thing! ~ Davoi, Merchant`,
    type: `Engagement`,
    cost: `2000 Gil`,
    location: `Ulei River`,
    prerequisites: [
      "Completed Free Muscadet! (#082)",
      "Read Foreign Fiends",
    ],
    reward: [`18000 Gil`, `2x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
  },
  {
    number: 84,
    name: `Foreign Fiend`,
    description: `A bizarre turtle-like monster is attacking the town! Somebody stop it! ~ Crusoi Inn`,
    type: `Engagement`,
    cost: `2000 Gil`,
    location: `Baguba Port`,
    prerequisites: [
      "Completed Foreign Fiend (#083)",
    ],
    reward: [`20400 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Medium`,
  },
  {
    number: 85,
    name: `Foreign Fiend`,
    description: `A plant monster is attacking people, and the body count is rising! We need a weeder, quick! ~ Bokum, Townsperson`,
    type: `Engagement`,
    cost: `2500 Gil`,
    location: `Uladon Bog`,
    prerequisites: [
      "Completed Foreign Fiend (#084)",
    ],
    reward: [`22600 Gil`, `2x Random Items`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
  },
  {
    number: 86,
    name: `Last Stand`,
    description: `I sense... a life-force possessing unfathomable magic powers! It would be folly to let it roam wild. Kill it! Kill it! ~ Shaton, Diviner`,
    type: `Engagement`,
    cost: `4000 Gil`,
    location: `Nubswood`,
    prerequisites: [
      "Completed Foreign Fiend (#085)",
    ],
    reward: [
      `34000 Gil`,
      `Secret Item (Dread Soul)`,
      `Secret Item (Judge`,
      `Coat)`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
  },
  {
    number: 87,
    name: `Free Bervenia!`,
    description: `Gukko is back in Cyril and planning to attack the palace with his newfound magical powers. Calling every town watch to arms! ~ Cyril Town Watch`,
    type: `Capture`,
    cost: `400 Gil`,
    location: `Bervenia Palace`,
    prerequisites: [
      "Freed all areas",
      
      "Read Gukko",
    ],
    reward: [`2400 Gil`, `Rukavi Soul`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Apanda x2`, `Archademon x2`],
  },
  {
    number: 88,
    name: `The Worldwyrm`,
    description: `The ley lines that run through Ivalice have gone awry -- the World Wyrm, Ogma is come again! Defeat him or Ivalice is doomed! ~ Jemingo, Geomancer`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Roda Volcano`,
    reward: [`22600 Gil`, `Ogma's Seal`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Slightly Hard`,
  },
  {
    number: 89,
    name: `Moogle Bride`,
    description: `My dearest Montblanc, I think of you always. If we could meet, I would much like to tell you how I feel in person. ~ Mogumi, Townsgirl`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Materiwood`,
    prerequisites: ["Completed The Worldwyrm (#088)",],
    reward: [`18000 Gil`, `Esteroth`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Thief`, `Time Mage`, `Black Mage`],
  },
  {
    number: 90,
    name: `Clan Law`,
    description: `We clans were made to steal work, to gain turf, were we not? All you fat and lazy clans, get ready for a rude awakening! ~ Secret Clan Coalition`,
    type: `Engagement`,
    cost: `2000 Gil`,
    location: `Ozmonfield`,
    prerequisites: ["Completed Moogle Bride (#089)"],
    reward: [`13600 Gil`, `Master Brave`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Medium`,
  },
  {
    number: 91,
    name: `Challengers?`,
    description: `A swordsman from afar has come looking to challenge our strongest warrior. One look at the guy was enough to send me running! ~ Hulick, Swordsman`,
    type: `Engagement`,
    cost: `2400 Gil`,
    location: `Delia Dunes`,
    prerequisites: [
      "Completed Down To Earth (#152)",
    ],
    reward: [`18000 Gil`, `Chirijiraden`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Fighter`, `Fighter might win`],
  },
  {
    number: 92,
    name: `Cursed Bride`,
    description: `Save my son! He's been odd ever since he married that girl, and the other day I saw her turn into a snake and bite him! ~ Marcello, Merchant Recluse`,
    type: `Engagement`,
    cost: `1000 Gil`,
    location: `Eluut Sands`,
    prerequisites: [
      "Completed Pirates Ahoy (#124)",
    ],
    reward: [
      `8200 Gil`,
      `Secret Item (Last Letter)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Medium`,
  },
  {
    number: 93,
    name: `Flan Breakout!`,
    description: `There's been an outbreak of flan near our logging site! They'll eat all the trees, and we'll be out of a job! Help! ~ Dals, Lumberjack`,
    type: `Engagement`,
    cost: `1700 Gil`,
    location: `Salikawood`,
    reward: [`13600 Gil`, `Heretic Rod`, `2x Random Cards`],
    difficulty: `Medium`,
    enemies: [`Jelly x2`, `Ice Flan x2`],
  },
  {
    number: 94,
    name: `Sorry, Friend`,
    description: `We learned a summoning spell at school, but when I tried it at home, I couldn't get the monster to leave! Help me! ~ Orvis, Mage School Junior`,
    type: `Encounter`,
    cost: `1500 Gil`,
    location: `Deti Plains`,
    reward: [
      `13600 Gil`,
      `Secret Item (Bangaa Helm)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Easy`,
  },
  {
    number: 95,
    name: `Carrot!`,
    description: `Oh my, what to do? My pet, Carrot, is hiding in her house and won't come out! Bring a spear, you may need it! ~ Mrs. Nanabu`,
    type: `Engagement`,
    cost: `5000 Gil`,
    location: `Jagd Helje`,
    prerequisites: [
      "Completed Den of Evil (#064)",
      "Completed Thorny Dreams (#193)",
      
    ],
    reward: [
      `40600 Gil`,
      `Secret Item (Malbow)`,
      `1x Random Item`,
      `2x Random`,
      `Cards`,
    ],
    difficulty: `Medium`,
  },
  {
    number: 96,
    name: `Shadow Clan`,
    description: `[Clan [Your Clan Name]!] If you truly believe you are the strongest clan in Ivalice, we, Shadow Clan, challenge you! ~ Hanzou, Shadow Clan Boss`,
    type: `Engagement`,
    cost: `4500 Gil`,
    location: `Jagd Ahli`,
    prerequisites: [
      "Completed Exploration (#065)",
      "Completed Missing Meow (#067)",
      
    ],
    reward: [`36000 Gil`, `Ninja Tabi`, `1x Random Item`, `2x Random Cards`],
    difficulty: `Hard`,
    enemies: [`Assassin x2`, `Ninja x3 (Hanzou)`],
  },
  {
    number: 97,
    name: `The Dark Blade`,
    description: `He killed them all... with his dark blade, he slew all the men that went to rescue their comrade who fell to the Redwings... ~ Deetz, Streetear`,
    type: `Engagement`,
    cost: `3000 Gil`,
    location: `Jagd Dorsa`,
    prerequisites: [
      "Completed Beastly Gun (#284)",
      
    ],
    reward: [
      `22600 Gil`,
      `Secret Item (Ebon Blade)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Medium`,
  },
  {
    number: 98,
    name: `The Hero Blade`,
    description: `Blacksmith Buckles lives outside town. Bring him materials and defeat him in battle, and he'll make a sword of legend for you! ~ Deetz, Streetear`,
    type: `Engagement`,
    cost: `3600 Gil`,
    location: `Baguba Port`,
    prerequisites: [
      "Completed Den of Evil (#064)",
      "Completed Carrot! (#095)",
      
    ],
    reward: [
      `27000 Gil`,
      `Secret Item (Excalibur2)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Templar (Buckles)`, `As a Templar`],
  },
  {
    number: 99,
    name: `The Fey Blade`,
    description: `Wanna fight me? I'm the traveling swordsmith, Gagatoh! Defeat me, and I'll make you a fey blade, the likes of which have never been seen! ~ Gagatoh, Traveling Swordsmith`,
    type: `Engagement`,
    cost: `5000 Gil`,
    location: `Siena Gorge`,
    prerequisites: [
      "Completed Alchemist Boy (#192)",
      
    ],
    reward: [
      `31600 Gil`,
      `Secret Item (Masamune 100)`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Hard`,
    enemies: [`A master Gladiator`],
  },
  {
    number: 100,
    name: `Fiend Run`,
    description: `There was a flood at the monster bank, and many of the monsters got out! Please capture those still on the loose! ~ Monster Bank Administration`,
    type: `Encounter`,
    cost: `1200 Gil`,
    prerequisites: [
      "Talk to Monster Bank administrator at Cyril",
      "Capture at least five monsters",
      "Seen Monster Escape Cutscene",
    ],
    reward: [
      `8800 Gil`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Coeurl`, `Ahriman`, `Red Cap`],
  },
  {
    number: 101,
    name: `Clan Roundup`,
    description: `Bandit clans are stealing work and attacking without warning! They're giving us clans a bad name. Help us round them up. ~ Clan Center`,
    type: `Encounter`,
    cost: `600 Gil`,
    difficulty: `Medium`,
    enemies: [`Thief`, `Archer`, `Black Mage`, `White Mage`],
  },
  {
    number: 102,
    name: `Wyrms Awaken`,
    description: `The dragons sleeping in Roda Volcano are awake and heading towards Baguba! Please help us hold them off. ~ Delia Royal Watchpost`,
    type: `Encounter`,
    cost: `2700 Gil`,
    reward: [
      `22600 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Icedrake`, `Firewyrm x2`, `Thundrake x2`],
  },
  {
    number: 103,
    name: `Mythril Rush`,
    description: `Professor Auggie's found a mythril vein in Tubola Cave using one of his new inventions! Talk to him -- you might get rich!`,
    type: `Encounter`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed Missing Prof (#063)",
    ],
    reward: [`7000 Gil`, `Secret Item (Silvril)`, `1x Random Card`],
    difficulty: `Medium`,
    enemies: [`Illusionist`],
  },
  {
    number: 104,
    name: `Stolen Scoop`,
    description: `Someone stole my latest scoop article, and I'll bet it was those guys at the Sprohm News. Get them before they reach Sprohm! ~ Eraile, Daily Baguba`,
    type: `Encounter`,
    cost: `1200 Gil`,
    reward: [
      `9000 Gil`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Easy`,
    enemies: [`Soldier`, `Thief x2`, `White Monk`],
  },
  {
    number: 105,
    name: `Smuggle Bust`,
    description: `We suspect a clan is smuggling rare monsters in boxes, but we can't move until we have proof! Can you look into it? ~ Dellar, Palace Guard`,
    type: `Encounter`,
    cost: `2000 Gil`,
    prerequisites: [
      "Completed Poachers (#108)",
    ],
    reward: [
      `13600 Gil`,
      `Secret Item (Chocobo Skin)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: ["Hunter", "Beastmaster", "Malboro x2", "Mystery Box x2"],
  },
  {
    number: 106,
    name: `Resistance`,
    description: `There's an underground resistance, trading anti-laws to defy the palace's rule! Try trading, you might get something good! ~ Ezel`,
    type: `Encounter`,
    cost: `1200 Gil`,
    prerequisites: [
      "Gossip with Ezel at Cadoan Card Keeper",
      "Seen Antilaw Resistance Cutscene",
    ],
    reward: [
      `6000 Gil`,
      `2x Random Item`,
      `1x Random Card`,
    ],
    difficulty: `Easy`,
    enemies: [`Fighter`, `Time Mage`, `Thief (Thomson)`],
  },
  {
    number: 107,
    name: `Old Friends`,
    description: `We've run into a tough blade biter, and well, we've bit off more than we can chew! Please help! ~ Ritz`,
    type: `Encounter`,
    cost: `600 Gil`,
    prerequisites: ["Completed S.O.S. (#048)"],
    reward: [
      `4600 Gil`,
      `Beastspear`,
      `1x Random Card`,
    ],
    difficulty: `Easy`,
    enemies: [`Bomb`, `Antlion`],
  },
  {
    number: 108,
    name: `Poachers`,
    description: `Oh, the fur of the kudik tiger -- that sheen! That silky feel! It's hard to come by, unless you happen to know a good poacher... ~ Flore, Ample Noblewoman`,
    type: `Encounter`,
    cost: `1600 Gil`,
    prerequisites: [
      "Completed Friend Trouble (#052)",
    ],
    reward: [
      `11400 Gil`,
      `Secret Item (Tiger Hide)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Archer x2`, `Gunner x2`, `Hunter x2`],
  },
  {
    number: 109,
    name: `Snow Fairy`,
    description: `Signs of snow spotted! When the earth shines in seven hues, the snow fairies appear. Watch the weather with care. `,
    type: `Encounter`,
    cost: `1200`,
    reward: [
      `9000 Gil`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Easy`,
    enemies: [`Sprite`, `Ice Flan`],
  },
  {
    number: 110,
    name: `Revenge`,
    description: `H-Help! A man named Weaver wants me dead. Yes, it was my fault his family died, but I've repented! ~ Celebrant, Gelzak Church`,
    type: `Encounter`,
    cost: `700 Gil`,
    prerequisites: ["Completed Weaver (#287)"],
    reward: [
      `13600 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
    ],
    difficulty: `Medium`,
    enemies: [`Archer`, `Gladiator`, `Black Mage`, `Fighter x2 (Weaver)`],
  },
  {
    number: 111,
    name: `Retrieve Mail!`,
    description: `I mis-sorted the mail, and now the delivery man's off to Cadoan! Stop that mail, use ANY MEANS NECESSARY. I'll take responsibility. ~ Marko, Mail Sorter`,
    type: `Encounter`,
    cost: `2400 Gil`,
    reward: [
      `11400 Gil`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
    difficulty: `Easy`,
    enemies: [`Gunner`, `Archer`, `Soldier`],
  },
  {
    number: 112,
    name: `A Challenge`,
    description: `Yo, Clan [Your Clan Name]. You're quite popular lately. There's still time for you to join us at Clan Bahan... or else! ~ Mintz, Deputy Clan Boss`,
    type: `Encounter`,
    cost: `600 Gil`,
    reward: [
      `4200 Gil`,
      `2x Random Items`,
      `Req. Skills: Negotiate/Lvl.4`,
    ],
    difficulty: `Slightly Hard`,
    enemies: [`Thief`, `Archer`, `White Mage`, `Black Mage`, `Soldier (Mintz)`],
  },
  {
    number: 113,
    name: `Watching You`,
    description: `I think I'm being watched. People say I'm just paranoid, but I've been hearing flapping wings at night! Please investigate. ~ Titi, Shy Student`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `2800 Gil`,
      `Ahriman Eye`,
      `1x Random Item`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 114,
    name: `Golden Gil`,
    description: `I want you to research the origin of the golden gil in my shop. If it's really from the Age of Kings, it could be good for sales. ~ Shopkeeper, The Golden Gil`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `6400 Gil`,
      `Ancient Coins`,
      `1x Random Item`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 115,
    name: `Dueling Sub`,
    description: `I've been challenged to a duel, but I'm scared. Will you go in my place? Just pretend to be me, OK? ~ Viscount Gatt`,
    type: `Dispatch`,
    cost: `300 Gil`,
    reward: [
      `1800 Gil`,
      `1x Random Item`,
      `Req. Jobs: Soldier`,
      `Dispatch Time: 3 Days`,
    ],
  },
  {
    number: 116,
    name: `Gulug Ghost`,
    description: `We need someone to offer holy water at the shrine on the old Gulug Volcano. The female ghost is up to her old tricks again. ~ Oktoma, Townsperson`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Huntmoon only"],
    reward: [
      `11800 Gil`,
      `Fire Sigil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 117,
    name: `Water City`,
    description: `A legendary city of water lies at the bottom of Bisebina Lake. We need constant updates -- please dive and report. ~ Hickle, Legend Researcher`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: ["Madmoon only"],
    reward: [
      `11800 Gil`,
      `Water Sigil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 118,
    name: `Mirage Tower`,
    description: `They say there's a mirage tower in the desert, where you can find crystalized wind! The wind's good this year, maybe some's there? ~ Bran, Streetear`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Bardmoon only"],
    reward: [
      `11800 Gil`,
      `Wind Sigil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 119,
    name: `A Barren Land`,
    description: `There is a barren land to the east, where no grass will grow. I want to know why! Bring me soil, as much as you can. ~ Powell, Researcher`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Sagemoon only"],
    reward: [
      `13200 Gil`,
      `Earth Sigil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 120,
    name: `Cadoan Meet`,
    description: `Mages! Want to compete in the Cadoan Mage Tourney? The tourney will be split by class in a fight to see who's the strongest! ~ Mage Tourney Committee`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `10600 Gil`,
      `Magic Trophy`,
      `1x Random Item`,
      `Secret Item`,
      `(1x Random Card)`,
      `Req. Jobs: Black Mage`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 121,
    name: `Sprohm Meet`,
    description: `The Sprohm Battle Tourney is accepting contestants. Fight for glory and honor! We've also prepared the usual monetary award... ~ Battle Tourney Committee`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4200 Gil`,
      `Fight Trophy`,
      `1x Random Item`,
      `Secret Item`,
      `(1x Random Card)`,
      `Req. Jobs: Fighter`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 122,
    name: `Run For Fun`,
    description: `There will be a sporting event at our academy soon, but missing one member for our popular marathon team. Looking for a replacement. ~ Pollan, Blue Team Leader`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `5200 Gil`,
      `Sport Trophy`,
      `1x Random Item`,
      `2x Random Cards`,
      `Req. Jobs: Juggler`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 123,
    name: `Hungry Ghost`,
    description: `A hungry ghost hound is causing a panic at the Earlchad Monastery and raiding the pantry. Please put it to rest. ~ Baldi, Head Monk`,
    type: `Dispatch`,
    cost: `900 Gil`,
    reward: [
      `4200 Gil`,
      `Elda's Cup`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 124,
    name: `Pirates Ahoy`,
    description: `We have reports that a large pirate band will be passing through our waters soon. We need good steel and young muscles! ~ Wilhem, Coast Guard`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `6400 Gil`,
      `Coast Medal`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 125,
    name: `Castle Sit-In`,
    description: `A group of youths are protest the capture of their friends at a castle in the south. Talk sense into them! ~ Hansrich, Security Chief`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Huntmoon only",
      "Completed Morning Woes (#151)",
    ],
    reward: [
      `4600 Gil`,
      `Guard Medal`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 126,
    name: `Wine Delivery`,
    description: `Looking for brave souls who will bring wine to sooth the parched throats of our heroes in battle. Come equipped for combat. ~ Devon, War Council Officer`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `7000 Gil`,
      `Rainbowite`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 127,
    name: `Broken Tunes`,
    description: `I've broken my lady's favorite music box. Please, repair it if you can. I would so much like to see her smile again. ~ Tirara, Maidservant`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed Good Bread (#276)",
    ],
    reward: [
      `11400 Gil`,
      `Cat's Tears`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 128,
    name: `Falcon Flown`,
    description: `My best hunting falcon, "Hyperion", has been gone for a day. Perhaps he is looking for his late master? Please find him! ~ Arno, Falconer`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    prerequisites: [
      "Completed Sword Needed (#277)",
    ],
    reward: [
      `11400 Gil`,
      `Dame's Blush`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 129,
    name: `Danger Pass`,
    description: `Bandits are active in Goras Pass and are cutting off our trade routes. Please stop them before we go out of business! ~ Feugo, Wilhem & Co. `,
    type: `Dispatch`,
    cost: `1500 Gil`,
    prerequisites: [
      "Completed Hundred-Eye (#165)",
    ],
    reward: [
      `7800 Gil`,
      `Thunderstone`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 130,
    name: `Mist Stars`,
    description: `Many of our children have never seen the stars due to the mists that cover our land most of the year. Can you help us? ~ Ulg, Astronomer`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `9000 Gil`,
      `Stormstone`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 131,
    name: `Adaman Alloy`,
    description: `I'm afraid we've run out of adamantite. We can't run a business like this! Find us some, and I will make adaman alloy for you. ~ Elbo, Workshop Vargi`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `0 Gil`,
      `Adaman Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 132,
    name: `Mysidia Alloy`,
    description: `Now taking orders for mysidia alloy. Only 10 orders can be filled, first come first served. Thank you. ~ Deunon, Workshop Rool`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `0 Gil`,
      `Mysidia Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 133,
    name: `Crusite Alloy`,
    description: `It's time for us to get back to work. Bring us good materials and we'll make you the best crusite alloy gil can buy! ~ Sabak, Workshop Berk`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    reward: [
      `0 Gil`,
      `Crusite Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 134,
    name: `Faceless Dolls`,
    description: `I found a creepy road in the Ophanwood with faceless dolls all lined up. I can't bring myself to walk past -- are they safe? ~ Edist, Taylor`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `10800 Gil`,
      `Blood Shawl`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 135,
    name: `Faithful Fairy`,
    description: `I quit work, but I'm still concerned about my old co-workers. Please bring them fairy wings that they may sweep in style. ~ Mables, Former Maidservant`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `10000 Gil`,
      `Ahriman Wing`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 136,
    name: `For The Lady`,
    description: `A large amount of gil, meant to pay for the Lady Tiana's medicine, has been stolen from Baron Ianna, and he wants it back. ~ Carnen, Streetear`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `10600 Gil`,
      `Fairy Wing`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 137,
    name: `Seven Nights`,
    description: `My teacher's secret recipe says "stir without rest for seven days and seven nights." Will someone please stir for me!? ~ Hihat, Alchemist Adept`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `11800 Gil`,
      `Goldcap`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 138,
    name: `Shady Deals`,
    description: `Selbaden Church is up to something. The Father has been meeting in secret with merchant types. I bet there's shady deals afoot. ~ Sayen, Townsperson`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed Janitor Duty (#281)",
    ],
    reward: [
      `10600 Gil`,
      `Life Water`,
      `1x Random Item`,
    ],
  },
  {
    number: 139,
    name: `Earthy Colors`,
    description: `I restored artwork for a living, but I'm out of paints. I need some rock from the mountains... Only the hardy need apply. ~ Rosseni, Atelier Wite`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Life Or Death (#210)",
    ],
    reward: [
      `2800 Gil`,
      `Ancient Text`,
      `1x Random Item`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 140,
    name: `Lost Heirloom`,
    description: `Please retrieve Estel's heirloom from the HQ of the greedy "Neighbor" merchant network! Justice must be done! ~ Fago, Ally of Justice`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `6000 Gil`,
      `Justice Badge`,
      `2x Random Items`,
      `1x Random Card`,
    ],
  },
  {
    number: 141,
    name: `Young Love`,
    description: `I must tell her how I feel yet I lack the courage to lift a quill. Perhaps the air-light feather from an ahriman wing would do. ~ Hernie, Timid Youth`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `13200 Gil`,
      `Friend Pin`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 142,
    name: `Ghosts Of War`,
    description: `The wails of a soldier's ghost are troubling folk near the ruins of a church on an old battlefield in the east. Please help. ~ Marvin, Town Official`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    prerequisites: [
      "Completed Young Love (#141)",
    ],
    reward: [
      `12400 Gil`,
      `Edaroya Tome`,
      `1x Random Item`,
    ],
  },
  {
    number: 143,
    name: `The Last Day`,
    description: `My whole class's "Ancient Studies" homework was stolen! If he had some ancient object, we could do it again... Help! ~ Babins, 4th Grade Swords`,
    type: `Dispatch`,
    cost: `200 Gil`,
    reward: [
      `1800 Gil`,
      `Homework`,
      `1x Random Item`,
    ],
  },
  {
    number: 144,
    name: `The Bell Tolls`,
    description: `They're rebuilding the Sart Clocktower that burned the other day. Never know what you might find in the rubble, eh? ~ Tysner, Streetear`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    reward: [
      `9000 Gil`,
      `Dictionary`,
      `1x Random Item`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 145,
    name: `Goblin Town`,
    description: `A goblin stole my favorite monster guide and buried it under a rock! I'll give you a copy if you get mine back for me! ~ Ian, Inquisitive Youth `,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `3600 Gil`,
      `Monster Guide`,
      `1x Random Item`,
    ],
  },
  {
    number: 146,
    name: `Secret Books`,
    description: `We got the secret books proving Selbaden Church's shady deals, but I'm scared they'll find it! How can I relax!? ~ Anonymous`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `11400 Gil`,
      `Secret Books`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 147,
    name: `Words Of Love`,
    description: `Ah, Locuna! I am but a servant, and you a noble's daughter. Our love cannot be, but I must tell you how I feel! Poem, anyone? ~ Cristo, Lovestruck Youth`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `10000 Gil`,
      `Rat Tail`,
      `1x Random Item`,
    ],
  },
  {
    number: 148,
    name: `You, Immortal`,
    description: `Looking for someone to model for a statue to be put in the Royal Library's new wing. Youth, beauty, and physique a plus. ~ Cesare, Artist`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `Stradivari`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 149,
    name: `Clocktower`,
    description: `The town clocktower has been struck by lightning, and the 12:00 gemstone lost. Need people to help with restoration. ~ Market Square Association`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `11400 Gil`,
      `Clock Post`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 150,
    name: `An Education`,
    description: `Nothing is more dear to me than my son, Lukel, yet he has never done well on tests. Won't someone tutor him? ~ Mrs. Kulel`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `3600 Gil`,
      `Fountain Pen`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 151,
    name: `Morning Woes`,
    description: `Our rooster, Nikki, has taken to crowing well before sunrise. Now the neighbors are complaing! Won't someone please help? ~ Mulchin, Grocer`,
    type: `Dispatch`,
    cost: `900 Gil`,
    reward: [`5200 Gil`, `Earplugs`, `1x Random Item`, `Dispatch Time: 5 Days`],
  },
  {
    number: 152,
    name: `Down To Earth`,
    description: `I have the incredible power to make things float just by looking at them. Problem is, I can't make them stop floating! Help! ~ Talkof, Psychic`,
    type: `Dispatch`,
    cost: `200 Gil`,
    reward: [`3400 Gil`, `Crystal`, `1x Random Item`, `Dispatch Time: 5 Days`],
  },
  {
    number: 153,
    name: `To Meden`,
    description: `I had a dog when I worked in the Meden Mines. Could you find her bones and hold a memorial service in the mines for her? ~ Hugo, Baker`,
    type: `Dispatch`,
    cost: `900 Gil`,
    reward: [
      `8200 Gil`,
      `Old Statue`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 154,
    name: `Neighbor!`,
    description: `We're looking for a few good "neighbors"! Won't you join our world- wid network? ~ Pewl, Neighbor Network`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `5200 Gil`,
      `Neighbor Pin`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 155,
    name: `Honor Lost`,
    description: `Some shady character are after our leader, Kerry! Can you help? Please don't let anyone know we hired you. ~ Ed, Assistant Leader`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `5400 Gil`,
      `Broken Sword`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 156,
    name: `Inspiration`,
    description: `I can't think of a single plot hook! Not a word of dialogue! Somebody please bring me an action-packed adventure novel. ~ Ruel, Novelist Apprentice`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `10000 Gil`,
      `Broken Sword`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 157,
    name: `Coo's Break`,
    description: `Coo," the star of our Royal Zoo, has escaped and the zookeeper blames himself. An adventure novel should cheer him up. ~ Zoon, Zoomaster`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `10000 Gil`,
      `Bent Sword`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 158,
    name: `The Match`,
    description: `Looking for someone to judge the final match in a historic fight. My blade vs. his spells! Current score: 100 to 100. ~ Nukkle, Soldier`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `8800 Gil`,
      `Rusty Spear`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 159,
    name: `The Deep Sea`,
    description: `Could you help me appraise a work by Clif Lusac, the Muse of the Sea? Someone said it's a fake! I'll give you a badge! ~ Olwen, Art Dealer`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `11400 Gil`,
      `Feather Badge`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 3 Battles`,
    ],
  },
  {
    number: 160,
    name: `A Worthy Eye`,
    description: `Only a sharp eye can find the best items! If you need an "insignia," bring me an item worthy of my eye! ~ E'oi the Elder`,
    type: `Dispatch`,
    cost: `2700 Gil`,
    reward: [
      `0 Gil`,
      `Insignia`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 161,
    name: `Lost In Mist`,
    description: `Our hill once called "The Sun's Home" is now called "The Hill of Mists." Can you find out why? ~ Nache, Townsperson`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `10000 Gil`,
      `Ally Finder`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 162,
    name: `Darn Kids`,
    description: `Lately, kids have been forming gangs and beating up on other kids. Maybe if we distract them with something they'd stop. ~ Victor, School Principal`,
    type: `Dispatch`,
    cost: `2700 Gil`,
    reward: [
      `11400 Gil`,
      `Ally Finder2`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 163,
    name: `Stage Fright`,
    description: `Needed: charm for curing stage fright. I want the cutest girl in town, Ms. Rina, to notice me in the play, but I'm too nervous! ~ Emporio, Young Actor`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `10600 Gil`,
      `Tranquil Box`,
      `1x Random Item`,
    ],
  },
  {
    number: 164,
    name: `Diary Dilemma`,
    description: `My little brothers hid my diary somewhere in my house. I need you to find it before -- gasp -- my parents do!!! ~ Edwina, Concerned Girl`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `3600 Gil`,
      `Loaded Dice`,
      `1x Random Item`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 165,
    name: `Hundred-Eye`,
    description: `The great hunter Hundred-Eye's daughter, Kailea, has just started hunting; but frankly, she sucks. Someone please train her!`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    prerequisites: [
      "Completed Wine Delivery (#126)",
    ],
    reward: [
      `9000 Gil`,
      `Snake Shield`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Battles`,
    ],
  },
  {
    number: 166,
    name: `Runaway Boy`,
    description: `Need someone to find a runaway child and give him some homeknit clothes. The clothes will be ready as soon as I find thread. ~ Gina, Marun Orphanage`,
    type: `Dispatch`,
    cost: `800 Gil`,
    reward: [
      `5400 Gil`,
      `Stasis Rope`,
      `1x Random Item`,
    ],
  },
  {
    number: 167,
    name: `Mad Alchemist`,
    description: `Dig me a nice cave home. My bizarre experiments have earned me the moniker of "Mad Alchemist." Now I want to live alone. ~ Galdinas, Alchemist`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `3400 Gil`,
      `Mythril Pick`,
      `1x Random Item`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 168,
    name: `Caravan Guard`,
    description: `Wanted: caravan guards. We are traveling merchants who sell our goods from town to town. We expect bandits in the pass ahead. ~ Sirocco, Caravan Leader`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `Caravan Musk`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 169,
    name: `Lifework`,
    description: `Needed: potion advice. Making the ultimate love potion is my life work. I'll be rich and famous for all time! ~ Dandarc, Palace Alchemist`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `6000 Gil`,
      `Love Potion`,
      `1x Random Item`,
      `2x Random Cards`,
      `Req. Jobs: Alchemist`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 170,
    name: `Cheap Laughs`,
    description: `Our husband-and-ife comedy routine needs some pizzazz. Flashy magic and headdresses should do the trick. Can you help? ~ Will and Tita`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `Tonberry Lamp`,
      `1x Random Item`,
    ],
  },
  {
    number: 171,
    name: `T.L.C.`,
    description: `I need someone to heal my wounds so I can get my revenge on those stinking lizard bangaas that lured my platoon into a trap! ~ Gecklan, Platoon Leader`,
    type: `Dispatch`,
    cost: `3500 Gil`,
    reward: [
      `7600 Gil`,
      `Stilpool Scroll`,
      `1x Random Item`,
      `Req. Skills: Magic/Lvl.25`,
      `Req. Jobs: White Mage`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 172,
    name: `Frozen Spring`,
    description: `Someone's frozen our village's only spring, and it's not thawing. Our children are thirsty! Please help us. ~ Nino, Shepard`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `3400 Gil`,
      `Dragon Bone`,
      `1x Random Item`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 173,
    name: `No Scents`,
    description: `Tonight's the night of my big date, and my dress and shoes are perfect, but I can't find my perfume anywhere! Help! ~ Lucy, Party Girl `,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `5200 Gil`,
      `Animal Bone`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 174,
    name: `On The Waves`,
    description: `I found a message in a bottle: a cry for help from a southern isle! If only I could send something -- water even! ~ Luis, Flower Seller`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    reward: [
      `13200 Gil`,
      `Skull`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 175,
    name: `Spirited Boy`,
    description: `My son is in the attic, pretending to be a monster that doesn't like homework! Maybe showing him a dictionary would work. ~ Sihaya, Mother of Three`,
    type: `Dispatch`,
    cost: `700 Gil`,
    reward: [
      `6400 Gil`,
      `Clock Gear`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 176,
    name: `Powder Worries`,
    description: `There's a lot of firearms coming into town lately. Thankfully, we've had no injuries... yet. Check into this matter with me. ~ Senole, Town Watch`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    prerequisites: [
      "Completed Lost Heirloom (#140)",
    ],
    reward: [
      `5400 Gil`,
      `Gun Gear`,
      `1x Random Item`,
      `2x Random Cards`,
      `Req. Jobs: Gunner`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 177,
    name: `The Blue Bolt`,
    description: `Our editor used to be so fast we called him "Blue Bolt." But he's lost it of late. We need something to jog his memory! ~ Elu, Cyril Times Reporter`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `9000 Gil`,
      `Silk Bloom`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 178,
    name: `Sweet Talk`,
    description: `Needed: speech trainer. I can't speak well. I'm always saying too much, or not enough! Please help! ~ Luhoche, Little Girl`,
    type: `Dispatch`,
    cost: `950 Gil`,
    reward: [
      `7000 Gil`,
      `Moon Bloom`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 179,
    name: `Scarface`,
    description: `My face was cut in a duel that I recklessly started. I wish to keep the scar as a penance, but how do I keep it from healing? ~ Tingel, Knight`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `9000 Gil`,
      `Blood Apple`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 3 Battles`,
    ],
  },
  {
    number: 180,
    name: `Mirage Town`,
    description: `Adventurer Phis seeks for the sign to the sky mirage city of Punevam. Get this: he says it's some kind of mushroom! Ridiculous! ~ Hoysun, Pub Customer`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `11400 Gil`,
      `Magic Fruit`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 181,
    name: `Soldier's Wish`,
    description: `I'm not long for this world, but I would like to see the town clock again before I go... Grandma always loved it. ~ Barus, Old Soldier`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `10600 Gil`,
      `Power Fruit`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 182,
    name: `Dry Spell`,
    description: `With all the sun we've been getting, we fear a drought. We need people to help open the sluice gates at Mitoralo. ~ Hinnel, Dam Official`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    reward: [
      `9600 Gil`,
      `Stolen Gil`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 183,
    name: `Swap Meet`,
    description: `I found stacks of old bills at my house, but I want old medals with pictures of the goddess on them! Like to trade? ~ Gelp, Antiques Collector`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    reward: [
      `1200 Gil`,
      `Ancient Bills`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 184,
    name: `Adaman Order`,
    description: `Has your clan put in its order for adaman alloy? It sells out quick, so get your order in soon! How about our shop? ~ Elbo, Workshop Vargi`,
    type: `Dispatch`,
    cost: `2500 Gil`,
    prerequisites: ["Completed Free Bervenia! (#087)"],
    reward: [
      `0 Gil`,
      `Adaman Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 185,
    name: `Magic Mysidia`,
    description: `It was recently discovered that mysidia alloy is enchanted with ancient magic! Better buy some before the prices go up! ~ Deunon, Workshop Rol`,
    type: `Dispatch`,
    cost: `3000 Gil`,
    prerequisites: ["Completed Adaman Order (#184)"],
    reward: [
      `0 Gil`,
      `Mysidia Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 186,
    name: `Conundrum`,
    description: `If you made a shield and a sword from the strongest of all alloys -- crusite -- which would be stronger? Come and let's find out! ~ Sabak, Workshop Berk`,
    type: `Dispatch`,
    cost: `3000 Gil`,
    reward: [
      `0 Gil`,
      `Crusite Alloy`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 187,
    name: `Lucky Night`,
    description: `Announcing: Casino Party. Test your luck at our one-night-only casino party! All welcome. ~ Matim, Steward`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `18000 Gil`,
      `Rat Tail`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 188,
    name: `Tutor Search`,
    description: `I seek my childhood tutor, Yoel. I have a promise to keep to him. It means very much to me. ~ Count Anet`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Completed Lucky Night (#187)"],
    reward: [
      `11400 Gil`,
      `Rusty Sword`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 189,
    name: `Why Am I Wet?`,
    description: `I don't want to have to move, but it has started raining far too much around my house. Please find out why. ~ Ivan, Gold Sculptor`,
    type: `Dispatch`,
    cost: `1800 Gil`,
    prerequisites: ["Completed Lucky Night (#187)"],
    reward: [
      `13600 Gil`,
      `Broken Sword`,
      `1x Random Item`,
      `2x Random Cards`,
      `Req. Jobs: Red Mage`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 190,
    name: `Run With Us`,
    description: `We are the Lightning Brothers, bound by blood-oath and iron law! Why don't you try joining us and see if you like it? ~ LBs, Emissaries of Justice`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    prerequisites: ["Completed Why Am I Wet? (#189)"],
    reward: [
      `18000 Gil`,
      `Bent Sword`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 40 Days`,
    ],
  },
  {
    number: 191,
    name: `Lucky Charm`,
    description: `Someone please find me an item that will lose to no bad luck, and a charm or spell to ward off evil spells. I'm fighting! ~ Milea, Determined Lady`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    prerequisites: ["Completed Why Am I Wet? (#189)"],
    reward: [
      `9000 Gil`,
      `Rusty Spear`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 192,
    name: `Alchemist Boy`,
    description: `Please stop my brother, Hasmir before someone gets hurt. He thinks he's an alchemist but all he makes is smoke and explosions! ~ Gretzel, Townsgirl`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: ["Completed Lucky Charm (#191)"],
    reward: [
      `4600 Gil`,
      `Insignia`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 193,
    name: `Thorny Dreams`,
    description: `The bangaa girl "Eleono" ssleepss in the Thoussand-Thorn Wood. Looking for a clanner to find out why she ssleepss. ~ Vajiri, Bangaa`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    prerequisites: ["Completed Lucky Night (#187)"],
    reward: [
      `16000 Gil`,
      `Blood Apple`,
      `1x Random Item`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 194,
    name: `Free Cyril!`,
    description: `The town Cyril has fallen into the hands of Clan Borzoi. We need you set a trap to get them out of our town! ~ Cyril Town Watch`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: [
      "Read Thief Exposed!",
    ],
    reward: [`2400 Gil`, `2x Random Items`, `Dispatch Time: 3 Days`],
  },
  {
    number: 195,
    name: `Ship Needed`,
    description: `I need a ship to take to the barbarian lands. It's just me, so a small craft will do. ~ Strange Warrior`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Read Borzoi's End",
    ],
    reward: [
      `4200 Gil`,
      `2x Random Items`,
      `2x Random Cards`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 196,
    name: `Mind Ceffyl`,
    description: `Bring me the sigils of "fire" and "wind." I shall craft from them a mind ceffyl, needed to make a spiritstone. ~ Melmin, Sage of the West`,
    type: `Dispatch`,
    cost: `3800 Gil`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `0 Gil`,
      `Mind Ceffyl`,
    ],
  },
  {
    number: 197,
    name: `Body Ceffyl`,
    description: `Bring me the sigils of "earth" and "water." I shall craft from them a body ceffyl, needed to make a spiritstone. ~ Bastra, Sage of the East`,
    type: `Dispatch`,
    cost: `3800 Gil`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `0 Gil`,
      `Body Ceffyl`,
    ],
  },
  {
    number: 198,
    name: `The Spiritstone`,
    description: `Bring the two ceffyls to me, and I shall use my alchemy to craft a spiritstone for you. ~ Kespas, Sage of the South`,
    type: `Dispatch`,
    cost: `3800 Gil`,
    prerequisites: [
      "Read The Sages",
    ],
    reward: [
      `0 Gil`,
      `Spiritstone`,
    ],
  },
  {
    number: 199,
    name: `Girl In Love`,
    description: `I've got a new boyfriend! He's a brave knight, with chestnut hair. Could you tell our fortune with the white thread? ~ Carena, Young Girl`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: ["Bardmoon only"],
    reward: [
      `3400 Gil`,
      `Magic Medal`,
      `1x Random Item`,
    ],
  },
  {
    number: 200,
    name: `Chocobo Help!`,
    description: `Need: Help during the Chocobo spawning season. - Private room - Meals - No experience required - Childcare - Any race ~ Sasasha, Chocobo Ranch`,
    type: `Dispatch`,
    cost: `200 Gil`,
    prerequisites: ["Bardmoon only"],
    reward: [
      `100 Gil`,
      `Chocobo Egg`,
      `1x Random Item`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 201,
    name: `The Skypole`,
    description: `Have you heard of the skypole on the southern peninsula? They it's a stairway to the gods! I'd like to see that! ~ Tay, Streetear`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `2400 Gil`,
      `Ancient Medal`,
      `1x Random Item`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 202,
    name: `Ruins Survey`,
    description: `Looking for people to join in a survey of the Istar Ruins to be held again this year. See ancient history first hand! ~ Rekka, Relics Board`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `10800 Gil`,
      `Ancient Medal`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 203,
    name: `Dig Dig Dig`,
    description: `Zezena Mines: Discovery of the Parum Family, scene of mechanist innovation! We must dig until we find a new mine shaft! Dig! ~ Zezena Mines Co.`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Madmoon only"],
    reward: [
      `11800 Gil`,
      `Zodiac Ore`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 204,
    name: `Seeking Silver`,
    description: `Before the Bell Mines became known for mythril, they were silver mines. Help me look for leftover silver near the west wall. ~ Hoholum, Gayl Stoneworks`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [`3400 Gil`, `Silvril`, `1x Random Item`, `Dispatch Time: 15 Days`],
  },
  {
    number: 205,
    name: `Materite`,
    description: `In the western edge of the Materiwood, materite can be gathered with ease if you go at the right time. Go have a look! ~ Sals, Pub Customer`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Kingmoon only",
    ],
    reward: [`0 Gil`, `Materite`, `1x Random Item`, `Dispatch Time: 10 Days`],
  },
  {
    number: 206,
    name: `The Wormhole`,
    description: `A giant worm is causing considerable damage to our fields as it looks for leestones in the ground. Someone please stop it! ~ Anton, Farmers' Guild`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Huntmoon only",
      "Completed You Immortal (#148)",
    ],
    reward: [
      `2800 Gil`,
      `Leestone`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 207,
    name: `Metal Hunt`,
    description: `I found a turtle burial ground at a mountain shrine. I keep going back in hopes that I might find some adamantite! ~ Catess, Traveler`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Hungry Ghost (#123)",
    ],
    reward: [
      `2400 Gil`,
      `Adamantite`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 208,
    name: `Math Is Hard`,
    description: `I've been at this equation for months. Never have I been so stumped in my life! Won't someone take a crack at this with me? ~ Kosyne, Mathematician`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4200 Gil`,
      `Black Thread`,
      `2x Random Items`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 209,
    name: `The Witness`,
    description: `Wanted: bodyguard. I witnessed a crime and now must appear in court. Please protect me until the day of the trial. ~ Bode, Townsperson`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `Black Thread`,
      `Lost Gun`,
      `Req. Jobs: Defender`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 210,
    name: `Life Or Death`,
    description: `I'll never finish on time. I have to borrow someone's notes. Can you find some for me, or I'll never get this homework done! ~ Felhon, Student`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `2400 Gil`,
      `Black Thread`,
      `1x Random Item`,
    ],
  },
  {
    number: 211,
    name: `Karlos's Day`,
    description: `Wanted: performer to entertain at the birthday party of Karlos, the second son of the Marquis Ealdoring. ~ Jung, Streatear`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `White Thread`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 212,
    name: `To Father`,
    description: `Could you bring my father to me? I promise I won't speak harshly to him. I just want to visit Mother's grave. Thank you. ~ Ren, Notary Public`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    prerequisites: [
      "Completed The Performer (#270)",
    ],
    reward: [
      `11400 Gil`,
      `White Thread`,
      `1x Random Item`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 213,
    name: `Oh Milese`,
    description: `Know you Milese of the Kefeus acting troupe? I'm her biggest fan! Won't you give her this song I've written? ~ Valerio, Composer`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `2800 Gil`,
      `White Thread`,
      `1x Random Item`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 214,
    name: `Skinning Time`,
    description: `We're looking for a few good skinners to help skin chocobo. It's not much of a living, but someone's got to do it! ~ Navarro, Chocobo Ranch`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `3600 Gil`,
      `Chocobo Skin`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 215,
    name: `Wild River`,
    description: `We need workers to help rein in the wild waters of the Pilos River in Andarna before it floods again! Please help. ~ Haagen, Townsperson`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `5400 Gil`,
      `Magic Cloth`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 216,
    name: `Magic Cloth`,
    description: `Hello again! It's me, Gonzales, from the magic cloth shop! I'm trading magic cloth for magic cotton -- got any? ~ Gonzales, Magic Cloth Shop`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Sagemoon only",
    ],
    reward: [
      `0 Gil`,
      `Magic Cloth`,
      `1x Random Item`,
      `1x Random Card`,
    ],
  },
  {
    number: 217,
    name: `Cotton Guard`,
    description: `It's the season when the typhoons come blowing from the south again. I need to find a way to protect my cotton crop! ~ Kerney, Townsperson`,
    type: `Dispatch`,
    cost: `950 Gil`,
    reward: [
      `7000 Gil`,
      `Magic Cotton`,
      `1x Random Card`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 218,
    name: `Help Dad`,
    description: `My son wants me to win him a toy in the shooting game at the next carnival. Won't somebody give me shooting lessons? ~ Bijard, Theologan`,
    type: `Dispatch`,
    cost: `950 Gil`,
    reward: [
      `7800 Gil`,
      `Bomb Shell`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 219,
    name: `Rubber or Real`,
    description: `My favorite toy is the champion of justice, but my friend Amigoh says it's just a rubber monster. Who's right? ~ Zels, Young Boy`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `5200 Gil`,
      `Bomb Shell`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 220,
    name: `Into The Woods`,
    description: `A pack of panthers has appeared in a wood far to the south. Somebody clear them out before they hurt someone! ~ Iguas, Townsperson`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: ["Huntmoon only"],
    reward: [
      `4600 Gil`,
      `Panther Hide`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 221,
    name: `Jerky Days`,
    description: `Want some delicious jerky? Come help out at my store! We have to make 5,000 sticks of jerky this year. ~ Godon, Butcher`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: ["Kingmoon only"],
    reward: [`4200 Gil`, `Jerky`, `1x Random Card`, `Dispatch Time: 5 Days`],
  },
  {
    number: 222,
    name: `New Fields`,
    description: `Needed: live-in help. We're looking to increase our fields again this year. All welcome! Don't worry, you'll be paid! ~ Farmer's Guild`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: ["Madmoon only"],
    reward: [
      `3600 Gil`,
      `Gysahl Greens`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 223,
    name: `Strange Fires`,
    description: `Strange fires have been breaking out near our powder store. It has to be a rival guild. Maybe you could ambush them? ~ Dabum, Fireworks Guild`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `9600 Gil`,
      `Magic Medal`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 224,
    name: `Better Living`,
    description: `Wanted: tester. Help test our amazing new form of illumination, guaranteed to change the lives of city dwellers! ~ Better Living Labs`,
    type: `Dispatch`,
    cost: `1300 Gil`,
    reward: [
      `10000 Gil`,
      `Chocobo Egg`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 225,
    name: `Malboro Hunt`,
    description: `A lost malboro child from a nest in the pond has wandered into town! Please return it to its parents before someone gets hurt. ~ Jonnie, Ice Cream Man`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Madmoon only",
    ],
    reward: [
      `4200 Gil`,
      `Cyril Ice`,
      `1x Random Item`,
      `1x Random Card`,
    ],
  },
  {
    number: 226,
    name: `Chocobo Work`,
    description: `Wanted: register clerk & part-time floor scrubber at The Chocobo's Kweh. ~ Rolana, The Chocobo's Kweh`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: ["Bardmoon only"],
    reward: [
      `4600 Gil`,
      `Choco Bread`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 227,
    name: `Party Night`,
    description: `They're holding a welcome party at the furniture store, and they want me to perform some tricks! Somebody teach me! ~ Xiao, Furniture Seller`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `9600 Gil`,
      `Choco Gratin`,
      `1x Random Item`,
      `2x Random Card`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 228,
    name: `Mama's Taste`,
    description: `Being away from home for 10 years, I've started to really miss my mama's gratin. Won't someone make me some kupo gratin? ~ Takatoka, Machinist`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `9000 Gil`,
      `Choco Gratin`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 229,
    name: `The Well Maze`,
    description: `I ran into a cave while I was digging a well, and there's something inside! Maybe you could lure it out with some bread? ~ Meuk, Well Digger`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `9600 Gil`,
      `Grownup Bread`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 230,
    name: `She's Gone`,
    description: `For years I gave her my all and now she's left and taken my savings with her. I going for a drink, want to come along? ~ Omar, Townsperson`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed Bread Woes (#234)",
    ],
    reward: [
      `10600 Gil`,
      `Malboro Wine`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 231,
    name: `Magic Vellum`,
    description: `Come make magic sheepskin vellum with me! I'll show you the pen is mightier than the sword. Bring some magic cotton with you! ~ Chikk, Paper Maker`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `4600 Gil`,
      `Magic Vellum`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 232,
    name: `Novel Ascent`,
    description: `I want to write novels about mountain climbing, but I'm not very good at it. I need a rope that won't ever break! ~ Torfo, Apprentice Novelist`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `11400 Gil`,
      `Runba's Tale`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 233,
    name: `Shiver`,
    description: `Someone please drive off the wailing spirit that haunts the pass near town. Hearing it sucks the strength right out of me! ~ Gillom, Townsperson`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `11800 Gil`,
      `Runba's Tale`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 234,
    name: `Bread Woes`,
    description: `I've been trying to make a bread that kids will love, but it's tough going. What I need now is a good bread to sooth MY taste buds. ~ Noluado, Baker`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `10800 Gil`,
      `Kiddy Bread`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 235,
    name: `Book Mess`,
    description: `Needed: able clan members to help clean my room. All you have to do is put a few thousand books back on their shelves! ~ Mimin, Scholar`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    prerequisites: ["Sagemoon only"],
    reward: [
      `12400 Gil`,
      `Encyclopedia`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 236,
    name: `One More Tail`,
    description: `My lucky rabbit tail found me a wonderful husband! But now we're married, I think I need a little more luck. Got a tail for me? ~ Bibilina, Lucky Lady`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: ["Madmoon only"],
    reward: [
      `10800 Gil`,
      `Rabbit Tail`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 237,
    name: `Relax Time!`,
    description: `Come enjoy the Danbukwood and get back to nature! Buy some wood and bring it home for that woodsy feeling all year long! ~ Yeesa Tourism Board`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: ["Huntmoon only"],
    reward: [
      `4600 Gil`,
      `Danbukwood`,
      `1x Random Item`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 238,
    name: `Foma Jungle`,
    description: `I've got tons of orders for moonwood chairs! Get me some moonwood from the deep Foma Jungle, if you would. No pun intended. ~ Gueguerre, Wood Craftsman`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: ["Huntmoon only"],
    reward: [
      `4600 Gil`,
      `Moonwood`,
      `1x Random Item`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 239,
    name: `For A Flower`,
    description: `I need a telaq flower, a strange blossom that blooms only a few times a year deep within a cave -- a cave with monsters. ~ Shelm, Alchemist`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `6000 Gil`,
      `Telaq Flower`,
      `1x Random Item`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 240,
    name: `Giza Plains`,
    description: `A bug infestation has hit Giza Plains, and it will reach the town if we don't take action! Someone help drive those critters away! ~ Noris, Townsperson`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: [
      "Completed Free Cyril (#194)",
      "Giza Plains not Freed",
    ],
    reward: [`2400 Gil`, `1x Random Item`, `Dispatch Time: 3 Enemies`],
  },
  {
    number: 241,
    name: `Lutia Pass`,
    description: `I opened a shop in Lutia Pass, but not a single customer has come yet! I think I need to advertise. Could you pass out flyers? ~ Bintz, Tool Shop`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Lutia Pass not Freed"],
    reward: [`2400 Gil`, `1x Random Item`, `Dispatch Time: 3 Enemies`],
  },
  {
    number: 242,
    name: `The Nubswood`,
    description: `Rock turtles have been attacking travelers in the Nubswood. Use this "shellout" to get rid of them, please. ~ Hoelik, Townsperson`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Completed Raven",
      "Nubswood not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 3 Enemies`,
    ],
  },
  {
    number: 243,
    name: `Eluut Sands`,
    description: `I'm trying to reforest the Eluut Sands in an attempt to tame the beasts that live there. Bring me a desert plant for study. ~ Karenne, Herbologist`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Eluut Sands not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 3 Enemies`,
    ],
  },
  {
    number: 244,
    name: `Ulei River`,
    description: `Somebody get the word out: there's fine fish to be had in the upper waters of the Ulei River! ~ Holt, Angler`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: ["Ulei River not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 3 Enemies`,
    ],
  },
  {
    number: 245,
    name: `Aisenfield`,
    description: `Somebody spread the word that those rumors of bandits in Aisenfield are a bunch of lies. It's bad for business! ~ Chocobo Shop, Aisen Branch`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Aisenfield not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 3 Enemies`,
    ],
  },
  {
    number: 246,
    name: `Roda Volcano`,
    description: `Roda Volcano's been active lately. Someone needs to go to the road at the base of the cone and clean off the chunks of lava. ~ Naricys, Geologist `,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Roda Volcano not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 3 Enemies`,
    ],
  },
  {
    number: 247,
    name: `Travel Aid`,
    description: `Please light the waypoints in the Koringwood. They are vital landmarks for helping travelers find their way. Thank you. ~ Zeshika, Woodland Guide`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: ["Koringwood not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 248,
    name: `The Salikawood`,
    description: `I plan on cutting a path through the Salikawood. I'll do some reforesting, too! I can't pay much, but I really need help. ~ Laycher, Innkeeper`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: ["Salikawood not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 249,
    name: `Nargai Cave`,
    description: `Monsters can't stand the smell of the flower that grows deep in Nargai Cave. Great for ensuring a safe voyage! Help me get one. ~ Buck, Bontanist`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: ["Nargai Cave not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 250,
    name: `Kudik Peaks`,
    description: `A rock slide has blocked off the road to the Kudik Peaks. Looking for people to help clear it off. ~ Jagark, Mountain Patrol`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Kudik Peaks not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 251,
    name: `Jeraw Sands`,
    description: `One of the ruins in Jeraw Sands is supposed to be the entrance to an underground cave! Please investigate. ~ Gadfly, Ivalice Tours`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Jeraw Sands not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 5 Enemies`,
    ],
  },
  {
    number: 252,
    name: `Uladon Bog`,
    description: `Won't someone help me build a bridge over Uladon Bog? It would really speed up travel. ~ Iluluna, Young Girl`,
    type: `Capture`,
    cost: `600 Gil`,
    prerequisites: ["Uladon Bog not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 253,
    name: `Gotor Sands`,
    description: `Find the oasis said to lay hidden in Gotor Sands. If we could draw water from there, it would be a great boon to travelers. ~ Gabela, Traveling Merchant`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Gotor Sands not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 254,
    name: `Delia Dunes`,
    description: `Please find out where the dragonflies of Delia Dunes live. Their wings are a vital ingredient for making medicine. ~ Carulea, Alchemist`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Delia Dunes not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 255,
    name: `Bugbusters`,
    description: `Bladebugs, the natural enemy of all monsters, are said to gather on the river that flows deep in the Materiwood. Find them! ~ Winetz, Entomologist`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Materiwood not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 256,
    name: `Tubola Cave`,
    description: `They say that the crystals are making monsters go crazy... I wonder about silvril? Get some from Tubola Cave for me! ~ Phol, Researcher`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Tubola Cave not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 257,
    name: `Deti Plains`,
    description: `They say armor fashioned from a wyrmgod scale will withstand any attack! Find a scale in the ruins on the Deti Plains for me. ~ Takukulu, Armorer`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Deti Plains not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 258,
    name: `Siena Gorge`,
    description: `I want you to confirm the old rumor that there is poison on the winds that blow through Siena Gorge. I'll pay you! ~ Cal, Lover of Gossip`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: ["Siena Gorge not Freed"],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 259,
    name: `Jagd Alhi`,
    description: `I'm thinking of building a gladitorial arena in Jagd Ahli. A lawless sport for a lawless zone! Help me find a good spot. ~ Pakanon, Architect`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Exploration (#065)",
      
      "Jagd Ahli not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 260,
    name: `Jagd Helje`,
    description: `I dropped something very important to me in a ruin in Jagd Helje. Please find it! ~ Ekal, Astrologer`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Den Of Evil (#064)",
      
      "Jagd Helje not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 261,
    name: `Jagd Dorsa`,
    description: `Please kill the jagdsaurus that plagues Jagd Dorsa. He'll come out if you go in there alone, I guarantee it. ~ Handog, Townsperson`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Jagd Dorsa not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 15 Enemies`,
    ],
  },
  {
    number: 262,
    name: `Ambervale`,
    description: `The nest of the chomper beetles from Ozmonfield was found in Ambervale! Please use this "bugoff" to drive them away! ~ Dalaben, Ranch Manager`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Ozmonfield (#263)",
      "Ambervale not Freed",
      
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 263,
    name: `Ozmonfield`,
    description: `The chomper beetles found in Ozmonfield are eating my chocobo feed. Please use this "bug-B-gone" to drive them away! ~ Dalaben, Ranch Manager`,
    type: `Capture`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed A Dragon's Aid (#066)",
      "Ozmonfield not Freed",
    ],
    reward: [
      `2400 Gil`,
      `1x Random Item`,
      `1x Random Card`,
      `Dispatch Time: 7 Enemies`,
    ],
  },
  {
    number: 264,
    name: `Swords in Cyril`,
    description: `Announcing the biggest even of the year: the Cyril Swordsmanship Competition! Test your strength and skill! ~ Cyril Event Committee`,
    type: `Dispatch`,
    cost: `300 Gil`,
    reward: [
      `1800 Gil`,
      `Secret Item (Victor Sword)`,
      `1x Random Item`,
      `Req. Jobs: Fencer`,
      `Dispatch Time: 1 Battle`,
    ],
  },
  {
    number: 265,
    name: `Newbie Hall`,
    description: `Need: part-time teachers. Help apprentices in a wide variety of jobs learn the tricks of your trade! ~ Oks, Newbie Hall Chief`,
    type: `Dispatch`,
    cost: `400 Gil`,
    prerequisites: [
      "Completed Earthy Colors (#139)",
    ],
    reward: [
      `2400 Gil`,
      `Onion Sword`,
      `1x Random Item`,
      `Req. Skills: Combat/Lvl.5`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 266,
    name: `Voodoo Doll`,
    description: `I saw the matron casting a spell on that nasty doll! That must be the cause of my lady's illness, it must be. Please, help my lady! ~ Eselle, Maidservant`,
    type: `Dispatch`,
    cost: `400 Gil`,
    reward: [
      `3400 Gil`,
      `Soulsaber`,
      `1x Random Item`,
      `Dispatch Time: 5 Days`,
    ],
  },
  {
    number: 267,
    name: `Come On Out`,
    description: `My son is so overweight he can hardly move. Someone get him out of his room! I don't care how you do it. ~ Joyce, Warehouse Monitor`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `5400 Gil`,
      `Oblige`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 268,
    name: `Food For Truth`,
    description: `My friend was arrested unfairly! While we look for the real criminal, I'd like to send him some good food. Do you know of any? ~ Theo, Fruitseller`,
    type: `Dispatch`,
    cost: `800 Gil`,
    prerequisites: [
      "Completed The Witness (#209)",
    ],
    reward: [
      `6400 Gil`,
      `Rhomphaia`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 269,
    name: `Alba Cave`,
    description: `A turtle monster guards a fabulous treasure at an ancient shrine in Alba Cave. Distract him with some food and it's yours! ~ Mumusen, Pub Customer`,
    type: `Dispatch`,
    cost: `600 Gil`,
    reward: [
      `6000 Gil`,
      `Secret Item (Beastsword)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
  },
  {
    number: 270,
    name: `The Performer`,
    description: `I've performed in many lands, but I've never had a hit. Maybe it's just bad luck? Got anything to make fortune smile on me? ~ Mamek, Traveling Performer`,
    type: `Dispatch`,
    cost: `1100 Gil`,
    reward: [
      `9600 Gil`,
      `Tonberrian`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 271,
    name: `One More Time`,
    description: `That guy in the corner's a fabulous tenor. We want him for our chorus group, but he refuses to join. Won't you convince him? ~ Arthin, Chorus Lead`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `6400 Gil`,
      `Aerial Hole`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 15 Days`,
    ],
  },
  {
    number: 272,
    name: `Spring Tree`,
    description: `A tree grows on the duke's land, and every spring a woman comes and looks at its roots. Could you check if something's there? ~ Eukanne, Ducal Maid`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: ["Cadoan Pub only"],
    reward: [
      `7000 Gil`,
      `Charfire`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 273,
    name: `Who Am I?`,
    description: `I woke in this town with no memory or items but this staff. Please trade me a magic medal for it--I must repay the inkeep. ~ Weathervane Inn, Room 3`,
    type: `Dispatch`,
    cost: `300 Gil`,
    prerequisites: [
      "Completed Adaman Alloy (#131)",
    ],
    reward: [
      `600 Gil`,
      `Power Staff`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 274,
    name: `Reaper Rumors`,
    description: `My buddy says that on full moon nights, the reaper comes down from the moon to a manse on the hill and someone dies! Is it true? ~ Nud, Future Streetear`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `8800 Gil`,
      `Crescent Bow`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 275,
    name: `Dog Days`,
    description: `My father is a postman, but he fell off his dogsled and hurt himself bad. I have to help him! Teach me how to ride a dogsled! ~ Rikk, Postman's Son`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `8800 Gil`,
      `Marduk Bow`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Days`,
    ],
  },
  {
    number: 276,
    name: `Good Bread`,
    description: `There's a bowyer outside town that makes the best bows in the land, but he only makes them if you bring him good bread! ~ Arco, Pub Customer`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    reward: [
      `0 Gil`,
      `Arbalest`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 277,
    name: `Sword Needed`,
    description: `There's a sword fighting competition coming up, and one of our team can't make it. Looking for a good swordsman to replace her! ~ Lotus, Swordsman`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `9000 Gil`,
      `Bangaa Spike`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 2 Battles`,
    ],
  },
  {
    number: 278,
    name: `El Ritmo`,
    description: `Those Nightwailers are out there singing every night. Noisy bunch, but bring 'em the materials, and they'll make you an instrument.`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `12400 Gil`,
      `Secret Item (Fell Castanets)`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 279,
    name: `Her Big Move`,
    description: `The best dancer in town has gone off to the city to be a star... I'd like to make a toast to her success. Got a drink? ~ Deuxhart, Townsperson`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `9600 Gil`,
      `Magic Hands`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 280,
    name: `Don't Look!`,
    description: `They say that on full-moon nights something scary happens if you look at the mirror in one of the dorm rooms! Is it true? Help! ~ Eluiotte, Frightened Girl`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `10800 Gil`,
      `Reverie Shield`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 10 Enemies`,
    ],
  },
  {
    number: 281,
    name: `Janitor Duty`,
    description: `What a great parade that was! Which reminds me, they're looking for people to help clean up all the trash. You interested? ~ Grek, Pub Customer`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `11400 Gil`,
      `Parade Helm`,
      `1x Random Item`,
      `2x Random Cards`,
      `Dispatch Time: 20 Days`,
    ],
  },
  {
    number: 282,
    name: `Unlucky Star`,
    description: `I live a cursed life, but now I'm getting married, and nothing can go wrong! I need some kind of charm to ward off evil spirits! ~ Domure, Unlucky Man`,
    type: `Dispatch`,
    cost: `1600 Gil`,
    reward: [
      `13200 Gil`,
      `Magic Robe`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 283,
    name: `Corral Care`,
    description: `The rainbow-furred corral is the fastest animal in the world, and one's loose on Duke Casell's land. Someone please feed it! ~ Falco, Animal Lover`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `12600 Gil`,
      `Fire Mitts`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 284,
    name: `Beastly Gun`,
    description: `Want a gun as strong and fast as a wild beast? Just bring me two little items I need, and it's all yours, free. ~ Strives, Musketeer`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    reward: [
      `0 Gil`,
      `Calling Gun`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 285,
    name: `Blade & Turtle`,
    description: `You can make amazingly strong swords with just a little adaman alloy. Too bad it's so hard to come by... ~ Gilgame, Young Blacksmith`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    prerequisites: ["Completed She's Gone (#230)"],
    reward: [
      `10600 Gil`,
      `Secret Item (Adaman Blade)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
  },
  {
    number: 286,
    name: `Valuable Fake`,
    description: `I finally got the famed sword "ragnarok," but it's a fake! Just bring me the right materials and I can make one of these, easy! ~ Hoek, Swordsmith`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    prerequisites: [
      "Completed Run For Fun (#122)",
    ],
    reward: [
      `9000 Gil`,
      `Secret Item (Nagrarok)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
  },
  {
    number: 287,
    name: `Weaver's War`,
    description: `I lost my family to those godless scoundrels in the Gelzak Church. Help me make a good sword so that I might avenge them! ~ Weaver, Knight`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `10600 Gil`,
      `Zankplus`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 288,
    name: `Fabled Sword`,
    description: `I found the designs for making the same sword used by a legendary swordsman! But, the ingredients are hard to find. Please help. ~ Belitz, Archaeologist`,
    type: `Dispatch`,
    cost: `1500 Gil`,
    prerequisites: [
      "Completed Novel Ascent (#232)",
    ],
    reward: [
      `12600 Gil`,
      `Secret Item (Master Sword)`,
      `1x Random Item`,
    ],
  },
  {
    number: 289,
    name: `Refurbishing`,
    description: `Due to the recent drop in weapon availability, we at Teldot Workshop are now offering refurbishing. Make old blades new! ~ Workshop Teldot`,
    type: `Dispatch`,
    cost: `4000 Gil`,
    prerequisites: [
      "Completed Oh Milese (#213)",
    ],
    reward: [
      `0 Gil`,
      `Lurebreaker`,
      `1x Random Item`,
    ],
  },
  {
    number: 290,
    name: `Stone Secret`,
    description: `I've found a way to make the usually brittle leestone hard as steel! Bring me leestone and I'll make you a weapon. ~ Ukes, Traveling Smith`,
    type: `Dispatch`,
    cost: `4000 Gil`,
    reward: [
      `0 Gil`,
      `Secret Item (Tabarise)`,
      `1x Random Item`,
      `2x Random`,
      `Cards`,
    ],
  },
  {
    number: 291,
    name: `Sword Stuff`,
    description: `I hope to use the smithing knowledge I gained abroad to make swords with the materials available here. Know any good materials? ~ Da'jerma, Swordsmith`,
    type: `Dispatch`,
    cost: `4500 Gil`,
    prerequisites: [
      "Completed Sorry, Friend (#094)",
    ],
    reward: [
      `0 Gil`,
      `Secret Item (Silkmoon)`,
      `1x Random Item`,
      `2x Random`,
      `Cards`,
    ],
  },
  {
    number: 292,
    name: `A Stormy Night`,
    description: `Once, long ago, a bolt of godsfire hit a shrine to the esper Odin. When the smoke cleared, they found a spear -- the Odinlance.`,
    type: `Dispatch`,
    cost: `1400 Gil`,
    prerequisites: [
      "Completed Ghosts Of War (#142)",
    ],
    reward: [
      `12600 Gil`,
      `Odin Lance`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 293,
    name: `Minstrel Song`,
    description: `I met a bard in the woods who said he'd sold his soul to some fiend. If you want a dark instrument, he's the one to ask. ~ Rayches, Pub Customer`,
    type: `Dispatch`,
    cost: `5500 Gil`,
    reward: [
      `0 Gil`,
      `Secret Item (Dark Fiddle)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
  },
  {
    number: 294,
    name: `Gun Crazy`,
    description: `I heard that Thousand-Barrel, that gun maker that lives up in Gilba Pass, invented a new gun! Got to be powerful, that. ~ Tetero, Pub Customer`,
    type: `Dispatch`,
    cost: `4000 Gil`,
    prerequisites: [
      "Completed Sword Stuff (#291)",
    ],
    reward: [
      `0 Gil`,
      `Bindsnipe`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 295,
    name: `Black Hat`,
    description: `To all black mages: in order to raise the status of our clan brothers, we will give you a black hat. Wear it well! ~ Black Mage Society`,
    type: `Dispatch`,
    cost: `2000 Gil`,
    reward: [
      `0 Gil`,
      `Black Hat`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 296,
    name: `Hat For A Girl`,
    description: `hat girl that's always standing on the pier must be chilly. I'd like to give her a hat, but which one? She's a white mage.`,
    type: `Dispatch`,
    cost: `1200 Gil`,
    reward: [
      `10800 Gil`,
      `White Hat`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 297,
    name: `Armor & Turtle`,
    description: `I could make some wicked strong armor if I had some adaman alloy. Just... it's so hard to get, you know? ~ Gilgame, Young Blacksmith`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed Mama's Taste (#228)",
    ],
    reward: [
      `9000 Gil`,
      `Adaman Armor`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 298,
    name: `Dark Armor`,
    description: `If you can bring me some materite, I believe I can make an outstanding suit of armor. I'll give you the suit. How about it? ~ Pepeiro, Alchemist`,
    type: `Dispatch`,
    cost: `2700 Gil`,
    prerequisites: [
      "Completed Dog Days (#275)",
    ],
    reward: [
      `0 Gil`,
      `Materia Armor`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
  {
    number: 299,
    name: `Fashion World`,
    description: `I hear Brint Mea, the popular brand, is looking for new designs. Probably trying to win customers back from Galmia Pepe! ~ Mit, Pub Customer`,
    type: `Dispatch`,
    cost: `600 Gil`,
    prerequisites: [
      "Completed An Education (#150)",
    ],
    reward: [
      `4600 Gil`,
      `Secret Item (Brint Set)`,
      `1x Random Item`,
      `2x`,
      `Random Cards`,
    ],
  },
  {
    number: 300,
    name: `Fashion Hoopla`,
    description: `Both Galmia Pepe and Brint Mea are looking for new designs! The fate of the fashion world hangs on the balance on this one! ~ Phale, Fashion Expert`,
    type: `Dispatch`,
    cost: `1000 Gil`,
    prerequisites: [
      "Completed The Performer (#270)",
      "Completed Fashion World (#299)",
    ],
    reward: [
      `11800 Gil`,
      `Galmia Set`,
      `1x Random Item`,
      `2x Random Cards`,
    ],
  },
];

const BLUE_MAGIC_REF: BlueRef[] = [
  {
    name: "Goblin Punch",
    mp: 8,
    desc: "Damage varies; can be very high or very low.",
    from: ["Goblin"],
    sources: [
      { type: "Mission", name: "Tower Ruins (#032)" },
      { type: "Mission", name: "Village Hunt (#037)" },
      { type: "Mission", name: "A Lost Ring (#049)" },
      { type: "Mission", name: "White Flowers (#055)" },
      { type: "Mission", name: "Snow in Lutia (#044)" },
    ],
    notes:
      "Only appears in missions. If co-op is available, “Newbie Hunt” works. A Paladin in “The Dark Blade” knows it.",
  },
  {
    name: "Magic Hammer",
    mp: 8,
    desc: "Deals MP damage.",
    from: ["Red Cap"],
    sources: [
      { type: "Clan", name: "Tubola Bandits" },
      { type: "Turf", name: "Help Helje!" },
    ],
  },
  {
    name: "Acid",
    mp: 12,
    desc: "Inflicts a random status ailment.",
    from: ["Flankind (Jelly / Ice Flan / Cream)"],
    sources: [],
  },
  {
    name: "Blowup",
    mp: 2,
    desc: "Self-destruct (adjacent AoE). Needs critical HP if using Control.",
    from: ["Bomb", "Grenade"],
    sources: [
      { type: "Turf", name: "Help Roda!" },
      { type: "Clan", name: "Wild Monsters" },
      { type: "Mission", name: "Diamond Rain (#007)" },
      { type: "Mission", name: "Tower Ruins (#032)" },
      { type: "Mission", name: "Magewyrm (#034)" },
      { type: "Mission", name: "Fire! Fire! (#038)" },
      { type: "Mission", name: "Hot Recipe (#047)" },
      { type: "Mission", name: "Missing Prof. (#063)" },
      { type: "Mission", name: "Exploration (#065)" },
      { type: "Mission", name: "Cadoan Watch (#074)" },
      { type: "Mission", name: "Old Friends (#107)" },
      { type: "Mission", name: "Snow Fairy (#109)" },
    ],
  },
  {
    name: "Mighty Guard",
    mp: 8,
    desc: "Buff: +W.Def & +M.Res for battle.",
    from: ["Icedrake"],
    sources: [
      { type: "Clan", name: "Wild Monsters" },
    ],
  },
  {
    name: "Mighty Guard",
    mp: 8,
    desc: "Buff: +W.Def & +M.Res for battle.",
    from: ["Icedrake"],
    sources: [
      { type: "Clan", name: "Wild Monsters" },
      { type: "Mission", name: "Pale Company (#011)" },
    ],
  },
  {
    name: "Guard-Off",
    mp: 10,
    desc: "Debuff: -W.Def & -M.Res for battle.",
    from: ["Firewyrm"],
    sources: [{ type: "Clan", name: "Roda Dragons" }],
  },
  {
    name: "Dragon Force",
    mp: 12,
    desc: "Buff: +W.Atk & +M.Atk.",
    from: ["Thundrake"],
    sources: [
      { type: "Mission", name: "Pale Company (#011)" },
      { type: "Mission", name: "Wyrms Awaken (#102)" },
      { type: "Mission", name: "A Dragon's Aid (#066)" },
    ],
    notes: "Only found in missions—prioritize when available.",
  },
  {
    name: "Night",
    mp: 24,
    desc: "Puts everyone (except caster) to sleep.",
    from: ["Lamia"],
    sources: [{ type: "Clan", name: "Jagd Emissaries" }],
  },
  {
    name: "Twister",
    mp: 20,
    desc: "Halves HP; multi-target.",
    from: ["Lilith"],
    sources: [{ type: "Clan", name: "Tubola Bandits" }],
  },
  {
    name: "LV3 Def-Less",
    mp: 12,
    desc: "DEF/RES ↓ if level is a multiple of 3.",
    from: ["Antlion", "Jawbreaker"],
    sources: [{ type: "Clan", name: "Antlions" }],
  },
  {
    name: "Matra Magic",
    mp: 24,
    desc: "Swap target HP and MP.",
    from: ["Toughskin"],
    sources: [
      { type: "Turf", name: "Help Nubs!" },
      { type: "Turf", name: "Help Nargai!" },
      { type: "Clan", name: "Antlions" },
      { type: "Clan", name: "Roda Dragons" },
      { type: "Clan", name: "Tribites" },
      { type: "Clan", name: "Kudik Beasts" },
      { type: "Mission", name: "Royal Ruins (#058)" },
      { type: "Mission", name: "Jagd Hunt (#012)" },
      ],
  },
  {
    name: "Poison Claw",
    mp: 8,
    desc: "Damage + Poison.",
    from: ["Red Panther"],
    sources: [
      { type: "Clan", name: "Kudik Beasts" },
      { type: "Mission", name: "Snow in Lutia (#044)" },
      ],
  },
  {
    name: "Hastebreak",
    mp: 12,
    desc: "Stop if Hasted; Slow otherwise.",
    from: ["Coeurl"],
    sources: [
      { type: "Turf", name: "Help Nargai!" },
      { type: "Turf", name: "Help Helje!" },
    ],
  },
  {
    name: "Bad Breath",
    mp: 20,
    desc: "Inflicts 5 random status ailments.",
    from: ["Malboro", "Big Malboro"],
    sources: [{ type: "Turf", name: "Help Eluut!" }],
  },
  {
    name: "Stare",
    mp: 12,
    desc: "Confuse if target faces caster.",
    from: ["Floateye"],
    sources: [{ type: "Clan", name: "Aisen Ghosts" }],
  },
  {
    name: "Roulette",
    mp: 20,
    desc: "Random instant KO to one unit.",
    from: ["Ahriman"],
    sources: [
      { type: "Clan", name: "Bloodthirsters" },
      { type: "Clan", name: "Jagd Emissaries" },
    ],
    notes: "Use Auto-Life (Angel Ring) or Zombify to learn safely.",
  },
  {
    name: "Drain Touch",
    mp: 10,
    desc: "Life drain melee.",
    from: ["Zombie"],
    sources: [
      { type: "Clan", name: "Aisen Ghosts" },
      { type: "Clan", name: "Tubola Bandits" },
    ],
  },
  {
    name: "LV? S-Flare",
    mp: 30,
    desc: "Hits all units sharing same last digit of level (including caster).",
    from: ["Vampire"],
    sources: [
      { type: "Clan", name: "Bloodthirsters" },
      { type: "Mission", name: "Quiet Sands (#018)" },
      { type: "Mission", name: "Mortal Snow (#---)" },
      ],
  },
  {
    name: "White Wind",
    mp: 12,
    desc: "Heal AoE for caster HP amount.",
    from: ["Sprite"],
    sources: [
      { type: "Clan", name: "Tricky Spirits" },
      { type: "Turf", name: "Help Eluut!" },
      { type: "Clan", name: "Tubola Bandits" },
      { type: "Turf", name: "Help Helje!" },
    ],
  },
  {
    name: "Angel Whisper",
    mp: 24,
    desc: "Heal + Auto-Life.",
    from: ["Titania"],
    sources: [{ type: "Clan", name: "Tricky Spirits" }],
  },
];

const CAPTURE_REF: CapRef[] = [
  {
    monster: "Goblin",
    family: "Goblinkind",
    missions: [
      "White Flowers (#055)",
      "A Lost Ring (#049)",
      "Snow in Lutia (#044)",
      "Village Hunt (#037)",
      "Tower Ruins (#032)",
      "Herb Picking (#001)",
    ],
    enjoys: [{ item: "Maiden Kiss", aff: 5 }],
    spits: [{ item: "Antidote", aff: 0 }],
    notes:
      "Blue Goblins eventually disappear — learn Goblin Punch & capture early",
  },
  {
    monster: "Red Cap",
    family: "Goblinkind",
    clans: ["Clan Hounds", "Tricky Spirits"],
    missions: ["Fiend Run (#100)", "White Flowers (#055)", "Herb Picking (#001)"],
    enjoys: [{ item: "Maiden Kiss", aff: 5 }],
    spits: [{ item: "Antidote", aff: 0 }],
    notes: "",
  },
  {
    monster: "Jelly",
    family: "Flankind",
    clans: ["Roda Dragons", "Wild Monsters"],
    missions: ["Flan Breakout (#093)", "Sketchy Thief (#059)"],
    enjoys: [{ item: "Antidote", aff: 5 }],
    spits: [{ item: "Eye Drops", aff: 0 }],
    notes: "",
  },
  {
    monster: "Ice Flan",
    family: "Flankind",
    clans: ["Roaming Naiads"],
    missions: [
      "Snow Fairy (#109)",
      "Flan Breakout! (#093)",
      "Water Sigil (#078)",
      "Exploration (#065)",
      "Prof in Trouble (#046)",
      "Diamond Rain (#007)",
    ],
    enjoys: [{ item: "Antidote", aff: 5 }],
    spits: [{ item: "Eye Drops", aff: 0 }],
    notes: "",
  },
  {
    monster: "Cream",
    family: "Flankind",
    clans: ["Tricky Spirits"],
    missions: [
      "Flan Breakout! (#093)",
      "Friend Trouble (#052)",
      "Desert Peril (#004)",
    ],
    enjoys: [{ item: "Antidote", aff: 5 }],
    spits: [{ item: "Eye Drops", aff: 0 }],
    notes: "",
  },
  {
    monster: "Bomb",
    family: "Bombkind",
    clans: ["Antlions", "Roda Dragons"],
    missions: [
      "Old Friends (#107)",
      "Cadoan Watch (#074)",
      "Missing Prof. (#063)",
      "Hot Recipe (#047)",
      "Fire! Fire! (#038)",
      "Magewyrm (#034)",
      "Tower Ruins (#032)",
      "Diamond Rain (#007)",
    ],
    areas: ["Help Roda!"],
    spits: [{ item: "Holy Water", aff: 0 }],
    notes: "",
  },
  {
    monster: "Grenade",
    family: "Bombkind",
    clans: ["Lost Monsters", "Wild Monsters"],
    missions: ["Snow Fairy (#109)", "Exploration (#065)"],
    areas: ["Help Roda!"],
    spits: [{ item: "Holy Water", aff: 0 }],
    notes: "",
  },
  {
    monster: "Icedrake",
    family: "Dragonkind",
    clans: ["Roaming Naiads", "Wild Monsters"],
    missions: [
      "Wyrms Awaken (#102)",
      "Free Bervenia! (#087)",
      "A Dragon's Aid (#066)",
      "Missing Prof. (#063)",
      "Magewyrm (#034)",
      "Tower Ruins (#032)",
      "Ruby Red (#031)",
      "To Ambervale (#022)",
      "Pale Company (#011)",
      "Diamond Rain (#007)",
    ],
    enjoys: [{ item: "Cureall", aff: 10 }],
    notes: "",
  },
  {
    monster: "Firewyrm",
    family: "Dragonkind",
    clans: ["Roda Dragons"],
    missions: [
      "Wyrms Awaken (#102)",
      "A Dragon's Aid (#066)",
      "For A Song (#054)",
      "Hot Recipe (#047)",
      "Magewyrm (#034)",
      "Tower Ruins (#032)",
      "Ruby Red (#031)",
      "Pale Company (#011)",
    ],
    areas: ["Help Roda!"],
    enjoys: [{ item: "Cureall", aff: 10 }],
    notes: "",
  },
  {
    monster: "Thundrake",
    family: "Dragonkind",
    missions: ["Wyrms Awaken (#102)", "A Dragon's Aid (#066)", "Pale Company (#011)"],
    enjoys: [{ item: "Cureall", aff: 10 }],
    notes: "Only found in missions-prioritize when available.",
  },
  {
    monster: "Lamia",
    family: "Lamiakind",
    clans: ["Clan Hounds", "Jagd Emissaries", "Roaming Naiads"],
    missions: [
      "Fire Sigil (#076)",
      "Royal Ruins (#058)",
      "A Lost Ring (#049)",
      "Diamond Rain (#007)",
    ],
    enjoys: [
      { item: "Cureall", aff: 10 },
      { item: "Echo Screen", aff: 5 },
    ],
    spits: [{ item: "Maiden Kiss", aff: 0 }],
    notes: "",
  },
  {
    monster: "Lilith",
    family: "Lamiakind",
    clans: ["Roaming Naiads"],
    missions: ["A Lost Ring (#049)", "To Ambervale (#022)"],
    enjoys: [
      { item: "Cureall", aff: 10 },
      { item: "Echo Screen", aff: 5 },
    ],
    spits: [{ item: "Maiden Kiss", aff: 0 }],
    notes: "",
  },
  {
    monster: "Antlion",
    family: "Antlionkind",
    clans: ["Antlions", "Kudik Beasts"],
    missions: [
      "Old Friends (#107)",
      "White Flowers (#055)",
      "Desert Rose (#051)",
      "Village Hunt (#037)",
      "Magewyrm (#034)",
      "Jagd Hunt (#012)",
      "Desert Peril (#004)",
    ],
    areas: ["Help Giza!"],
    enjoys: [{ item: "Soft", aff: 5 }],
    spits: [{ item: "Bandage", aff: 0 }],
    notes: "",
  },
  {
    monster: "Jawbreaker",
    family: "Antlionkind",
    clans: ["Aisen Ghosts", "Antlions"],
    missions: ["Exploration (#065)", "Desert Rose (#051)", "To Ambervale (#022)"],
    areas: ["Help Giza!"],
    enjoys: [{ item: "Soft", aff: 5 }],
    spits: [{ item: "Bandage", aff: 0 }],
    notes: "",
  },
  {
    monster: "Red Panther",
    family: "Pantherkind",
    clans: ["Kudik Beasts", "Tribites"],
    missions: [
      "For A Song (#054)",
      "Friend Trouble (#052)",
      "Desert Rose (#051)",
      "Frosty Mage (#045)",
      "Snow in Lutia (#044)",
      "Magewyrm (#034)",
      "Desert Peril (#004)",
    ],
    enjoys: [{ item: "Holy Water", aff: 10 }],
    spits: [
      { item: "Antidote", aff: 0 },
      { item: "Echo Screen", aff: 0 },
    ],
    notes: "",
  },
  {
    monster: "Coeurl",
    family: "Pantherkind",
    clans: ["Clan Hounds", "Tribites", "Wild Monsters"],
    missions: [
      "Fiend Run (#100)",
      "Exploration (#065)",
      "Friend Trouble (#052)",
      "Village Hunt (#037)",
      "To Ambervale (#022)",
      "Desert Peril (#004)",
    ],
    areas: ["Help Nargai!", "Help Helje!"],
    enjoys: [{ item: "Holy Water", aff: 10 }],
    spits: [
      { item: "Antidote", aff: 0 },
      { item: "Echo Screen", aff: 0 },
    ],
    notes: "",
  },
  {
    monster: "Malboro",
    family: "Malborokind",
    clans: ["Lost Monsters", "Wild Monsters"],
    missions: [
      "Smuggle Bust (#105)",
      "Carrot! (#095)",
      "Foreign Fiend (#085)",
      "For A Song (#054)",
      "Tower Ruins (#032)",
    ],
    areas: ["Help Eluut!"],
    enjoys: [
      { item: "Holy Water", aff: 7 },
      { item: "Bandage", aff: 4 },
    ],
    spits: [{ item: "Cureall", aff: 0 }],
    notes: "",
  },
  {
    monster: "Big Malboro",
    family: "Malborokind",
    clans: ["Lost Monsters"],
    missions: [
      "Fiend Run (#100)", 
      "Foreign Fiend (#085)", 
      "To Ambervale (#022)"],
    areas: ["Help Eluut!"],
    enjoys: [
      { item: "Holy Water", aff: 7 },
      { item: "Bandage", aff: 4 },
    ],
    spits: [{ item: "Cureall", aff: 0 }],
    notes: "",
  },
  {
    monster: "Floateye",
    family: "Ahrimankind",
    clans: ["Aisen Ghosts", "Lost Monsters"],
    missions: ["Staring Eyes (#050)", "Frosty Mage (#045)", "Twisted Flow (#005)"],
    enjoys: [{ item: "Eye Drops", aff: 5 }],
    spits: [{ item: "Soft", aff: 0 }],
    notes: "",
  },
  {
    monster: "Ahriman",
    family: "Ahrimankind",
    clans: ["Bloodthirsters", "Jagd Emissaries"],
    missions: [
      "Fiend Run (#100)",
      "Free Bervenia! (#087)",
      "Missing Prof. (#063)",
      "Staring Eyes (#050)",
      "Twisted Flow (#005)",
    ],
    enjoys: [{ item: "Holy Water", aff: 5 }],
    spits: [{ item: "Soft", aff: 0 }],
    notes: "",
  },
];

const MAP_PLACEMENTS: Record<
  string,
  { number: number; title: string; reward?: string | null }
> = {
  Sprohm: { number: 14, title: "Sprohm" },
  "Lutia Pass": { number: 8, title: "Lutia Pass" },
  Nubswood: { number: 9, title: "Nubswood" },
  "Eluut Sands": { number: 6, title: "Eluut Sands" },
  "Ulei River": { number: 5, title: "Ulei River" },
  Cadoan: { number: 15, title: "Cadoan" },
  Aisenfield: { number: 18, title: "Aisenfield" },
  "Roda Volcano": { number: 4, title: "Roda Volcano" },
  Koringwood: { number: 10, title: "Koringwood" },
  Salikawood: { number: 22, title: "Salikawood" },
  "Nargai Cave": { number: 13, title: "Nargai Cave" },
  "Baguba Port": { number: 16, title: "Baguba Port" },
  "Jagd Dorsa": { number: 7, title: "Jagd Dorsa" },
  "Kudik Peaks": { number: 24, title: "Kudik Peaks" },
  "Jeraw Sands": { number: 2, title: "Jeraw Sands" },
  Muscadet: { number: 21, title: "Muscadet" },
  "Uladon Bog": {number: 1, title: "Uladon Bog"},
  "Gotor Sands": { number: 12, title: "Gotor Sands" },
  "Jagd Ahli": { number: 3, title: "Jagd Ahli" },
  "Delia Dunes": { number: 17, title: "Delia Dunes" },
  Ozmonfield: { number: 23, title: "Ozmonfield" },
  Materiwood: { number: 20, title: "Materiwood" },
  "Tubola Cave": { number: 19, title: "Tubola Cave" },
  "Jagd Helje": { number: 26, title: "Jagd Helje" },
  "Deti Plains": { number: 11, title: "Deti Plains" },
  "Siena Gorge": { number: 25, title: "Siena Gorge" },
};


// === Global Missables helpers (injected) ===
type GlobalMissable = {
    id: number;
    type: string;
    missable: string[];
    warning?: string;
    mission?: number[];
    note: string;
};

const getMissablesForMission = (num: number): GlobalMissable[] =>
    GLOBAL_MISSABLES.filter((m) => Array.isArray(m.mission) && m.mission.includes(num));

const missableKey = (m: GlobalMissable) => keyify(`miss-global:${m.id}`);

// Treat a global missable as "auto-checked" if linked Blue/Capture entries are checked
const isMissableAutoChecked = (m: GlobalMissable, checked: Record<string, boolean>) => {
    const names = Array.isArray(m.missable) ? m.missable : [];
    if (m.type === "Monster Bank") {
        return names.some((nm) => !!checked[keyify(`cap:${nm}`)]);
    }
    if (m.type === "Blue Magic") {
        return names.some((nm) => !!checked[keyify(`blue:${nm}`)]);
    }
    return false;
};

const isMissableChecked = (m: GlobalMissable, checked: Record<string, boolean>) => {
    return !!checked[missableKey(m)] || isMissableAutoChecked(m, checked);
};

function MissableCard({
    m,
    checked,
    setCheck,
}: {
    m: GlobalMissable;
    checked: Record<string, boolean>;
    setCheck: (id: string) => void;
}) {
    const id = missableKey(m);
    const manualChecked = !!checked[id];
    const autoCap = m.type === "Monster Bank" && Array.isArray(m.missable) && m.missable.some((nm) => !!checked[keyify(`cap:${nm}`)]);
    const autoBlue = m.type === "Blue Magic" && Array.isArray(m.missable) && m.missable.some((nm) => !!checked[keyify(`blue:${nm}`)]);
    const autoChecked = !!(autoCap || autoBlue);
    const isChecked = manualChecked || autoChecked;
    const linkNames = Array.isArray(m.missable) ? m.missable : [];
    const ensureChecked   = (key: string) => { if (!checked[key]) setCheck(key); };
    const ensureUnchecked = (key: string) => { if (checked[key])  setCheck(key); };
    const syncLinkedOnManualCheck = (nextManual: boolean) => {
      if (m.type === "Monster Bank") {
        linkNames.forEach((nm) =>
          nextManual ? ensureChecked(keyify(`cap:${nm}`)) : ensureUnchecked(keyify(`cap:${nm}`))
        );
      } else if (m.type === "Blue Magic") {
        linkNames.forEach((nm) =>
          nextManual ? ensureChecked(keyify(`blue:${nm}`)) : ensureUnchecked(keyify(`blue:${nm}`))
        );
      }
    };


    // Card-level click: prevent label default + stop bubbling, toggle only this missable
    const onCardClick = (e: React.SyntheticEvent) => {
        if (typeof e.preventDefault === "function") e.preventDefault();
        e.stopPropagation();
        const nextManual = !manualChecked;
        setCheck(id);
        syncLinkedOnManualCheck(nextManual);
    };

    // Block parent handlers on mousedown/pointerdown as well (prevents label toggles)
    const block = (e: React.SyntheticEvent) => {
        if (typeof e.preventDefault === "function") e.preventDefault();
        e.stopPropagation();
    };

    // Checkbox: allow default (so it visually toggles), stop bubbling, and persist state
    const cbClick = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };
    const cbChange = () => {
        const nextManual = !manualChecked;
        setCheck(id);
        syncLinkedOnManualCheck(nextManual);
    };

    return (
        <li
            key={`gm-${m.id}`}
            className="flex w-full items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10 cursor-pointer"
            onClick={onCardClick}
            onMouseDown={block}
            onPointerDown={block}
        >
            <input
                type="checkbox"
                className="mt-0.5 accent-red-600 dark:accent-red-400"
                checked={isChecked}
                onChange={cbChange}
                onClick={cbClick}
            />
            <div className="flex-1 min-w-0 text-sm text-zinc-800 dark:text-zinc-200">
                <div className="font-semibold text-red-700 dark:text-red-300">
                    Missable: {Array.isArray(m.missable) ? m.missable.join(", ") : "Unknown"}
                </div>
                {!isChecked && (
                    <>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                            <span className="font-semibold">Type:</span> {m.type}
                        </div>
                        {m.warning && (
                            <div className="text-xs italic text-red-700 dark:text-red-300 mt-1">
                                {m.warning}
                            </div>
                        )}
                        {m.note && (
                            <div className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                                {m.note}
                            </div>
                        )}
                    </>
                )}
            </div>
        </li>
    );
}

const GLOBAL_MISSABLES: { id: number; type: string; missable: string[]; warning?: string; mission?: number[]; note: string }[] = [
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
  warning: "Do NOT complete A Dragon's Aid (#066) or discard the Wyrmstone before recruiting Pallanza.",
  note: "If you complete this mission before recruiting Pallanza, you will lose the Wyrmstone and miss the opportunity to recruit Pallanza.",
  mission: [66]
 },
 {
  id: 4,
  type: "Recruiting-Related Missions",
  missable: ["Quin"],
  warning: "Save before starting Tubola Caves (#256).",
  note: "If Quin doesn't offer to join, reset because this is the only chance to recruit Quin.",
  mission: [256]
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
  warning: "Do NOT complete \"Reconciliation\" alongside \"Left Behind\" or \"A Maiden's Cry\".",
  note: "Possible bug can cause issues.",
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
  note: "Learn ASAP. Can learn in Wind Sigil (#079), Magewrym (#034), The Worldwyrm (#088) in Pale Company (#011), Wyrm's Awaken (#102), A Dragon's Aid (#066), Ruby Red (#031), and To Amberavle (#022).",
  mission: [79,34,88,11,102,66,31,22]
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
  note: "Can be obtained in Frosty Mage (#045).",
  mission: [45]
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
  note: "Can be obtained in Quiet Sands (#018). Solo battle - equip Steal on Marche.",
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
  missable: ["Save the Queen", "Maiximillian", "Bangaa Helm"],
  warning: "Target: Llednar",
  note: "Can be obtained in Present Day (Llednar Variant) (#020). Solo battle - equip Steal on Marche.",
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
  note: "Negotiate and give Ice Cream",
  mission: [109]
 },
 {
  id: 69,
  type: "Miscellaneous",
  missable: ["Bracers", "Hades Bows", "Angel Rings"],
  note: "Repeatable - excellent for farming Angel Rings (Rare).",
  mission: [72]
 },
 {
  id: 70,
  type: "Miscellaneous",
  missable: ["R4 Anti-Law"],
  warning: "Failure results in R3 Anti-Law.",
  note: "Successfully negotiate to receive the R4 Anti-Law.",
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

const Tag: React.FC<{
  color: "blue" | "green" | "purple" | "red" | "amber";
  children: React.ReactNode;
}> = ({ color, children }) => {
  const map: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ring-1 ring-zinc-950/10 dark:ring-white/10 ${map[color]}`}
    >
      {children}
    </span>
  );
};

const ProgressBar: React.FC<{
  done: number;
  total: number;
  label: string;
  color: "blue" | "green" | "purple" | "red" | "amber";
}> = ({ done, total, label, color }) => {
  const percent = pct(done, total);
  const palette: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
  };
  return (
    <div className="text-xs">
      <div className="flex flex-wrap items-end justify-between gap-1">
        <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-zinc-600 dark:text-zinc-400">
          {done}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded">
        <div
          className={`h-2 ${palette[color]} rounded`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const Panel: React.FC<{
  title: string;
  subtitle?: string;
  border: string;
  buttonColor: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "red" | "amber" | "purple";
}> = ({ title, subtitle, border, buttonColor, children, right, tone = "neutral" }) => {
  const bgMap: Record<string, string> = {
    neutral: "bg-white dark:bg-zinc-800",
    blue: "bg-blue-50 dark:bg-blue-900/10",
    green: "bg-green-50 dark:bg-green-900/10",
    red: "bg-red-50 dark:bg-red-900/10",
    amber: "bg-amber-50 dark:bg-amber-900/10",
    purple: "bg-purple-50 dark:bg-purple-900/10",
  };
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl p-3 ring-1 ring-zinc-950/10 dark:ring-white/10 ${border} ${bgMap[tone]} transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{title}
            {subtitle && (
            <>
              <br></br>
              <span className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</span>
            </>
            )}
        </h4>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {right}
          <button
            className={`${buttonColor} text-white text-sm px-3 py-1 rounded`}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="mt-3">{children}</div>
        </>
      )}
    </div>
  );
};

const FFTAProgressionGuide: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // --- Save/Load overlay UI state ---
  type ScreenMode = "idle" | "saving" | "loading";
  const [screenMode, setScreenMode] = useState<ScreenMode>("idle");

  // Maintain your existing checked state...
  // const [checked, setChecked] = useState<Record<string, boolean>>({ ... });

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Hidden file input for Load
  const loadInputRef = useRef<HTMLInputElement | null>(null);

  type SaveFileV1 = {
      format: "ffta-progress-v1";
      slot: 1;
      checked: string[];
  };

  const buildSavePayload = (): SaveFileV1 => {
      const list = Object.keys(checked).filter((k) => !!checked[k]);
      return { format: "ffta-progress-v1", slot: 1, checked: list };
  };

  const validateParsedSave = (parsed: any): parsed is SaveFileV1 =>
      parsed &&
      parsed.format === "ffta-progress-v1" &&
      parsed.slot === 1 &&
      Array.isArray(parsed.checked) &&
      parsed.checked.every((x: any) => typeof x === "string");

  const applyLoadedChecked = (keys: string[]) => {
      const next: Record<string, boolean> = {};
      for (const k of keys) next[k] = true;
      setChecked(next);
  };

  // --- SAVE: show overlay for 1s, then download file ---
  const saveProgressToFile = async () => {
      setScreenMode("saving");
      await wait(2000);

      const payload = buildSavePayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ffta_slot_1.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setScreenMode("idle");
  };

  // --- LOAD: user picks file, then show overlay for 1s while applying ---
  const triggerLoadPicker = () => {
      loadInputRef.current?.click();
  };

  const handleLoadFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = async () => {
          setScreenMode("loading");
          await wait(2000);
          try {
              const text = String(reader.result || "");
              const parsed = JSON.parse(text);
              if (!validateParsedSave(parsed)) {
                  // Invalid format, just exit overlay
                  setScreenMode("idle");
                  return;
              }
              applyLoadedChecked(parsed.checked);
          } catch {
              // Parse error—just exit overlay
          } finally {
              setScreenMode("idle");
          }
      };
      reader.readAsText(file);
  };


  const toggle = (k: string) => setExpanded((p) => ({ ...p, [k]: !p[k] }));
  const setCheck = (k: string, v?: boolean) =>
    setChecked((p) => ({ ...p, [k]: v ?? !p[k] }));

  const blueTotal = BLUE_MAGIC_REF.length;
  const blueDone = useMemo(
    () =>
      BLUE_MAGIC_REF.reduce(
        (n, b) => n + (checked[keyify(`blue:${b.name}`)] ? 1 : 0),
        0
      ),
    [checked]
  );
  const capTotal = CAPTURE_REF.length;
  const capDone = useMemo(
    () =>
      CAPTURE_REF.reduce(
        (n, c) => n + (checked[keyify(`cap:${c.monster}`)] ? 1 : 0),
        0
      ),
    [checked]
  );
  const missTotal = GLOBAL_MISSABLES.length;
  const missDone = useMemo(
      () =>
          GLOBAL_MISSABLES.reduce(
              (n, m) => n + (isMissableChecked(m, checked) ? 1 : 0),
              0
          ),
      [checked]
  );

  const missionMap = useMemo(() => {
    const m = new Map<number, QuestRef>();
    for (const q of MISSION_REF) m.set(q.number, q);
    return m;
  }, []);
  const questTotal = MISSION_REF.slice(2).length;
  const questKey = (num: number) => keyify(`quest-global:${num}`);
  const questDone = useMemo(
    () =>
      MISSION_REF.slice(2).reduce(
        (n, q) => n + (checked[questKey(q.number)] ? 1 : 0),
        0
      ),
    [checked]
  );

  const blocks: Block[] = [
    {
      key: "tutorial",
      kind: "story",
      title: "Snowball Fight",
      subtitle: "Schoolyard",
      sidequests: [-1]
    },
    {
      key: "isekai",
      kind: "story",
      title: "Bangaas",
      subtitle: "Ivalice",
      sidequests: [0]
    },
    {
      key: "pre-001",
      kind: "between",
      title: "Pre-Story Missions (After Bangaas → Before #001)",
      placements: ['Sprohm']
    },
    {
      key: "001",
      kind: "story",
      title: "Herb Picking (#001)",
      subtitle: "Giza Plains",
      sidequests: [1]
    },
    {
      key: "post-001",
      kind: "between",
      title: "Between-Story Missions (After #001 → Before #002)",
      placements: ["Lutia Pass"],
      blue: ["Goblin Punch", "Magic Hammer", "Poison Claw", "Blowup"],
      caps: ["Goblin", "Red Cap", "Red Panther", "Bomb", "Floateye"],
      sidequests: [38, 115, 44, 45, 46],
    },
    {
      key: "002",
      kind: "story",
      title: "Thesis Hunt (#002)",
      subtitle: "Lutia Pass",
      sidequests: [2]
    },
    {
      key: "post-002",
      kind: "between",
      title: "Between-Story Missions (After #002 → Before #003)",
      placements: ["Nubswood"],
      sidequests: [25, 27, 68, 69, 70, 143, 194, 240, 199, 200, 201, 264]
    },
    {
      key: "003",
      kind: "story",
      title: "The Cheetahs (#003)",
      subtitle: "Nubswood",
      sidequests: [3]
    },
    {
      key: "post-003",
      kind: "between",
      title: "Between-Story Missions (After #003 → Before #004)",
      placements: ["Eluut Sands"],
      blue: ["Hastebreak", "Matra Magic", "LV3 Def-Less"],
      caps: ["Antlion", "Coeurl"],
      sidequests: [37, 55, 113, 50, 167, 210, 139, 265],
    },
    {
      key: "004",
      kind: "story",
      title: "Desert Peril (#004)",
      subtitle: "Eluut Sands",
      blue: ["Acid"],
      caps: ["Cream"],
      sidequests: [4]
    },
    {
      key: "post-004",
      kind: "between",
      title: "Between-Story Missions (After #004 → Before #005)",
      placements: ["Ulei River"],
      caps: ["Jawbreaker", "Lilith"],
      sidequests: [49, 101, 112, 145, 152, 213, 289, 241],
    },
    {
      key: "005",
      kind: "story",
      title: "Twisted Flow (#005)",
      subtitle: "Ulei River",
      caps: ["Ahriman"],
      sidequests: [5]
    },
    {
      key: "post-005",
      kind: "between",
      title: "Between-Story Missions (After #005 → Before #006)",
      placements: ["Cadoan"],
      blue: ["Stare", "Drain Touch"],
      sidequests: [164, 172, 266],
    },
    { 
      key: "006",
      kind: "story", 
      title: "Antilaws (#006)", 
      subtitle: "Cadoan", 
      sidequests: [6] 
    },
    {
      key: "post-006",
      kind: "between",
      title: "Between-Story Missions (After #006 → Before #007)",
      placements: ["Aisenfield"],
      sidequests: [62, 71, 106, 123, 207, 148, 150, 299, 175, 205, 242, 267],
      missables: [1,2]
    },
    {
      key: "007",
      kind: "story",
      title: "Diamond Rain (#007)",
      subtitle: "Aisenfield",
      blue: ["Mighty Guard"],
      caps: ["Icedrake", "Ice Flan", "Lamia"],
      sidequests: [7],
    },
    {
      key: "post-007",
      kind: "between",
      title: "Between-Story Missions (After #007 → Before #008)",
      placements: ["Roda Volcano"],
      blue: ["Night", "Bad Breath"],
      caps: ["Firewyrm", "Malboro", "Big Malboro"],
      sidequests: [47, 73, 74, 75, 195, 76, 122, 286, 155, 168, 208, 209, 268, 243],
    },
    {
      key: "008",
      kind: "story",
      title: "Hot Awakening (#008)",
      subtitle: "Roda Volcano",
      sidequests: [8],
    },
    {
      key: "post-008",
      kind: "between",
      title: "Between-Story Missions (After #008 → Before #009)",
      placements: ["Koringwood"],
      caps: ["Jelly"],
      sidequests: [32, 33, 36, 48, 72, 151, 125, 170, 244, 269],
    },
    {
      key: "009",
      kind: "story",
      title: "Magic Wood (#009)",
      subtitle: "Koringwood",
      sidequests: [9],
    },
    {
      key: "post-009",
      kind: "between",
      title: "Between-Story Missions (After #009 → Before #010)",
      placements: ["Salikawood"],
      sidequests: [100, 140, 162, 166, 173, 211, 245, 270, 212, 300],
    },
    {
      key: "010",
      kind: "story",
      title: "Emerald Keep (#010)",
      subtitle: "Salikawood",
      sidequests: [10],
    },
    {
      key: "post-010",
      kind: "between",
      title: "Between-Story Missions (After #010 → Before #011)",
      placements: ["Nargai Cave"],
      sidequests: [114, 58, 124, 92, 154, 169, 206, 219, 246],
    },
    {
      key: "011",
      kind: "story",
      title: "Pale Company (#011)",
      subtitle: "Nargai Cave",
      blue: ["Dragon Force"],
      caps: ["Thundrake"],
      sidequests: [11],
    },
    {
      key: "post-011",
      kind: "between",
      title: "Between-Story Missions (After #011 → Before #012)",
      placements: ["Baguba Port", "Jagd Dorsa"],
      blue: ["Guard-Off"],
      sidequests: [111, 133, 160, 176, 214, 215, 247, 271, 287, 110],
    },
    {
      key: "012",
      kind: "story",
      title: "Jagd Hunt (#012)",
      subtitle: "Baguba Port",
      blue: ["White Wind"],
      sidequests: [12],
    },
    {
      key: "post-012",
      kind: "between",
      title: "Between-Story Missions (After #012 → Before #013)",
      placements: ["Dorsa Caravan"],
      sidequests: [52, 108, 77, 78, 79, 80, 81, 132, 156, 196, 197, 198, 204, 222, 248, 272],
    },
    {
      key: "013",
      kind: "story",
      title: "The Bounty (#013)",
      subtitle: "Dorsa Caravan",
      sidequests: [13],
    },
    {
      key: "post-013",
      kind: "between",
      title: "Between-Story Missions (After #013 → Before #014)",
      placements: ["Kudik Caves"],
      caps: ["Grenade"],
      sidequests: [26, 61, 109, 131, 273, 157, 178, 216, 217, 218, 225, 249],
    },
    {
      key: "014",
      kind: "story",
      title: "Golden Clock (#014)",
      subtitle: "Kudik Caves",
      sidequests: [14],
    },
    {
      key: "post-014",
      kind: "between",
      title: "Between-Story Missions (After #014 → Before #015)",
      placements: ["Jeraw Sands"],
    },
    {
      key: "015",
      kind: "story",
      title: "Scouring Time (#015)",
      subtitle: "Jeraw Sands",
      sidequests: [15],
    },
    {
      key: "post-015",
      kind: "between",
      title: "Between-Story Missions (After #015 → Before #016)",
      placements: ["Muscadet"],
      sidequests: [28, 39, 82, 83, 84, 85, 86, 93, 126, 153, 158, 179, 220, 221, 228, 250, 251, 252, 274],
      missables: [5]
    },
    {
      key: "016",
      kind: "story",
      title: "The Big Find (#016)",
      subtitle: "Muscadet",
      sidequests: [16],
    },
    {
      key: "post-016",
      kind: "between",
      title: "Between-Story Missions (After #016 → Before #017)",
      placements: ["Materiwood", "Jagd Ahli"],
      blue: ["LV? S-Flare"],
      sidequests: [51, 65, 30, 104, 105, 53, 121, 130, 149, 165, 129, 181, 223, 224, 253, 275, 298, 297],
    },
    {
      key: "017",
      kind: "story",
      title: "Desert Patrol (#017)",
      subtitle: "Materiwood",
      sidequests: [17],
    },
    {
      key: "post-017",
      kind: "between",
      title: "Between-Story Missions (After #017 → Before #018)",
      placements: ["Ozmonfield"],
      sidequests: [34, 35, 91, 102, 31, 66, 60, 144, 161, 171, 231, 254],
    },
    {
      key: "018",
      kind: "story",
      title: "Quiet Sands (#018)",
      subtitle: "Ozmonfield",
      blue: ["Angel Whisper"],
      sidequests: [18],
    },
    {
      key: "post-018",
      kind: "between",
      title: "Between-Story Missions (After #018 → Before #019)",
      placements: ["Deti Plains"],
      sidequests: [54, 107, 134, 147, 163, 177, 180, 182, 226, 227, 234, 255, 276, 127, 277, 128, 278],
    },
    {
      key: "019",
      kind: "story",
      title: "Materite Now! (#019)",
      subtitle: "Deti Plains",
      sidequests: [19],
    },
    {
      key: "post-019",
      kind: "between",
      title: "Between-Story Missions (After #019 → Before #020)",
      placements: ["Tubola Cave"],
      sidequests: [135, 136, 202, 229, 230, 285, 279, 280, 293],
    },
    {
      key: "020",
      kind: "story",
      title: "Present Day (#020)",
      subtitle: "Ambervale",
      sidequests: [20],
    },
    {
      key: "post-020",
      kind: "between",
      title: "Between-Story Missions (After #020 → Before #021)",
      placements: ["Ahli Desert", "Jagd Helje"],
      blue: ["Roulette","Twister"],
      sidequests: [40, 41, 42, 57, 63, 103, 64, 29, 116, 117, 118, 119, 120, 137, 183, 203, 232, 288, 233, 235, 236, 256, 281, 138, 282, 295, 296],
    },
    {
      key: "021",
      kind: "story",
      title: "Hidden Vein (#021)",
      subtitle: "Tubola Caves",
      sidequests: [21],
    },
    {
      key: "post-021",
      kind: "between",
      title: "Between-Story Missions (After #021 → Before #022)",
      placements: ["Delia Dunes"],
      blue: [
        "White Wind",
      ],
      sidequests: [94, 291, 294, 159],
    },
    {
      key: "022",
      kind: "story",
      title: "To Ambervale (#022)",
      subtitle: "Delia Dunes",
      sidequests: [22],
    },
    {
      key: "post-022",
      kind: "between",
      title: "Between-Story Missions (After #022 → Before #023)",
      placements: ["Gotor Sands"],
      sidequests: [43, 59, 141, 142, 292, 146, 174, 237, 238, 239, 257, 258, 283, 290],
    },
    {
      key: "023",
      kind: "story",
      title: "Over the Hill (#023)",
      subtitle: "Siena Gorge",
      sidequests: [23],
    },
    {
      key: "post-023",
      kind: "between",
      title: "Between-Story Missions (After #023 → Before #024)",
      placements: ["Siena Gorge"],
      sidequests: [56],
      missables: [7]
    },
    {
      key: "024",
      kind: "story",
      title: "Royal Valley (#024)",
      subtitle: "Ambervale",
      sidequests: [24],
    },
    {
      key: "post-024",
      kind: "between",
      title: "Post-Main Game (After #024)",
      sidequests: [87, 184, 185, 88, 89, 90, 186, 187, 188, 189, 190, 191, 67, 96, 192, 99, 193, 95, 98, 259, 260, 261, 263, 262, 284, 97],
      missables: [8,9,10,11]
    },
  ];

  const MapPanel: React.FC<{ placements: string[] }> = ({ placements }) => {
    return (
      <Panel
        title="World Map Placements"
        border="border-purple-600"
        buttonColor="bg-purple-600"
        tone="purple"
        right={<></>}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {placements.map((loc) => {
              const m = MAP_PLACEMENTS[loc];
              if (!m) return null;
              return (
                <div
                  key={loc}
                  className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/10 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                >
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300 min-w-[2rem]">
                    {m.number}.
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {m.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        <div className="space-y-3">
          <img
            src={mapGif}
            alt="FFTA World Map"
            className="w-full rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
          />
        </div>
      </Panel>
    );
  };

  const RefList: React.FC<{ type: "blue" | "cap" | "quest" | "miss"; names: (string[] | number[]) }> = ({
    type,
    names,
  }) => {
    const tagColor =
      type === "blue"
        ? "text-blue-700 dark:text-blue-300"
        : type === "cap"
        ? "text-green-700 dark:text-green-300"
        : type === "quest"
        ? "text-amber-700 dark:text-amber-300"
        : type === "miss"
        ? "text-red-700 dark:text-red-300"
        : "text-zinc-700 dark:text-zinc-300";
    return (
    <ul className="space-y-2">
      {names.map((n) => {
        // ----- BLUE -----
        if (type === "blue" && typeof n === "string") {
          const id = keyify(`blue:${n}`);
          const isChecked = !!checked[id];
          const b = BLUE_MAGIC_REF.find((x) => x.name === n);
          if (!b) return null;
          return (
            <li
              key={`blue-${n}`}
              className="whitespace-pre-line bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-blue-600 dark:accent-blue-400"
                  checked={isChecked}
                  onChange={() => setCheck(id)}
                />
                <div onClick={() => setCheck(id)} className="flex-1 cursor-pointer select-none">
                  <div className={`font-semibold ${tagColor}`}>
                    {b.name}{" "}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      MP {b.mp}
                    </span>
                  </div>
                  {/* Hide everything below when checked */}
                  {!isChecked && (
                    <>
                      {b.desc && (
                        <div className="text-sm text-zinc-800 dark:text-zinc-200">
                          {b.desc}
                        </div>
                      )}
                      <div className="text-xs mt-1 text-zinc-700 dark:text-zinc-300">
                        <div>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            From:
                          </span>{" "}
                          {b.from.join(", ")}
                        </div>
                        {b.sources.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {b.sources.filter((s) => s.type === "Clan").length > 0 && (
                              <div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  Clans:
                                </span>{" "}
                                {b.sources
                                  .filter((s) => s.type === "Clan")
                                  .map((s) => s.name)
                                  .join(", ")}
                              </div>
                            )}
                            {b.sources.filter((s) => s.type === "Mission").length > 0 && (
                              <div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  Missions:
                                </span>{" "}
                                {b.sources
                                  .filter((s) => s.type === "Mission")
                                  .map((s) => s.name)
                                  .join(", ")}
                              </div>
                            )}
                            {b.sources.filter((s) => s.type === "Turf").length > 0 && (
                              <div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  Turf Defense:
                                </span>{" "}
                                {b.sources
                                  .filter((s) => s.type === "Turf")
                                  .map((s) => s.name)
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                        {b.notes && (
                          <div className="mt-1 italic text-zinc-700 dark:text-zinc-300">
                            {b.notes}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        }

        // ----- CAPTURE -----
        if (type === "cap" && typeof n === "string") {
          const c = CAPTURE_REF.find((x) => x.monster === n);
          if (!c) return null;
          const id = keyify(`cap:${c.monster}`);
          const isChecked = !!checked[id];
          return (
            <li
              key={`cap-${n}`}
              className="whitespace-pre-line bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-green-600 dark:accent-green-400"
                  checked={isChecked}
                  onChange={() => setCheck(id)}
                />
                <div onClick={() => setCheck(id)} className="flex-1 cursor-pointer select-none">
                  <div className={`font-semibold ${tagColor}`}>
                    {c.monster}{" "}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({c.family})
                    </span>
                  </div>
                  {/* Hide everything below when checked */}
                  {!isChecked && (
                    <>
                      <div className="text-xs mt-1 space-y-1 text-zinc-900 dark:text-zinc-100">
                        {c.clans && (
                          <div>
                            <span className="font-semibold">Random Battles:</span>{" "}
                            <ul className="list-disc list-inside ml-4">
                              {c.clans.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {c.missions && (
                          <div>
                            <span className="font-semibold">Missions:</span>{" "}
                            <ul className="list-disc list-inside ml-4">
                              {c.missions.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {c.areas && (
                          <div>
                            <span className="font-semibold">Turf Defense:</span>{" "}
                            <ul className="list-disc list-inside ml-4">
                              {c.areas.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                        {c.enjoys && (
                          <>
                            <div className="font-semibold">Enjoys:</div>
                            <ul className="list-disc list-inside ml-4">
                              {c.enjoys.map((e, i) => (
                                <li key={i}>
                                  {e.item}{" "}
                                  <span className="text-xs text-gray-400">
                                    (Affection gained: {e.aff})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {c.spits && (
                          <>
                            <div className="font-semibold">Spits back:</div>
                            <ul className="list-disc list-inside ml-4">
                              {c.spits.map((e, i) => (
                                <li key={i}>
                                  {e.item}{" "}
                                  <span className="text-xs text-gray-400">
                                    (Affection gained: {e.aff})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      {c.notes && (
                        <div className="text-xs mt-1 italic text-zinc-700 dark:text-zinc-300">
                          {c.notes}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        }

        // ----- MISSION (NEW) -----
        if (type === "quest" && typeof n === "number") {
          const q = MISSION_REF.find((q) => q.number === n);
          if (!q) return null;
          if (n === 0 || n === -1) return null; // skip isekai and tutorial
          const id = questKey(n);
          const isChecked = !!checked[id];

          return (
            <li
              key={`mission-${n}`}
              className="whitespace-pre-line bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
            >
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-purple-600 dark:accent-purple-400"
                  checked={isChecked}
                  onChange={() => setCheck(id)}
                />
                <div>
                  <div className={`font-semibold ${tagColor}`}>
                    #{String(q.number).padStart(3, "0")} — {q.name}
                  </div>
                  {/* ---- Global Missables tied to this mission (injected) ---- */}
                  {(() => {
                      const related = getMissablesForMission(n);
                      if (!related.length) return null;
                      return (
                          <div className="mt-3">
                              <Panel
                                  title="Missables (Global)"
                                  border="border-red-600"
                                  buttonColor="bg-red-600"
                                  right={<></>}
                              >
                                  <ul className="space-y-2 w-full text-sm">
                                    {GLOBAL_MISSABLES.map((m) => (
                                      <MissableCard
                                        key={`gm-global-${m.id}`}
                                        m={m}
                                        checked={checked}
                                        setCheck={setCheck}
                                      />
                                    ))}
                                  </ul>
                              </Panel>
                          </div>
                      );
                  })()}

                  {/* Hide everything below when checked */}
                  {!isChecked && (
                    <>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{q.location}</span>
                      {q.description && (
                        <div className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
                          {q.description}
                        </div>
                      )}

                      <div className="text-xs mt-1 space-y-1 text-zinc-900 dark:text-zinc-100">
                        <KV l="Type" v={q.type} />
                        <KV l="Difficulty" v={q.difficulty} />
                        <KV l="Cost" v={q.cost} />
                        <KV l="Location" v={q.location} />
                        <List l="Prerequisites" a={q.prerequisites} />
                        <List l="Rewards" a={q.reward} />
                        <List l="Enemies" a={q.enemies} />
                      </div>
                    </>
                  )}
                </div>
              </label>
            </li>
          );
        }
        return null;
      })}
    </ul>
    );
  };

const KV = ({ l, v }: { l: string; v?: string }) =>
  v ? <div><b>{l}:</b> {v}</div> : null;

const List = ({ l, a }: { l: string; a?: string[] }) =>
  a && a.length ? (
    <div>
      <div className="font-semibold">{l}:</div>
      <ul className="list-disc list-inside">
        {a.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  ) : null;

  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-zinc-100 dark:bg-zinc-900 transition-colors">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl ring-1 ring-zinc-950/10 dark:ring-white/10 shadow-sm">
        <h1 className="text-3xl font-bold mb-1">
          FFTA Story Progression Guide
        </h1>
        <p className="text-sm opacity-90">
          Story • Between-Story Missions • Blue Magic • Captures • Missables • Map
          Placements • Recruits
        </p>
      </div>

      <br></br>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Save or load your progress via a file.
      </div>
      <div className="flex items-center gap-2">
          <button
              onClick={saveProgressToFile}
              className="px-3 py-1 rounded text-white bg-emerald-600 hover:bg-emerald-700 text-sm"
          >
              Save Progress
          </button>
          <button
              onClick={triggerLoadPicker}
              className="px-3 py-1 rounded text-white bg-indigo-600 hover:bg-indigo-700 text-sm"
          >
              Load Progress
          </button>
          <input
              ref={loadInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLoadFile(f);
                  e.currentTarget.value = "";
              }}
          />
      </div>
      </div>


      <div className="mt-3 grid grid-cols-1 gap-3">
        <Panel
          title="Blue Magic Reference"
          subtitle='When starting a battle, it is helpful to check the status of monsters and restart if it does not know the respective Blue Magic. Blue Magic can also be learned from enemy Blue Mages.'
          border="border-blue-600"
          buttonColor="bg-blue-600"
          tone="blue"
          right={
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <ProgressBar
                label="Blue Magic"
                done={blueDone}
                total={blueTotal}
                color="blue"
              />
            </div>
          }
        >
          <RefList type="blue" names={BLUE_MAGIC_REF.map((b) => b.name)} />
        </Panel>

        <Panel
          title="Capturable Monsters Reference"
          subtitle='You cannot capture a monster if it is asleep, charmed, or the last enemy on the field. Plan accordingly!'
          border="border-green-600"
          buttonColor="bg-green-600"
          tone="green"
          right={
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <ProgressBar
                label="Captures"
                done={capDone}
                total={capTotal}
                color="green"
              />
            </div>
          }
        >
          <CollapsibleTwoTables
            title="Affection & Items Cheatsheet"
            defaultOpen={false}
            tone="neutral"                      // gives sensible defaults
            border="border-zinc-600"         // same as Panel border
            text="text-zinc-200"             // table text tone
            headerBg="bg-zinc-900/10"        // header/thead background
            rowBg="bg-zinc-950/10"           // every cell/row background
            divider="divide-white/10"         // thin inner dividers
            leftTitle="Affection Ranges"
            leftRows={leftRows}
            leftColumns={[
              { key: "affection", header: "Affection", className: "w-28" },
              { key: "response", header: "Response" },
            ]}
            rightTitle="Items That Increase Affection"
            rightRows={rightRows}
            rightColumns={[
              { key: "item", header: "Item" },
              { key: "affection", header: "Affection", className: "w-28" },
              { key: "max", header: "Max", className: "w-20" },
            ]}
          />
          <RefList type="cap" names={CAPTURE_REF.map((c) => c.monster)} />
        </Panel>

        <Panel
          title="Mission Reference"
          subtitle='If a quest does not appear, you may need to accept quests to "empty" your available quest slots.'
          border="border-amber-600"
          buttonColor="bg-amber-600"
          tone="amber"
          right={
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <ProgressBar
                label="Missions"
                done={questDone}
                total={questTotal}
                color="amber"
              />
            </div>
          }
        >
          <RefList type="quest" names={MISSION_REF.map((q) => q.number)} />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel
          title="Missables & Warnings"
          subtitle='Take a moment to review the missables and warnings before proceeding to avoid later heartache!'
          border="border-red-600"
          buttonColor="bg-red-600"
          tone="red"
          right={
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <ProgressBar
                label="Missables"
                done={missDone}
                total={missTotal}
                color="red"
              />
            </div>
          }
        >
          <ul className="space-y-2 w-full text-sm">
            {GLOBAL_MISSABLES.map((m) => (
              <MissableCard
                key={`gm-global-${m.id}`}
                m={m}
                checked={checked}
                setCheck={setCheck}
              />
            ))}
          </ul>
        </Panel>
      </div>

      {screenMode !== "idle" && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div className="relative mx-4 w-full max-w-md rounded-2xl shadow-lg ring-1 ring-white/10 bg-zinc-100 dark:bg-zinc-900">
              <div className="px-5 py-4 border-b border-zinc-200/60 dark:border-white/10">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {screenMode === "saving" ? "Saving to Slot 1..." : "Loading from Slot 1..."}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Please wait
                  </p>
              </div>

              <div className="px-5 py-6">
                  {/* Faux save slots UI to give that game feel */}
                  <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-xl p-3 ring-1 ring-zinc-300 dark:ring-white/10 bg-white dark:bg-zinc-800">
                          <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg ring-1 ring-zinc-300 dark:ring-white/10" />
                              <div>
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                      Slot 1
                                  </div>
                                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      {screenMode === "saving" ? "Writing save data..." : "Reading save data..."}
                                  </div>
                              </div>
                          </div>
                          {/* Simple spinner */}
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                      </div>
                      <div className="opacity-50 flex items-center justify-between rounded-xl p-3 ring-1 ring-zinc-300 dark:ring-white/10 bg-white dark:bg-zinc-800">
                          <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg ring-1 ring-zinc-300 dark:ring-white/10" />
                              <div>
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                      Slot 2
                                  </div>
                                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      Empty
                                  </div>
                              </div>
                          </div>
                          <div className="h-5 w-5 rounded-full border-2 border-transparent" />
                      </div>
                      <div className="opacity-50 flex items-center justify-between rounded-xl p-3 ring-1 ring-zinc-300 dark:ring-white/10 bg-white dark:bg-zinc-800">
                          <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg ring-1 ring-zinc-300 dark:ring-white/10" />
                              <div>
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                      Slot 3
                                  </div>
                                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      Empty
                                  </div>
                              </div>
                          </div>
                          <div className="h-5 w-5 rounded-full border-2 border-transparent" />
                      </div>
                  </div>
              </div>

              <div className="px-5 py-4 border-t border-zinc-200/60 dark:border-white/10 text-right">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {screenMode === "saving" ? "Saving to Slot 1..." : "Loading from Slot 1..."}
                  </span>
              </div>
          </div>
      </div>
  )}


      <div className="mt-4 space-y-2">
        {blocks.map((b) => {
          const isOpen = !!expanded[b.key];
          const blueNames = b.blue || [];
          const capNames = b.caps || [];
          const recs = b.recruits || [];
          const miss = b.missables || [];
          const quest = b.sidequests || [];

          const blueDoneLocal = blueNames.reduce(
            (n, b) => n + (checked[keyify(`blue:${b}`)] ? 1 : 0),
            0
          );
          const capDoneLocal = capNames.reduce(
            (n, c) => n + (checked[keyify(`cap:${c}`)] ? 1 : 0),
            0
          );
          const missDoneLocal = miss.reduce(
            (n, m) => n + (checked[keyify(`miss-global:${m}`)] ? 1 : 0),
            0
          );
          const questDoneLocal = quest.reduce(
            (n, q) => n + (checked[keyify(`quest-global:${q}`)] ? 1 : 0),
            0
          );

          return (
            <div
              key={b.key}
              className={`rounded-2xl overflow-hidden ring-1 ring-zinc-950/10 dark:ring-white/10 transition-colors ${
                b.kind === "story"
                  ? "bg-amber-50 dark:bg-amber-900/10"
                  : "bg-white dark:bg-zinc-800"
              }`}
            >
              <div
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  b.kind === "story"
                    ? "hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/70"
                }`}
                onClick={() => toggle(b.key)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                      {b.title}
                    </span>
                    {b.subtitle && (
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        ({b.subtitle})
                      </span>
                    )}
                    {b.placements && b.placements.length > 0 && (
                      <Tag color="purple">
                        <MapPin className="w-3 h-3" />
                        Place #
                        {b.placements
                          .map((l) => MAP_PLACEMENTS[l]?.number)
                          .filter(Boolean)
                          .join(", #")}
                      </Tag>
                    )}
                    {blueNames.length > 0 && (
                      <Tag color="blue">
                        Blue Magic {blueDoneLocal}/{blueNames.length}
                      </Tag>
                    )}
                    {capNames.length > 0 && (
                      <Tag color="green">
                        Captures {capDoneLocal}/{capNames.length}
                      </Tag>
                    )}
                    {b.kind === "between" && quest.length > 0 && (
                      <Tag color="amber">
                        Sidequests {questDoneLocal}/{quest.length}
                      </Tag>
                    )}
                    {miss.length > 0 && (
                      <Tag color="red">
                        Missables {missDoneLocal}/{miss.length}
                      </Tag>
                    )}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="text-zinc-500" />
                ) : (
                  <ChevronDown className="text-zinc-500" />
                )}
              </div>

              {isOpen && (
                <div className="p-4 space-y-4 border-t border-zinc-200 dark:border-zinc-800">
                  {b.kind === "story" && quest.map((num) => {
                          const id = keyify(`quest-global:${num}`);
                          const q = missionMap.get(num);
                          const isChecked = !!checked[id];
                          return (
                            <li
                              key={num}
                              className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                            >
                              <label htmlFor={`side-${num}`} className="w-full text-zinc-800 dark:text-zinc-200 w-full cursor-pointer select-none">
                                {q ? (
                                  <>
                                    <div className="italic">
                                      {q.strategy &&
                                      q.strategy.length ? (
                                        <pre className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                                          {q.strategy}
                                        </pre>
                                      ) : (
                                        "None"
                                      )}
                                    </div>

                                    {/* Related global missables for this mission (injected) */}
                                    {q && !isChecked && (() => {
                                        const related = getMissablesForMission(num);
                                        if (!related.length) return null;
                                        return (
                                            <div className="mt-2">
                                                <ul className="space-y-2 w-full">
                                                    {related.map((m) => (
                                                        <MissableCard
                                                            key={`gm-side-${num}-${m.id}`}
                                                            m={m}
                                                            checked={checked}
                                                            setCheck={setCheck}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })()}
                                  </>
                                ) : (
                                  <div className="font-semibold">
                                    No strategy available. 
                                  </div>
                                )}
                              </label>
                            </li>
                          );
                        })}
                  {b.placements && b.placements.length > 0 && (
                    <MapPanel placements={b.placements} />
                  )}

                  {blueNames.length > 0 && (
                    <Panel
                      title="Blue Magic Now Available"
                      border="border-blue-600"
                      buttonColor="bg-blue-600"
                      tone="blue"
                      right={
                        <div className="w-full sm:w-auto sm:min-w-[180px]">
                          <ProgressBar
                            label="Blue Magic"
                            done={blueDoneLocal}
                            total={blueNames.length}
                            color="blue"
                          />
                        </div>
                      }
                    >
                      <RefList type="blue" names={blueNames} />
                    </Panel>
                  )}

                  {capNames.length > 0 && (
                    <Panel
                      title="Capturable Monsters Now Available"
                      border="border-green-600"
                      buttonColor="bg-green-600"
                      tone="green"
                      right={
                        <div className="w-full sm:w-auto sm:min-w-[180px]">
                          <ProgressBar
                            label="Captures"
                            done={capDoneLocal}
                            total={capNames.length}
                            color="green"
                          />
                        </div>
                      }
                    >
                      <RefList type="cap" names={capNames} />
                    </Panel>
                  )}

                  {b.kind === "between" && quest.length > 0 && (
                    <Panel
                      title="Side Missions Now Available"
                      border="border-amber-600"
                      buttonColor="bg-amber-600"
                      tone="amber"
                      right={
                        <div className="w-full sm:w-auto sm:min-w-[180px]">
                          <ProgressBar
                            label="Sidequests"
                            done={questDoneLocal}
                            total={quest.length}
                            color="amber"
                          />
                        </div>
                      }
                    >
                      <ul className="space-y-2 text-sm">
                        {quest.map((num) => {
                          const id = keyify(`quest-global:${num}`);
                          const q = missionMap.get(num);
                          const isChecked = !!checked[id];
                          return (
                            <li
                              key={num}
                              className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                            >
                              <label className="flex w-full items-start gap-2">
                              <input
                                id={`side-${num}`}
                                type="checkbox" className="mt-0.5 accent-amber-600 dark:accent-amber-400"
                                checked={!!checked[id]}
                                onChange={() => setCheck(id)}
                              />
                              <label htmlFor={`side-${num}`} className="w-full text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                                {q ? (
                                  <>
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                      #{String(q.number).padStart(3, "0")} —{" "}
                                      {q.name}
                                    </div>
                                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      {!isChecked && q.prerequisites && (
                                        <>
                                      <span className="font-semibold">
                                        Prerequisites:
                                      </span>{" "}
                                        <ul className="list-disc ml-5 mt-1">
                                          {q.prerequisites.map((p, i) => (
                                            <li key={i}>{p}</li>
                                          ))}
                                        </ul>
                                        </>
                                      )}
                                    </div>

                                    {/* Related global missables for this mission (injected) */}
                                    {q && !isChecked && (() => {
                                        const related = getMissablesForMission(num);
                                        if (!related.length) return null;
                                        return (
                                            <div className="mt-2">
                                                <ul className="space-y-2 w-full">
                                                    {related.map((m) => (
                                                        <MissableCard
                                                            key={`gm-side-${num}-${m.id}`}
                                                            m={m}
                                                            checked={checked}
                                                            setCheck={setCheck}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })()}
                                  </>
                                ) : (
                                  <div className="font-semibold">
                                    #{String(num).padStart(3, "0")} — Unknown
                                    quest
                                  </div>
                                )}
                              </label>
                            </label>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}


                  {/* --- Missables (Local) --- */}
                  {(Array.isArray(b.missables) && b.missables.length > 0) && (() => {
                      // Look up the GlobalMissable objects for the IDs listed on this block
                      const localMiss = b.missables
                          .map((id) => GLOBAL_MISSABLES.find((m) => m.id === id))
                          .filter((m): m is GlobalMissable => !!m);

                      if (localMiss.length === 0) return null;

                      return (
                          <Panel
                              title="Missables Now Available"
                              border="border-red-600"
                              buttonColor="bg-red-600"
                              tone="red"
                              right={
                                <div className="w-full sm:w-auto sm:min-w-[180px]">
                                  <ProgressBar
                                    label="Missables"
                                    done={missDoneLocal}
                                    total={miss.length}
                                    color="red"
                                  />
                                </div>
                              }

                          >
                              <ul className="space-y-2 w-full text-sm">
                                  {localMiss.map((m) => (
                                      <MissableCard
                                          key={`gm-local-${m.id}`}
                                          m={m}
                                          checked={checked}
                                          setCheck={setCheck}
                                      />
                                  ))}
                              </ul>
                          </Panel>
                      );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-800/90 text-zinc-200 p-4 rounded-b-2xl text-center text-sm mt-4 ring-1 ring-white/10">
        <p>
          Check off tasks as you complete them. Show/Hide panels keep each
          section compact.
        </p>
      </div>
    </div>
  );
};

export default FFTAProgressionGuide;
