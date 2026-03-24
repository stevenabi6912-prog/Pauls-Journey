// scenes.js — Jerusalem 3D World Data
// Paul's Journeys — A Biblical RPG

var WORLD = {
  npcs: [
    {
      id: 'high_priest',
      name: 'Caiaphas, High Priest',
      x: 0, z: -18,
      bodyColor: 0xf5f0e0,
      accentColor: 0xc9a84c,
      headColor: 0xc09060,
      isHighPriest: true,
      dialogues: [
        { speaker: 'High Priest', text: '"Saul of Tarsus. Your zeal for the Law is known throughout Jerusalem. I have been expecting you."' },
        { speaker: 'High Priest', text: '"And Saul, yet breathing out threatenings and slaughter against the disciples of the Lord, went unto the high priest." \u2014 Acts 9:1' },
        { speaker: 'High Priest', text: '"These followers of The Way have spread to Damascus. You will go there, and bring them back \u2014 bound \u2014 to face judgment in Jerusalem."' },
        { speaker: 'High Priest', text: '"And desired of him letters to Damascus to the synagogues, that if he found any of this way, whether they were men or women, he might bring them bound unto Jerusalem." \u2014 Acts 9:2' },
        { speaker: 'High Priest', text: '"The letters are sealed with the authority of the Sanhedrin. God speed your mission, Saul." He presses the scrolls into your hands.' },
      ],
      onComplete: 'receive_letters',
    },
    {
      id: 'merchant',
      name: 'Market Merchant',
      x: -7, z: 4,
      bodyColor: 0x8b6040,
      accentColor: 0xc07840,
      headColor: 0xb07840,
      isHighPriest: false,
      dialogues: [
        { speaker: 'Merchant', text: '"Fresh figs! Dates from Jericho! The finest in all Jerusalem!" He glances toward the temple.' },
        { speaker: 'Merchant', text: '"You seek the High Priest? Follow the road north \u2014 straight through the market. You cannot miss the great white walls of the temple."' },
      ],
      onComplete: null,
    },
    {
      id: 'pharisee',
      name: 'Pharisee',
      x: 9, z: -7,
      bodyColor: 0x2a4a6a,
      accentColor: 0x5a8aaa,
      headColor: 0xc09060,
      isHighPriest: false,
      dialogues: [
        { speaker: 'Pharisee', text: '"Shalom, brother Saul. The followers of The Way grow bolder each day \u2014 preaching openly that Jesus rose from the dead."' },
        { speaker: 'Pharisee', text: '"Madness! You do God\'s work pursuing them. May the Almighty grant you success on the road to Damascus, brother."' },
      ],
      onComplete: null,
    },
  ],

  buildings: [
    // Temple platform (elevated floor)
    { x: 0, z: -17, w: 22, d: 13, h: 0.45, color: 0xd8d0a0 },
    // Temple back wall
    { x: 0, z: -22.5, w: 22, d: 1.5, h: 6, color: 0xe8e0c0, roofColor: 0xd0c890 },
    // Temple left wall
    { x: -10.5, z: -17, w: 1.5, d: 13, h: 6, color: 0xe8e0c0, roofColor: 0xd0c890 },
    // Temple right wall
    { x: 10.5, z: -17, w: 1.5, d: 13, h: 6, color: 0xe8e0c0, roofColor: 0xd0c890 },
    // Temple front wall left (leaves door gap in center)
    { x: -6, z: -11.2, w: 10, d: 1.5, h: 5.5, color: 0xe8e0c0, roofColor: 0xd0c890 },
    // Temple front wall right
    { x: 6, z: -11.2, w: 10, d: 1.5, h: 5.5, color: 0xe8e0c0, roofColor: 0xd0c890 },
    // Altar inside
    { x: 0, z: -20.5, w: 2.5, d: 2.5, h: 1.4, color: 0xcfc890, roofColor: 0xe0d8a0 },
    // Temple steps (3 tiers)
    { x: 0, z: -10.6, w: 6, d: 0.7, h: 0.15, color: 0xc8b880 },
    { x: 0, z: -10.0, w: 5, d: 0.7, h: 0.3, color: 0xc0b070 },
    { x: 0, z: -9.4, w: 4, d: 0.7, h: 0.45, color: 0xb8a860 },
    // Temple columns (5 across front)
    { x: -4, z: -11.4, w: 0.6, d: 0.6, h: 5.5, color: 0xf0ead0 },
    { x: -2, z: -11.4, w: 0.6, d: 0.6, h: 5.5, color: 0xf0ead0 },
    { x:  0, z: -11.4, w: 0.6, d: 0.6, h: 5.5, color: 0xf0ead0 },
    { x:  2, z: -11.4, w: 0.6, d: 0.6, h: 5.5, color: 0xf0ead0 },
    { x:  4, z: -11.4, w: 0.6, d: 0.6, h: 5.5, color: 0xf0ead0 },
    // Buildings east (near temple)
    { x: 11, z: -8.5, w: 4.5, d: 3.5, h: 3.5, color: 0x9b6535, roofColor: 0x7a4820 },
    { x: 11, z: -4.5, w: 4.5, d: 3.5, h: 3.0, color: 0x8a5a2a, roofColor: 0x6a3810 },
    // Buildings west (near temple)
    { x: -11, z: -8.5, w: 4.5, d: 3.5, h: 3.5, color: 0x9b6535, roofColor: 0x7a4820 },
    { x: -11, z: -4.5, w: 4.5, d: 3.5, h: 3.0, color: 0x8a5a2a, roofColor: 0x6a3810 },
    // South border walls (with gate gap)
    { x: -8, z: 22, w: 12, d: 1.5, h: 3.0, color: 0x6b4020 },
    { x:  8, z: 22, w: 12, d: 1.5, h: 3.0, color: 0x6b4020 },
    // Gate posts
    { x: -2, z: 22, w: 0.7, d: 0.7, h: 3.5, color: 0x4a2808 },
    { x:  2, z: 22, w: 0.7, d: 0.7, h: 3.5, color: 0x4a2808 },
  ],

  paths: [
    // Main north-south road
    { x: 0, z: 0, w: 4, d: 38, color: 0x9a8870 },
    // East-west cross through market
    { x: 0, z: 5, w: 22, d: 2.5, color: 0x9a8870 },
    // Temple courtyard paving
    { x: 0, z: -15.5, w: 10, d: 5, color: 0xd8d0a0 },
  ],

  palms: [
    { x: -12, z:  2 }, { x: 12, z:  2 },
    { x: -12, z: -2 }, { x: 12, z: -2 },
    { x: -11, z:  9 }, { x: 11, z:  9 },
    { x: -13, z: 15 }, { x: 13, z: 15 },
  ],

  stalls: [
    { x: -7, z: 3, color: 0xc03020 },
    { x: -4, z: 3, color: 0x9030a0 },
    { x:  4, z: 7, color: 0x2060c0 },
    { x:  7, z: 7, color: 0xe06010 },
    { x: -7, z: 7, color: 0xe07020 },
    { x:  7, z: 3, color: 0xb02030 },
  ],

  decorations: [
    { type: 'pot',  x: -2.5, z: -10.5 },
    { type: 'pot',  x:  2.5, z: -10.5 },
    { type: 'pot',  x: -1.5, z:  18 },
    { type: 'pot',  x:  1.5, z:  18 },
    { type: 'lamp', x: -2,   z:  0 },
    { type: 'lamp', x:  2,   z:  0 },
    { type: 'lamp', x: -2,   z:  9 },
    { type: 'lamp', x:  2,   z:  9 },
  ],

  // AABB collision boxes {minX, maxX, minZ, maxZ}
  colliders: [
    // Temple perimeter
    { minX: -12, maxX: 12,  minZ: -24,   maxZ: -23   },  // back wall
    { minX: -12, maxX: -10, minZ: -24,   maxZ: -10.5 },  // left wall
    { minX:  10, maxX:  12, minZ: -24,   maxZ: -10.5 },  // right wall
    // Temple front wall (gap for door -1.5 to 1.5)
    { minX: -12, maxX: -1.5, minZ: -12,  maxZ: -10.8 },
    { minX:  1.5, maxX: 12,  minZ: -12,  maxZ: -10.8 },
    // Altar
    { minX: -1.3, maxX: 1.3, minZ: -21.8, maxZ: -19.2 },
    // North buildings east
    { minX:  8.5, maxX: 13,  minZ: -10.5, maxZ: -7 },
    { minX:  8.5, maxX: 13,  minZ:  -6.5, maxZ: -2.5 },
    // North buildings west
    { minX: -13,  maxX: -8.5, minZ: -10.5, maxZ: -7 },
    { minX: -13,  maxX: -8.5, minZ:  -6.5, maxZ: -2.5 },
    // Market stalls
    { minX: -9,   maxX: -5.5, minZ:  1.5,  maxZ:  5 },
    { minX: -5.5, maxX: -2.5, minZ:  1.5,  maxZ:  5 },
    { minX:  2.5, maxX:  5.5, minZ:  5.5,  maxZ:  9 },
    { minX:  5.5, maxX:  9,   minZ:  5.5,  maxZ:  9 },
    { minX: -9,   maxX: -5.5, minZ:  5.5,  maxZ:  9 },
    { minX:  5.5, maxX:  9,   minZ:  1.5,  maxZ:  5 },
    // South wall (gap for gate -1.8 to 1.8)
    { minX: -14,  maxX: -2,   minZ:  21,   maxZ:  24 },
    { minX:   2,  maxX:  14,  minZ:  21,   maxZ:  24 },
    // World border
    { minX: -15,  maxX:  15,  minZ: -25,   maxZ: -24 },
  ],
};
