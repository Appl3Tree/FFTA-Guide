import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const keyify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

type RefSource = { type: 'Clan' | 'Mission' | 'Turf' | 'Area'; name: string };

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
  missions?: string[];
  areas?: string[];
  enjoys?: string;
  spits?: string;
};

type Block = {
  key: string;
  kind: 'story' | 'between';
  title: string;
  subtitle?: string;
  placements?: string[];
  blue?: string[];
  caps?: string[];
  recruits?: string[];
  missables?: string[];
  side?: { id: string; name: string; appears?: string }[];
};

const BLUE_MAGIC_REF: BlueRef[] = [
  { name: 'Goblin Punch', mp: 8, desc: 'Damage varies; can be very high or very low.', from: ['Goblin'], sources: [
    { type: 'Mission', name: '#032 Tower Ruins' },
    { type: 'Mission', name: '#037 Village Hunt' },
    { type: 'Mission', name: '#049 A Lost Ring' },
    { type: 'Mission', name: '#055 White Flowers' },
    { type: 'Mission', name: '#044 Snow in Lutia' },
    { type: 'Mission', name: '#001 Herb Picking (too early to learn/capture)' }
  ], notes: 'Only appears in missions. If co-op is available, “Newbie Hunt” works. A Paladin in “The Dark Blade” knows it.' },
  { name: 'Magic Hammer', mp: 8, desc: 'Deals MP damage.', from: ['Red Cap'], sources: [ { type: 'Clan', name: 'Tubola Bandits' }, { type: 'Turf', name: 'Help Helje' } ] },
  { name: 'Acid', mp: 12, desc: 'Inflicts a random status ailment.', from: ['Flankind (Jelly / Ice Flan / Cream)'], sources: [] },
  { name: 'Blowup', mp: 2, desc: 'Self‑destruct (adjacent AoE). Needs critical HP if using Control.', from: ['Bomb', 'Grenade'], sources: [ { type: 'Turf', name: 'Help Roda' }, { type: 'Clan', name: 'Wild Monsters' } ] },
  { name: 'Mighty Guard', mp: 8, desc: 'Buff: +W.Def & +M.Res for battle.', from: ['Icedrake'], sources: [ { type: 'Clan', name: 'Wild Monsters' } ] },
  { name: 'Guard-Off', mp: 10, desc: 'Debuff: -W.Def & -M.Res for battle.', from: ['Firewyrm'], sources: [ { type: 'Clan', name: 'Roda Dragons' } ] },
  { name: 'Dragon Force', mp: 12, desc: 'Buff: +W.Atk & +M.Atk.', from: ['Thundrake'], sources: [
    { type: 'Mission', name: '#011 Pale Company' },
    { type: 'Mission', name: '#102 Wyrms Awaken' },
    { type: 'Mission', name: "#066 A Dragon's Aid" }
  ], notes: 'Only found in missions—prioritize when available.' },
  { name: 'Night', mp: 24, desc: 'Puts everyone (except caster) to sleep.', from: ['Lamia'], sources: [ { type: 'Clan', name: 'Jagd Emissaries' } ] },
  { name: 'Twister', mp: 20, desc: 'Halves HP; multi‑target.', from: ['Lilith'], sources: [ { type: 'Clan', name: 'Tubola Bandits' } ] },
  { name: 'LV3 Def-Less', mp: 12, desc: 'DEF/RES ↓ if level is a multiple of 3.', from: ['Antlion', 'Jawbreaker'], sources: [ { type: 'Clan', name: 'Antlions' } ] },
  { name: 'Matra Magic', mp: 24, desc: 'Swap target HP and MP.', from: ['Toughskin'], sources: [ { type: 'Clan', name: 'Tubola Bandits' } ] },
  { name: 'Poison Claw', mp: 8, desc: 'Damage + Poison.', from: ['Red Panther'], sources: [ { type: 'Clan', name: 'Kudik Beasts' } ] },
  { name: 'Hastebreak', mp: 12, desc: 'Stop if Hasted; Slow otherwise.', from: ['Coeurl'], sources: [ { type: 'Turf', name: 'Help Nargai' }, { type: 'Turf', name: 'Help Helje' } ] },
  { name: 'Bad Breath', mp: 20, desc: 'Inflicts 5 random status ailments.', from: ['Malboro', 'Big Malboro'], sources: [ { type: 'Turf', name: 'Help Eluut' } ] },
  { name: 'Stare', mp: 12, desc: 'Confuse if target faces caster.', from: ['Floateye'], sources: [ { type: 'Clan', name: 'Aisen Ghosts' } ] },
  { name: 'Roulette', mp: 20, desc: 'Random instant KO to one unit.', from: ['Ahriman'], sources: [ { type: 'Clan', name: 'Bloodthirsters' }, { type: 'Clan', name: 'Jagd Emissaries' } ], notes: 'Use Auto‑Life (Angel Ring) or Zombify to learn safely.' },
  { name: 'Drain Touch', mp: 10, desc: 'Life drain melee.', from: ['Zombie'], sources: [ { type: 'Clan', name: 'Aisen Ghosts' }, { type: 'Clan', name: 'Tubola Bandits' } ] },
  { name: 'LV? S-Flare', mp: 30, desc: 'Hits all units sharing same last digit of level (including caster).', from: ['Vampire'], sources: [ { type: 'Clan', name: 'Bloodthirsters' } ] },
  { name: 'White Wind', mp: 12, desc: 'Heal AoE for caster HP amount.', from: ['Sprite'], sources: [ { type: 'Clan', name: 'Tricky Spirits' }, { type: 'Turf', name: 'Help Eluut' }, { type: 'Clan', name: 'Tubola Bandits' }, { type: 'Turf', name: 'Help Helje' } ] },
  { name: 'Angel Whisper', mp: 24, desc: 'Heal + Auto‑Life.', from: ['Titania'], sources: [ { type: 'Clan', name: 'Tricky Spirits' } ] }
];

const CAPTURE_REF: CapRef[] = [
  { monster: 'Goblin', family: 'Goblinkind', missions: ['#055 White Flowers', '#049 A Lost Ring', '#044 Snow in Lutia', '#037 Village Hunt', '#032 Tower Ruins', '#001 Herb Picking'] },
  { monster: 'Red Cap', family: 'Goblinkind', clans: ['Clan Hounds', 'Tricky Spirits'], missions: ['#100 Fiend Run', '#055 White Flowers', '#001 Herb Picking'], areas: ['Help ____'] },
  { monster: 'Jelly', family: 'Flankind', clans: ['Roda Dragons', 'Wild Monsters'], missions: ['#093 Flan Breakout!', '#059 Sketchy Thief'], areas: ['Help ____'] },
  { monster: 'Ice Flan', family: 'Flankind', clans: ['Roaming Naiads'], missions: ['#109 Snow Fairy', '#093 Flan Breakout!', '#078 Water Sigil', '#065 Exploration', '#046 Prof in Trouble', '#007 Diamond Rain'], areas: ['Help ____'] },
  { monster: 'Cream', family: 'Flankind', clans: ['Tricky Spirits'], missions: ['#093 Flan Breakout!', '#052 Friend Trouble', '#004 Desert Peril'], areas: ['Help ____'] },
  { monster: 'Bomb', family: 'Bombkind', clans: ['Antlions', 'Roda Dragons'], missions: ['#107 Old Friends', '#074 Cadoan Watch', '#063 Missing Prof.', '#047 Hot Recipe', '#038 Fire! Fire!', '#034 Magewyrm', '#032 Tower Ruins', '#007 Diamond Rain'], areas: ['Help Roda!'] },
  { monster: 'Grenade', family: 'Bombkind', clans: ['Lost Monsters', 'Wild Monsters'], missions: ['#109 Snow Fairy', '#065 Exploration'], areas: ['Help Roda!'] },
  { monster: 'Icedrake', family: 'Dragonkind', clans: ['Roaming Naiads', 'Wild Monsters'], missions: ['#102 Wyrms Awaken', '#087 Free Bervenia!', "#066 A Dragon's Aid", '#063 Missing Prof.', '#034 Magewyrm', '#032 Tower Ruins', '#031 Ruby Red', '#022 To Ambervale', '#011 Pale Company', '#007 Diamond Rain'] },
  { monster: 'Firewyrm', family: 'Dragonkind', clans: ['Roda Dragons'], missions: ['#102 Wyrms Awaken', "#066 A Dragon's Aid", '#054 For A Song', '#047 Hot Recipe', '#034 Magewyrm', '#032 Tower Ruins', '#031 Ruby Red', '#011 Pale Company'], areas: ['Help Roda!'] },
  { monster: 'Thundrake', family: 'Dragonkind', missions: ['#102 Wyrms Awaken', "#066 A Dragon's Aid", '#011 Pale Company'] },
  { monster: 'Lamia', family: 'Lamiakind', clans: ['Clan Hounds', 'Jagd Emissaries', 'Roaming Naiads'], missions: ['#076 Fire Sigil', '#058 Royal Ruins', '#049 A Lost Ring', '#007 Diamond Rain'], areas: ['Help ____'] },
  { monster: 'Lilith', family: 'Lamiakind', clans: ['Roaming Naiads'], missions: ['#049 A Lost Ring', '#022 To Ambervale'], areas: ['Help ____'] },
  { monster: 'Antlion', family: 'Antlionkind', clans: ['Antlions', 'Kudik Beasts'], missions: ['#107 Old Friends', '#055 White Flowers', '#051 Desert Rose', '#037 Village Hunt', '#034 Magewyrm', '#012 Jagd Hunt', '#004 Desert Peril'], areas: ['Help Giza!'] },
  { monster: 'Jawbreaker', family: 'Antlionkind', clans: ['Aisen Ghosts', 'Antlions'], missions: ['#065 Exploration', '#051 Desert Rose', '#022 To Ambervale'], areas: ['Help Giza!'] },
  { monster: 'Toughskin', family: 'Antlionkind', missions: ['#065 Exploration', '#012 Jagd Hunt', '#034 Magewyrm'] },
  { monster: 'Red Panther', family: 'Pantherkind', clans: ['Kudik Beasts', 'Tribites'], missions: ['#054 For A Song', '#052 Friend Trouble', '#051 Desert Rose', '#045 Frosty Mage', '#044 Snow in Lutia', '#034 Magewyrm', '#004 Desert Peril'], areas: ['Help ____'] },
  { monster: 'Coeurl', family: 'Pantherkind', clans: ['Clan Hounds', 'Tribites', 'Wild Monsters'], missions: ['#100 Fiend Run', '#065 Exploration', '#052 Friend Trouble', '#037 Village Hunt', '#022 To Ambervale', '#004 Desert Peril'], areas: ['Help Nargai', 'Help Helje'] },
  { monster: 'Malboro', family: 'Malborokind', clans: ['Lost Monsters', 'Wild Monsters'], missions: ['#105 Smuggler Bust', '#085 Foreign Fiend', '#054 For A Song', '#032 Tower Ruins'], areas: ['Help Eluut'] },
  { monster: 'Big Malboro', family: 'Malborokind', clans: ['Lost Monsters'], missions: ['#100 Fiend Run', '#085 Foreign Fiend', '#022 To Ambervale'], areas: ['Help Eluut'] },
  { monster: 'Floateye', family: 'Ahrimankind', clans: ['Aisen Ghosts', 'Lost Monsters'], missions: ['#050 Staring Eyes', '#045 Frosty Mage', '#005 Twisted Flow'] },
  { monster: 'Ahriman', family: 'Ahrimankind', clans: ['Bloodthirsters', 'Jagd Emissaries'], missions: ['#100 Fiend Run', '#087 Free Bervenia!', '#063 Missing Prof.', '#050 Staring Eyes', '#005 Twisted Flow'] },
  { monster: 'Sprite', family: 'Fairykind', clans: ['Tricky Spirits', 'Tubola Bandits'], areas: ['Help Eluut', 'Help Helje'] },
  { monster: 'Titania', family: 'Fairykind', clans: ['Tricky Spirits'] },
  { monster: 'Vampire', family: 'Undead', clans: ['Bloodthirsters'], missions: ['#100 Fiend Run'] },
  { monster: 'Zombie', family: 'Undead', clans: ['Aisen Ghosts', 'Tubola Bandits'] }
];

const MAP_PLACEMENTS: Record<string, { number: number; title: string; reward?: string | null }> = {
  'Sprohm': { number: 14, title: 'Sprohm' },
  'Lutia Pass': { number: 8, title: 'Lutia Pass' },
  'Nubswood': { number: 9, title: 'Nubswood' },
  'Eluut Sands': { number: 6, title: 'Eluut Sands' },
  'Ulei River': { number: 5, title: 'Ulei River' },
  'Cadoan': { number: 15, title: 'Cadoan' },
  'Aisenfield': { number: 18, title: 'Aisenfield' },
  'Roda Volcano': { number: 4, title: 'Roda Volcano' },
  'Koringwood': { number: 10, title: 'Koringwood' },
  'Salikawood': { number: 22, title: 'Salikawood' },
  'Nargai Cave': { number: 13, title: 'Nargai Cave' },
  'Baguba Port': { number: 16, title: 'Baguba Port' },
  'Dorsa Caravan': { number: 7, title: 'Dorsa Caravan' },
  'Kudik Caves': { number: 24, title: 'Kudik Caves' },
  'Jeraw Sands': { number: 2, title: 'Jeraw Sands' },
  'Muscadet': { number: 21, title: 'Muscadet' },
  'Materiwood': { number: 20, title: 'Materiwood' },
  'Ozmonfield': { number: 23, title: 'Ozmonfield' },
  'Deti Plains': { number: 19, title: 'Deti Plains' },
  'Tubola Cave': { number: 20, title: 'Tubola Cave' },
  'Ahli Desert': { number: 3, title: 'Ahli Desert' },
  'Delia Dunes': { number: 17, title: 'Delia Dunes' },
  'Gotor Sands': { number: 12, title: 'Gotor Sands' },
  'Siena Gorge': { number: 25, title: 'Siena Gorge' },
  'Helj': { number: 26, title: 'Helj' },
};

const GLOBAL_MISSABLES: { id: string; text: string }[] = [
  { id: 'miss-eldas-cup', text: 'Dispatch: Caravan Guard (#168) — Do NOT complete until Eldena joins. Completing spends Elda’s Cup.' },
  { id: 'miss-hero-gaol', text: 'Use mission item “The Hero Gaol” (from #062 Oasis Frogs) on missions to recruit Lini.' },
  { id: 'miss-snake-shield', text: 'Use mission item “Snake Shield” (from #165 Hundred‑Eye) on missions to recruit Cheney.' },
  { id: 'miss-missing-prof', text: 'Tubola Caves: Missing Professor (#063) — SAVE before mission. Quin may ask to join; if not, reload. Not repeatable.' },
  { id: 'miss-wyrmstone', text: "Delia Dunes: A Dragon's Aid (#066) — Do NOT complete until Pallanza joins. Completing spends Wyrmstone." },
  { id: 'miss-clan-league', text: 'Mission #043E Clan League — repeatable source for recruiting Littlevilli (random after completion).' },
  { id: 'miss-ezel', text: 'Koringwood: Reconciliation → then Bored — Ezel offers to join. Avoid completing simultaneously with Left Behind / A Maiden’s Cry.' },
  { id: 'miss-ritz', text: 'Lutia Pass: Mortal Snow — Ritz offers to join. Avoid completing at same time as Left Behind / A Maiden’s Cry.' },
  { id: 'miss-babus', text: 'Dispatch: Left Behind → With Babus → Doned Here — Babus offers to join. Avoid finishing with A Maiden’s Cry; accept “With Babus” before moving.' },
  { id: 'miss-shara', text: 'Dispatch: A Maiden’s Cry (both versions) — Shara offers to join. Do NOT complete at the same time as Left Behind.' },
  { id: 'miss-cid', text: 'After all 300 missions → “Cleanup Time” → Cid offers to join.' },
  { id: 'miss-blue-goblins', text: 'Blue Goblins eventually disappear — learn Goblin Punch & capture early (#001, #032, #037, #044, #049, #055).' },
  { id: 'miss-thundrakes', text: 'Thundrakes disappear — learn Dragon Force and capture during #011 / #066 / #102 (and more).' },
  { id: 'miss-free-bervenia', text: '⚠️ #087 Free Bervenia bug — if failed, it may not reappear.' },
];

const Tag: React.FC<{ color: 'blue' | 'green' | 'purple' | 'red'; children: React.ReactNode }> = ({ color, children }) => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
  };
  return <span className={`text-xs px-2 py-1 rounded ${map[color]} inline-flex items-center gap-1`}>{children}</span>;
};

const ProgressBar: React.FC<{ done: number; total: number; label: string; color: 'blue'|'green'|'purple'|'red' }> = ({done,total,label,color})=>{
  const percent = pct(done,total);
  const palette: Record<string,string> = { blue:'bg-blue-500', green:'bg-green-500', purple:'bg-purple-500', red:'bg-red-500' };
  return (
    <div className="text-xs">
      <div className="flex justify-between"><span>{label}</span><span>{done}/{total} ({percent}%)</span></div>
      <div className="h-2 bg-gray-200 rounded">
        <div className={`h-2 ${palette[color]} rounded`} style={{width:`${percent}%`}}/>
      </div>
    </div>
  );
};

const Panel: React.FC<{ title: string; border: string; buttonColor: string; children: React.ReactNode; right?: React.ReactNode }> = ({title,border,buttonColor,children,right})=>{
  const [open,setOpen]=useState(false);
  return (
    <div className={`border-2 ${border} rounded p-3`}>
      <div className="flex items-center justify-between">
        <h4 className="font-bold">{title}</h4>
        <div className="flex items-center gap-2">
          {right}
          <button className={`${buttonColor} text-white text-sm px-3 py-1 rounded`} onClick={()=>setOpen(o=>!o)}>{open?'Hide':'Show'}</button>
        </div>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FFTAProgressionGuide: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setExpanded(p => ({ ...p, [k]: !p[k] }));
  const setCheck = (k: string, v?: boolean) => setChecked(p => ({ ...p, [k]: v ?? !p[k] }));

  const blueTotal = BLUE_MAGIC_REF.length;
  const blueDone = useMemo(() => BLUE_MAGIC_REF.reduce((n, b) => n + (checked[keyify(`blue:${b.name}`)] ? 1 : 0), 0), [checked]);
  const capTotal = CAPTURE_REF.length;
  const capDone = useMemo(() => CAPTURE_REF.reduce((n, c) => n + (checked[keyify(`cap:${c.monster}`)] ? 1 : 0), 0), [checked]);
  const missTotal = GLOBAL_MISSABLES.length;
  const missDone = useMemo(() => GLOBAL_MISSABLES.reduce((n, m) => n + (checked[keyify(`miss-global:${m.id}`)] ? 1 : 0), 0), [checked]);

  const blocks: Block[] = [
    { key:'001', kind:'story', title:'#001 Herb Picking', subtitle:'Giza Plains' },
    { key:'post-001', kind:'between', title:'Between‑Story Tasks (After #001 → Before #002)', placements:['Lutia Pass'], blue:['Goblin Punch'], caps:['Goblin','Red Cap'], side:[{ id:'025', name:'Cave Research', appears:'Kingmoon only' }, { id:'050', name:'Staring Eyes', appears:'After #001' }] },

    { key:'002', kind:'story', title:'#002 Thesis Hunt', subtitle:'Lutia Pass' },
    { key:'post-002', kind:'between', title:'Between‑Story Tasks (After #002 → Before #003)', placements:['Nubswood'] },

    { key:'003', kind:'story', title:'#003 The Cheetahs', subtitle:'Nubswood' },
    { key:'post-003', kind:'between', title:'Between‑Story Tasks (After #003 → Before #004)', placements:['Eluut Sands'], blue:['Acid','Poison Claw','Hastebreak'], caps:['Cream','Red Panther','Antlion','Coeurl','Jelly'] },

    { key:'004', kind:'story', title:'#004 Desert Peril', subtitle:'Eluut Sands' },
    { key:'post-004', kind:'between', title:'Between‑Story Tasks (After #004 → Before #005)', placements:['Ulei River'] },

    { key:'005', kind:'story', title:'#005 Twisted Flow', subtitle:'Ulei River' },
    { key:'post-005', kind:'between', title:'Between‑Story Tasks (After #005 → Before #006)', placements:['Cadoan'], blue:['Stare','Roulette','Drain Touch'], side:[{ id:'069', name:'To Be Free', appears:'Read rumor “Area Freed!”' }] },

    { key:'006', kind:'story', title:'#006 Antilaws', subtitle:'Cadoan' },
    { key:'post-006', kind:'between', title:'Between‑Story Tasks (After #006 → Before #007)', placements:['Aisenfield'] },

    { key:'007', kind:'story', title:'#007 Diamond Rain', subtitle:'Aisenfield' },
    { key:'post-007', kind:'between', title:'Between‑Story Tasks (After #007 → Before #008)', placements:['Roda Volcano'], blue:['Blowup','Night','Mighty Guard'], caps:['Bomb','Icedrake','Lamia'] },

    { key:'008', kind:'story', title:'#008 Hot Awakening', subtitle:'Roda Volcano' },
    { key:'post-008', kind:'between', title:'Between‑Story Tasks (After #008 → Before #009)', placements:['Koringwood'], caps:['Firewyrm','Bomb'] },

    { key:'009', kind:'story', title:'#009 Magic Wood', subtitle:'Koringwood' },
    { key:'post-009', kind:'between', title:'Between‑Story Tasks (After #009 → Before #010)', placements:['Salikawood'] },

    { key:'010', kind:'story', title:'#010 Emerald Keep', subtitle:'Salikawood' },
    { key:'post-010', kind:'between', title:'Between‑Story Tasks (After #010 → Before #011)', placements:['Nargai Cave'] },

    { key:'011', kind:'story', title:'#011 Pale Company', subtitle:'Nargai Cave' },
    { key:'post-011', kind:'between', title:'Between‑Story Tasks (After #011 → Before #012)', placements:['Baguba Port'], blue:['Dragon Force','Mighty Guard','Guard-Off'], caps:['Icedrake','Firewyrm','Thundrake'] },

    { key:'012', kind:'story', title:'#012 The Bounty', subtitle:'Baguba Port' },
    { key:'post-012', kind:'between', title:'Between‑Story Tasks (After #012 → Before #013)', placements:['Dorsa Caravan'], caps:['Antlion','Toughskin'] },

    { key:'013', kind:'story', title:'#013 Golden Clock', subtitle:'Dorsa Caravan' },
    { key:'post-013', kind:'between', title:'Between‑Story Tasks (After #013 → Before #014)', placements:['Kudik Caves'] },

    { key:'014', kind:'story', title:'#014 The Big Find', subtitle:'Kudik Caves' },
    { key:'post-014', kind:'between', title:'Between‑Story Tasks (After #014 → Before #015)', placements:['Jeraw Sands'] },

    { key:'015', kind:'story', title:'#015 Desert Patrol', subtitle:'Jeraw Sands' },
    { key:'post-015', kind:'between', title:'Between‑Story Tasks (After #015 → Before #016)', placements:['Muscadet'] },

    { key:'016', kind:'story', title:'#016 Quiet Sands', subtitle:'Muscadet' },
    { key:'post-016', kind:'between', title:'Between‑Story Tasks (After #016 → Before #017)', placements:['Materiwood'] },

    { key:'017', kind:'story', title:'#017 Desert Patrol (Chain)', subtitle:'Materiwood' },
    { key:'post-017', kind:'between', title:'Between‑Story Tasks (After #017 → Before #018)', placements:['Ozmonfield'] },

    { key:'018', kind:'story', title:'#018 Quiet Sands (Chain)', subtitle:'Ozmonfield' },
    { key:'post-018', kind:'between', title:'Between‑Story Tasks (After #018 → Before #019)', placements:['Deti Plains'] },

    { key:'019', kind:'story', title:'#019 Materite Now!', subtitle:'Deti Plains' },
    { key:'post-019', kind:'between', title:'Between‑Story Tasks (After #019 → Before #020)', placements:['Tubola Cave'] },

    { key:'020', kind:'story', title:'#020 Present Day', subtitle:'Ambervale' },
    { key:'post-020', kind:'between', title:'Between‑Story Tasks (After #020 → Before #021)', placements:['Ahli Desert'] },

    { key:'021', kind:'story', title:'#021 Hidden Vein', subtitle:'Tubola Caves' },
    { key:'post-021', kind:'between', title:'Between‑Story Tasks (After #021 → Before #022)', placements:['Delia Dunes'], blue:['White Wind','Matra Magic','Magic Hammer','Roulette','Drain Touch'], caps:['Floateye','Ahriman','Red Panther','Coeurl','Antlion','Jawbreaker','Toughskin','Sprite'], side:[{ id:'087', name:'Free Bervenia!', appears:'⚠️ Bug: may not reappear if failed' }] },

    { key:'022', kind:'story', title:'#022 To Ambervale', subtitle:'Delia Dunes' },
    { key:'post-022', kind:'between', title:'Between‑Story Tasks (After #022 → Before #023)', placements:['Gotor Sands'], blue:['Dragon Force','Hastebreak','Twister','Bad Breath'], caps:['Firewyrm','Icedrake','Thundrake','Red Panther','Coeurl','Malboro','Big Malboro'] },

    { key:'023', kind:'story', title:'#023 Over the Hill', subtitle:'Siena Gorge' },
    { key:'post-023', kind:'between', title:'Between‑Story Tasks (After #023 → Before #024)', placements:['Siena Gorge'] },

    { key:'024', kind:'story', title:'#024 Royal Valley', subtitle:'Ambervale' },
  ];

  const MapPanel: React.FC<{ placements: string[] }> = ({ placements }) => {
    return (
      <Panel title="World Map Placements" border="border-green-600" buttonColor="bg-green-500" right={<></>}>
        <div className="space-y-3">
          <img src="https://64.media.tumblr.com/e07fe7840fbbd3ca6abde6378245b9d6/tumblr_inline_ph09u7zzNr1qlaths_250.gif" alt="FFTA World Map" className="w-full border rounded"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {placements.map(loc => {
              const m = MAP_PLACEMENTS[loc];
              if (!m) return null;
              return (
                <div key={loc} className="flex items-start gap-2 bg-green-50 p-2 rounded border">
                  <span className="font-mono font-bold text-green-700 min-w-[2rem]">{m.number}.</span>
                  <div className="flex-1">
                    <span className="font-semibold">{m.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    );
  };

  const RefList: React.FC<{ type: 'blue' | 'cap'; names: string[] }> = ({ type, names }) => {
    const tagColor = type === 'blue' ? 'text-blue-700' : 'text-green-700';
    return (
      <ul className="space-y-2">
        {names.map(n => {
          if (type === 'blue') {
            const id = keyify(`blue:${n}`);
            const b = BLUE_MAGIC_REF.find(x => x.name === n);
            if (!b) return null;
            return (
              <li key={n} className="whitespace-pre-line bg-white p-2 rounded border">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" checked={!!checked[id]} onChange={() => setCheck(id)} />
                  <div>
                    <div className={`font-semibold ${tagColor}`}>{b.name} <span className="text-xs text-gray-500">MP {b.mp}</span></div>
                    {b.desc && <div className="text-sm">{b.desc}</div>}
                    <div className="text-xs mt-1">
                      <div className="font-semibold">From:</div>
                      <div>{b.from.join(', ')}</div>
                      {b.sources.length>0 && (
                        <div className="mt-1 space-y-1">
                          {b.sources.filter(s=>s.type==='Clan').length>0 && (
                            <div><span className="font-semibold">Clans:</span> {b.sources.filter(s=>s.type==='Clan').map(s=>s.name).join(', ')}</div>
                          )}
                          {b.sources.filter(s=>s.type==='Mission').length>0 && (
                            <div><span className="font-semibold">Missions:</span> {b.sources.filter(s=>s.type==='Mission').map(s=>s.name).join(', ')}</div>
                          )}
                          {b.sources.filter(s=>s.type==='Turf').length>0 && (
                            <div><span className="font-semibold">Areas:</span> {b.sources.filter(s=>s.type==='Turf').map(s=>s.name).join(', ')}</div>
                          )}
                        </div>
                      )}
                      {b.notes && <div className="mt-1 italic">{b.notes}</div>}
                    </div>
                  </div>
                </label>
              </li>
            );
          }

          const c = CAPTURE_REF.find(x => x.monster === n);
          if (!c) return null;
          const id = keyify(`cap:${c.monster}`);
          return (
            <li key={n} className="whitespace-pre-line bg-white p-2 rounded border">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" checked={!!checked[id]} onChange={() => setCheck(id)} />
                <div>
                  <div className={`font-semibold ${tagColor}`}>{c.monster} <span className="text-[11px] text-gray-500">({c.family})</span></div>
                  <div className="text-xs mt-1 space-y-1">
                    {c.clans && <div><span className="font-semibold">Clans:</span> {c.clans.join(', ')}</div>}
                    {c.missions && <div><span className="font-semibold">Missions:</span> {c.missions.join(', ')}</div>}
                    {c.areas && <div><span className="font-semibold">Areas:</span> {c.areas.join(', ')}</div>}
                    {c.enjoys && <div><span className="font-semibold">Enjoys:</span> {c.enjoys}</div>}
                    {c.spits && <div><span className="font-semibold">Spits back:</span> {c.spits}</div>}
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-1">FFTA Story Progression Guide</h1>
        <p className="text-sm opacity-90">Story • Between‑Story Tasks • Blue Magic • Captures • Missables • Map Placements • Recruits</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <Panel title="Blue Magic Reference" border="border-blue-600" buttonColor="bg-blue-500" right={<div className="min-w-[200px]"><ProgressBar label="Blue Magic" done={blueDone} total={blueTotal} color="blue"/></div>}>
          <RefList type='blue' names={BLUE_MAGIC_REF.map(b=>b.name)} />
        </Panel>
        <Panel title="Capturable Monsters Reference" border="border-green-600" buttonColor="bg-green-500" right={<div className="min-w-[200px]"><ProgressBar label="Captures" done={capDone} total={capTotal} color="green"/></div>}>
          <RefList type='cap' names={CAPTURE_REF.map(c=>c.monster)} />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel title="Missables & Warnings (Global)" border="border-red-600" buttonColor="bg-red-500" right={<div className="min-w-[200px]"><ProgressBar label="Missables" done={missDone} total={missTotal} color="red"/></div>}>
          <ul className="space-y-2 text-sm">
            {GLOBAL_MISSABLES.map(m=>{
              const id = keyify(`miss-global:${m.id}`);
              return (
                <li key={m.id} className="flex items-start gap-2 bg-white p-2 rounded border">
                  <input type="checkbox" className="mt-0.5" checked={!!checked[id]} onChange={()=>setCheck(id)} />
                  <span>{m.text}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 space-y-2">
        {blocks.map(b => {
          const isOpen = !!expanded[b.key];
          const blueNames = b.blue || [];
          const capNames = b.caps || [];
          const side = b.side || [];
          const recs = b.recruits || [];
          const miss = b.missables || [];

          const blueDoneLocal = blueNames.reduce((n, nm)=> n + (checked[keyify(`blue:${nm}`)]?1:0), 0);
          const capDoneLocal  = capNames.reduce((n, nm)=> n + (checked[keyify(`cap:${nm}`)]?1:0), 0);
          const sideDoneLocal = side.reduce((n, s)=> n + (checked[keyify(`side:${s.id}`)]?1:0), 0);

          return (
            <div key={b.key} className={`rounded-lg overflow-hidden border-2 ${b.kind==='story'?'border-purple-600 bg-white':'border-amber-600 bg-amber-50'}`}>
              <div className={`p-4 flex items-center justify-between cursor-pointer ${b.kind==='story'?'hover:bg-purple-50':'hover:bg-amber-100'}`} onClick={()=>toggle(b.key)}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-lg">{b.title}</span>
                    {b.subtitle && <span className="text-sm text-gray-600">({b.subtitle})</span>}
                    {b.placements && b.placements.length>0 && (
                      <Tag color="purple"><MapPin className="w-3 h-3"/> Place #{b.placements.map(l=>MAP_PLACEMENTS[l]?.number).filter(Boolean).join(', ')}</Tag>
                    )}
                    {blueNames.length>0 && <Tag color="blue">Blue Magic {blueDoneLocal}/{blueNames.length}</Tag>}
                    {capNames.length>0 && <Tag color="green">Captures {capDoneLocal}/{capNames.length}</Tag>}
                    {side.length>0 && <Tag color="purple">Side {sideDoneLocal}/{side.length}</Tag>}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="text-gray-500"/> : <ChevronDown className="text-gray-500"/>}
              </div>

              {isOpen && (
                <div className="p-4 space-y-4 border-t">
                  {b.placements && b.placements.length>0 && (
                    <MapPanel placements={b.placements}/>
                  )}

                  {blueNames.length>0 && (
                    <Panel title="Blue Magic Available" border="border-blue-600" buttonColor="bg-blue-500" right={<></>}>
                      <RefList type="blue" names={blueNames}/>
                    </Panel>
                  )}

                  {capNames.length>0 && (
                    <Panel title="Capturable Monsters" border="border-green-600" buttonColor="bg-green-500" right={<></>}>
                      <RefList type="cap" names={capNames}/>
                    </Panel>
                  )}

                  {side.length>0 && (
                    <Panel title="Side Missions Now Available" border="border-amber-600" buttonColor="bg-amber-500" right={<div className="min-w-[180px]"><ProgressBar label="Side" done={sideDoneLocal} total={side.length} color="purple"/></div>}>
                      <ul className="space-y-2 text-sm">
                        {side.map(s=>{
                          const id = keyify(`side:${s.id}`);
                          return (
                            <li key={s.id} className="flex items-start gap-2 bg-white p-2 rounded border">
                              <input type="checkbox" className="mt-0.5" checked={!!checked[id]} onChange={()=>setCheck(id)} />
                              <div>
                                <span className="font-semibold">#{s.id} {s.name}</span>
                                {s.appears && <div className="text-xs text-gray-600">Appears at: {s.appears}</div>}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}

                  {recs.length>0 && (
                    <Panel title="Recruits / Unlocks" border="border-purple-600" buttonColor="bg-purple-500" right={<></>}>
                      <ul className="space-y-2 text-sm">
                        {recs.map(line => {
                          const id = keyify(`rec:${b.key}:${line}`);
                          return (
                            <li key={id} className="flex items-start gap-2 bg-white p-2 rounded border">
                              <input type="checkbox" className="mt-0.5" checked={!!checked[id]} onChange={()=>setCheck(id)} />
                              <span>{line}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}

                  {miss.length>0 && (
                    <Panel title="Missables (Local)" border="border-red-600" buttonColor="bg-red-500" right={<></>}>
                      <ul className="space-y-2 text-sm">
                        {miss.map(line => {
                          const id = keyify(`miss:${b.key}:${line}`);
                          return (
                            <li key={id} className="flex items-start gap-2 bg-white p-2 rounded border">
                              <input type="checkbox" className="mt-0.5" checked={!!checked[id]} onChange={()=>setCheck(id)} />
                              <span>{line}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 text-gray-300 p-4 rounded-b-lg text-center text-sm mt-4">
        <p>Check off tasks as you complete them. Show/Hide panels keep each section compact.</p>
      </div>
    </div>
  );
};

export default FFTAProgressionGuide;
