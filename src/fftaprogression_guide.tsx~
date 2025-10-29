import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

const keyify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

type RefSource = { type: "Clan" | "Mission" | "Turf" | "Area"; name: string };
type ClanSkillSource = { skill: "Combat" | "Magic" | "Smithing" | "Craft" | "Appraise" | "Gather" | "Negotiate" | "Track", level: number };

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
  clans: string[];
  missions: string[];
  areas: string[];
  enjoys: {item: string, aff: number}[];
  spits: {item: string, aff: number}[];
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
  missables?: string[];
  sidequests?: number[];
};

type QuestRef = {
    number: number;
    name: string;
    description: string;
    type: "Capture" | "Dispatch" | "Encounter" | "Engagement";
    cost: string;
    location?: string;
    prerequisites?: string[];
    reward: string[];
    available_for?: string;
    difficulty?: "Very Easy" | "Easy" | "Medium" | "Slightly Hard" | "Hard" | "Very Hard";
    req_items?: string[];
    req_skill?: ClanSkillSource;
    req_job?: string;
    dispatch_time?: string;
    enemies?: string[];
};

const MISSION_REF: QuestRef[] = [
    {
        number: 1,
        name: `Herb Picking`,
        description: `Looking for people to gather the fever-reducing herb muscamaloi on the Giza Plain. No experience necessary. ~ Ivalice Pharmacists Guild`,
        type: `Engagement`,
        cost: `300 Gil`,
        location: `Giza Plain`,
        prerequisites: [`Any Pub at beginning of game. Only mission available`, `Seen Joining Clan Nutsy Cutscene`],
        reward: [`600 Gil`, `Lutia Pass placement`],
        difficulty: `Very Easy`,
        enemies: [`Goblin x3`, `Red Cap`, `Sprite`],
    },
    {
        number: 2,
        name: `Thesis Hunt`,
        description: `I search for my master the late Dr. Dalilei's thesis. It was taken from me by bandits as I crossed the Lutia Pass. ~ Dr. Coleman, Geologist`,
        type: `Engagement`,
        cost: `900 Gil`,
        location: `Lutia Pass`,
        prerequisites: [`After placement of the Lutia Pass symbol`, `Completed Herb Picking (#001)`],
        reward: [`4000 Gil`, `x1 Random Item`],
        difficulty: `Medium`,
        enemies: [`Archer`, `Soldier x2`, `Thief x2`, `White Mage`],
    },
    {
        number: 3,
        name: `The Cheetahs`,
        description: `There's a price on the heads of the band of conmen calling themselves the "Cheetahs." Word is they were seen in Nubswood! ~ Bratt, Steetear`,
        type: `Engagement`,
        cost: `1200 Gil`,
        location: `Nubswood`,
        prerequisites: [`After placement of the Nubswood symbol`, `Seen Bartender's Clan Warning Cutscene`],
        reward: [`6000 Gil`, `x2 Random Items`],
        difficulty: `Easy`,
        enemies: [`Thief`, `White Monk`, `Fighter`, `Archer`, `Black Mage`],
    },
    {
        number: 4,
        name: `Desert Peril`,
        description: `There's been a rash of attacks by crazed monsters in the Eluut Sands area recently. Will pay for research & removal. ~ Eluut Civilian Militia`,
        type: `Engagement`,
        cost: `1000 Gil`,
        location: `Eluut Sands`,
        prerequisites: [`After placement of the Eluut Sands symbol`, `Seen Montblanc Asks About Ritz Cutscene`],
        reward: [`7000 Gil`, `x1 Random Item`],
        difficulty: `Slightly Hard`,
        enemies: [`Cream`, `Red Panther x2`, `Antlion`, `Coeurl`],
    },
    {
        number: 5,
        name: `Twisted Flow`,
        description: `I've seen the Ulei River bending and warping most strangely, but no one else can see anything! Please find out the truth. ~ Jura, Time Mage Adept`,
        type: `Engagement`,
        cost: `1000 Gil`,
        location: `Ulei River`,
        prerequisites: [`After placement of the Ulei River symbol`, `Completed Desert Peril (#004)`],
        reward: [`8000 Gil`, `x2 Random Items`],
        difficulty: `Hard`,
        enemies: [`Totema (Famfrit)`, `Floateye x2`, `Ahriman x2`],
    },
    {
        number: 6,
        name: `Antilaws`,
        description: `An alchemist named "Ezel" claims he's found a way to nullify laws! Looking for information about him and his "antilaws." * Numerous Requests`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Cadoan`,
        prerequisites: [`After placement of the Cadoan symbol`, `Seen Antilaw Rumor Cutscene`],
        reward: [`9000 Gil`, `R2 Antilaw`, `2x Random Items`],
        difficulty: `Medium`,
        enemies: [`Gladiator`, `Illusionist`, `Hunter`, `Ninja`, `Fighter`, `Defender`],
    },
    {
        number: 7,
        name: `Diamond Rain`,
        description: `Word is, diamonds are falling in the rain in Aisenfield. If it's true, we'll be rich! ~ Geyna, Streetear`,
        type: `Engagement`,
        cost: `1400 Gil`,
        location: `Aisenfield`,
        prerequisites: [`After placement of the Aisenfield symbol`, `Completed Antilaws (#006)`],
        reward: [`10600 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Bomb`, `Lamia`, `Ice Flan`, `Icedrake`],
    },
    {
        number: 8,
        name: `Hot Awakening`,
        description: `The Roda Volcano has been active lately. The Royal Mage Academy wants to hire researchers. No experience needed, must like heat. ~ Ramda, Geology Labs`,
        type: `Engagement`,
        cost: `1600 Gil`,
        location: `Roda Volcano`,
        prerequisites: [`After placement of the Roda Volcano symbol`, `Completed Diamond Rain (#007)`],
        reward: [`11400 Gil`, `1x Random Item`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Ultima Crystal x8`],
    },
    {
        number: 9,
        name: `Magic Wood`,
        description: `Trespassers have been cutting down trees in the Koringwood for their magical properties. They must be stopped! ~ Guillaume, Ranger Captain`,
        type: `Engagement`,
        cost: `1600 Gil`,
        location: `Koringwood`,
        prerequisites: [`After placement of the Koringwood symbol`, `Completed Hot Awakening (#008)`],
        reward: [`12600 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Archer`, `Time Mage`, `Black Mage`, `Thief x2`, `Summoner`],
    },
    {
        number: 10,
        name: `Emerald Keep`,
        description: `The Royal Mage Academy has given up their search for the giant emerald crystal of Salika Keep. Treasure hunters, now's your chance! ~ Levey, Search Team Member`,
        type: `Engagement`,
        cost: `1800 Gil`,
        location: `Salikawood`,
        prerequisites: [`After placement of the Salikawood symbol`, `Completed Magic Wood (#009)`],
        reward: [`13600 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Bishop`, `Gunner`, `Alchemist`, `Templar x2`, `Runeseeker (Babus`],
    },
    {
        number: 11,
        name: `Pale Company`,
        description: `A spirit or ghost was seen going into Nargai Cave, and is making low moaning noises. We can't sleep. Please investigate. ~ Nargai Area Residents`,
        type: `Engagement`,
        cost: `1900 Gil`,
        location: `Nargai Cave`,
        prerequisites: [`After placement of the Nargai Cave symbol`, `Completed Emerald Keep (#010)`],
        reward: [`15000 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Hard`,
        enemies: [`Icedrake`, `Totema (Adrammelech)`],
    },
    {
        number: 12,
        name: `Jagd Hunt`,
        description: `On my brand-new airship's maiden flight, she was damaged in a hit- and-run! The criminal is in Jagd Dorsa, kupo! Get him! ~ Nono, Machinist Apprentice`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Jagd Dorsa`,
        prerequisites: [`After placement of the Jagd Dorsa symbol`, `Seen Nono's Loss Cutscene`],
        reward: [`16000 Gil`, `2x Random Item`, `1x Random Card`],
        difficulty: `Hard`,
        enemies: [`Ninja`, `Hunter`, `Antlion`],
    },
    {
        number: 13,
        name: `The Bounty`,
        description: `Looking for information about that bounty the palace is offering. Give us a shout if you see us. We're around. ~ Clan Ox`,
        type: `Encounter`,
        cost: `2900 Gil`,
        prerequisites: [`After placement of the Kudik Peaks symbol`, `Seen Nono's Trade Idea Cutscene`],
        reward: [`17200 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Fighter`, `Time Mage`, `Black Mage`],
    },
    {
        number: 14,
        name: `Golden Clock`,
        description: `Someone has been selling phoney copies of our "Golden Sandclock (tm)" in the Jeraw Sands area. Please investigate. ~ Belta Clockworks Co. `,
        type: `Engagement`,
        cost: `2200 Gil`,
        location: `Jeraw Sands`,
        prerequisites: [`After placement of the Jeraw Sands symbol`, `Completed The Bounty (#013)`],
        reward: [`18000 Gil`, `1x Random Item`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Alchemist`, `Time Mage`],
    },
    {
        number: 15,
        name: `Scouring Time`,
        description: `By order of Her Majesty Queen Remedi we will be searching each town for the boy wanted by the palace. ~ Bervenia Palace and Judges`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Muscadet`,
        prerequisites: [`After placement of the Muscadet symbol`, `Seen Ezel's Warning Cutscene`],
        reward: [`19600 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Gunner`, `Templar x2`, `Mog Knight x2`],
    },
    {
        number: 16,
        name: `The Big Find`,
        description: `Even after the historical finds in the Uladon Bog, the Royal Mage Academy says there might be more lying hidden out there... ~ Azare, Streetear`,
        type: `Engagement`,
        cost: `3000 Gil`,
        location: `Uladon Bog`,
        prerequisites: [`After placement of the Uladon Bog symbol`, `Seen Mewt's New Retainer Cutscene`],
        reward: [`20400 Gil`, `2x Random Item`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Thief x2`, `Bishop x2`, `Fighter x2`],
    },
    {
        number: 17,
        name: `Desert Patrol`,
        description: `The famed Mirage of Gotor is drawing big crowds, and big crowds draw thieves and pickpockets. Please help us patrol! ~ Ivalice Tourism Board`,
        type: `Engagement`,
        cost: `2500 Gil`,
        location: `Gotor Sands`,
        prerequisites: [`After placement of the Gotor Sands symbol`, `Completed The Big Find (#016)`],
        reward: [`21400 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Bishop`, `Defender`, `Gladiator`, `White Monk`, `Soldier x2`],
    },
    {
        number: 18,
        name: `Quiet Sands`,
        description: `The famed "Barking Sands" in the Delia Dunes have stopped barking, and tour cancellations are rising. Please investigate. ~ Acamel Tours Office`,
        type: `Engagement`,
        cost: `4000 Gil`,
        location: `Delia Dunes`,
        prerequisites: [`After placement of the Delia Dunes symbol`, `Completed Desert Patrol (#017)`],
        reward: [`22600 Gil`, `1x Random Item`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Templar x2`, `Titania x2`],
    },
    {
        number: 19,
        name: `Materite Now!`,
        description: `Materite is getting hard to find with Audience Day near. I need some for my experiments! Search the Materiwood -- ore will do. ~ Pallas, Alchemist`,
        type: `Engagement`,
        cost: `2700 Gil`,
        location: `Materiwood`,
        prerequisites: [`After placement of the Materiwood symbol`, `Seen Gift Day Gossip Cutscene`],
        reward: [`23400 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Summoner`, `White Mage`],
    },
    {
        number: 20,
        name: `Present Day`,
        description: `Security at the palace is tight as ever with the public audiences today. Come pay your respects to the prince and queen. ~ Bervenia Spokesman`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Bervenia Palace`,
        prerequisites: [`After placement of the Bervenia Palace symbol`, `Completed Materite Now! (#019)`],
        reward: [`25000 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Templar`, `Alchemist`, `Gladiator x2`],
    },
    {
        number: 21,
        name: `Hidden Vein`,
        description: `Most say the Tubola Cave mines were depleted during the 1st Mythril Rush, but my grandfather's will says otherwise. Please check! ~ Cruu, Mine Foreman`,
        type: `Engagement`,
        cost: `2800 Gil`,
        location: `Tubola Cave`,
        prerequisites: [`After placement of the Tubola Cave symbol`, `Seen Royal Vacation Gossip Cutscene`],
        reward: [`26200 Gil`, `1x Random Item`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`White Monk`],
    },
    {
        number: 22,
        name: `To Ambervale`,
        description: `Mewt and Remedi have gone to the Ambervale. Before you follow, come to the Deti Plains, I have a request to ask of you. ~ Judgemaster Cid`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Deti Plains`,
        prerequisites: [`After placement of the Deti Plains symbol`, `Seen Go To Deti Plains Cutscene`],
        reward: [`27000 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Medium`,
        enemies: [`Coeurl`],
    },
    {
        number: 23,
        name: `Over The Hill`,
        description: `I want you to find me some amber in the Siena Gorge. Amber contains the power of the sun, essential in making the antilaw I need. ~ Judgemaster Cid`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Siena Gorge`,
        prerequisites: [`After placement of the Siena Gorge symbol`, `Completed To Ambervale (#022)`],
        reward: [`28600 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Hard`,
        enemies: [`Summoner`],
    },
    {
        number: 24,
        name: `Royal Valley`,
        description: `Thank you for waiting, Marche, I can leave for the Ambervale any time. Let's go as soon as you are ready.`,
        type: `Engagement`,
        cost: `0 Gil`,
        location: `Ambervale`,
        prerequisites: [`After placement of the Ambervale symbol`, `Completed Over The Hill (#023)`, `Haven't Cleared Game`],
        reward: [`End of game`],
        difficulty: `Hard`,
        enemies: [`Ninja`, `Gunner`, `Alchemist`, `Illusionist`],
    },
    {
        number: 25,
        name: `Wanted!`,
        description: `This Month's Wanted! Black Mage Dolce: 4600 Gil [] Dangerous magic use [] Eating and running [] Assorted misdemeanors [] Last spotted in forest`,
        type: `Engagement`,
        cost: `600 Gil`,
        location: `Nubswood`,
                prerequisites: [
          "Completed Thesis Hunt. Kingmoon (#002)",
          "only",
        ],
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
                prerequisites: [
          "Completed Jagd Hunt (#012)",
          "Completed The Bounty. Bardmoon (#013)",
          "only",
        ],
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
          "Completed Herb Picking (#001)",
          "Completed Thesis Hunt. Madmoon (#002)",
          "only",
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
                prerequisites: [
          "Completed Scouring Time. Sagemoon (#015)",
          "only",
        ],
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
          "Completed Present Day (#020)",
          "Completed Den of Evil. Huntmoon (#064)",
          "only",
        ],
        reward: [`45000 Gil`, `Secret Item (Zanmato)`, `1x Random Item`, `2x`, `Random Cards`],
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
          "Completed The Bounty (#013)",
          "Completed Wanted! (#025)",
          "Completed Exploration. Kingmoon (#065)",
          "only",
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
          "Completed Desert Patrol (#017)",
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
                prerequisites: [
          ",",
          "After receiving the Mission Item",
        ],
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
          "Completed Hot Awakening (#008)",
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
          "Completed Desert Patrol (#017)",
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
          "Completed Desert Patrol (#017)",
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
                prerequisites: [
          ",",
          "After receiving the Mission Item",
        ],
        reward: [`0 Gil`, `Ayvuir Blue`, `1x Random Item`, `Req. Skills: Combat/Lvl.10`],
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
                prerequisites: ["Completed The Cheetahs (#003)"],
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
                prerequisites: ["Completed Herb Picking (#001)"],
        reward: [`3600 Gil`, `Sprinkler`, `1x Random Item`, `available_for: "10 Days`],
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
                prerequisites: [
          "Completed Scouring Time. Muscadet (#015)",
          "Pub only",
        ],
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
                prerequisites: [
          "Completed Present Day. Kingmoon (#020)",
          "only",
        ],
        reward: [`7000 Gil`, `Sequence`, `1x Random Item`, `Secret Item (1x Random`, `Card)`, `available_for: "15 Days`],
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
                prerequisites: [
          "Completed Present Day. Madmoon (#020)",
          "only",
        ],
        reward: [`7000 Gil`, `Sapere Aude`, `1x Random Item`, `Secret Item (1x`, `Random Card)`, `available_for: "15 Days`],
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
                prerequisites: [
          "Completed Present Day. Huntmoon (#020)",
          "only",
        ],
        reward: [`7000 Gil`, `Acadia Hat`, `1x Random Item`, `Secret Item (1x`, `Random Card)`, `available_for: "15 Days`],
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
          "Completed To Ambervale (#022)",
          "After completion of side-mission engagements with",
          "and the",
          "Blue Genius",
          "Brown Rabbits",
          "White Kupos",
          "Yellow Powerz",
        ],`],
        reward: [`22600 Gil`, `Peytral`, `1x Random Item`, `1x Random Card`, `available_for: "25 Days`],
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
                prerequisites: ["Completed Herb Picking (#001)"],
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
          "Completed Herb Picking (#001)",
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
          "Completed Herb Picking (#001)",
          "Completed Snow in Lutia (#044)",
        ],
        reward: [`4000 Gil`, `Gedegg Soup`, `available_for: "25 Days`],
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
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`7000 Gil`, `Gedegg Soup`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: ["Completed Hot Awakening (#008)"],
        reward: [`7800 Gil`, `Secret Item (Topaz Armring)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Skills: Tracking/Lvl.7`, `available_for: "15 Days`],
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
                prerequisites: [
          "Completed Desert Peril (#003)",
          "Completed Desert Peril (#004)",
        ],
        reward: [`5200 Gil`, `2x Random Items`, `available_for: "15 Days`],
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
          "Completed The Cheetahs (#003)",
          "Completed Watching You (#113)",
        ],
        reward: [`4600 Gil`, `Vesper`, `1x Random Item`, `Req. Items: Ahriman Eye`, `available_for: "25 Days`],
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
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`0 Gil`, `Blue Rose`, `1x Random Item`, `2x Random Cards`, `Req. Items: Flower Vase`, `available_for: "15 Days`],
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
                prerequisites: ["Completed Jagd Hunt (#012)"],
        reward: [`9000 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "25 Days`],
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
          "Completed The Big Find (#016)",
          "Completed Smuggle Bust (#105)",
        ],
        reward: [`18000 Gil`, `Tiger Hide`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`16000 Gil`, `Trichord`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: ["Completed The Cheetahs (#003)"],
        reward: [`1600 Gil`, `White Flowers`, `1x Random Item`, `available_for: "25 Days`],
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
          "Completed To Ambervale (#022)",
          "Completed Over The Hill. Gossip (#023)",
          "Seen Ezel",
          "with Ezel at Cadoan Card Keeper",
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
                prerequisites: [
          "Completed Materite Now! (#019)",
          "Completed Present Day (#020)",
        ],
        reward: [`7000 Gil`, `Secret Item (Helje Key)`, `1x Random Item`, `1x`, `Random Card`, `available_for: "25 Days`],
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
          "Completed Emerald Keep (#010)",
          "Completed Golden Gil (#114)",
        ],
        reward: [`7000 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`18000 Gil`, `Sketchbook`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: [
          "Completed A Dragon (#066)",
          ",",
        ],
        reward: [`36000 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "10 Days`],
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
                prerequisites: ["Completed The Bounty (#013)"],
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
                prerequisites: [
          "Completed Twisted Flow (#005)",
          "Completed Antilaws (#006)",
        ],
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
          "Completed Present Day (#020)",
          "Completed Prof In Trouble (#046)",
        ],
        reward: [`18000 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "25 Days`],
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
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`22600 Gil`, `1x Random Item`, `2x Random Cards`, `Req. Items: Helje Key`, `Req. Skills: Combat/Lvl.25`],
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
                prerequisites: ["Completed The Big Find (#016)"],
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
          "Completed Desert Patrol (#017)",
          "Completed Wyrms Awaken (#102)",
        ],
        reward: [`31600 Gil`, `2x Random Items`, `2x Random Cards`, `Req. Items: Wyrmstone`, `available_for: "25 Days`],
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
          "Completed Royal Valley (#024)",
          "Completed Lucky Charm (#191)",
          "Clear Game",
        ],
        reward: [`27000 Gil`, `Ally Finder2`, `1x Random Item`, `2x Random Cards`, `Req. Items: Rabbit Tail`],
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
                prerequisites: ["Completed Thesis Hunt (#002)"],
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
          "Completed Fowl Thief and reading (#068)",
          ",",
          "Area Freed!",
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
          "Completed Free Sprohm! and reading (#069)",
          ",",
          "Our Heroes",
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
                prerequisites: [
          "Completed Raven (#070)",
          ",",
          "s Plan",
        ],
        reward: [`7000 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Hard`,
        enemies: [`White Mage (Batalise)`, `Black Mage (Golitaire)`, `a Black Mage`],
    },
    {
        number: 72,
        name: `Lutia Mop-up`,
        description: `We found another nest of those Borzoi worms in Lutia Pass! We've got four of their capos already, only three to go! ~ Sprohm Town Watch`,
        type: `Engagement`,
        cost: `800 Gil`,
        location: `Lutia Pass`,
                prerequisites: [
          "Completed Antilaws (#006)",
          "Completed Hot Awakening. Sprohm Pub (#008)",
          "Completed Nubswood Base (#071)",
          "only",
        ],
        reward: [`6000 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "25 Days`],
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
          "Completed Antilaws (#006)",
          "Completed Lutia Mop-up. Cyril Pub (#072)",
          "only",
        ],
        reward: [`7200 Gil`, `Secret Item (Shijin Shield)`, `2x Random Cards`, `Req. Skills: Combat/Lvl. 12`],
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
          "Completed Antilaws (#006)",
          "Completed and reading (#075)",
          ",",
          "and",
          "Read Crime Ring",
          "rumor. Cadoan Pub only",
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
          "Completed Cadoan Watch and reading (#074)",
          ",",
          "The Redwings",
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
          "Completed Free Cadoan and reading (#075)",
          ",",
          "Falgabird",
        ],
        reward: [`4600 Gil`, `Fire Sigil`, `Secret Item (Random Item)`, `2x Random`, `Cards`],
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
          "Completed Jagd Hunt and reading (#012)",
          ",",
          "TheSpiritstone",
        ],
        reward: [`2400 Gil`, `Secret Item (Delta Fang)`, `1x Random Item`, `2x`, `Random Cards`],
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
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`18000 Gil`, `Water Sigil`, `Secret Item (Random Item)`, `2x`, `Random Cards`],
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
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`18000 Gil`, `Wind Sigil`, `Secret Item (Random Item)`, `2x`, `Random Cards`],
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
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`18000 Gil`, `Earth Sigil`, `Secret Item (Random Item)`, `2x`, `Random Cards`],
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
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`22600 Gil`, `Secret Item (Reaper Cloak)`, `2x Random Cards`, `Req. Items: Spiritstone`],
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
          "Completed The Redwings and (#081)",
          ",",
          "reading",
          "s End",
        ],
        reward: [`2400 Gil`, `Secret Item (Hanya Helm)`, `2x Random Cards`],
        difficulty: `Slightly Hard`,
        enemies: [`Assassin x2 (Celia`],
    },
    {
        number: 83,
        name: `ForeignFiend`,
        description: `A giant snake is attacking our traveling merchants! We can't make our rounds like this. Someone please stop that thing! ~ Davoi, Merchant`,
        type: `Engagement`,
        cost: `2000 Gil`,
        location: `Ulei River`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed Free Muscadet! and (#082)",
          "Read Foreign Fiends",
          "reading the",
          "rumor",
        ],
        reward: [`18000 Gil`, `2x Random Item`, `2x Random Cards`],
        difficulty: `Medium`,
    },
    {
        number: 84,
        name: `ForeignFiend`,
        description: `A bizarre turtle-like monster is attacking the town! Somebody stop it! ~ Crusoi Inn`,
        type: `Engagement`,
        cost: `2000 Gil`,
        location: `Baguba Port`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed ForeignFiend (#083)",
        ],
        reward: [`20400 Gil`, `2x Random Items`, `2x Random Cards`],
        difficulty: `Medium`,
    },
    {
        number: 85,
        name: `ForeignFiend`,
        description: `A plant monster is attacking people, and the body count is rising! We need a weeder, quick! ~ Bokum, Townsperson`,
        type: `Engagement`,
        cost: `2500 Gil`,
        location: `Uladon Bog`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed ForeignFiend (#084)",
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
          "Completed Scouring Time (#015)",
          "Completed ForeignFiend (#085)",
        ],
        reward: [`34000 Gil`, `Secret Item (Dread Soul)`, `Secret Item (Judge`, `Coat)`, `2x Random Cards`],
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
          "Completed Royal Valley and freeing (#024)",
          "all areas",
          "Clear Game",
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
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
        ],
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
                prerequisites: [
          "Completed The Worldwyrm (#088)",
          "Clear Game",
        ],
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
                prerequisites: [
          "Completed Moogle Bride (#089)",
          "Clear Game",
        ],
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
          "Completed Desert Patrol (#017)",
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
          "Completed Emerald Keep (#010)",
          "Completed Pirates Ahoy (#124)",
        ],
        reward: [`8200 Gil`, `Secret Item (Last Letter)`, `1x Random Item`, `2x`, `Random Cards`],
        difficulty: `Medium`,
    },
    {
        number: 93,
        name: `Flan Breakout!`,
        description: `There's been an outbreak of flan near our logging site! They'll eat all the trees, and we'll be out of a job! Help! ~ Dals, Lumberjack`,
        type: `Engagement`,
        cost: `1700 Gil`,
        location: `Salikawood`,
                prerequisites: ["Completed Scouring Time (#015)"],
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
                prerequisites: [
          "Completed Present Day (#020)",
          "Completed Hidden Vein (#021)",
        ],
        reward: [`13600 Gil`, `Secret Item (Bangaa Helm)`, `1x Random Item`, `2x`, `Random Cards`],
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
          "Completed Royal Valley and Mission (#024)",
          "Completed Den of Evil (#064)",
          "Completed Thorny Dreams (#193)",
          "Clear Game",
        ],
        reward: [`40600 Gil`, `Secret Item (Malbow)`, `1x Random Item`, `2x Random`, `Cards`, `available_for: "20 Days`],
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
          "Completed Royal Valley (#024)",
          "Completed Exploration (#065)",
          "Completed Missing Meow (#067)",
          "Clear Game",
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
          "Completed Royal Valley (#024)",
          "Completed Beastly Gun (#284)",
          "Clear Game",
        ],
        reward: [`22600 Gil`, `Secret Item (Ebon Blade)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Spiritstone/Bent Sword`],
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
          "Completed Royal Valley (#024)",
          "Completed Den of Evil (#064)",
          "Completed Carrot! (#095)",
          "Clear Game",
        ],
        reward: [`27000 Gil`, `Secret Item (Excalibur2)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Rusty Sword/Mysidia Alloy`],
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
          "Completed Royal Valley (#024)",
          "Completed Alchemist Boy (#192)",
          "Clear Game",
        ],
        reward: [`31600 Gil`, `Secret Item (Masamune 100)`, `1x Random Item`, `2x Random Cards`, `Req. Items: Zodiac Ore/Blood Apple`],
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
          "Completed Magic Wood (#009)",
          "administrator at Cyril",
          "Capture at least five monsters and talk to Monster Bank",
          "Seen Monster Escape Cutscene",
        ],
        reward: [`8800 Gil`, `1x Random Item`, `2x Random Cards`, `available_for: "20 Days`],
        difficulty: `Medium`,
        enemies: [`Coeurl`, `Ahriman`, `Red Cap`],
    },
    {
        number: 101,
        name: `Clan Roundup`,
        description: `Bandit clans are stealing work and attacking without warning! They're giving us clans a bad name. Help us round them up. ~ Clan Center`,
        type: `Encounter`,
        cost: `600 Gil`,
                prerequisites: ["Completed Desert Peril (#004)"],
        reward: [`4600 Gil`, `2x Random Item`, `available_for: "25 Days`],
        difficulty: `Medium`,
        enemies: [`Thief`, `Archer`, `Black Mage`, `White Mage`],
    },
    {
        number: 102,
        name: `Wyrms Awaken`,
        description: `The dragons sleeping in Roda Volcano are awake and heading towards Baguba! Please help us hold them off. ~ Delia Royal Watchpost`,
        type: `Encounter`,
        cost: `2700 Gil`,
                prerequisites: ["Completed Desert Patrol (#017)"],
        reward: [`22600 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "35 Days`],
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
          "Completed Present Day (#020)",
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
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`9000 Gil`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
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
          "Completed The Big Find (#016)",
          "Completed Poachers (#108)",
        ],
        reward: [`13600 Gil`, `Secret Item (Chocobo Skin)`, `1x Random Item`, `2x`, `Random Cards`, `available_for: "40 Days`],
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
          "Completed Antilaws (#006)",
          "Gossip with Ezel at Cadoan Card Keeper",
          "Seen Antilaw Resistance Cutscene",
        ],
        reward: [`6000 Gil`, `2x Random Item`, `1x Random Card`, `available_for: "25 Days`],
        difficulty: `Easy`,
        enemies: [`Fighter`, `Time Mage`, `Thief (Thomson)`],
    },
    {
        number: 107,
        name: `Old Friends`,
        description: `We've run into a tough blade biter, and well, we've bit off more than we can chew! Please help! ~ Ritz`,
        type: `Encounter`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Completed S.O.S. (#048)",
        ],
        reward: [`4600 Gil`, `Beastspear`, `1x Random Card`, `available_for: "25 Days`],
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
          "Completed Jagd Hunt (#012)",
          "Completed Friend Trouble (#052)",
        ],
        reward: [`11400 Gil`, `Secret Item (Tiger Hide)`, `1x Random Item`, `2x`, `Random Cards`, `available_for: "25 Days`],
        difficulty: `Slightly Hard`,
        enemies: [`Archer x2`, `Gunner x2`, `Hunter x2`],
    },
    {
        number: 109,
        name: `Snow Fairy`,
        description: `Signs of snow spotted! When the earth shines in seven hues, the snow fairies appear. Watch the weather with care. `,
        type: `Encounter`,
        cost: `1200`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`9000 Gil`, `1x Random Item`, `2x Random Cards`, `available_for: "20 Days`],
        difficulty: `Easy`,
        enemies: [`Sprite`, `Ice Flan`],
    },
    {
        number: 110,
        name: `Revenge`,
        description: `H-Help! A man named Weaver wants me dead. Yes, it was my fault his family died, but I've repented! ~ Celebrant, Gelzak Church`,
        type: `Encounter`,
        cost: `700 Gil`,
                prerequisites: [
          "Completed Weaver (#287)",
          ",",
        ],
        reward: [`13600 Gil`, `2x Random Items`, `2x Random Cards`, `available_for: "25 Days`],
        difficulty: `Medium`,
        enemies: [`Archer`, `Gladiator`, `Black Mage`, `Fighter x2 (Weaver)`],
    },
    {
        number: 111,
        name: `Retrieve Mail!`,
        description: `I mis-sorted the mail, and now the delivery man's off to Cadoan! Stop that mail, use ANY MEANS NECESSARY. I'll take responsibility. ~ Marko, Mail Sorter`,
        type: `Encounter`,
        cost: `2400 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`11400 Gil`, `1x Random Item`, `2x Random Cards`, `available_for: "25 Days`],
        difficulty: `Easy`,
        enemies: [`Gunner`, `Archer`, `Soldier`],
    },
    {
        number: 112,
        name: `A Challenge`,
        description: `Yo, Clan [Your Clan Name]. You're quite popular lately. There's still time for you to join us at Clan Bahan... or else! ~ Mintz, Deputy Clan Boss`,
        type: `Encounter`,
        cost: `600 Gil`,
                prerequisites: ["Completed Desert Peril (#004)"],
        reward: [`4200 Gil`, `2x Random Items`, `Req. Skills: Negotiate/Lvl.4`, `available_for: "25 Days`],
        difficulty: `Slightly Hard`,
        enemies: [`Thief`, `Archer`, `White Mage`, `Black Mage`, `Soldier (Mintz)`],
    },
    {
        number: 113,
        name: `Watching You`,
        description: `I think I'm being watched. People say I'm just paranoid, but I've been hearing flapping wings at night! Please investigate. ~ Titi, Shy Student`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed The Cheetahs (#003)"],
        reward: [`2800 Gil`, `Ahriman Eye`, `1x Random Item`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 114,
        name: `Golden Gil`,
        description: `I want you to research the origin of the golden gil in my shop. If it's really from the Age of Kings, it could be good for sales. ~ Shopkeeper, The Golden Gil`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Emerald Keep (#010)"],
        reward: [`6400 Gil`, `Ancient Coins`, `1x Random Item`, `Dispatch Time: 20 Days`],
    },
    {
        number: 115,
        name: `Dueling Sub`,
        description: `I've been challenged to a duel, but I'm scared. Will you go in my place? Just pretend to be me, OK? ~ Viscount Gatt`,
        type: `Dispatch`,
        cost: `300 Gil`,
                prerequisites: ["Completed Herb Picking (#001)"],
        reward: [`1800 Gil`, `1x Random Item`, `Req. Jobs: Soldier`, `Dispatch Time: 3 Days`],
    },
    {
        number: 116,
        name: `Gulug Ghost`,
        description: `We need someone to offer holy water at the shrine on the old Gulug Volcano. The female ghost is up to her old tricks again. ~ Oktoma, Townsperson`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Present Day. Huntmoon (#020)",
          "only",
        ],
        reward: [`11800 Gil`, `Fire Sigil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 117,
        name: `Water City`,
        description: `A legendary city of water lies at the bottom of Bisebina Lake. We need constant updates -- please dive and report. ~ Hickle, Legend Researcher`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Present Day. Madmoon (#020)",
          "only",
        ],
        reward: [`11800 Gil`, `Water Sigil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 118,
        name: `Mirage Tower`,
        description: `They say there's a mirage tower in the desert, where you can find crystalized wind! The wind's good this year, maybe some's there? ~ Bran, Streetear`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Present Day. Bardmoon (#020)",
          "only",
        ],
        reward: [`11800 Gil`, `Wind Sigil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 119,
        name: `A Barren Land`,
        description: `There is a barren land to the east, where no grass will grow. I want to know why! Bring me soil, as much as you can. ~ Powell, Researcher`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Present Day. Sagemoon (#020)",
          "only",
        ],
        reward: [`13200 Gil`, `Earth Sigil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 120,
        name: `Cadoan Meet`,
        description: `Mages! Want to compete in the Cadoan Mage Tourney? The tourney will be split by class in a fight to see who's the strongest! ~ Mage Tourney Committee`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Completed Present Day (#020)",
        ],
        reward: [`10600 Gil`, `Magic Trophy`, `1x Random Item`, `Secret Item`, `(1x Random Card)`, `Req. Jobs: Black Mage`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 121,
        name: `Sprohm Meet`,
        description: `The Sprohm Battle Tourney is accepting contestants. Fight for glory and honor! We've also prepared the usual monetary award... ~ Battle Tourney Committee`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed The Big Find (#016)",
        ],
        reward: [`4200 Gil`, `Fight Trophy`, `1x Random Item`, `Secret Item`, `(1x Random Card)`, `Req. Jobs: Fighter`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 122,
        name: `Run For Fun`,
        description: `There will be a sporting event at our academy soon, but missing one member for our popular marathon team. Looking for a replacement. ~ Pollan, Blue Team Leader`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`5200 Gil`, `Sport Trophy`, `1x Random Item`, `2x Random Cards`, `Req. Jobs: Juggler`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 123,
        name: `Hungry Ghost`,
        description: `A hungry ghost hound is causing a panic at the Earlchad Monastery and raiding the pantry. Please put it to rest. ~ Baldi, Head Monk`,
        type: `Dispatch`,
        cost: `900 Gil`,
                prerequisites: ["Completed Antilaws (#006)"],
        reward: [`4200 Gil`, `Elda's Cup`, `1x Random Item`, `2x Random Cards`, `Req. Items: Dragon Bone`, `Dispatch Time: 10 Days`],
    },
    {
        number: 124,
        name: `Pirates Ahoy`,
        description: `We have reports that a large pirate band will be passing through our waters soon. We need good steel and young muscles! ~ Wilhem, Coast Guard`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Emerald Keep (#010)"],
        reward: [`6400 Gil`, `Coast Medal`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 125,
        name: `Castle Sit-In`,
        description: `A group of youths are protest the capture of their friends at a castle in the south. Talk sense into them! ~ Hansrich, Security Chief`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Hot Awakening. Huntmoon (#008)",
          "Completed Morning Woes (#151)",
          "only",
        ],
        reward: [`4600 Gil`, `Guard Medal`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 126,
        name: `Wine Delivery`,
        description: `Looking for brave souls who will bring wine to sooth the parched throats of our heroes in battle. Come equipped for combat. ~ Devon, War Council Officer`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`7000 Gil`, `Rainbowite`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 127,
        name: `Broken Tunes`,
        description: `I've broken my lady's favorite music box. Please, repair it if you can. I would so much like to see her smile again. ~ Tirara, Maidservant`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Desert Patrol (#017)",
          "Completed Good Bread (#276)",
        ],
        reward: [`11400 Gil`, `Cat's Tears`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Days`],
    },
    {
        number: 128,
        name: `Falcon Flown`,
        description: `My best hunting falcon, "Hyperion", has been gone for a day. Perhaps he is looking for his late master? Please find him! ~ Arno, Falconer`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Completed Sword Needed (#277)",
        ],
        reward: [`11400 Gil`, `Dame's Blush`, `1x Random Item`, `2x Random Cards`, `Req. Items: Skull`, `Dispatch Time: 10 Days`],
    },
    {
        number: 129,
        name: `Danger Pass`,
        description: `Bandits are active in Goras Pass and are cutting off our trade routes. Please stop them before we go out of business! ~ Feugo, Wilhem & Co. `,
        type: `Dispatch`,
        cost: `1500 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed Hundred-Eye (#165)",
        ],
        reward: [`7800 Gil`, `Thunderstone`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 130,
        name: `Mist Stars`,
        description: `Many of our children have never seen the stars due to the mists that cover our land most of the year. Can you help us? ~ Ulg, Astronomer`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`9000 Gil`, `Stormstone`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 131,
        name: `Adaman Alloy`,
        description: `I'm afraid we've run out of adamantite. We can't run a business like this! Find us some, and I will make adaman alloy for you. ~ Elbo, Workshop Vargi`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`0 Gil`, `Adaman Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Adamantite/Adamantite`, `Req. Skills: Smithing/Lvl.15`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 132,
        name: `Mysidia Alloy`,
        description: `Now taking orders for mysidia alloy. Only 10 orders can be filled, first come first served. Thank you. ~ Deunon, Workshop Rool`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed Jagd Hunt (#012)"],
        reward: [`0 Gil`, `Mysidia Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Adamantite/Sivril`, `Req. Skills: Smithing/Lvl.15`, `Dispatch Time: 15 Days`],
    },
    {
        number: 133,
        name: `Crusite Alloy`,
        description: `It's time for us to get back to work. Bring us good materials and we'll make you the best crusite alloy gil can buy! ~ Sabak, Workshop Berk`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`0 Gil`, `Crusite Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Zodiac Ore/Zodiac Ore`, `Req. Skills: Smithing/Lvl.15`, `Dispatch Time: 10 Days`],
    },
    {
        number: 134,
        name: `Faceless Dolls`,
        description: `I found a creepy road in the Ophanwood with faceless dolls all lined up. I can't bring myself to walk past -- are they safe? ~ Edist, Taylor`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`10800 Gil`, `Blood Shawl`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 135,
        name: `Faithful Fairy`,
        description: `I quit work, but I'm still concerned about my old co-workers. Please bring them fairy wings that they may sweep in style. ~ Mables, Former Maidservant`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Materite Now (#019)"],
        reward: [`10000 Gil`, `Ahriman Wing`, `1x Random Item`, `2x Random Cards`, `Req. Items: Fairy Wing`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 136,
        name: `For The Lady`,
        description: `A large amount of gil, meant to pay for the Lady Tiana's medicine, has been stolen from Baron Ianna, and he wants it back. ~ Carnen, Streetear`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Materite Now (#019)"],
        reward: [`10600 Gil`, `Fairy Wing`, `1x Random Item`, `2x Random Cards`, `Req. Items: Stolen Gil`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 137,
        name: `Seven Nights`,
        description: `My teacher's secret recipe says "stir without rest for seven days and seven nights." Will someone please stir for me!? ~ Hihat, Alchemist Adept`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Completed Present Day (#020)",
        ],
        reward: [`11800 Gil`, `Goldcap`, `1x Random Item`, `2x Random Cards`, `Req. Items: Ancient Bills`, `Dispatch Time: 15 Days`],
    },
    {
        number: 138,
        name: `Shady Deals`,
        description: `Selbaden Church is up to something. The Father has been meeting in secret with merchant types. I bet there's shady deals afoot. ~ Sayen, Townsperson`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Present Day (#020)",
          "Completed Janitor Duty (#281)",
        ],
        reward: [`10600 Gil`, `Life Water`, `1x Random Item`, `Req. Items: Secret Books`, `Dispatch Time: 10 Days`],
    },
    {
        number: 139,
        name: `Earthy Colors`,
        description: `I restored artwork for a living, but I'm out of paints. I need some rock from the mountains... Only the hardy need apply. ~ Rosseni, Atelier Wite`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed The Cheetahs (#003)",
          "Completed Life Or Death (#210)",
        ],
        reward: [`2800 Gil`, `Ancient Text`, `1x Random Item`, `Dispatch Time: 5 Days`],
    },
    {
        number: 140,
        name: `Lost Heirloom`,
        description: `Please retrieve Estel's heirloom from the HQ of the greedy "Neighbor" merchant network! Justice must be done! ~ Fago, Ally of Justice`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`6000 Gil`, `Justice Badge`, `2x Random Items`, `1x Random Card`, `Req. Items: Neighbor Pin`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 141,
        name: `Young Love`,
        description: `I must tell her how I feel yet I lack the courage to lift a quill. Perhaps the air-light feather from an ahriman wing would do. ~ Hernie, Timid Youth`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`13200 Gil`, `Friend Pin`, `1x Random Item`, `2x Random Cards`, `Req. Items: Ahriman Wing`, `Dispatch Time: 10 Days`],
    },
    {
        number: 142,
        name: `Ghosts Of War`,
        description: `The wails of a soldier's ghost are troubling folk near the ruins of a church on an old battlefield in the east. Please help. ~ Marvin, Town Official`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: [
          "Completed To Ambervale (#022)",
          "Completed Young Love (#141)",
        ],
        reward: [`12400 Gil`, `Edaroya Tome`, `1x Random Item`, `Req. Items: Tranquil Box`, `Req. Skills: Track/Lvl.40`, `Dispatch Time: 10 Days`],
    },
    {
        number: 143,
        name: `The Last Day`,
        description: `My whole class's "Ancient Studies" homework was stolen! If he had some ancient object, we could do it again... Help! ~ Babins, 4th Grade Swords`,
        type: `Dispatch`,
        cost: `200 Gil`,
                prerequisites: [
          "Completed Herb Picking (#001)",
          "Completed Thesis Hunt (#002)",
        ],
        reward: [`1800 Gil`, `Homework`, `1x Random Item`, `Req. Items: Ancient Medal`, `Dispatch Time: 5 Days`],
    },
    {
        number: 144,
        name: `The Bell Tolls`,
        description: `They're rebuilding the Sart Clocktower that burned the other day. Never know what you might find in the rubble, eh? ~ Tysner, Streetear`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: ["Completed Desert Patrol (#017)"],
        reward: [`9000 Gil`, `Dictionary`, `1x Random Item`, `Dispatch Time: 10 Days`],
    },
    {
        number: 145,
        name: `Goblin Town`,
        description: `A goblin stole my favorite monster guide and buried it under a rock! I'll give you a copy if you get mine back for me! ~ Ian, Inquisitive Youth `,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Desert Peril (#004)"],
        reward: [`3600 Gil`, `Monster Guide`, `1x Random Item`, `Req. Items: Mythril Pick`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 146,
        name: `Secret Books`,
        description: `We got the secret books proving Selbaden Church's shady deals, but I'm scared they'll find it! How can I relax!? ~ Anonymous`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`11400 Gil`, `Secret Books`, `1x Random Item`, `2x Random Cards`, `Req. Items: Stilpool Scroll`, `Dispatch Time: 10 Days`],
    },
    {
        number: 147,
        name: `Words Of Love`,
        description: `Ah, Locuna! I am but a servant, and you a noble's daughter. Our love cannot be, but I must tell you how I feel! Poem, anyone? ~ Cristo, Lovestruck Youth`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`10000 Gil`, `Rat Tail`, `1x Random Item`, `Req. Items: Stilpool Scroll`, `Dispatch Time: 10 Days`],
    },
    {
        number: 148,
        name: `You, Immortal`,
        description: `Looking for someone to model for a statue to be put in the Royal Library's new wing. Youth, beauty, and physique a plus. ~ Cesare, Artist`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Twisted Flow (#005)",
          "Completed Antilaws (#006)",
        ],
        reward: [`4600 Gil`, `Stradivari`, `1x Random Item`, `2x Random Cards`, `Req. Items: Tonberry Lamp`, `Req. Skills: Craft/Lvl.10`, `Dispatch Time: 30 Days`],
    },
    {
        number: 149,
        name: `Clocktower`,
        description: `The town clocktower has been struck by lightning, and the 12:00 gemstone lost. Need people to help with restoration. ~ Market Square Association`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`11400 Gil`, `Clock Post`, `1x Random Item`, `2x Random Cards`, `Req. Items: Cat's Tears`, `Req. Jobs: Gadgeteer`, `Dispatch Time: 20 Days`],
    },
    {
        number: 150,
        name: `An Education`,
        description: `Nothing is more dear to me than my son, Lukel, yet he has never done well on tests. Won't someone tutor him? ~ Mrs. Kulel`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Antilaws (#006)"],
        reward: [`3600 Gil`, `Fountain Pen`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 151,
        name: `Morning Woes`,
        description: `Our rooster, Nikki, has taken to crowing well before sunrise. Now the neighbors are complaing! Won't someone please help? ~ Mulchin, Grocer`,
        type: `Dispatch`,
        cost: `900 Gil`,
                prerequisites: ["Completed Hot Awakening (#008)"],
        reward: [`5200 Gil`, `Earplugs`, `1x Random Item`, `Dispatch Time: 5 Days`],
    },
    {
        number: 152,
        name: `Down To Earth`,
        description: `I have the incredible power to make things float just by looking at them. Problem is, I can't make them stop floating! Help! ~ Talkof, Psychic`,
        type: `Dispatch`,
        cost: `200 Gil`,
                prerequisites: ["Completed Desert Peril (#004)"],
        reward: [`3400 Gil`, `Crystal`, `1x Random Item`, `Dispatch Time: 5 Days`],
    },
    {
        number: 153,
        name: `To Meden`,
        description: `I had a dog when I worked in the Meden Mines. Could you find her bones and hold a memorial service in the mines for her? ~ Hugo, Baker`,
        type: `Dispatch`,
        cost: `900 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`8200 Gil`, `Old Statue`, `1x Random Item`, `2x Random Cards`, `Req. Items: Animal Bone`, `Dispatch Time: 20 Days`],
    },
    {
        number: 154,
        name: `Neighbor!`,
        description: `We're looking for a few good "neighbors"! Won't you join our world- wid network? ~ Pewl, Neighbor Network`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Emerald Keep (#010)"],
        reward: [`5200 Gil`, `Neighbor Pin`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 155,
        name: `Honor Lost`,
        description: `Some shady character are after our leader, Kerry! Can you help? Please don't let anyone know we hired you. ~ Ed, Assistant Leader`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`5400 Gil`, `Broken Sword`, `1x Random Item`, `2x Random Cards`, `Req. Items: Bomb Shell`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 156,
        name: `Inspiration`,
        description: `I can't think of a single plot hook! Not a word of dialogue! Somebody please bring me an action-packed adventure novel. ~ Ruel, Novelist Apprentice`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Jagd Hunt (#012)"],
        reward: [`10000 Gil`, `Broken Sword`, `1x Random Item`, `2x Random Cards`, `Req. Items: Runba's Tale`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 157,
        name: `Coo's Break`,
        description: `Coo," the star of our Royal Zoo, has escaped and the zookeeper blames himself. An adventure novel should cheer him up. ~ Zoon, Zoomaster`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`10000 Gil`, `Bent Sword`, `1x Random Item`, `2x Random Cards`, `Req. Items: Runba's Tale`, `Dispatch Time: 5 Days`],
    },
    {
        number: 158,
        name: `The Match`,
        description: `Looking for someone to judge the final match in a historic fight. My blade vs. his spells! Current score: 100 to 100. ~ Nukkle, Soldier`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`8800 Gil`, `Rusty Spear`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 159,
        name: `The Deep Sea`,
        description: `Could you help me appraise a work by Clif Lusac, the Muse of the Sea? Someone said it's a fake! I'll give you a badge! ~ Olwen, Art Dealer`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Materite Now! (#019)",
          "Completed Materite Now (#021)",
        ],
        reward: [`11400 Gil`, `Feather Badge`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 160,
        name: `A Worthy Eye`,
        description: `Only a sharp eye can find the best items! If you need an "insignia," bring me an item worthy of my eye! ~ E'oi the Elder`,
        type: `Dispatch`,
        cost: `2700 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`0 Gil`, `Insignia`, `1x Random Item`, `2x Random Cards`, `Req. Items: Feather Badge/Delta Fang`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 161,
        name: `Lost In Mist`,
        description: `Our hill once called "The Sun's Home" is now called "The Hill of Mists." Can you find out why? ~ Nache, Townsperson`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed Desert Patrol (#017)"],
        reward: [`10000 Gil`, `Ally Finder`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 20 Days`],
    },
    {
        number: 162,
        name: `Darn Kids`,
        description: `Lately, kids have been forming gangs and beating up on other kids. Maybe if we distract them with something they'd stop. ~ Victor, School Principal`,
        type: `Dispatch`,
        cost: `2700 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`11400 Gil`, `Ally Finder2`, `1x Random Item`, `2x Random Cards`, `Req. Items: Dame's Blush/Ally Finder`, `Req. Skills: Smithing/Lvl.20`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 163,
        name: `Stage Fright`,
        description: `Needed: charm for curing stage fright. I want the cutest girl in town, Ms. Rina, to notice me in the play, but I'm too nervous! ~ Emporio, Young Actor`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`10600 Gil`, `Tranquil Box`, `1x Random Item`, `Req. Items: Old Statue`, `Dispatch Time: 15 Days`],
    },
    {
        number: 164,
        name: `Diary Dilemma`,
        description: `My little brothers hid my diary somewhere in my house. I need you to find it before -- gasp -- my parents do!!! ~ Edwina, Concerned Girl`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Twisted Flow (#005)"],
        reward: [`3600 Gil`, `Loaded Dice`, `1x Random Item`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 165,
        name: `Hundred-Eye`,
        description: `The great hunter Hundred-Eye's daughter, Kailea, has just started hunting; but frankly, she sucks. Someone please train her!`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed The Big Find (#016)",
          "Completed Wine Delivery (#126)",
        ],
        reward: [`9000 Gil`, `Snake Shield`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Battles`],
    },
    {
        number: 166,
        name: `Runaway Boy`,
        description: `Need someone to find a runaway child and give him some homeknit clothes. The clothes will be ready as soon as I find thread. ~ Gina, Marun Orphanage`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`5400 Gil`, `Stasis Rope`, `1x Random Item`, `Req. Items: Black Thread`, `Dispatch Time: 10 Days`],
    },
    {
        number: 167,
        name: `Mad Alchemist`,
        description: `Dig me a nice cave home. My bizarre experiments have earned me the moniker of "Mad Alchemist." Now I want to live alone. ~ Galdinas, Alchemist`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed The Cheetahs (#003)"],
        reward: [`3400 Gil`, `Mythril Pick`, `1x Random Item`, `Dispatch Time: 10 Days`],
    },
    {
        number: 168,
        name: `Caravan Guard`,
        description: `Wanted: caravan guards. We are traveling merchants who sell our goods from town to town. We expect bandits in the pass ahead. ~ Sirocco, Caravan Leader`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`4600 Gil`, `Caravan Musk`, `1x Random Item`, `2x Random Cards`, `Req. Items: Elda's Cup`, `Dispatch Time: 20 Days`],
    },
    {
        number: 169,
        name: `Lifework`,
        description: `Needed: potion advice. Making the ultimate love potion is my life work. I'll be rich and famous for all time! ~ Dandarc, Palace Alchemist`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Magic Wood (#009)",
          "Completed Emerald Keep (#010)",
        ],
        reward: [`6000 Gil`, `Love Potion`, `1x Random Item`, `2x Random Cards`, `Req. Jobs: Alchemist`, `Dispatch Time: 15 Days`],
    },
    {
        number: 170,
        name: `Cheap Laughs`,
        description: `Our husband-and-ife comedy routine needs some pizzazz. Flashy magic and headdresses should do the trick. Can you help? ~ Will and Tita`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Hot Awakening (#008)"],
        reward: [`4600 Gil`, `Tonberry Lamp`, `1x Random Item`, `Req. Items: Bomb Shell`, `Dispatch Time: 5 Days`],
    },
    {
        number: 171,
        name: `T.L.C.`,
        description: `I need someone to heal my wounds so I can get my revenge on those stinking lizard bangaas that lured my platoon into a trap! ~ Gecklan, Platoon Leader`,
        type: `Dispatch`,
        cost: `3500 Gil`,
                prerequisites: ["Completed Desert Patrol (#017)"],
        reward: [`7600 Gil`, `Stilpool Scroll`, `1x Random Item`, `Req. Skills: Magic/Lvl.25`, `Req. Jobs: White Mage`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 172,
        name: `Frozen Spring`,
        description: `Someone's frozen our village's only spring, and it's not thawing. Our children are thirsty! Please help us. ~ Nino, Shepard`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Twisted Flow (#005)"],
        reward: [`3400 Gil`, `Dragon Bone`, `1x Random Item`, `Dispatch Time: 20 Days`],
    },
    {
        number: 173,
        name: `No Scents`,
        description: `Tonight's the night of my big date, and my dress and shoes are perfect, but I can't find my perfume anywhere! Help! ~ Lucy, Party Girl `,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`5200 Gil`, `Animal Bone`, `1x Random Item`, `2x Random Cards`, `Req. Items: Caravan Musk`, `Dispatch Time: 15 Days`],
    },
    {
        number: 174,
        name: `On The Waves`,
        description: `I found a message in a bottle: a cry for help from a southern isle! If only I could send something -- water even! ~ Luis, Flower Seller`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`13200 Gil`, `Skull`, `1x Random Item`, `2x Random Cards`, `Req. Items: Life Water`, `Req. Jobs: Time Mage`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 175,
        name: `Spirited Boy`,
        description: `My son is in the attic, pretending to be a monster that doesn't like homework! Maybe showing him a dictionary would work. ~ Sihaya, Mother of Three`,
        type: `Dispatch`,
        cost: `700 Gil`,
                prerequisites: ["Completed Antilaws (#006)"],
        reward: [`6400 Gil`, `Clock Gear`, `1x Random Item`, `2x Random Cards`, `Req. Items: Dictionary`, `Dispatch Time: 5 Days`],
    },
    {
        number: 176,
        name: `Powder Worries`,
        description: `There's a lot of firearms coming into town lately. Thankfully, we've had no injuries... yet. Check into this matter with me. ~ Senole, Town Watch`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: [
          "Completed Emerald Keep (#010)",
          "Completed Pale Company (#011)",
          "Completed Lost Heirloom (#140)",
        ],
        reward: [`5400 Gil`, `Gun Gear`, `1x Random Item`, `2x Random Cards`, `Req. Jobs: Gunner`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 177,
        name: `The Blue Bolt`,
        description: `Our editor used to be so fast we called him "Blue Bolt." But he's lost it of late. We need something to jog his memory! ~ Elu, Cyril Times Reporter`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`9000 Gil`, `Silk Bloom`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 178,
        name: `Sweet Talk`,
        description: `Needed: speech trainer. I can't speak well. I'm always saying too much, or not enough! Please help! ~ Luhoche, Little Girl`,
        type: `Dispatch`,
        cost: `950 Gil`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`7000 Gil`, `Moon Bloom`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 179,
        name: `Scarface`,
        description: `My face was cut in a duel that I recklessly started. I wish to keep the scar as a penance, but how do I keep it from healing? ~ Tingel, Knight`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`9000 Gil`, `Blood Apple`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 180,
        name: `Mirage Town`,
        description: `Adventurer Phis seeks for the sign to the sky mirage city of Punevam. Get this: he says it's some kind of mushroom! Ridiculous! ~ Hoysun, Pub Customer`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`11400 Gil`, `Magic Fruit`, `1x Random Item`, `2x Random Cards`, `Req. Items: Goldcap`, `Dispatch Time: 10 Days`],
    },
    {
        number: 181,
        name: `Soldier's Wish`,
        description: `I'm not long for this world, but I would like to see the town clock again before I go... Grandma always loved it. ~ Barus, Old Soldier`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`10600 Gil`, `Power Fruit`, `1x Random Item`, `2x Random Cards`, `Req. Items: Clock Gear/Clock Post`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 182,
        name: `Dry Spell`,
        description: `With all the sun we've been getting, we fear a drought. We need people to help open the sluice gates at Mitoralo. ~ Hinnel, Dam Official`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`9600 Gil`, `Stolen Gil`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 20 Days`],
    },
    {
        number: 183,
        name: `Swap Meet`,
        description: `I found stacks of old bills at my house, but I want old medals with pictures of the goddess on them! Like to trade? ~ Gelp, Antiques Collector`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`1200 Gil`, `Ancient Bills`, `1x Random Item`, `2x Random Cards`, `Req. Items: Ancient Medal`, `Dispatch Time: 5 Days`],
    },
    {
        number: 184,
        name: `Adaman Order`,
        description: `Has your clan put in its order for adaman alloy? It sells out quick, so get your order in soon! How about our shop? ~ Elbo, Workshop Vargi`,
        type: `Dispatch`,
        cost: `2500 Gil`,
                prerequisites: [
          "Completed Free Bervenia! (#087)",
          "Clear Game",
        ],
        reward: [`0 Gil`, `Adaman Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Adamantite/Adamantite`, `Req. Skills: Smithing/Lvl.35`, `Dispatch Time: 15 Days`],
    },
    {
        number: 185,
        name: `Magic Mysidia`,
        description: `It was recently discovered that mysidia alloy is enchanted with ancient magic! Better buy some before the prices go up! ~ Deunon, Workshop Rol`,
        type: `Dispatch`,
        cost: `3000 Gil`,
                prerequisites: [
          "Completed Adaman Order (#184)",
          "Clear Game",
        ],
        reward: [`0 Gil`, `Mysidia Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Adamantite/Silvril`, `Req. Skills: Smithing/Lvl.35`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 186,
        name: `Conundrum`,
        description: `If you made a shield and a sword from the strongest of all alloys -- crusite -- which would be stronger? Come and let's find out! ~ Sabak, Workshop Berk`,
        type: `Dispatch`,
        cost: `3000 Gil`,
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
        ],
        reward: [`0 Gil`, `Crusite Alloy`, `1x Random Item`, `2x Random Cards`, `Req. Items: Zodiac Ore/Zodiac Ore`, `Req. Skills: Smithing/Lvl.35`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 187,
        name: `Lucky Night`,
        description: `Announcing: Casino Party. Test your luck at our one-night-only casino party! All welcome. ~ Matim, Steward`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
        ],
        reward: [`18000 Gil`, `Rat Tail`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Days`],
    },
    {
        number: 188,
        name: `Tutor Search`,
        description: `I seek my childhood tutor, Yoel. I have a promise to keep to him. It means very much to me. ~ Count Anet`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Lucky Night (#187)",
          "Clear Game",
        ],
        reward: [`11400 Gil`, `Rusty Sword`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 189,
        name: `Why Am I Wet?`,
        description: `I don't want to have to move, but it has started raining far too much around my house. Please find out why. ~ Ivan, Gold Sculptor`,
        type: `Dispatch`,
        cost: `1800 Gil`,
                prerequisites: [
          "Completed Lucky Night (#187)",
          "Clear Game",
        ],
        reward: [`13600 Gil`, `Broken Sword`, `1x Random Item`, `2x Random Cards`, `Req. Jobs: Red Mage`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 190,
        name: `Run With Us`,
        description: `We are the Lightning Brothers, bound by blood-oath and iron law! Why don't you try joining us and see if you like it? ~ LBs, Emissaries of Justice`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: [
          "Completed Why Am I Wet? (#189)",
          "Clear Game",
        ],
        reward: [`18000 Gil`, `Bent Sword`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 40 Days`],
    },
    {
        number: 191,
        name: `Lucky Charm`,
        description: `Someone please find me an item that will lose to no bad luck, and a charm or spell to ward off evil spells. I'm fighting! ~ Milea, Determined Lady`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: [
          "Completed Why Am I Wet? (#189)",
          "Clear Game",
        ],
        reward: [`9000 Gil`, `Rusty Spear`, `1x Random Item`, `2x Random Cards`, `Req. Items: Rat Tail`, `Dispatch Time: 40 Days`],
    },
    {
        number: 192,
        name: `Alchemist Boy`,
        description: `Please stop my brother, Hasmir before someone gets hurt. He thinks he's an alchemist but all he makes is smoke and explosions! ~ Gretzel, Townsgirl`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Lucky Charm (#191)",
          "Clear Game",
        ],
        reward: [`4600 Gil`, `Insignia`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 193,
        name: `Thorny Dreams`,
        description: `The bangaa girl "Eleono" ssleepss in the Thoussand-Thorn Wood. Looking for a clanner to find out why she ssleepss. ~ Vajiri, Bangaa`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: [
          "Completed Lucky Night (#187)",
          "Clear Game",
        ],
        reward: [`16000 Gil`, `Blood Apple`, `1x Random Item`, `Dispatch Time: 20 Days`],
    },
    {
        number: 194,
        name: `Free Cyril!`,
        description: `The town Cyril has fallen into the hands of Clan Borzoi. We need you set a trap to get them out of our town! ~ Cyril Town Watch`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Fowl Thief (#068)",
          ",",
          "and reading",
          "Thief Exposed!",
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
          "Completed Borzoi Falling (#073)",
          ",",
          "and",
          "reading",
          "s End",
        ],
        reward: [`4200 Gil`, `2x Random Items`, `2x Random Cards`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 196,
        name: `Mind Ceffyl`,
        description: `Bring me the sigils of "fire" and "wind." I shall craft from them a mind ceffyl, needed to make a spiritstone. ~ Melmin, Sage of the West`,
        type: `Dispatch`,
        cost: `3800 Gil`,
                prerequisites: [
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`0 Gil`, `Mind Ceffyl`, `Req. Items: Fire Sigil/Wind Sigil`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 197,
        name: `Body Ceffyl`,
        description: `Bring me the sigils of "earth" and "water." I shall craft from them a body ceffyl, needed to make a spiritstone. ~ Bastra, Sage of the East`,
        type: `Dispatch`,
        cost: `3800 Gil`,
                prerequisites: [
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`0 Gil`, `Body Ceffyl`, `Req. Items: Earth Sigil/Water Sigil`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 198,
        name: `The Spiritstone`,
        description: `Bring the two ceffyls to me, and I shall use my alchemy to craft a spiritstone for you. ~ Kespas, Sage of the South`,
        type: `Dispatch`,
        cost: `3800 Gil`,
                prerequisites: [
          "Completed Free Baguba! and reading (#077)",
          ",",
          "The Sages",
        ],
        reward: [`0 Gil`, `Spiritstone`, `Req. Items: Mind Ceffyl/Body Ceffyl`, `Dispatch Time: 4 Battles`],
    },
    {
        number: 199,
        name: `Girl In Love`,
        description: `I've got a new boyfriend! He's a brave knight, with chestnut hair. Could you tell our fortune with the white thread? ~ Carena, Young Girl`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Thesis Hunt. Bardmoon (#002)",
          "only",
        ],
        reward: [`3400 Gil`, `Magic Medal`, `1x Random Item`, `Req. Items: White Thread`, `Req. Jobs: White Mage`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 200,
        name: `Chocobo Help!`,
        description: `Need: Help during the Chocobo spawning season. - Private room - Meals - No experience required - Childcare - Any race ~ Sasasha, Chocobo Ranch`,
        type: `Dispatch`,
        cost: `200 Gil`,
                prerequisites: [
          "Completed Thesis Hunt. Bardmoon (#002)",
          "only",
        ],
        reward: [`100 Gil`, `Chocobo Egg`, `1x Random Item`, `Dispatch Time: 5 Days`],
    },
    {
        number: 201,
        name: `The Skypole`,
        description: `Have you heard of the skypole on the southern peninsula? They it's a stairway to the gods! I'd like to see that! ~ Tay, Streetear`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Thesis Hunt (#002)"],
        reward: [`2400 Gil`, `Ancient Medal`, `1x Random Item`, `Dispatch Time: 10 Days`],
    },
    {
        number: 202,
        name: `Ruins Survey`,
        description: `Looking for people to join in a survey of the Istar Ruins to be held again this year. See ancient history first hand! ~ Rekka, Relics Board`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Materite Now! (#019)"],
        reward: [`10800 Gil`, `Ancient Medal`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 203,
        name: `Dig Dig Dig`,
        description: `Zezena Mines: Discovery of the Parum Family, scene of mechanist innovation! We must dig until we find a new mine shaft! Dig! ~ Zezena Mines Co.`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Present Day. Madmoon (#020)",
          "only",
        ],
        reward: [`11800 Gil`, `Zodiac Ore`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 204,
        name: `Seeking Silver`,
        description: `Before the Bell Mines became known for mythril, they were silver mines. Help me look for leftover silver near the west wall. ~ Hoholum, Gayl Stoneworks`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Jagd Hunt (#012)"],
        reward: [`3400 Gil`, `Silvril`, `1x Random Item`, `Dispatch Time: 15 Days`],
    },
    {
        number: 205,
        name: `Materite`,
        description: `In the western edge of the Materiwood, materite can be gathered with ease if you go at the right time. Go have a look! ~ Sals, Pub Customer`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Twisted Flow (#005)",
          "Completed Antilaws. Kingmoon only (#006)",
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
          "Completed Emerald Keep (#010)",
          "Completed You Immortal. Huntmoon (#148)",
          "Completed You",
          "only",
        ],
        reward: [`2800 Gil`, `Leestone`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 207,
        name: `Metal Hunt`,
        description: `I found a turtle burial ground at a mountain shrine. I keep going back in hopes that I might find some adamantite! ~ Catess, Traveler`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Antilaws (#006)",
          "Completed Hungry Ghost (#123)",
        ],
        reward: [`2400 Gil`, `Adamantite`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 15 Days`],
    },
    {
        number: 208,
        name: `Math Is Hard`,
        description: `I've been at this equation for months. Never have I been so stumped in my life! Won't someone take a crack at this with me? ~ Kosyne, Mathematician`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`4200 Gil`, `Black Thread`, `2x Random Items`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 209,
        name: `The Witness`,
        description: `Wanted: bodyguard. I witnessed a crime and now must appear in court. Please protect me until the day of the trial. ~ Bode, Townsperson`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Diamond Rain (#007)"],
        reward: [`4600 Gil`, `Black Thread`, `Lost Gun`, `Req. Jobs: Defender`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 210,
        name: `Life Or Death`,
        description: `I'll never finish on time. I have to borrow someone's notes. Can you find some for me, or I'll never get this homework done! ~ Felhon, Student`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed The Cheetahs (#003)"],
        reward: [`2400 Gil`, `Black Thread`, `1x Random Item`, `Req. Items: Homework`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 211,
        name: `Karlos's Day`,
        description: `Wanted: performer to entertain at the birthday party of Karlos, the second son of the Marquis Ealdoring. ~ Jung, Streatear`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`4600 Gil`, `White Thread`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 212,
        name: `To Father`,
        description: `Could you bring my father to me? I promise I won't speak harshly to him. I just want to visit Mother's grave. Thank you. ~ Ren, Notary Public`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: [
          "Completed Magic Wood (#009)",
          "Completed The Performer (#270)",
        ],
        reward: [`11400 Gil`, `White Thread`, `1x Random Item`, `Dispatch Time: 10 Days`],
    },
    {
        number: 213,
        name: `Oh Milese`,
        description: `Know you Milese of the Kefeus acting troupe? I'm her biggest fan! Won't you give her this song I've written? ~ Valerio, Composer`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Desert Peril (#004)"],
        reward: [`2800 Gil`, `White Thread`, `1x Random Item`, `Dispatch Time: 15 Days`],
    },
    {
        number: 214,
        name: `Skinning Time`,
        description: `We're looking for a few good skinners to help skin chocobo. It's not much of a living, but someone's got to do it! ~ Navarro, Chocobo Ranch`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`3600 Gil`, `Chocobo Skin`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 215,
        name: `Wild River`,
        description: `We need workers to help rein in the wild waters of the Pilos River in Andarna before it floods again! Please help. ~ Haagen, Townsperson`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`5400 Gil`, `Magic Cloth`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 216,
        name: `Magic Cloth`,
        description: `Hello again! It's me, Gonzales, from the magic cloth shop! I'm trading magic cloth for magic cotton -- got any? ~ Gonzales, Magic Cloth Shop`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Hot Awakening (#008)",
          "Completed The Bounty. Sagemoon (#013)",
          "only",
        ],
        reward: [`0 Gil`, `Magic Cloth`, `1x Random Item`, `1x Random Card`, `Req. Items: Magic Cotton`, `Dispatch Time: 10 Days`],
    },
    {
        number: 217,
        name: `Cotton Guard`,
        description: `It's the season when the typhoons come blowing from the south again. I need to find a way to protect my cotton crop! ~ Kerney, Townsperson`,
        type: `Dispatch`,
        cost: `950 Gil`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`7000 Gil`, `Magic Cotton`, `1x Random Card`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 218,
        name: `Help Dad`,
        description: `My son wants me to win him a toy in the shooting game at the next carnival. Won't somebody give me shooting lessons? ~ Bijard, Theologan`,
        type: `Dispatch`,
        cost: `950 Gil`,
                prerequisites: ["Completed The Bounty (#013)"],
        reward: [`7800 Gil`, `Bomb Shell`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 219,
        name: `Rubber or Real`,
        description: `My favorite toy is the champion of justice, but my friend Amigoh says it's just a rubber monster. Who's right? ~ Zels, Young Boy`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Emerald Keep (#010)"],
        reward: [`5200 Gil`, `Bomb Shell`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 220,
        name: `Into The Woods`,
        description: `A pack of panthers has appeared in a wood far to the south. Somebody clear them out before they hurt someone! ~ Iguas, Townsperson`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Scouring Time. Huntmoon (#015)",
          "only",
        ],
        reward: [`4600 Gil`, `Panther Hide`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 221,
        name: `Jerky Days`,
        description: `Want some delicious jerky? Come help out at my store! We have to make 5,000 sticks of jerky this year. ~ Godon, Butcher`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Scouring Time. Kingmoon (#015)",
          "only",
        ],
        reward: [`4200 Gil`, `Jerky`, `1x Random Card`, `Dispatch Time: 5 Days`],
    },
    {
        number: 222,
        name: `New Fields`,
        description: `Needed: live-in help. We're looking to increase our fields again this year. All welcome! Don't worry, you'll be paid! ~ Farmer's Guild`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Jagd Hunt. Madmoon only (#012)"],
        reward: [`3600 Gil`, `Gysahl Greens`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 223,
        name: `Strange Fires`,
        description: `Strange fires have been breaking out near our powder store. It has to be a rival guild. Maybe you could ambush them? ~ Dabum, Fireworks Guild`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`9600 Gil`, `Magic Medal`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 224,
        name: `Better Living`,
        description: `Wanted: tester. Help test our amazing new form of illumination, guaranteed to change the lives of city dwellers! ~ Better Living Labs`,
        type: `Dispatch`,
        cost: `1300 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`10000 Gil`, `Chocobo Egg`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 225,
        name: `Malboro Hunt`,
        description: `A lost malboro child from a nest in the pond has wandered into town! Please return it to its parents before someone gets hurt. ~ Jonnie, Ice Cream Man`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Jagd Hunt. Madmoon only (#012)",
          "Completed The Bounty (#013)",
        ],
        reward: [`4200 Gil`, `Cyril Ice`, `1x Random Item`, `1x Random Card`, `Req. Items: Chocobo Egg`, `Dispatch Time: 15 Days`],
    },
    {
        number: 226,
        name: `Chocobo Work`,
        description: `Wanted: register clerk & part-time floor scrubber at The Chocobo's Kweh. ~ Rolana, The Chocobo's Kweh`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Quiet Sands. Bardmoon (#018)",
          "only",
        ],
        reward: [`4600 Gil`, `Choco Bread`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 227,
        name: `Party Night`,
        description: `They're holding a welcome party at the furniture store, and they want me to perform some tricks! Somebody teach me! ~ Xiao, Furniture Seller`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`9600 Gil`, `Choco Gratin`, `1x Random Item`, `2x Random Card`, `Dispatch Time: 15 Days`],
    },
    {
        number: 228,
        name: `Mama's Taste`,
        description: `Being away from home for 10 years, I've started to really miss my mama's gratin. Won't someone make me some kupo gratin? ~ Takatoka, Machinist`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`9000 Gil`, `Choco Gratin`, `1x Random Item`, `2x Random Cards`, `Req. Items: Chocobo Egg/Gysahl Greens`, `Dispatch Time: 15 Days`],
    },
    {
        number: 229,
        name: `The Well Maze`,
        description: `I ran into a cave while I was digging a well, and there's something inside! Maybe you could lure it out with some bread? ~ Meuk, Well Digger`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Materite Now! (#019)"],
        reward: [`9600 Gil`, `Grownup Bread`, `1x Random Item`, `2x Random Cards`, `Req. Items: Choco Bread`, `Dispatch Time: 15 Days`],
    },
    {
        number: 230,
        name: `She's Gone`,
        description: `For years I gave her my all and now she's left and taken my savings with her. I going for a drink, want to come along? ~ Omar, Townsperson`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Materite Now! (#019)",
          "Completed Bread Woes (#234)",
        ],
        reward: [`10600 Gil`, `Malboro Wine`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 5 Days`],
    },
    {
        number: 231,
        name: `Magic Vellum`,
        description: `Come make magic sheepskin vellum with me! I'll show you the pen is mightier than the sword. Bring some magic cotton with you! ~ Chikk, Paper Maker`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Desert Patrol (#017)"],
        reward: [`4600 Gil`, `Magic Vellum`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 232,
        name: `Novel Ascent`,
        description: `I want to write novels about mountain climbing, but I'm not very good at it. I need a rope that won't ever break! ~ Torfo, Apprentice Novelist`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`11400 Gil`, `Runba's Tale`, `1x Random Item`, `2x Random Cards`, `Req. Items: Stasis Rope`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 233,
        name: `Shiver`,
        description: `Someone please drive off the wailing spirit that haunts the pass near town. Hearing it sucks the strength right out of me! ~ Gillom, Townsperson`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`11800 Gil`, `Runba's Tale`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 20 Days`],
    },
    {
        number: 234,
        name: `Bread Woes`,
        description: `I've been trying to make a bread that kids will love, but it's tough going. What I need now is a good bread to sooth MY taste buds. ~ Noluado, Baker`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`10800 Gil`, `Kiddy Bread`, `1x Random Item`, `2x Random Cards`, `Req. Items: Choco Bread`, `Dispatch Time: 20 Days`],
    },
    {
        number: 235,
        name: `Book Mess`,
        description: `Needed: able clan members to help clean my room. All you have to do is put a few thousand books back on their shelves! ~ Mimin, Scholar`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: [
          "Completed Present Day! Sagemoon (#020)",
          "only",
        ],
        reward: [`12400 Gil`, `Encyclopedia`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 236,
        name: `One More Tail`,
        description: `My lucky rabbit tail found me a wonderful husband! But now we're married, I think I need a little more luck. Got a tail for me? ~ Bibilina, Lucky Lady`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Present Day! Madmoon (#020)",
          "only",
        ],
        reward: [`10800 Gil`, `Rabbit Tail`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 10 Days`],
    },
    {
        number: 237,
        name: `Relax Time!`,
        description: `Come enjoy the Danbukwood and get back to nature! Buy some wood and bring it home for that woodsy feeling all year long! ~ Yeesa Tourism Board`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed To Ambervale. Huntmoon (#022)",
          "only",
        ],
        reward: [`4600 Gil`, `Danbukwood`, `1x Random Item`, `Dispatch Time: 15 Days`],
    },
    {
        number: 238,
        name: `Foma Jungle`,
        description: `I've got tons of orders for moonwood chairs! Get me some moonwood from the deep Foma Jungle, if you would. No pun intended. ~ Gueguerre, Wood Craftsman`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed To Ambervale. Huntmoon (#022)",
          "only",
        ],
        reward: [`4600 Gil`, `Moonwood`, `1x Random Item`, `Dispatch Time: 15 Days`],
    },
    {
        number: 239,
        name: `For A Flower`,
        description: `I need a telaq flower, a strange blossom that blooms only a few times a year deep within a cave -- a cave with monsters. ~ Shelm, Alchemist`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`6000 Gil`, `Telaq Flower`, `1x Random Item`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 240,
        name: `Giza Plains`,
        description: `A bug infestation has hit Giza Plains, and it will reach the town if we don't take action! Someone help drive those critters away! ~ Noris, Townsperson`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Thesis Hunt (#002)",
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
                prerequisites: [
          "Completed Desert Peril (#004)",
          "Lutia Pass not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 242,
        name: `The Nubswood`,
        description: `Rock turtles have been attacking travelers in the Nubswood. Use this "shellout" to get rid of them, please. ~ Hoelik, Townsperson`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Antilaws (#006)",
          "Completed Raven",
          "Nubswood not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 243,
        name: `Eluut Sands`,
        description: `I'm trying to reforest the Eluut Sands in an attempt to tame the beasts that live there. Bring me a desert plant for study. ~ Karenne, Herbologist`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Diamond Rain (#007)",
          "Eluut Sands not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 244,
        name: `Ulei River`,
        description: `Somebody get the word out: there's fine fish to be had in the upper waters of the Ulei River! ~ Holt, Angler`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Hot Awakening (#008)",
          "Ulei River not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 245,
        name: `Aisenfield`,
        description: `Somebody spread the word that those rumors of bandits in Aisenfield are a bunch of lies. It's bad for business! ~ Chocobo Shop, Aisen Branch`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Magic Wood (#009)",
          "Aisenfield not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 246,
        name: `Roda Volcano`,
        description: `Roda Volcano's been active lately. Someone needs to go to the road at the base of the cone and clean off the chunks of lava. ~ Naricys, Geologist `,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Emerald Keep (#010)",
          "Roda Volcano not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 247,
        name: `Travel Aid`,
        description: `Please light the waypoints in the Koringwood. They are vital landmarks for helping travelers find their way. Thank you. ~ Zeshika, Woodland Guide`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Pale Company (#011)",
          "Koringwood not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 248,
        name: `The Salikawood`,
        description: `I plan on cutting a path through the Salikawood. I'll do some reforesting, too! I can't pay much, but I really need help. ~ Laycher, Innkeeper`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Jagd Hunt (#012)",
          "Salikawood not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 249,
        name: `Nargai Cave`,
        description: `Monsters can't stand the smell of the flower that grows deep in Nargai Cave. Great for ensuring a safe voyage! Help me get one. ~ Buck, Bontanist`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed The Bounty (#013)",
          "Nargai Cave not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 250,
        name: `Kudik Peaks`,
        description: `A rock slide has blocked off the road to the Kudik Peaks. Looking for people to help clear it off. ~ Jagark, Mountain Patrol`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Golden Clock (#014)",
          "Completed Scouring Time (#015)",
          "Kudik Peaks not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 251,
        name: `Jeraw Sands`,
        description: `One of the ruins in Jeraw Sands is supposed to be the entrance to an underground cave! Please investigate. ~ Gadfly, Ivalice Tours`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Jeraw Sands not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 252,
        name: `Uladon Bog`,
        description: `Won't someone help me build a bridge over Uladon Bog? It would really speed up travel. ~ Iluluna, Young Girl`,
        type: `Capture`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Uladon Bog not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 253,
        name: `Gotor Sands`,
        description: `Find the oasis said to lay hidden in Gotor Sands. If we could draw water from there, it would be a great boon to travelers. ~ Gabela, Traveling Merchant`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed The Big Find (#016)",
          "Gotor Sands not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 254,
        name: `Delia Dunes`,
        description: `Please find out where the dragonflies of Delia Dunes live. Their wings are a vital ingredient for making medicine. ~ Carulea, Alchemist`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Desert Patrol (#017)",
          "Delia Dunes not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 255,
        name: `Bugbusters`,
        description: `Bladebugs, the natural enemy of all monsters, are said to gather on the river that flows deep in the Materiwood. Find them! ~ Winetz, Entomologist`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Materiwood not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 256,
        name: `Tubola Cave`,
        description: `They say that the crystals are making monsters go crazy... I wonder about silvril? Get some from Tubola Cave for me! ~ Phol, Researcher`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Present Day (#020)",
          "Tubola Cave not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 257,
        name: `Deti Plains`,
        description: `They say armor fashioned from a wyrmgod scale will withstand any attack! Find a scale in the ruins on the Deti Plains for me. ~ Takukulu, Armorer`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed To Ambervale (#022)",
          "Deti Plains not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 258,
        name: `Siena Gorge`,
        description: `I want you to confirm the old rumor that there is poison on the winds that blow through Siena Gorge. I'll pay you! ~ Cal, Lover of Gossip`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed To Ambervale (#022)",
          "Siena Gorge not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 259,
        name: `Jagd Alhi`,
        description: `I'm thinking of building a gladitorial arena in Jagd Ahli. A lawless sport for a lawless zone! Help me find a good spot. ~ Pakanon, Architect`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Exploration (#065)",
          "Clear Game",
          "Jagd Ahli not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 260,
        name: `Jagd Helje`,
        description: `I dropped something very important to me in a ruin in Jagd Helje. Please find it! ~ Ekal, Astrologer`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Den Of Evil (#064)",
          "Clear Game",
          "Jagd Helje not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 15 Enemies`],
    },
    {
        number: 261,
        name: `Jagd Dorsa`,
        description: `Please kill the jagdsaurus that plagues Jagd Dorsa. He'll come out if you go in there alone, I guarantee it. ~ Handog, Townsperson`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
          "Jagd Dorsa not Freed",
          "Seen 24 05",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 15 Enemies`],
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
          "Clear Game",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 263,
        name: `Ozmonfield`,
        description: `The chomper beetles found in Ozmonfield are eating my chocobo feed. Please use this "bug-B-gone" to drive them away! ~ Dalaben, Ranch Manager`,
        type: `Capture`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
          "Completed A Dragon",
          "Ozmonfield not Freed",
        ],
        reward: [`2400 Gil`, `1x Random Item`, `1x Random Card`, `Dispatch Time: 7 Enemies`],
    },
    {
        number: 264,
        name: `Swords in Cyril`,
        description: `Announcing the biggest even of the year: the Cyril Swordsmanship Competition! Test your strength and skill! ~ Cyril Event Committee`,
        type: `Dispatch`,
        cost: `300 Gil`,
                prerequisites: ["Completed Thesis Hunt (#002)"],
        reward: [`1800 Gil`, `Secret Item (Victor Sword)`, `1x Random Item`, `Req. Jobs: Fencer`, `Dispatch Time: 1 Battle`],
    },
    {
        number: 265,
        name: `Newbie Hall`,
        description: `Need: part-time teachers. Help apprentices in a wide variety of jobs learn the tricks of your trade! ~ Oks, Newbie Hall Chief`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: [
          "Completed The Cheetahs (#003)",
          "Completed Earthy Colors (#139)",
        ],
        reward: [`2400 Gil`, `Onion Sword`, `1x Random Item`, `Req. Skills: Combat/Lvl.5`, `Dispatch Time: 10 Days`],
    },
    {
        number: 266,
        name: `Voodoo Doll`,
        description: `I saw the matron casting a spell on that nasty doll! That must be the cause of my lady's illness, it must be. Please, help my lady! ~ Eselle, Maidservant`,
        type: `Dispatch`,
        cost: `400 Gil`,
                prerequisites: ["Completed Twisted Flow (#005)"],
        reward: [`3400 Gil`, `Soulsaber`, `1x Random Item`, `Dispatch Time: 5 Days`],
    },
    {
        number: 267,
        name: `Come On Out`,
        description: `My son is so overweight he can hardly move. Someone get him out of his room! I don't care how you do it. ~ Joyce, Warehouse Monitor`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: ["Completed Antilaws (#006)"],
        reward: [`5400 Gil`, `Oblige`, `1x Random Item`, `2x Random Cards`, `Req. Items: Jerky`, `Dispatch Time: 10 Days`],
    },
    {
        number: 268,
        name: `Food For Truth`,
        description: `My friend was arrested unfairly! While we look for the real criminal, I'd like to send him some good food. Do you know of any? ~ Theo, Fruitseller`,
        type: `Dispatch`,
        cost: `800 Gil`,
                prerequisites: [
          "Completed Diamond Rain (#007)",
          "Completed The Witness (#209)",
        ],
        reward: [`6400 Gil`, `Rhomphaia`, `1x Random Item`, `2x Random Cards`, `Req. Items: Choco Gratin`, `Req. Skills: Appraise/Lvl.18`, `Dispatch Time: 20 Days`],
    },
    {
        number: 269,
        name: `Alba Cave`,
        description: `A turtle monster guards a fabulous treasure at an ancient shrine in Alba Cave. Distract him with some food and it's yours! ~ Mumusen, Pub Customer`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: ["Completed Hot Awakening (#008)"],
        reward: [`6000 Gil`, `Secret Item (Beastsword)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Jerky`, `Req. Jobs: Blue Mage`, `Dispatch Time: 4 Battles`],
    },
    {
        number: 270,
        name: `The Performer`,
        description: `I've performed in many lands, but I've never had a hit. Maybe it's just bad luck? Got anything to make fortune smile on me? ~ Mamek, Traveling Performer`,
        type: `Dispatch`,
        cost: `1100 Gil`,
                prerequisites: ["Completed Magic Wood (#009)"],
        reward: [`9600 Gil`, `Tonberrian`, `1x Random Item`, `2x Random Cards`, `Req. Items: Rabbit Tail`, `Dispatch Time: 15 Days`],
    },
    {
        number: 271,
        name: `One More Time`,
        description: `That guy in the corner's a fabulous tenor. We want him for our chorus group, but he refuses to join. Won't you convince him? ~ Arthin, Chorus Lead`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`6400 Gil`, `Aerial Hole`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 15 Days`],
    },
    {
        number: 272,
        name: `Spring Tree`,
        description: `A tree grows on the duke's land, and every spring a woman comes and looks at its roots. Could you check if something's there? ~ Eukanne, Ducal Maid`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Jagd Hunt. Cadoan Pub (#012)",
          "only",
        ],
        reward: [`7000 Gil`, `Charfire`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 273,
        name: `Who Am I?`,
        description: `I woke in this town with no memory or items but this staff. Please trade me a magic medal for it--I must repay the inkeep. ~ Weathervane Inn, Room 3`,
        type: `Dispatch`,
        cost: `300 Gil`,
                prerequisites: [
          "Completed The Bounty (#013)",
          "Completed Adaman Alloy (#131)",
        ],
        reward: [`600 Gil`, `Power Staff`, `1x Random Item`, `2x Random Cards`, `Req. Items: Magic Medal/Magic Medal`, `Dispatch Time: 15 Days`],
    },
    {
        number: 274,
        name: `Reaper Rumors`,
        description: `My buddy says that on full moon nights, the reaper comes down from the moon to a manse on the hill and someone dies! Is it true? ~ Nud, Future Streetear`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Scouring Time (#015)"],
        reward: [`8800 Gil`, `Crescent Bow`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 275,
        name: `Dog Days`,
        description: `My father is a postman, but he fell off his dogsled and hurt himself bad. I have to help him! Teach me how to ride a dogsled! ~ Rikk, Postman's Son`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed The Big Find (#016)"],
        reward: [`8800 Gil`, `Marduk Bow`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Days`],
    },
    {
        number: 276,
        name: `Good Bread`,
        description: `There's a bowyer outside town that makes the best bows in the land, but he only makes them if you bring him good bread! ~ Arco, Pub Customer`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Desert Patrol (#017)",
          "Completed Quiet Sands (#018)",
        ],
        reward: [`0 Gil`, `Arbalest`, `1x Random Item`, `2x Random Cards`, `Req. Items: Kiddy Bread/Grownup Bread`, `Dispatch Time: 5 Days`],
    },
    {
        number: 277,
        name: `Sword Needed`,
        description: `There's a sword fighting competition coming up, and one of our team can't make it. Looking for a good swordsman to replace her! ~ Lotus, Swordsman`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`9000 Gil`, `Bangaa Spike`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 278,
        name: `El Ritmo`,
        description: `Those Nightwailers are out there singing every night. Noisy bunch, but bring 'em the materials, and they'll make you an instrument.`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Quiet Sands (#018)"],
        reward: [`12400 Gil`, `Secret Item (Fell Castanets)`, `1x Random Item`, `2x Random Cards`, `Req. Items: Danbukwood/Moonwood`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 279,
        name: `Her Big Move`,
        description: `The best dancer in town has gone off to the city to be a star... I'd like to make a toast to her success. Got a drink? ~ Deuxhart, Townsperson`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Materite Now! (#019)"],
        reward: [`9600 Gil`, `Magic Hands`, `1x Random Item`, `2x Random Cards`, `Req. Items: Malboro Wine`, `Dispatch Time: 7 Days`],
    },
    {
        number: 280,
        name: `Don't Look!`,
        description: `They say that on full-moon nights something scary happens if you look at the mirror in one of the dorm rooms! Is it true? Help! ~ Eluiotte, Frightened Girl`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: ["Completed Materite Now! (#019)"],
        reward: [`10800 Gil`, `Reverie Shield`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 281,
        name: `Janitor Duty`,
        description: `What a great parade that was! Which reminds me, they're looking for people to help clean up all the trash. You interested? ~ Grek, Pub Customer`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`11400 Gil`, `Parade Helm`, `1x Random Item`, `2x Random Cards`, `Dispatch Time: 20 Days`],
    },
    {
        number: 282,
        name: `Unlucky Star`,
        description: `I live a cursed life, but now I'm getting married, and nothing can go wrong! I need some kind of charm to ward off evil spirits! ~ Domure, Unlucky Man`,
        type: `Dispatch`,
        cost: `1600 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`13200 Gil`, `Magic Robe`, `1x Random Item`, `2x Random Cards`, `Req. Items: Blood Shawl`, `Dispatch Time: 3 Enemies`],
    },
    {
        number: 283,
        name: `Corral Care`,
        description: `The rainbow-furred corral is the fastest animal in the world, and one's loose on Duke Casell's land. Someone please feed it! ~ Falco, Animal Lover`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`12600 Gil`, `Fire Mitts`, `1x Random Item`, `2x Random Cards`, `Req. Items: Choco Gratin`, `Dispatch Time: 10 Days`],
    },
    {
        number: 284,
        name: `Beastly Gun`,
        description: `Want a gun as strong and fast as a wild beast? Just bring me two little items I need, and it's all yours, free. ~ Strives, Musketeer`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: [
          "Completed Royal Valley (#024)",
          "Clear Game",
          "Completed C8",
        ],
        reward: [`0 Gil`, `Calling Gun`, `1x Random Item`, `2x Random Cards`, `Req. Items: Insignia`, `Ally Finder2`, `Dispatch Time: 10 Days`],
    },
    {
        number: 285,
        name: `Blade & Turtle`,
        description: `You can make amazingly strong swords with just a little adaman alloy. Too bad it's so hard to come by... ~ Gilgame, Young Blacksmith`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: [
          "Completed Materite Now! (#019)",
          "Completed She",
        ],
        reward: [`10600 Gil`, `Secret Item (Adaman Blade)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Adaman Alloy/Broken Sword`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 286,
        name: `Valuable Fake`,
        description: `I finally got the famed sword "ragnarok," but it's a fake! Just bring me the right materials and I can make one of these, easy! ~ Hoek, Swordsmith`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: [
          "Completed Diamond Rain (#007)",
          "Completed Run For Fun (#122)",
        ],
        reward: [`9000 Gil`, `Secret Item (Nagrarok)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Bent Sword/Rainbowite`, `Dispatch Time: 10 Days`],
    },
    {
        number: 287,
        name: `Weaver's War`,
        description: `I lost my family to those godless scoundrels in the Gelzak Church. Help me make a good sword so that I might avenge them! ~ Weaver, Knight`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Pale Company (#011)"],
        reward: [`10600 Gil`, `Zankplus`, `1x Random Item`, `2x Random Cards`, `Req. Items: Crusite Alloy/Blood Apple`, `Dispatch Time: 5 Enemies`],
    },
    {
        number: 288,
        name: `Fabled Sword`,
        description: `I found the designs for making the same sword used by a legendary swordsman! But, the ingredients are hard to find. Please help. ~ Belitz, Archaeologist`,
        type: `Dispatch`,
        cost: `1500 Gil`,
                prerequisites: [
          "Completed Present Day (#020)",
          "Completed Novel Ascent (#232)",
        ],
        reward: [`12600 Gil`, `Secret Item (Master Sword)`, `1x Random Item`, `Req. Items: Thunderstone/Stormstone`, `Req. Jobs: Soldier`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 289,
        name: `Refurbishing`,
        description: `Due to the recent drop in weapon availability, we at Teldot Workshop are now offering refurbishing. Make old blades new! ~ Workshop Teldot`,
        type: `Dispatch`,
        cost: `4000 Gil`,
                prerequisites: [
          "Completed Desert Peril (#004)",
          "Completed Oh Milese (#213)",
        ],
        reward: [`0 Gil`, `Lurebreaker`, `1x Random Item`, `Req. Items: Broken Sword`, `Dispatch Time: 20 Days`],
    },
    {
        number: 290,
        name: `Stone Secret`,
        description: `I've found a way to make the usually brittle leestone hard as steel! Bring me leestone and I'll make you a weapon. ~ Ukes, Traveling Smith`,
        type: `Dispatch`,
        cost: `4000 Gil`,
                prerequisites: ["Completed To Ambervale (#022)"],
        reward: [`0 Gil`, `Secret Item (Tabarise)`, `1x Random Item`, `2x Random`, `Cards`, `Req. Items: Rusty Sword/Leestone`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 291,
        name: `Sword Stuff`,
        description: `I hope to use the smithing knowledge I gained abroad to make swords with the materials available here. Know any good materials? ~ Da'jerma, Swordsmith`,
        type: `Dispatch`,
        cost: `4500 Gil`,
                prerequisites: [
          "Completed Present Day (#020)",
          "Completed Sorry Friend (#094)",
          "Completed Sorry",
        ],
        reward: [`0 Gil`, `Secret Item (Silkmoon)`, `1x Random Item`, `2x Random`, `Cards`, `Req. Items: Silk Bloom/Moon Bloom`, `Dispatch Time: 4 Battles`],
    },
    {
        number: 292,
        name: `A Stormy Night`,
        description: `Once, long ago, a bolt of godsfire hit a shrine to the esper Odin. When the smoke cleared, they found a spear -- the Odinlance.`,
        type: `Dispatch`,
        cost: `1400 Gil`,
                prerequisites: [
          "Completed To Ambervale (#022)",
          "Completed Ghosts Of War (#142)",
        ],
        reward: [`12600 Gil`, `Odin Lance`, `1x Random Item`, `2x Random Cards`, `Req. Items: Rusty Spear/Mysidia Alloy`, `Dispatch Time: 4 Battles`],
    },
    {
        number: 293,
        name: `Minstrel Song`,
        description: `I met a bard in the woods who said he'd sold his soul to some fiend. If you want a dark instrument, he's the one to ask. ~ Rayches, Pub Customer`,
        type: `Dispatch`,
        cost: `5500 Gil`,
                prerequisites: ["Completed Materite Now! (#019)"],
        reward: [`0 Gil`, `Secret Item (Dark Fiddle)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Stradivari/Black Thread`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 294,
        name: `Gun Crazy`,
        description: `I heard that Thousand-Barrel, that gun maker that lives up in Gilba Pass, invented a new gun! Got to be powerful, that. ~ Tetero, Pub Customer`,
        type: `Dispatch`,
        cost: `4000 Gil`,
                prerequisites: [
          "Completed Present Day (#020)",
          "Completed Sword Stuff (#291)",
        ],
        reward: [`0 Gil`, `Bindsnipe`, `1x Random Item`, `2x Random Cards`, `Req. Items: Crusite Alloy/Gun Gear`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 295,
        name: `Black Hat`,
        description: `To all black mages: in order to raise the status of our clan brothers, we will give you a black hat. Wear it well! ~ Black Mage Society`,
        type: `Dispatch`,
        cost: `2000 Gil`,
                prerequisites: [
          "Completed Quiet Sands (#018)",
          "Completed Present Day (#020)",
        ],
        reward: [`0 Gil`, `Black Hat`, `1x Random Item`, `2x Random Cards`, `Req. Items: Black Thread/Magic Cloth`, `Req. Jobs: Black Mage`, `Dispatch Time: 3 Battles`],
    },
    {
        number: 296,
        name: `Hat For A Girl`,
        description: `hat girl that's always standing on the pier must be chilly. I'd like to give her a hat, but which one? She's a white mage.`,
        type: `Dispatch`,
        cost: `1200 Gil`,
                prerequisites: ["Completed Present Day (#020)"],
        reward: [`10800 Gil`, `White Hat`, `1x Random Item`, `2x Random Cards`, `Req. Items: White Thread/Magic Cloth`, `Dispatch Time: 30 Days`],
    },
    {
        number: 297,
        name: `Armor & Turtle`,
        description: `I could make some wicked strong armor if I had some adaman alloy. Just... it's so hard to get, you know? ~ Gilgame, Young Blacksmith`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Scouring Time (#015)",
          "Completed The Big Find (#016)",
          "Completed Mama",
        ],
        reward: [`9000 Gil`, `Adaman Armor`, `1x Random Item`, `2x Random Cards`, `Req. Items: Adaman Alloy/Rat Tail`, `Dispatch Time: 2 Battles`],
    },
    {
        number: 298,
        name: `Dark Armor`,
        description: `If you can bring me some materite, I believe I can make an outstanding suit of armor. I'll give you the suit. How about it? ~ Pepeiro, Alchemist`,
        type: `Dispatch`,
        cost: `2700 Gil`,
                prerequisites: [
          "Completed The Big Find (#016)",
          "Completed Dog Days (#275)",
        ],
        reward: [`0 Gil`, `Materia Armor`, `1x Random Item`, `2x Random Cards`, `Req. Items: Materite/Materite`, `Dispatch Time: 10 Enemies`],
    },
    {
        number: 299,
        name: `Fashion World`,
        description: `I hear Brint Mea, the popular brand, is looking for new designs. Probably trying to win customers back from Galmia Pepe! ~ Mit, Pub Customer`,
        type: `Dispatch`,
        cost: `600 Gil`,
                prerequisites: [
          "Completed Antilaws (#006)",
          "Completed An Education (#150)",
        ],
        reward: [`4600 Gil`, `Secret Item (Brint Set)`, `1x Random Item`, `2x`, `Random Cards`, `Req. Items: Chocobo Skin/Magic Cotton`, `Dispatch Time: 10 Days`],
    },
    {
        number: 300,
        name: `Fashion Hoopla`,
        description: `Both Galmia Pepe and Brint Mea are looking for new designs! The fate of the fashion world hangs on the balance on this one! ~ Phale, Fashion Expert`,
        type: `Dispatch`,
        cost: `1000 Gil`,
                prerequisites: [
          "Completed Magic Wood (#009)",
          "Completed The Performer (#270)",
          "Completed Fashion World (#299)",
        ],
        reward: [`11800 Gil`, `Galmia Set`, `1x Random Item`, `2x Random Cards`, `Req. Items: Chocobo Skin/Magic Cotton`, `Dispatch Time: 5 Days`],
    },
  ];

const BLUE_MAGIC_REF: BlueRef[] = [
  {
    name: "Goblin Punch",
    mp: 8,
    desc: "Damage varies; can be very high or very low.",
    from: ["Goblin"],
    sources: [
      { type: "Mission", name: "#032 Tower Ruins" },
      { type: "Mission", name: "#037 Village Hunt" },
      { type: "Mission", name: "#049 A Lost Ring" },
      { type: "Mission", name: "#055 White Flowers" },
      { type: "Mission", name: "#044 Snow in Lutia" },
      {
        type: "Mission",
        name: "#001 Herb Picking (too early to learn/capture)",
      },
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
      { type: "Turf", name: "Help Helje" },
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
      { type: "Turf", name: "Help Roda" },
      { type: "Clan", name: "Wild Monsters" },
    ],
  },
  {
    name: "Mighty Guard",
    mp: 8,
    desc: "Buff: +W.Def & +M.Res for battle.",
    from: ["Icedrake"],
    sources: [{ type: "Clan", name: "Wild Monsters" }],
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
      { type: "Mission", name: "#011 Pale Company" },
      { type: "Mission", name: "#102 Wyrms Awaken" },
      { type: "Mission", name: "#066 A Dragon's Aid" },
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
    sources: [{ type: "Clan", name: "Tubola Bandits" }],
  },
  {
    name: "Poison Claw",
    mp: 8,
    desc: "Damage + Poison.",
    from: ["Red Panther"],
    sources: [{ type: "Clan", name: "Kudik Beasts" }],
  },
  {
    name: "Hastebreak",
    mp: 12,
    desc: "Stop if Hasted; Slow otherwise.",
    from: ["Coeurl"],
    sources: [
      { type: "Turf", name: "Help Nargai" },
      { type: "Turf", name: "Help Helje" },
    ],
  },
  {
    name: "Bad Breath",
    mp: 20,
    desc: "Inflicts 5 random status ailments.",
    from: ["Malboro", "Big Malboro"],
    sources: [{ type: "Turf", name: "Help Eluut" }],
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
    sources: [{ type: "Clan", name: "Bloodthirsters" }],
  },
  {
    name: "White Wind",
    mp: 12,
    desc: "Heal AoE for caster HP amount.",
    from: ["Sprite"],
    sources: [
      { type: "Clan", name: "Tricky Spirits" },
      { type: "Turf", name: "Help Eluut" },
      { type: "Clan", name: "Tubola Bandits" },
      { type: "Turf", name: "Help Helje" },
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
    clans: null,
    missions: [
      "#055 White Flowers",
      "#049 A Lost Ring",
      "#044 Snow in Lutia",
      "#037 Village Hunt",
      "#032 Tower Ruins",
      "#001 Herb Picking",
    ],
    areas: null,
    enjoys: [
		{item: "Maiden Kiss", aff: 5}
    ],
    spits: [
		{item: "Antidote", aff: 0}
    ],
    notes:
      "Blue Goblins eventually disappear — learn Goblin Punch & capture early",
  },
  {
    monster: "Red Cap",
    family: "Goblinkind",
    clans: ["Clan Hounds", "Tricky Spirits"],
    missions: ["#100 Fiend Run", "#055 White Flowers", "#001 Herb Picking"],
    areas: null,
    enjoys: [
		{item: "Maiden Kiss", aff: 5}
    ],
    spits: [
		{item: "Antidote", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Jelly",
    family: "Flankind",
    clans: ["Roda Dragons", "Wild Monsters"],
    missions: ["#093 Flan Breakout!", "#059 Sketchy Thief"],
    areas: null,
    enjoys: [
		{item: "Antidote", aff: 5}
    ],
    spits: [
		{item: "Eye Drops", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Ice Flan",
    family: "Flankind",
    clans: ["Roaming Naiads"],
    missions: [
      "#109 Snow Fairy",
      "#093 Flan Breakout!",
      "#078 Water Sigil",
      "#065 Exploration",
      "#046 Prof in Trouble",
      "#007 Diamond Rain",
    ],
    areas: null,
    enjoys: [
		{item: "Antidote", aff: 5}
    ],
    spits: [
		{item: "Eye Drops", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Cream",
    family: "Flankind",
    clans: ["Tricky Spirits"],
    missions: [
      "#093 Flan Breakout!",
      "#052 Friend Trouble",
      "#004 Desert Peril",
    ],
    areas: null,
    enjoys: [
		{item: "Antidote", aff: 5}
    ],
    spits: [
		{item: "Eye Drops", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Bomb",
    family: "Bombkind",
    clans: ["Antlions", "Roda Dragons"],
    missions: [
      "#107 Old Friends",
      "#074 Cadoan Watch",
      "#063 Missing Prof.",
      "#047 Hot Recipe",
      "#038 Fire! Fire!",
      "#034 Magewyrm",
      "#032 Tower Ruins",
      "#007 Diamond Rain",
    ],
    areas: ["Help Roda!"],
    enjoys: null,
    spits: [
		{item: "Holy Water", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Grenade",
    family: "Bombkind",
    clans: ["Lost Monsters", "Wild Monsters"],
    missions: ["#109 Snow Fairy", "#065 Exploration"],
    areas: ["Help Roda!"],
    enjoys: null,
    spits: [
		{item: "Holy Water", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Icedrake",
    family: "Dragonkind",
    clans: ["Roaming Naiads", "Wild Monsters"],
    missions: [
      "#102 Wyrms Awaken",
      "#087 Free Bervenia!",
      "#066 A Dragon's Aid",
      "#063 Missing Prof.",
      "#034 Magewyrm",
      "#032 Tower Ruins",
      "#031 Ruby Red",
      "#022 To Ambervale",
      "#011 Pale Company",
      "#007 Diamond Rain",
    ],
    areas: null,
    enjoys: [
		{item: "Cureall", aff: 10}
    ],
    spits: null,
    notes: "",
  },
  {
    monster: "Firewyrm",
    family: "Dragonkind",
    clans: ["Roda Dragons"],
    missions: [
      "#102 Wyrms Awaken",
      "#066 A Dragon's Aid",
      "#054 For A Song",
      "#047 Hot Recipe",
      "#034 Magewyrm",
      "#032 Tower Ruins",
      "#031 Ruby Red",
      "#011 Pale Company",
    ],
    areas: ["Help Roda!"],
    enjoys: [
		{item: "Cureall", aff: 10}
    ],
    spits: null,
    notes: "",
  },
  {
    monster: "Thundrake",
    family: "Dragonkind",
    clans: null,
    missions: ["#102 Wyrms Awaken", "#066 A Dragon's Aid", "#011 Pale Company"],
    areas: null,
    enjoys: [
		{item: "Cureall", aff: 10}
    ],
    spits: null,
    notes: "Only found in missions-prioritize when available.",
  },
  {
    monster: "Lamia",
    family: "Lamiakind",
    clans: ["Clan Hounds", "Jagd Emissaries", "Roaming Naiads"],
    missions: [
      "#076 Fire Sigil",
      "#058 Royal Ruins",
      "#049 A Lost Ring",
      "#007 Diamond Rain",
    ],
    areas: null,
    enjoys: [
		{item: "Cureall", aff: 10},
		{item: "Echo Screen", aff: 5},
    ],
    spits: [
		{item: "Maiden Kiss", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Lilith",
    family: "Lamiakind",
    clans: ["Roaming Naiads"],
    missions: ["#049 A Lost Ring", "#022 To Ambervale"],
    areas: null,
    enjoys: [
		{item: "Cureall", aff: 10},
		{item: "Echo Screen", aff: 5},
    ],
    spits: [
		{item: "Maiden Kiss", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Antlion",
    family: "Antlionkind",
    clans: ["Antlions", "Kudik Beasts"],
    missions: [
      "#107 Old Friends",
      "#055 White Flowers",
      "#051 Desert Rose",
      "#037 Village Hunt",
      "#034 Magewyrm",
      "#012 Jagd Hunt",
      "#004 Desert Peril",
    ],
    areas: ["Help Giza!"],
    enjoys: [
		{item: "Soft", aff: 5}
    ],
    spits: [
		{item: "Bandage", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Jawbreaker",
    family: "Antlionkind",
    clans: ["Aisen Ghosts", "Antlions"],
    missions: ["#065 Exploration", "#051 Desert Rose", "#022 To Ambervale"],
    areas: ["Help Giza!"],
    enjoys: [
		{item: "Soft", aff: 5}
    ],
    spits: [
		{item: "Bandage", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Red Panther",
    family: "Pantherkind",
    clans: ["Kudik Beasts", "Tribites"],
    missions: [
      "#054 For A Song",
      "#052 Friend Trouble",
      "#051 Desert Rose",
      "#045 Frosty Mage",
      "#044 Snow in Lutia",
      "#034 Magewyrm",
      "#004 Desert Peril",
    ],
    areas: null,
    enjoys: [
		{item: "Holy Water", aff: 10}
    ],
    spits: [
		{item: "Antidote", aff: 0},
		{item: "Echo Screen", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Coeurl",
    family: "Pantherkind",
    clans: ["Clan Hounds", "Tribites", "Wild Monsters"],
    missions: [
      "#100 Fiend Run",
      "#065 Exploration",
      "#052 Friend Trouble",
      "#037 Village Hunt",
      "#022 To Ambervale",
      "#004 Desert Peril",
    ],
    areas: ["Help Nargai", "Help Helje"],
    enjoys: [
		{item: "Holy Water", aff: 10}
    ],
    spits: [
		{item: "Antidote", aff: 0},
		{item: "Echo Screen", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Malboro",
    family: "Malborokind",
    clans: ["Lost Monsters", "Wild Monsters"],
    missions: [
      "#105 Smuggler Bust",
      "#085 Foreign Fiend",
      "#054 For A Song",
      "#032 Tower Ruins",
    ],
    areas: ["Help Eluut"],
    enjoys: [
		{item: "Holy Water", aff: 7},
		{item: "Bandage", aff: 4}
    ],
    spits: [
		{item: "Cureall", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Big Malboro",
    family: "Malborokind",
    clans: ["Lost Monsters"],
    missions: ["#100 Fiend Run", "#085 Foreign Fiend", "#022 To Ambervale"],
    areas: ["Help Eluut"],
    enjoys: [
		{item: "Holy Water", aff: 7},
		{item: "Bandage", aff: 4}
    ],
    spits: [
		{item: "Cureall", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Floateye",
    family: "Ahrimankind",
    clans: ["Aisen Ghosts", "Lost Monsters"],
    missions: ["#050 Staring Eyes", "#045 Frosty Mage", "#005 Twisted Flow"],
    areas: null,
    enjoys: [
		{item: "Eye Drops", aff: 5}
    ],
    spits: [
		{item: "Soft", aff: 0}
    ],
    notes: "",
  },
  {
    monster: "Ahriman",
    family: "Ahrimankind",
    clans: ["Bloodthirsters", "Jagd Emissaries"],
    missions: [
      "#100 Fiend Run",
      "#087 Free Bervenia!",
      "#063 Missing Prof.",
      "#050 Staring Eyes",
      "#005 Twisted Flow",
    ],
    areas: null,
    enjoys: [
		{item: "Holy Water", aff: 5}
    ],
    spits: [
		{item: "Soft", aff: 0}
    ],
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
  "Dorsa Caravan": { number: 7, title: "Dorsa Caravan" },
  "Kudik Caves": { number: 24, title: "Kudik Caves" },
  "Jeraw Sands": { number: 2, title: "Jeraw Sands" },
  Muscadet: { number: 21, title: "Muscadet" },
  Materiwood: { number: 20, title: "Materiwood" },
  Ozmonfield: { number: 23, title: "Ozmonfield" },
  "Deti Plains": { number: 19, title: "Deti Plains" },
  "Tubola Cave": { number: 20, title: "Tubola Cave" },
  "Ahli Desert": { number: 3, title: "Ahli Desert" },
  "Delia Dunes": { number: 17, title: "Delia Dunes" },
  "Gotor Sands": { number: 12, title: "Gotor Sands" },
  "Siena Gorge": { number: 25, title: "Siena Gorge" },
  Helj: { number: 26, title: "Helj" },
};

const GLOBAL_MISSABLES: { id: string; text: string }[] = [
  {
    id: "miss-eldas-cup",
    text: "Dispatch: Caravan Guard (#168) — Do NOT complete until Eldena joins. Completing spends Elda’s Cup.",
  },
  {
    id: "miss-hero-gaol",
    text: "Use mission item “The Hero Gaol” (from #062 Oasis Frogs) on missions to recruit Lini.",
  },
  {
    id: "miss-snake-shield",
    text: "Use mission item “Snake Shield” (from #165 Hundred-Eye) on missions to recruit Cheney.",
  },
  {
    id: "miss-missing-prof",
    text: "Tubola Caves: Missing Professor (#063) — SAVE before mission. Quin may ask to join; if not, reload. Not repeatable.",
  },
  {
    id: "miss-wyrmstone",
    text: "Delia Dunes: A Dragon's Aid (#066) — Do NOT complete until Pallanza joins. Completing spends Wyrmstone.",
  },
  {
    id: "miss-clan-league",
    text: "Mission #043E Clan League — repeatable source for recruiting Littlevilli (random after completion).",
  },
  {
    id: "miss-ezel",
    text: "Koringwood: Reconciliation → then Bored — Ezel offers to join. Avoid completing simultaneously with Left Behind / A Maiden’s Cry.",
  },
  {
    id: "miss-ritz",
    text: "Lutia Pass: Mortal Snow — Ritz offers to join. Avoid completing at same time as Left Behind / A Maiden’s Cry.",
  },
  {
    id: "miss-babus",
    text: "Dispatch: Left Behind → With Babus → Doned Here — Babus offers to join. Avoid finishing with A Maiden’s Cry; accept “With Babus” before moving.",
  },
  {
    id: "miss-shara",
    text: "Dispatch: A Maiden’s Cry (both versions) — Shara offers to join. Do NOT complete at the same time as Left Behind.",
  },
  {
    id: "miss-cid",
    text: "After all 300 missions → “Cleanup Time” → Cid offers to join.",
  },
  {
    id: "miss-blue-goblins",
    text: "Blue Goblins eventually disappear — learn Goblin Punch & capture early (#001, #032, #037, #044, #049, #055).",
  },
  {
    id: "miss-thundrakes",
    text: "Thundrakes disappear — learn Dragon Force and capture during #011 / #066 / #102 (and more).",
  },
  {
    id: "miss-free-bervenia",
    text: "⚠️ #087 Free Bervenia bug — if failed, it may not reappear.",
  },
];

const Tag: React.FC<{
  color: "blue" | "green" | "purple" | "red";
  children: React.ReactNode;
}> = ({ color, children }) => {
  const map: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
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
  color: "blue" | "green" | "purple" | "red";
}> = ({ done, total, label, color }) => {
  const percent = pct(done, total);
  const palette: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };
  return (
    <div className="text-xs">
      <div className="flex justify-between">
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
  border: string;
  buttonColor: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "red" | "amber" | "purple";
}> = ({ title, border, buttonColor, children, right, tone = "neutral" }) => {
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
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
        <div className="flex items-center gap-2">
          {right}
          <button
            className={`${buttonColor} text-white text-sm px-3 py-1 rounded`}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FFTAProgressionGuide: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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
        (n, m) => n + (checked[keyify(`miss-global:${m.id}`)] ? 1 : 0),
        0
      ),
    [checked]
  );

  const blocks: Block[] = [
    {
      key: "pre-001",
      kind: "between",
      title: "Pre-Story Tasks (After Bangaa Fight → Before #001)",
    },
    {
      key: "001",
      kind: "story",
      title: "#001 Herb Picking",
      subtitle: "Giza Plains",
    },
    {
      key: "post-001",
      kind: "between",
      title: "Between-Story Tasks (After #001 → Before #002)",
      placements: ["Lutia Pass"],
      blue: ["Goblin Punch"],
      caps: ["Goblin", "Red Cap"],
      sidequests: [
      0, 3, 5, 10],
    },

    {
      key: "002",
      kind: "story",
      title: "#002 Thesis Hunt",
      subtitle: "Lutia Pass",
    },
    {
      key: "post-002",
      kind: "between",
      title: "Between-Story Tasks (After #002 → Before #003)",
      placements: ["Nubswood"],
    },

    {
      key: "003",
      kind: "story",
      title: "#003 The Cheetahs",
      subtitle: "Nubswood",
    },
    {
      key: "post-003",
      kind: "between",
      title: "Between-Story Tasks (After #003 → Before #004)",
      placements: ["Eluut Sands"],
      blue: ["Acid", "Poison Claw", "Hastebreak"],
      caps: ["Cream", "Red Panther", "Antlion", "Coeurl", "Jelly"],
    },

    {
      key: "004",
      kind: "story",
      title: "#004 Desert Peril",
      subtitle: "Eluut Sands",
    },
    {
      key: "post-004",
      kind: "between",
      title: "Between-Story Tasks (After #004 → Before #005)",
      placements: ["Ulei River"],
    },

    {
      key: "005",
      kind: "story",
      title: "#005 Twisted Flow",
      subtitle: "Ulei River",
    },
    {
      key: "post-005",
      kind: "between",
      title: "Between-Story Tasks (After #005 → Before #006)",
      placements: ["Cadoan"],
      blue: ["Stare", "Roulette", "Drain Touch"],
      sidequests: [
        69
      ],
    },

    { key: "006", kind: "story", title: "#006 Antilaws", subtitle: "Cadoan" },
    {
      key: "post-006",
      kind: "between",
      title: "Between-Story Tasks (After #006 → Before #007)",
      placements: ["Aisenfield"],
    },

    {
      key: "007",
      kind: "story",
      title: "#007 Diamond Rain",
      subtitle: "Aisenfield",
    },
    {
      key: "post-007",
      kind: "between",
      title: "Between-Story Tasks (After #007 → Before #008)",
      placements: ["Roda Volcano"],
      blue: ["Blowup", "Night", "Mighty Guard"],
      caps: ["Bomb", "Icedrake", "Lamia"],
    },

    {
      key: "008",
      kind: "story",
      title: "#008 Hot Awakening",
      subtitle: "Roda Volcano",
    },
    {
      key: "post-008",
      kind: "between",
      title: "Between-Story Tasks (After #008 → Before #009)",
      placements: ["Koringwood"],
      caps: ["Firewyrm", "Bomb"],
    },

    {
      key: "009",
      kind: "story",
      title: "#009 Magic Wood",
      subtitle: "Koringwood",
    },
    {
      key: "post-009",
      kind: "between",
      title: "Between-Story Tasks (After #009 → Before #010)",
      placements: ["Salikawood"],
    },

    {
      key: "010",
      kind: "story",
      title: "#010 Emerald Keep",
      subtitle: "Salikawood",
    },
    {
      key: "post-010",
      kind: "between",
      title: "Between-Story Tasks (After #010 → Before #011)",
      placements: ["Nargai Cave"],
    },

    {
      key: "011",
      kind: "story",
      title: "#011 Pale Company",
      subtitle: "Nargai Cave",
    },
    {
      key: "post-011",
      kind: "between",
      title: "Between-Story Tasks (After #011 → Before #012)",
      placements: ["Baguba Port"],
      blue: ["Dragon Force", "Mighty Guard", "Guard-Off"],
      caps: ["Icedrake", "Firewyrm", "Thundrake"],
    },

    {
      key: "012",
      kind: "story",
      title: "#012 The Bounty",
      subtitle: "Baguba Port",
    },
    {
      key: "post-012",
      kind: "between",
      title: "Between-Story Tasks (After #012 → Before #013)",
      placements: ["Dorsa Caravan"],
      caps: ["Antlion", "Toughskin"],
    },

    {
      key: "013",
      kind: "story",
      title: "#013 Golden Clock",
      subtitle: "Dorsa Caravan",
    },
    {
      key: "post-013",
      kind: "between",
      title: "Between-Story Tasks (After #013 → Before #014)",
      placements: ["Kudik Caves"],
    },

    {
      key: "014",
      kind: "story",
      title: "#014 The Big Find",
      subtitle: "Kudik Caves",
    },
    {
      key: "post-014",
      kind: "between",
      title: "Between-Story Tasks (After #014 → Before #015)",
      placements: ["Jeraw Sands"],
    },

    {
      key: "015",
      kind: "story",
      title: "#015 Desert Patrol",
      subtitle: "Jeraw Sands",
    },
    {
      key: "post-015",
      kind: "between",
      title: "Between-Story Tasks (After #015 → Before #016)",
      placements: ["Muscadet"],
    },

    {
      key: "016",
      kind: "story",
      title: "#016 Quiet Sands",
      subtitle: "Muscadet",
    },
    {
      key: "post-016",
      kind: "between",
      title: "Between-Story Tasks (After #016 → Before #017)",
      placements: ["Materiwood"],
    },

    {
      key: "017",
      kind: "story",
      title: "#017 Desert Patrol (Chain)",
      subtitle: "Materiwood",
    },
    {
      key: "post-017",
      kind: "between",
      title: "Between-Story Tasks (After #017 → Before #018)",
      placements: ["Ozmonfield"],
    },

    {
      key: "018",
      kind: "story",
      title: "#018 Quiet Sands (Chain)",
      subtitle: "Ozmonfield",
    },
    {
      key: "post-018",
      kind: "between",
      title: "Between-Story Tasks (After #018 → Before #019)",
      placements: ["Deti Plains"],
    },

    {
      key: "019",
      kind: "story",
      title: "#019 Materite Now!",
      subtitle: "Deti Plains",
    },
    {
      key: "post-019",
      kind: "between",
      title: "Between-Story Tasks (After #019 → Before #020)",
      placements: ["Tubola Cave"],
    },

    {
      key: "020",
      kind: "story",
      title: "#020 Present Day",
      subtitle: "Ambervale",
    },
    {
      key: "post-020",
      kind: "between",
      title: "Between-Story Tasks (After #020 → Before #021)",
      placements: ["Ahli Desert"],
    },

    {
      key: "021",
      kind: "story",
      title: "#021 Hidden Vein",
      subtitle: "Tubola Caves",
    },
    {
      key: "post-021",
      kind: "between",
      title: "Between-Story Tasks (After #021 → Before #022)",
      placements: ["Delia Dunes"],
      blue: [
        "White Wind",
        "Matra Magic",
        "Magic Hammer",
        "Roulette",
        "Drain Touch",
      ],
      caps: [
        "Floateye",
        "Ahriman",
        "Red Panther",
        "Coeurl",
        "Antlion",
        "Jawbreaker",
        "Toughskin",
        "Sprite",
      ],
      sidequests: [
        87
      ],
    },

    {
      key: "022",
      kind: "story",
      title: "#022 To Ambervale",
      subtitle: "Delia Dunes",
    },
    {
      key: "post-022",
      kind: "between",
      title: "Between-Story Tasks (After #022 → Before #023)",
      placements: ["Gotor Sands"],
      blue: ["Dragon Force", "Hastebreak", "Twister", "Bad Breath"],
      caps: [
        "Firewyrm",
        "Icedrake",
        "Thundrake",
        "Red Panther",
        "Coeurl",
        "Malboro",
        "Big Malboro",
      ],
    },

    {
      key: "023",
      kind: "story",
      title: "#023 Over the Hill",
      subtitle: "Siena Gorge",
    },
    {
      key: "post-023",
      kind: "between",
      title: "Between-Story Tasks (After #023 → Before #024)",
      placements: ["Siena Gorge"],
    },

    {
      key: "024",
      kind: "story",
      title: "#024 Royal Valley",
      subtitle: "Ambervale",
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
        <div className="space-y-3">
          <img
            src="https://64.media.tumblr.com/e07fe7840fbbd3ca6abde6378245b9d6/tumblr_inline_ph09u7zzNr1qlaths_250.gif"
            alt="FFTA World Map"
            className="w-full rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
          />
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
        </div>
      </Panel>
    );
  };

  const RefList: React.FC<{ type: "blue" | "cap"; names: string[] }> = ({
    type,
    names,
  }) => {
    const tagColor =
      type === "blue"
        ? "text-blue-700 dark:text-blue-300"
        : "text-green-700 dark:text-green-300";
    return (
      <ul className="space-y-2">
        {names.map((n) => {
          if (type === "blue") {
            const id = keyify(`blue:${n}`);
            const b = BLUE_MAGIC_REF.find((x) => x.name === n);
            if (!b) return null;
            return (
              <li
                key={n}
                className="whitespace-pre-line bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
              >
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 accent-blue-600 dark:accent-blue-400"
                    checked={!!checked[id]}
                    onChange={() => setCheck(id)}
                  />
                  <div>
                    <div className={`font-semibold ${tagColor}`}>
                      {b.name}{" "}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        MP {b.mp}
                      </span>
                    </div>
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
                          {b.sources.filter((s) => s.type === "Clan").length >
                            0 && (
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
                          {b.sources.filter((s) => s.type === "Mission")
                            .length > 0 && (
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
                          {b.sources.filter((s) => s.type === "Turf").length >
                            0 && (
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
                  </div>
                </label>
              </li>
            );
          }

          const c = CAPTURE_REF.find((x) => x.monster === n);
          if (!c) return null;
          const id = keyify(`cap:${c.monster}`);
          return (
            <li
              key={n}
              className="whitespace-pre-line bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
            >
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-green-600 dark:accent-green-400"
                  checked={!!checked[id]}
                  onChange={() => setCheck(id)}
                />
                <div>
                  <div className={`font-semibold ${tagColor}`}>
                    {c.monster}{" "}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({c.family})
                    </span>
                  </div>
                  <div className="text-xs mt-1 space-y-1 text-zinc-900 dark:text-zinc-100">
                    {c.clans && (
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Random Battles:
                        </span>{" "}
                        {
                            <ul className="list-disc list-inside ml-4">
                                {c.clans.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        }
                      </div>
                    )}
                    {c.missions && (
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Missions:
                        </span>{" "}
                        {
                            <ul className="list-disc list-inside ml-4">
                                {c.missions.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        }
                      </div>
                    )}
                    {c.areas && (
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Turf Defense:
                        </span>{" "}
                        {
                            <ul className="list-disc list-inside ml-4">
                                {c.areas.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        }
                      </div>
                    )}
                    {c.enjoys && (
                      <><div>
                                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                          Enjoys:
                                      </span>{" "}
                                  </div><ul className="list-disc list-inside ml-4">
                                          {c.enjoys.map((e, i) => (
                                              <li key={i}>
                                                  {e.item} <span className="text-xs text-gray-400">(Affection gained: {e.aff})</span>
                                              </li>
                                          ))}
                                      </ul></>
                    )}
                    {c.spits && (
                      <><div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Spits back:
                        </span>{" "}
                      </div><ul className="list-disc list-inside ml-4">
                                          {c.spits.map((e, i) => (
                                              <li key={i}>
                                                  {e.item} <span className="text-xs text-gray-400">(Affection gained: {e.aff})</span>
                                              </li>
                                          ))}
                                      </ul></>
                    )}
                  </div>
                  {c.notes && (
                    <div className="text-xs mt-1 italic text-zinc-700 dark:text-zinc-300">
                      {c.notes}
                    </div>
                  )}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-zinc-100 dark:bg-zinc-900 transition-colors">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl ring-1 ring-zinc-950/10 dark:ring-white/10 shadow-sm">
        <h1 className="text-3xl font-bold mb-1">
          FFTA Story Progression Guide
        </h1>
        <p className="text-sm opacity-90">
          Story • Between-Story Tasks • Blue Magic • Captures • Missables • Map
          Placements • Recruits
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <Panel
          title="Blue Magic Reference"
          border="border-blue-600"
          buttonColor="bg-blue-600"
          tone="blue"
          right={
            <div className="min-w-[200px]">
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
          border="border-green-600"
          buttonColor="bg-green-600"
          tone="green"
          right={
            <div className="min-w-[200px]">
              <ProgressBar
                label="Captures"
                done={capDone}
                total={capTotal}
                color="green"
              />
            </div>
          }
        >
          <RefList type="cap" names={CAPTURE_REF.map((c) => c.monster)} />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel
          title="Missables & Warnings (Global)"
          border="border-red-600"
          buttonColor="bg-red-600"
          tone="red"
          right={
            <div className="min-w-[200px]">
              <ProgressBar
                label="Missables"
                done={missDone}
                total={missTotal}
                color="red"
              />
            </div>
          }
        >
          <ul className="space-y-2 text-sm">
            {GLOBAL_MISSABLES.map((m) => {
              const id = keyify(`miss-global:${m.id}`);
              return (
                <li
                  key={m.id}
                  className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-red-600 dark:accent-red-400"
                    checked={!!checked[id]}
                    onChange={() => setCheck(id)}
                  />
                  <span className="text-zinc-800 dark:text-zinc-200">
                    {m.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 space-y-2">
        {blocks.map((b) => {
          const isOpen = !!expanded[b.key];
          const blueNames = b.blue || [];
          const capNames = b.caps || [];
          const side = b.sidequests || [];
          const recs = b.recruits || [];
          const miss = b.missables || [];

          const blueDoneLocal = blueNames.reduce(
            (n, nm) => n + (checked[keyify(`blue:${nm}`)] ? 1 : 0),
            0
          );
          const capDoneLocal = capNames.reduce(
            (n, nm) => n + (checked[keyify(`cap:${nm}`)] ? 1 : 0),
            0
          );
          const sideDoneLocal = side.reduce(
            (n, s) => n + (checked[keyify(`side:${s}`)] ? 1 : 0),
            0
          );

          return (
            <div
              key={b.key}
              className={`rounded-2xl overflow-hidden ring-1 ring-zinc-950/10 dark:ring-white/10 transition-colors ${
                b.kind === "story"
                  ? "bg-white dark:bg-zinc-800"
                  : "bg-amber-50 dark:bg-amber-900/10"
              }`}
            >
              <div
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  b.kind === "story"
                    ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/70"
                    : "hover:bg-amber-100 dark:hover:bg-amber-900/20"
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
                          .join(", ")}
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
                    {side.length > 0 && (
                      <Tag color="purple">
                        Side {sideDoneLocal}/{side.length}
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
                  {b.placements && b.placements.length > 0 && (
                    <MapPanel placements={b.placements} />
                  )}

                  {blueNames.length > 0 && (
                    <Panel
                      title="Blue Magic Available"
                      border="border-blue-600"
                      buttonColor="bg-blue-600"
                      tone="blue"
                      right={<></>}
                    >
                      <RefList type="blue" names={blueNames} />
                    </Panel>
                  )}

                  {capNames.length > 0 && (
                    <Panel
                      title="Capturable Monsters"
                      border="border-green-600"
                      buttonColor="bg-green-600"
                      tone="green"
                      right={<></>}
                    >
                      <RefList type="cap" names={capNames} />
                    </Panel>
                  )}

                  {side.length > 0 && (
                    <Panel
                      title="Side Missions Now Available"
                      border="border-amber-600"
                      buttonColor="bg-amber-600"
                      tone="amber"
                      right={
                        <div className="min-w-[180px]">
                          <ProgressBar
                            label="Side"
                            done={sideDoneLocal}
                            total={side.length}
                            color="purple"
                          />
                        </div>
                      }
                    >
                      <ul className="space-y-2 text-sm">
                        {side.map((s) => {
                          const id = keyify(`side:${s}`);
                          return (
                            <li
                              key={s}
                              className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 accent-purple-600 dark:accent-purple-400"
                                checked={!!checked[id]}
                                onChange={() => setCheck(id)}
                              />
                              <div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  #{s} {s}
                                </span>
                                {s && (
                                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Appears at: {s}
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}

                  {recs.length > 0 && (
                    <Panel
                      title="Recruits / Unlocks"
                      border="border-purple-600"
                      buttonColor="bg-purple-600"
                      right={<></>}
                    >
                      <ul className="space-y-2 text-sm">
                        {recs.map((line) => {
                          const id = keyify(`rec:${b.key}:${line}`);
                          return (
                            <li
                              key={id}
                              className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 accent-purple-600 dark:accent-purple-400"
                                checked={!!checked[id]}
                                onChange={() => setCheck(id)}
                              />
                              <span className="text-zinc-800 dark:text-zinc-200">
                                {line}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  )}

                  {miss.length > 0 && (
                    <Panel
                      title="Missables (Local)"
                      border="border-red-600"
                      buttonColor="bg-red-600"
                      right={<></>}
                    >
                      <ul className="space-y-2 text-sm">
                        {miss.map((line) => {
                          const id = keyify(`miss:${b.key}:${line}`);
                          return (
                            <li
                              key={id}
                              className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl ring-1 ring-zinc-950/10 dark:ring-white/10"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 accent-red-600 dark:accent-red-400"
                                checked={!!checked[id]}
                                onChange={() => setCheck(id)}
                              />
                              <span className="text-zinc-800 dark:text-zinc-200">
                                {line}
                              </span>
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
