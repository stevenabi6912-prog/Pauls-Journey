// ============================================================
//  PAUL'S JOURNEYS — Map & World Data (scenes.js)
//  Canvas-based top-down RPG
// ============================================================

// ── TILE TYPE CONSTANTS ────────────────────────────────────
const T = {
  SAND:         0,
  WALL:         1,
  TEMPLE_WALL:  2,
  PATH:         3,
  DOOR:         4,
  PALM:         5,
  STALL:        6,
  TEMPLE_FLOOR: 7,
  STEPS:        8,
  GATE:         9,
  ALTAR:        10,
};

// ── TILE MAP: 25 columns × 20 rows ────────────────────────
// Row 0  = north edge (wall)
// Row 19 = south edge (gate at cols 11–12)
const MAP = [
  // col: 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // row 0: north border wall
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 1: sand border
  [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1], // row 2: temple back wall
  [1, 0, 2, 7, 7, 7,10, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,10, 7, 7, 7, 2, 0, 1], // row 3: temple floor with altars
  [1, 0, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 0, 1], // row 4: temple floor (High Priest at col 12)
  [1, 0, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 0, 1], // row 5: temple floor
  [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1], // row 6: temple front wall w/ door cols 11-12
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 7: temple steps
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], // row 8: buildings + center path
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], // row 9: buildings
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 10: open area
  [1, 5, 0, 6, 6, 0, 6, 6, 0, 0, 0, 3, 3, 0, 0, 0, 6, 6, 0, 6, 6, 0, 5, 0, 1], // row 11: market (palms + stalls)
  [1, 5, 0, 6, 6, 0, 6, 6, 0, 0, 0, 3, 3, 0, 0, 0, 6, 6, 0, 6, 6, 0, 5, 0, 1], // row 12: market
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 13: open
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 14: open
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 15: open
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 16: open
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 17: open (player spawns here)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // row 18: open
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // row 19: south border with GATE cols 11-12
];

// ── NPC DEFINITIONS ────────────────────────────────────────
const NPCS_DATA = [
  {
    id: 'high_priest',
    name: 'Caiaphas, High Priest',
    tileX: 12,
    tileY: 4,
    bodyColor: '#f5f0e0',
    accentColor: '#c9a84c',
    headColor: '#c09060',
    isHighPriest: true,
    dialogues: [
      {
        speaker: 'High Priest',
        text: '"Saul of Tarsus. Your zeal for the Law is known throughout Jerusalem. I have been expecting you."'
      },
      {
        speaker: 'Narrator',
        text: '"And Saul, yet breathing out threatenings and slaughter against the disciples of the Lord, went unto the high priest." \u2014 Acts 9:1'
      },
      {
        speaker: 'High Priest',
        text: '"These followers of The Way have spread to Damascus. You will go there, and bring them back \u2014 bound \u2014 to face judgment in Jerusalem."'
      },
      {
        speaker: 'Narrator',
        text: '"And desired of him letters to Damascus to the synagogues, that if he found any of this way, whether they were men or women, he might bring them bound unto Jerusalem." \u2014 Acts 9:2'
      },
      {
        speaker: 'High Priest',
        text: '"The letters are sealed with the authority of the Sanhedrin. God speed your mission, Saul." He presses the scrolls into your hands.'
      },
    ],
    onComplete: 'receive_letters',
  },
  {
    id: 'merchant',
    name: 'Market Merchant',
    tileX: 4,
    tileY: 12,
    bodyColor: '#8b5030',
    accentColor: '#c07840',
    headColor: '#b07840',
    isHighPriest: false,
    dialogues: [
      {
        speaker: 'Merchant',
        text: '"Fresh figs! Dates from Jericho! The finest in all Jerusalem!" He lowers his voice.'
      },
      {
        speaker: 'Merchant',
        text: '"You seek the High Priest? Follow the main road north \u2014 straight through the market. You cannot miss the temple\'s great white walls."'
      },
    ],
    onComplete: null,
  },
  {
    id: 'pharisee',
    name: 'Pharisee',
    tileX: 19,
    tileY: 9,
    bodyColor: '#2a4a6a',
    accentColor: '#5a8aaa',
    headColor: '#c09060',
    isHighPriest: false,
    dialogues: [
      {
        speaker: 'Pharisee',
        text: '"Shalom, brother Saul. The followers of The Way grow bolder each day \u2014 preaching openly that this Jesus rose from the dead."'
      },
      {
        speaker: 'Pharisee',
        text: '"Blasphemy! You do God\'s work pursuing them. May the Almighty grant you success on the road to Damascus, brother."'
      },
    ],
    onComplete: null,
  },
];
