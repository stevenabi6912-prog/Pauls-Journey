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

    // ── Stall Workers ──────────────────────────────────────
    {
      id: 'worker_figs',
      name: 'Fig Seller',
      x: -7, z: 1.8,
      bodyColor: 0x7a5a30,
      accentColor: 0xd4a860,
      headColor: 0xb07840,
      dialogues: [
        { speaker: 'Fig Seller', text: '"Fresh figs from Jericho! Sweet dates from the Jordan valley! You look hungry, friend."' },
        { speaker: 'Fig Seller', text: '"Business is slow today. Ever since Saul of Tarsus began rounding up the followers of The Way, people hurry home before sunset."' },
      ],
      onComplete: null,
    },
    {
      id: 'worker_cloth',
      name: 'Cloth Merchant',
      x: -4, z: 1.8,
      bodyColor: 0x6a3060,
      accentColor: 0xaa70a0,
      headColor: 0xb07840,
      dialogues: [
        { speaker: 'Cloth Merchant', text: '"Fine linen from Egypt! Wool from the hills of Judea! Come, feel the quality!"' },
        { speaker: 'Cloth Merchant', text: '"Traveling far? Take a good cloak \u2014 the road to Damascus is no short walk, friend."' },
      ],
      onComplete: null,
    },
    {
      id: 'worker_spice',
      name: 'Spice Trader',
      x: 7, z: 1.8,
      bodyColor: 0x804020,
      accentColor: 0xc07030,
      headColor: 0xc09060,
      dialogues: [
        { speaker: 'Spice Trader', text: '"Cinnamon, myrrh, frankincense! The finest spices from Arabia and beyond!"' },
        { speaker: 'Spice Trader', text: '"I heard a man named Stephen was stoned not long ago, right here in Jerusalem. A terrible business. The city has not been the same."' },
      ],
      onComplete: null,
    },
    {
      id: 'worker_pottery',
      name: 'Potter',
      x: 4, z: 5.8,
      bodyColor: 0x8b5a20,
      accentColor: 0xc08040,
      headColor: 0xb07840,
      dialogues: [
        { speaker: 'Potter', text: '"I shape the clay as the LORD shapes us. Each vessel has its purpose. Here \u2014 feel how smooth this jar is."' },
        { speaker: 'Potter', text: '"\"But now, O LORD, thou art our father; we are the clay, and thou our potter.\" \u2014 Isaiah 64:8"' },
      ],
      onComplete: null,
    },
    {
      id: 'worker_bread',
      name: 'Bread Seller',
      x: 7, z: 5.8,
      bodyColor: 0x9a7040,
      accentColor: 0xd4a060,
      headColor: 0xb08050,
      dialogues: [
        { speaker: 'Bread Seller', text: '"Barley loaves! Still warm from the oven! A denarius for two loaves!"' },
        { speaker: 'Bread Seller', text: '"Buy bread before you leave, traveler. The desert road does not feed the hungry."' },
      ],
      onComplete: null,
    },
    {
      id: 'worker_oil',
      name: 'Oil Merchant',
      x: -7, z: 5.8,
      bodyColor: 0x4a6030,
      accentColor: 0x8aaa50,
      headColor: 0xb07840,
      dialogues: [
        { speaker: 'Oil Merchant', text: '"Olive oil from the Mount of Olives! The purest pressing for lamps and cooking alike!"' },
        { speaker: 'Oil Merchant', text: '"Keep your lamp full, friend. \"Thy word is a lamp unto my feet.\" \u2014 Psalm 119:105"' },
      ],
      onComplete: null,
    },

    // ── Talking Pair ──────────────────────────────────────
    {
      id: 'talker_a',
      name: 'Townsman',
      x: 2, z: 13,
      staticFacing: Math.PI / 2,
      bodyColor: 0x5a6a8a,
      accentColor: 0x8aaaca,
      headColor: 0xb07840,
      dialogues: [
        { speaker: 'Townsman', text: '"I tell you, these followers of The Way are good people. They sell their possessions and share everything with the poor!"' },
        { speaker: 'Townsman', text: '"\"And all that believed were together, and had all things common.\" \u2014 Acts 2:44. How can that be called heresy?"' },
      ],
      onComplete: null,
    },
    {
      id: 'talker_b',
      name: 'Scribe',
      x: 4.5, z: 13,
      staticFacing: -Math.PI / 2,
      bodyColor: 0x2a4a2a,
      accentColor: 0x4a8a4a,
      headColor: 0xc09060,
      dialogues: [
        { speaker: 'Scribe', text: '"They blaspheme the Law! They say this Jesus rose from the dead. Saul is right to pursue them. The Sanhedrin must act!"' },
        { speaker: 'Scribe', text: '"Hush your voice \u2014 Saul himself walks these very streets. Best not be heard taking their side."' },
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

  signs: [
    {
      id: 'sign_market',
      x: 0, z: 1.2,
      label: 'Market Notice',
      text: 'JERUSALEM MARKET\n\n\"A false balance is abomination to the LORD: but a just weight is his delight.\"\n\u2014 Proverbs 11:1',
    },
    {
      id: 'sign_temple',
      x: 0, z: -9.6,
      label: 'Temple Inscription',
      text: 'HOLY TEMPLE OF THE LORD\n\nEnter with reverence. Remove thy sandals.\n\n\"My house shall be called a house of prayer for all people.\"\n\u2014 Isaiah 56:7',
    },
    {
      id: 'sign_damascus',
      x: 0, z: 19.4,
      label: 'Road Marker',
      text: 'ROAD TO DAMASCUS\n\nThree days journey north.\nAll travelers must carry proper letters of passage.',
    },
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
