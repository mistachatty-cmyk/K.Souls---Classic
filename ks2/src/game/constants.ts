import type { Part } from "./types";

export const ARENA_W = 900;
export const ARENA_H = 560;
export const CHAR_RADIUS = 14;
export const MAX_HP = 20;
export const SPAWN_SPEED = 2.8;
export const BOT_MIN_INTERVAL = 2000;
export const BOT_MAX_INTERVAL = 4000;
export const SCOREBOARD_H = 60;
export const GRID_CELL_SIZE = 60;
export const MAX_PARTICLES = 350;

export const SPLASH_ARCHIVE = [
  "LOK HORIZON: Connecting...",
  "THEEEee ULtimatee everything-everywhere-all-at-once auto-battler?",
  "Why choose a variant when you can build the ULTIMATE?",
  "🦉 Lok: Focus on what matters.",
  "💰 COIN MODE: Greed is a weapon.",
  "GSix: Gilded Protocol - Authorized.",
  "Br/kn State: THE SOUL OF THE MACHINE.",
  "4-Tone Puke: Pure Retro DMG.",
  "Everything-Everywhere-All-At-Once.",
  "Liquidate the System.",
  "Welcome back, Eric.",
  "Welcome back, Cante.",
  "Welcome back, Miss N.",
  "Welcome back, Sire.",
  "Must build additional pylons.",
  "The only way to win is to not lose.",
  "Howa bout a pickle you nasty",
  "W.O.W Service Initiated",
  "Have you seen Moka?",
  "I love you Tan-Moka",
  "MCallie Named her BumbleBee...",
  "It's okay to be sad and happy, it grows you ^^",
  "I like saying hungry hungry hippo but I don't mean to offend",
  "Hello World!",
  "Ima Cookie Monster",
  "You're a good person, I like you",
  "Ultimate Arena Smash Bro's",
  "Horizon Protocol Engaged.",
  "Essence limits: Unbound.",
  "We are the architects of the arena.",
  "Send Over The Souls",
  "New champions rise from the shadows.",
  "The arena remembers every battle.",
  "Victory favors the bold.",
  "In the face of chaos, find order.",
  "Build your legacy, one fight at a time.",
  "The strongest weapon is strategy.",
  "Every soul has a story.",
  "Fight with honor, win with glory.",
  "The arena awaits your command.",
  "",
  "The only way to lose is to not win.",
  "The only way to tie is to not win or lose.",
  "W.O.W Service Terminated",
  "Hey Hey Hey... Don't be so rough <3",
  "Ima Cookie MOnster",
  "Youa Cookie?",
  "I'm a good person, I like you",
  "Arena Smash Bro's",
  "Yum Yum Get in my tum",
];

export const BASE_PARTS: Part[] = [
  { ox: 0, oy: -20, r: 7, type: "head" },
  { ox: 0, oy: -6, r: 9, type: "body" },
  { ox: -12, oy: -8, r: 5, type: "arm" },
  { ox: 12, oy: -8, r: 5, type: "arm" },
  { ox: -6, oy: 6, r: 5, type: "leg" },
  { ox: 6, oy: 6, r: 5, type: "leg" },
];