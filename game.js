import * as THREE from 'three';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass }      from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader }      from 'three/addons/shaders/FXAAShader.js';
import { Sky }             from 'three/addons/objects/Sky.js';

// ============================================================
//  PAUL'S JOURNEYS — 3D Game Engine (game.js)
//  Three.js top-down RPG — Jerusalem 34 AD
// ============================================================

const Game = {
  renderer:    null,
  composer:    null,
  fxaaPass:    null,
  scene:       null,
  camera:      null,
  playerGroup: null,
  npcObjects:  {},   // id -> { group, data }
  signObjects: [],   // { group, data }
  lampLights:  [],

  player: {
    pos:         null,
    speed:       6,
    moving:      false,
    animTime:    0,
    facingAngle: 0,
    jumpY:       0,
    jumpVel:     0,
    isJumping:   false,
  },

  cam: {
    offsetY: 9,
    offsetZ: 12,
    pos:     null,   // THREE.Vector3, set in init
  },

  keys: {},
  joy:  { active: false, angle: 0, mag: 0 },

  dialogueActive:   false,
  dialogueQueue:    [],
  dialogueIndex:    0,
  dialogueTyping:   false,
  typeTimer:        null,
  dialogueCallback: null,
  currentDialogueNPC: null,

  hasLetters:          false,
  gateUnlocked:        false,
  templeInside:        false,
  templeTransitioning: false,
  templeLight:         null,
  damascusTriggered:   false,
  interactCooldown:    0,
  gateBlockCooldown:   0,
  lastTime:            0,

  companionsRecruited: 0,
  horsesAcquired:      false,
  recruitedNPCs:       {},
  inventory:           { shekels: 5, tentCloth: 0, tents: 0 },
  minigameActive:      false,
  horseObjects:        [],
  choiceActive:        false,

  // ── DOM REFS ──────────────────────────────────────────────
  elDialogueBox:    null,
  elDialogueSpeaker: null,
  elDialogueText:   null,
  elDialoguePrompt: null,
  elInteractPrompt: null,
  elQuestText:      null,
  elScriptureRef:   null,
  elNotification:   null,
  elNotifText:      null,
  elJoyBase:        null,
  elJoyThumb:       null,
  elCompassFace:    null,

  // ── INIT ─────────────────────────────────────────────────
  init() {
    const canvas = document.getElementById('game-canvas');

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.scene.fog = new THREE.Fog(0xe8d4a0, 55, 140);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 200);

    // Player state
    this.player.pos = new THREE.Vector3(0, 0, 17);
    this.cam.pos    = new THREE.Vector3(0, 9, 29);

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.4, 0.82
    );
    this.composer.addPass(bloom);
    this.composer.addPass(new OutputPass());
    this.fxaaPass = new ShaderPass(FXAAShader);
    this.composer.addPass(this.fxaaPass);

    // Build world
    this.setupLighting();
    this.buildWorld();
    this.buildPlayer();
    this.buildNPCs();
    this.buildSigns();

    // Resize
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Cache DOM
    this.elDialogueBox     = document.getElementById('dialogue-box');
    this.elDialogueSpeaker = document.getElementById('dialogue-speaker');
    this.elDialogueText    = document.getElementById('dialogue-text');
    this.elDialoguePrompt  = document.getElementById('dialogue-prompt');
    this.elInteractPrompt  = document.getElementById('interact-prompt');
    this.elQuestText       = document.getElementById('quest-text');
    this.elScriptureRef    = document.getElementById('scripture-ref');
    this.elNotification    = document.getElementById('notification');
    this.elNotifText       = document.getElementById('notif-text');
    this.elJoyBase         = document.getElementById('joystick-base');
    this.elJoyThumb        = document.getElementById('joystick-thumb');
    this.elCompassFace     = document.getElementById('compass-face');

    // Input
    this.setupInput();

    // Start loop
    this.lastTime = performance.now();
    requestAnimationFrame(t => this.loop(t));
  },

  // ── RESIZE ────────────────────────────────────────────────
  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setSize(w, h);
      if (this.fxaaPass) {
        const pr = this.renderer.getPixelRatio();
        this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
      }
    }
  },

  // ── LIGHTING ──────────────────────────────────────────────
  setupLighting() {
    // Sky/ground hemisphere — warm sky, sandy bounce
    const hemi = new THREE.HemisphereLight(0x9fc8e8, 0xc49060, 0.7);
    this.scene.add(hemi);

    // Sun
    const sun = new THREE.DirectionalLight(0xffe0a0, 1.8);
    sun.position.set(22, 38, 22);
    sun.castShadow = true;
    sun.shadow.mapSize.width  = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left   = -60;
    sun.shadow.camera.right  =  60;
    sun.shadow.camera.top    =  60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.camera.near   = 1;
    sun.shadow.camera.far    = 120;
    sun.shadow.bias = -0.0008;
    this.scene.add(sun);

    // Soft cool rim from north
    const rim = new THREE.DirectionalLight(0xaabbcc, 0.35);
    rim.position.set(-10, 12, -20);
    this.scene.add(rim);
  },

  // ── BUILD WORLD ───────────────────────────────────────────
  buildWorld() {
    // Procedural sky
    const sky = new Sky();
    sky.scale.setScalar(450);
    this.scene.add(sky);
    const su = sky.material.uniforms;
    su['turbidity'].value       = 5;
    su['rayleigh'].value        = 1.8;
    su['mieCoefficient'].value  = 0.004;
    su['mieDirectionalG'].value = 0.82;
    const sunDir = new THREE.Vector3();
    sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(68), THREE.MathUtils.degToRad(20));
    su['sunPosition'].value.copy(sunDir);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xc4956a, roughness: 0.95, metalness: 0 });
    const ground    = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Buildings
    for (const b of WORLD.buildings) {
      this.addBuilding(b);
    }

    // Paths
    for (const p of WORLD.paths) {
      this.addPath(p);
    }

    // Palm trees
    for (const palm of WORLD.palms) {
      this.addPalm(palm.x, palm.z);
    }

    // Market stalls
    for (const stall of WORLD.stalls) {
      this.addStall(stall);
    }

    // Decorations
    for (const dec of WORLD.decorations) {
      this.addDecoration(dec);
    }
  },

  addBuilding(b) {
    const geo  = new THREE.BoxGeometry(b.w, b.h, b.d);
    const mat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: b.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(b.x, b.h / 2, b.z);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    if (b.roofColor !== undefined) {
      const rGeo  = new THREE.BoxGeometry(b.w + 0.15, 0.18, b.d + 0.15);
      const rMat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: b.roofColor });
      const roof  = new THREE.Mesh(rGeo, rMat);
      roof.position.set(b.x, b.h + 0.09, b.z);
      roof.castShadow = true;
      this.scene.add(roof);
    }
  },

  addPath(p) {
    const geo  = new THREE.BoxGeometry(p.w, 0.06, p.d);
    const mat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: p.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p.x, 0.03, p.z);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  },

  addPalm(x, z) {
    // Trunk
    const trunkGeo  = new THREE.CylinderGeometry(0.13, 0.2, 3.2, 6);
    const trunkMat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x7a5010 });
    const trunk     = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 1.6, z);
    trunk.castShadow = true;
    this.scene.add(trunk);

    // Leaf clusters
    const leafOffsets = [
      [  0,    0,    0   ],
      [  0.9, -0.3,  0.2 ],
      [ -0.9, -0.3,  0.2 ],
      [  0.2, -0.3,  0.9 ],
      [ -0.2, -0.3, -0.9 ],
      [  0.6, -0.2, -0.6 ],
    ];
    const leafMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x2d7a2d });
    for (const off of leafOffsets) {
      const leafGeo  = new THREE.SphereGeometry(0.55, 5, 4);
      const leaf     = new THREE.Mesh(leafGeo, leafMat);
      leaf.scale.set(1, 0.28, 1);
      leaf.position.set(x + off[0], 3.4 + off[1], z + off[2]);
      leaf.castShadow = true;
      this.scene.add(leaf);
    }
  },

  addStall(s) {
    const group = new THREE.Group();

    // Table top
    const topGeo = new THREE.BoxGeometry(2.2, 0.1, 1.3);
    const topMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x8b5e2a });
    const top    = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.85;
    top.castShadow = true;
    group.add(top);

    // 4 legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.85, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x6b3e0a });
    const legPositions = [
      [ 0.95, 0.425,  0.55],
      [-0.95, 0.425,  0.55],
      [ 0.95, 0.425, -0.55],
      [-0.95, 0.425, -0.55],
    ];
    for (const lp of legPositions) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lp[0], lp[1], lp[2]);
      group.add(leg);
    }

    // Awning
    const awningGeo = new THREE.BoxGeometry(2.5, 0.1, 1.6);
    const awningMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: s.color });
    const awning    = new THREE.Mesh(awningGeo, awningMat);
    awning.position.y = 2.0;
    awning.castShadow = true;
    group.add(awning);

    // 4 awning poles
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.15, 5);
    const poleMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x6b3e0a });
    const polePositions = [
      [ 0.95, 1.42,  0.55],
      [-0.95, 1.42,  0.55],
      [ 0.95, 1.42, -0.55],
      [-0.95, 1.42, -0.55],
    ];
    for (const pp of polePositions) {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(pp[0], pp[1], pp[2]);
      group.add(pole);
    }

    // 3 item spheres on table
    const itemColors = [0xc8a820, 0xc03018, 0x80a030];
    const itemGeo    = new THREE.SphereGeometry(0.13, 5, 4);
    for (let i = 0; i < 3; i++) {
      const itemMat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: itemColors[i] });
      const item     = new THREE.Mesh(itemGeo, itemMat);
      item.position.set(-0.5 + i * 0.5, 0.97, 0);
      group.add(item);
    }

    group.position.set(s.x, 0, s.z);
    this.scene.add(group);
  },

  addDecoration(d) {
    if (d.type === 'pot') {
      const geo  = new THREE.CylinderGeometry(0.18, 0.12, 0.4, 7);
      const mat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0xa05030 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(d.x, 0.2, d.z);
      mesh.castShadow = true;
      this.scene.add(mesh);

    } else if (d.type === 'lamp') {
      // Pole
      const poleGeo  = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 5);
      const poleMat  = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x6a4a20 });
      const pole     = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(d.x, 1.4, d.z);
      this.scene.add(pole);

      // Globe
      const globeGeo = new THREE.SphereGeometry(0.16, 7, 5);
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0xffd070,
        emissive: new THREE.Color(0xffd070),
        roughness: 0.1, metalness: 0,
        emissiveIntensity: 2.0,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      globe.position.set(d.x, 2.9, d.z);
      this.scene.add(globe);

      // Point light
      const light = new THREE.PointLight(0xffd070, 0.8, 6);
      light.position.set(d.x, 2.9, d.z);
      this.scene.add(light);
      this.lampLights.push(light);
    }
  },

  // ── BUILD PLAYER ──────────────────────────────────────────
  buildPlayer() {
    const group = new THREE.Group();

    // Robe
    const robeGeo = new THREE.CylinderGeometry(0.22, 0.38, 1.05, 8);
    const robeMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x5a4030 });
    const robe    = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = 0.525;
    robe.castShadow = true;
    group.add(robe);
    group.robe = robe;

    // Robe hem accent ring
    const hemGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.07, 8);
    const hemMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.82, color: 0xc9a84c });
    const hem    = new THREE.Mesh(hemGeo, hemMat);
    hem.position.y = 0.035;
    group.add(hem);

    // Belt
    const beltGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.07, 8);
    const beltMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.6, color: 0x8b5e20 });
    const belt    = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.72;
    group.add(belt);

    // Head
    const headGeo = new THREE.SphereGeometry(0.23, 8, 6);
    const headMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0xc09060 });
    const head    = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.26;
    head.castShadow = true;
    group.add(head);

    // Headband ring
    const bandGeo = new THREE.TorusGeometry(0.23, 0.03, 4, 12);
    const bandMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.82, color: 0xc9a84c });
    const band    = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 1.30;
    group.add(band);

    // Beard
    const beardGeo = new THREE.SphereGeometry(0.13, 6, 4);
    const beardMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x4a3020 });
    const beard    = new THREE.Mesh(beardGeo, beardMat);
    beard.scale.set(1, 0.7, 0.8);
    beard.position.set(0, 1.14, 0.15);
    group.add(beard);

    group.position.set(0, 0, 17);
    this.playerGroup = group;
    this.scene.add(group);
  },

  // ── BUILD NPCs ────────────────────────────────────────────
  buildNPCs() {
    for (const npcData of WORLD.npcs) {
      const group = this.createNPCGroup(npcData);
      group.position.set(npcData.x, 0, npcData.z);
      this.npcObjects[npcData.id] = { group: group, data: npcData };
      this.scene.add(group);
    }
  },

  // ── BUILD SIGNS ───────────────────────────────────────────
  buildSigns() {
    this.signObjects = [];
    for (const s of WORLD.signs) {
      const group = new THREE.Group();

      // Post
      const postGeo = new THREE.BoxGeometry(0.1, 1.6, 0.1);
      const postMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0x6b3e0a });
      const post    = new THREE.Mesh(postGeo, postMat);
      post.position.y = 0.8;
      post.castShadow = true;
      group.add(post);

      // Board
      const boardGeo = new THREE.BoxGeometry(1.5, 0.65, 0.09);
      const boardMat = new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0, color: 0xd4a85a });
      const board    = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = 1.57;
      board.castShadow = true;
      group.add(board);

      // Gold trim edges
      const trimMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.7, color: 0xb8892a });
      const topTrim = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 0.1), trimMat);
      topTrim.position.y = 1.92;
      group.add(topTrim);
      const botTrim = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 0.1), trimMat);
      botTrim.position.y = 1.22;
      group.add(botTrim);

      group.position.set(s.x, 0, s.z);
      this.scene.add(group);
      this.signObjects.push({ group, data: s });
    }
  },

  createNPCGroup(npc) {
    const group = new THREE.Group();

    if (npc.isHighPriest) {
      // Wider robe
      const robeGeo = new THREE.CylinderGeometry(0.26, 0.46, 1.1, 8);
      const robeMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.bodyColor });
      const robe    = new THREE.Mesh(robeGeo, robeMat);
      robe.position.y = 0.55;
      robe.castShadow = true;
      group.add(robe);

      // Wider hem
      const hemGeo = new THREE.CylinderGeometry(0.47, 0.47, 0.07, 8);
      const hemMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.accentColor });
      const hem    = new THREE.Mesh(hemGeo, hemMat);
      hem.position.y = 0.035;
      group.add(hem);

      // Larger head
      const headGeo = new THREE.SphereGeometry(0.25, 8, 6);
      const headMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.headColor });
      const head    = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.32;
      head.castShadow = true;
      group.add(head);

      // Mitre (tall priest hat)
      const mitreGeo = new THREE.CylinderGeometry(0.07, 0.24, 0.55, 6);
      const mitreMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: 0xf5f0e0 });
      const mitre    = new THREE.Mesh(mitreGeo, mitreMat);
      mitre.position.y = 1.87;
      group.add(mitre);

      // Breastplate
      const bpGeo = new THREE.BoxGeometry(0.4, 0.32, 0.06);
      const bpMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.accentColor });
      const bp    = new THREE.Mesh(bpGeo, bpMat);
      bp.position.set(0, 0.85, 0.28);
      group.add(bp);

      // 4 gems on breastplate (2x2 grid)
      const gemColors = [0xff2020, 0x2040ff, 0x20c040, 0xffd020];
      const gemGeo    = new THREE.BoxGeometry(0.07, 0.07, 0.07);
      const gemPositions = [
        [-0.1,  0.05, 0.06],
        [ 0.1,  0.05, 0.06],
        [-0.1, -0.08, 0.06],
        [ 0.1, -0.08, 0.06],
      ];
      for (let i = 0; i < 4; i++) {
        const gemMat = new THREE.MeshStandardMaterial({ roughness: 0.05, metalness: 0.1, color: gemColors[i], emissive: new THREE.Color(gemColors[i]), emissiveIntensity: 0.4 });
        const gem    = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(
          bp.position.x + gemPositions[i][0],
          bp.position.y + gemPositions[i][1],
          bp.position.z + gemPositions[i][2]
        );
        group.add(gem);
      }

    } else {
      // Regular NPC robe
      const robeGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.0, 7);
      const robeMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.bodyColor });
      const robe    = new THREE.Mesh(robeGeo, robeMat);
      robe.position.y = 0.5;
      robe.castShadow = true;
      group.add(robe);

      // Hem
      const hemGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.06, 7);
      const hemMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.accentColor });
      const hem    = new THREE.Mesh(hemGeo, hemMat);
      hem.position.y = 0.03;
      group.add(hem);

      // Head
      const headGeo = new THREE.SphereGeometry(0.21, 8, 6);
      const headMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.headColor });
      const head    = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.21;
      head.castShadow = true;
      group.add(head);

      // Head wrap
      const wrapGeo = new THREE.CylinderGeometry(0.215, 0.215, 0.055, 8);
      const wrapMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0, color: npc.accentColor });
      const wrap    = new THREE.Mesh(wrapGeo, wrapMat);
      wrap.position.y = 1.25;
      group.add(wrap);
    }

    return group;
  },

  // ── INPUT ─────────────────────────────────────────────────
  setupInput() {
    // Detect touch device — works on real phones AND browser emulation
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    }

    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        this.tryInteract();
      }
      if (e.key === ' ') {
        e.preventDefault();
        this.tryJump();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        this.dismissDialogue();
      }
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.key) !== -1) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Dialogue advance on click
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.addEventListener('click', () => {
      this.advanceDialogue();
    });

    // Interact button (mobile) — touchstart so it fires while joystick is held
    const interactBtn = document.getElementById('interact-btn');
    interactBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.tryInteract();
    }, { passive: false });
    interactBtn.addEventListener('click', () => { this.tryInteract(); }); // desktop fallback

    // Jump button (mobile)
    const jumpBtn = document.getElementById('jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.tryJump();
      }, { passive: false });
      jumpBtn.addEventListener('click', () => { this.tryJump(); }); // desktop fallback
    }

    // Joystick
    this.setupJoystick();
  },

  setupJoystick() {
    const zone  = document.getElementById('joystick-zone');
    const base  = document.getElementById('joystick-base');
    const thumb = document.getElementById('joystick-thumb');

    let originX   = 0;
    let originY   = 0;
    let joyTouchId = null;  // track which finger owns the joystick
    const DEAD    = 50;     // max radius px

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      // Only claim the first unclaimed touch
      if (joyTouchId !== null) return;
      const touch    = e.changedTouches[0];
      joyTouchId     = touch.identifier;
      originX        = touch.clientX;
      originY        = touch.clientY;

      base.style.left    = (originX - 45) + 'px';
      base.style.top     = (originY - 45) + 'px';
      base.style.opacity = '1';
      thumb.style.transform = 'translate(-50%, -50%)';

      this.joy.active = true;
      this.joy.mag    = 0;
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (touch.identifier !== joyTouchId) continue;
        const dx      = touch.clientX - originX;
        const dy      = touch.clientY - originY;
        const dist    = Math.sqrt(dx * dx + dy * dy);
        const clamped = Math.min(dist, DEAD);
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;

        thumb.style.transform =
          'translate(calc(-50% + ' + (nx * clamped) + 'px), calc(-50% + ' + (ny * clamped) + 'px))';

        this.joy.angle = Math.atan2(dy, dx);
        this.joy.mag   = Math.min(dist / DEAD, 1);
      }
    }, { passive: false });

    const endJoy = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (touch.identifier !== joyTouchId) continue;
        joyTouchId            = null;
        thumb.style.transform = 'translate(-50%, -50%)';
        base.style.opacity    = '0';
        this.joy.mag          = 0;
        this.joy.active       = false;
      }
    };

    zone.addEventListener('touchend',    endJoy, { passive: false });
    zone.addEventListener('touchcancel', endJoy, { passive: false });
  },

  // ── GAME LOOP ─────────────────────────────────────────────
  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.update(dt);
    this.composer.render();
    requestAnimationFrame(t => this.loop(t));
  },

  // ── UPDATE ────────────────────────────────────────────────
  update(dt) {
    if (this.interactCooldown  > 0) this.interactCooldown  -= dt;
    if (this.gateBlockCooldown > 0) this.gateBlockCooldown -= dt;

    if (!this.dialogueActive && !this.templeTransitioning && !this.minigameActive && !this.choiceActive) {
      this.updatePlayer(dt);
    }

    this.updateCamera(dt);
    this.updateNPCFacing();
    this.updateInteractUI();
    this.updateFollowers(dt);
    this.updateCompass();
  },

  // ── PLAYER MOVEMENT ───────────────────────────────────────
  updatePlayer(dt) {
    const keys = this.keys;
    let dx = 0;
    let dz = 0;

    // Keyboard input (world-space: W=north = -Z, S=south = +Z)
    if (keys['w'] || keys['W'] || keys['ArrowUp'])    dz -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown'])  dz += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft'])  dx -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) dx += 1;

    // Joystick input
    if (this.joy.active && this.joy.mag > 0.1) {
      dx += Math.cos(this.joy.angle) * this.joy.mag;
      dz += Math.sin(this.joy.angle) * this.joy.mag;
    }

    // Normalize diagonal
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len > 1) {
      dx /= len;
      dz /= len;
    }

    const speed = this.player.speed;
    const pos   = this.player.pos;

    // Jump physics
    if (this.player.isJumping) {
      this.player.jumpY   += this.player.jumpVel * dt;
      this.player.jumpVel -= 22 * dt;
      if (this.player.jumpY <= 0) {
        this.player.jumpY   = 0;
        this.player.jumpVel = 0;
        this.player.isJumping = false;
      }
    }

    if (len > 0.01) {
      this.player.moving = true;

      // Try X movement
      const newX = pos.x + dx * speed * dt;
      if (!this.collidesAt(newX, pos.z)) {
        pos.x = newX;
      }

      // Try Z movement
      const newZ = pos.z + dz * speed * dt;
      if (!this.collidesAt(pos.x, newZ)) {
        pos.z = newZ;
      } else if (dz > 0 && newZ > 53.5 && !this.gateUnlocked && this.gateBlockCooldown <= 0) {
        // Player walked into the south gate — show hint
        this.gateBlockCooldown = 4;
        if (!this.hasLetters) {
          this.showNotification('The road is sealed.\nObtain letters from\nthe High Priest first.');
        } else {
          this.showNotification('Show your letters\nto the Gate Guard\nto pass.');
        }
      }

      // Facing angle — smooth rotation
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - this.player.facingAngle;
      // Wrap to -PI..PI
      while (diff >  Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      this.player.facingAngle += diff * 0.18;
      this.playerGroup.rotation.y = this.player.facingAngle;

      // Walk bob
      this.player.animTime += dt * 8;
      const ty1 = this.getTerrainY(pos.x, pos.z);
      this.playerGroup.position.y = ty1 + Math.abs(Math.sin(this.player.animTime)) * 0.06 + this.player.jumpY;

    } else {
      this.player.moving = false;

      // Breathing idle
      this.player.animTime += dt * 1.5;
      const ty2 = this.getTerrainY(pos.x, pos.z);
      this.playerGroup.position.y = ty2 + Math.sin(this.player.animTime) * 0.012 + this.player.jumpY;
    }

    // Sync group position
    this.playerGroup.position.x = pos.x;
    this.playerGroup.position.z = pos.z;

    // Temple entry / exit transition
    if (!this.templeTransitioning) {
      const px = pos.x, pz = pos.z;
      if (!this.templeInside && pz < -11.5 && Math.abs(px) < 1.8) {
        this.enterTemple();
      } else if (this.templeInside && pz > -11.5 && Math.abs(px) < 1.3) {
        this.exitTemple();
      }
    }

    // Check for Damascus Road trigger (only after gate guard unlocks it)
    if (this.gateUnlocked && pos.z > 55.8) {
      this.triggerDamascusRoad();
    }
  },

  // ── COLLISION ─────────────────────────────────────────────
  collidesAt(x, z) {
    const r = 0.45;

    // World border (sides + north)
    if (x < -37 || x > 37) return true;
    if (z < -27.5) return true;
    // South gate — blocked until guard unlocks it
    if (z > 54.5 && !this.gateUnlocked) return true;

    // AABB scene colliders
    for (const c of WORLD.colliders) {
      if (x - r < c.maxX && x + r > c.minX &&
          z - r < c.maxZ && z + r > c.minZ) {
        return true;
      }
    }

    // NPC bodies (dynamic) — skip recruited followers who move with player
    const nr2 = (r + 0.38) * (r + 0.38);
    for (const id in this.npcObjects) {
      if (this.recruitedNPCs[id]) continue;
      const g  = this.npcObjects[id].group;
      const dx = x - g.position.x;
      const dz = z - g.position.z;
      if (dx * dx + dz * dz < nr2) return true;
    }

    // Sign posts (dynamic)
    const sr2 = (r + 0.1) * (r + 0.1);
    for (const s of this.signObjects) {
      const dx = x - s.group.position.x;
      const dz = z - s.group.position.z;
      if (dx * dx + dz * dz < sr2) return true;
    }

    return false;
  },

  // ── TERRAIN ELEVATION ─────────────────────────────────────
  getTerrainY(x, z) {
    // Grand staircase — walk up automatically (no jump needed)
    if (z < -8.1 && z > -10.75 && Math.abs(x) < 5.6) {
      if (z < -10.15) return 1.10;
      if (z < -9.63)  return 0.88;
      if (z < -9.11)  return 0.66;
      if (z < -8.59)  return 0.44;
      return 0.22;
    }
    // Temple platform surface
    if (z < -10.75 && Math.abs(x) < 11) return 1.2;
    return 0;
  },

  // ── CAMERA ────────────────────────────────────────────────
  updateCamera(dt) {
    const p = this.player.pos;
    const targetX = p.x;
    const targetY = this.templeInside ? 20 : this.cam.offsetY;
    const targetZ = p.z + (this.templeInside ? 9 : this.cam.offsetZ);

    const k = 0.07;
    this.cam.pos.x += (targetX - this.cam.pos.x) * k;
    this.cam.pos.y += (targetY - this.cam.pos.y) * k;
    this.cam.pos.z += (targetZ - this.cam.pos.z) * k;

    this.camera.position.copy(this.cam.pos);
    this.camera.lookAt(p.x, this.templeInside ? 1.5 : 0.8, p.z - (this.templeInside ? 5 : 1.5));
  },

  // ── NPC FACING ────────────────────────────────────────────
  updateNPCFacing() {
    const px = this.player.pos.x;
    const pz = this.player.pos.z;

    for (const id in this.npcObjects) {
      const obj = this.npcObjects[id];

      // Talking-pair NPCs keep a fixed facing angle
      if (obj.data.staticFacing !== undefined) {
        obj.group.rotation.y = obj.data.staticFacing;
        continue;
      }

      const nx  = obj.group.position.x;
      const nz  = obj.group.position.z;
      const dx  = px - nx;
      const dz  = pz - nz;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 6) {
        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - obj.group.rotation.y;
        while (diff >  Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        obj.group.rotation.y += diff * 0.05;
      }
    }
  },

  // ── INTERACT UI ───────────────────────────────────────────
  updateInteractUI() {
    if (this.dialogueActive) {
      this.elInteractPrompt.classList.add('hidden');
      return;
    }

    const nearestNPC  = this.findNearestNPC(3.5);
    const nearestSign = this.findNearestSign(2.5);

    if (nearestNPC) {
      this.elInteractPrompt.textContent = '[E] Talk to ' + nearestNPC.data.name;
      this.elInteractPrompt.classList.remove('hidden');
    } else if (nearestSign) {
      this.elInteractPrompt.textContent = '[E] Read ' + nearestSign.data.label;
      this.elInteractPrompt.classList.remove('hidden');
    } else {
      this.elInteractPrompt.classList.add('hidden');
    }
  },

  // ── FIND NEAREST NPC ──────────────────────────────────────
  findNearestNPC(maxDist) {
    const px = this.player.pos.x;
    const pz = this.player.pos.z;
    let nearest = null;
    let nearestDist = maxDist;

    for (const id in this.npcObjects) {
      const obj = this.npcObjects[id];
      const dx  = px - obj.group.position.x;
      const dz  = pz - obj.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = obj;
      }
    }

    return nearest;
  },

  // ── FIND NEAREST SIGN ─────────────────────────────────────
  findNearestSign(maxDist) {
    const px = this.player.pos.x;
    const pz = this.player.pos.z;
    let nearest = null;
    let nearestDist = maxDist;

    for (const s of this.signObjects) {
      const dx   = px - s.group.position.x;
      const dz   = pz - s.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = s;
      }
    }

    return nearest;
  },

  // ── INTERACT ──────────────────────────────────────────────
  tryInteract() {
    if (this.dialogueActive) {
      this.advanceDialogue();
      return;
    }

    if (this.interactCooldown > 0) return;

    // Prefer NPC over sign if both are nearby
    const nearestNPC = this.findNearestNPC(3.5);
    if (nearestNPC) {
      this.interactCooldown = 0.4;
      this.startDialogue(nearestNPC);
      return;
    }

    const nearestSign = this.findNearestSign(2.5);
    if (nearestSign) {
      this.interactCooldown = 0.4;
      // Wrap sign data so it works with the existing dialogue system
      const signAsNPC = {
        group: nearestSign.group,
        data: {
          name: nearestSign.data.label,
          dialogues: [{ speaker: nearestSign.data.label, text: nearestSign.data.text }],
          onComplete: null,
        },
      };
      this.startDialogue(signAsNPC);
    }
  },

  // ── DIALOGUE ──────────────────────────────────────────────
  startDialogue(npcObj) {
    this.currentDialogueNPC = npcObj;
    const id = npcObj.data.id;
    let dialogues = npcObj.data.dialogues;

    if (id === 'gate_guard') {
      const allReady = this.hasLetters && this.companionsRecruited >= 4 && this.horsesAcquired;
      if (allReady && npcObj.data.dialoguesAlt) {
        dialogues = npcObj.data.dialoguesAlt;
      } else if (this.hasLetters && npcObj.data.dialoguesMissing) {
        dialogues = npcObj.data.dialoguesMissing;
      }
    } else if (npcObj.data.onComplete === 'recruit_companion') {
      if (this.recruitedNPCs[id]) {
        dialogues = [{ speaker: npcObj.data.name, text: '"I am ready, Saul. We leave when you give the word."' }];
      } else if (this.hasLetters && npcObj.data.dialoguesAlt) {
        dialogues = npcObj.data.dialoguesAlt;
      }
      // else: soldier mode — use default dialogues
    } else if (id === 'stable_master' && this.horsesAcquired) {
      dialogues = [{ speaker: 'Elias', text: '"Your four horses are in the pen and ready to ride. May God grant you a swift journey to Damascus."' }];
    } else if (id === 'stable_master' && this.inventory.shekels < 15) {
      dialogues = [{ speaker: 'Elias', text: '"Four horses for the Damascus road \u2014 that\'s 15 shekels. Come back when you have the coin. You can earn it making and selling tents."' }];
    } else if (id === 'loom_keeper' && this.inventory.tentCloth === 0) {
      dialogues = [{ speaker: 'Benjamin', text: '"Bring me tent cloth and I will weave it into a fine tent. Find Miriam \u2014 she sells cloth on the main road north of the craftsmen\'s quarter. 2 shekels a bolt."' }];
    } else if (id === 'joseph_buyer' && this.inventory.tents === 0) {
      dialogues = [{ speaker: 'Joseph', text: '"Do you have any tents to sell? I pay 5 shekels each. Bring me one and we have a deal."' }];
    } else if (id === 'miriam_cloth' && this.inventory.shekels < 2) {
      dialogues = [{ speaker: 'Miriam', text: '"Tent cloth is 2 shekels a bolt. Come back when you have the coin, friend."' }];
    }

    this.dialogueQueue  = dialogues;
    this.dialogueIndex  = 0;
    this.dialogueActive = true;

    this.elDialogueBox.classList.remove('hidden');
    this.showDialogueLine(0);
  },

  showDialogueLine(index) {
    if (index >= this.dialogueQueue.length) {
      this.endDialogue();
      return;
    }

    const line = this.dialogueQueue[index];
    this.elDialogueSpeaker.textContent = line.speaker;

    // Clear previous
    if (this.typeTimer) {
      clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }
    this.elDialogueText.textContent = '';
    this.dialogueTyping = true;
    this.elDialoguePrompt.style.opacity = '0';

    // Letter-by-letter typing
    const fullText = line.text;
    let charIdx    = 0;

    const typeNext = () => {
      if (charIdx >= fullText.length) {
        this.dialogueTyping = false;
        this.elDialoguePrompt.style.opacity = '';
        return;
      }

      this.elDialogueText.textContent += fullText[charIdx];
      const ch = fullText[charIdx];
      charIdx++;

      // Punctuation pause
      let delay = 22;
      if (ch === '.' || ch === '!' || ch === '?' || ch === '\u2014') delay = 70;
      else if (ch === ',' || ch === ';') delay = 45;

      this.typeTimer = setTimeout(typeNext, delay);
    };

    typeNext();
  },

  advanceDialogue() {
    if (!this.dialogueActive) return;

    if (this.dialogueTyping) {
      // Skip to full text
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
        this.typeTimer = null;
      }
      const line = this.dialogueQueue[this.dialogueIndex];
      this.elDialogueText.textContent = line.text;
      this.dialogueTyping = false;
      this.elDialoguePrompt.style.opacity = '';
      return;
    }

    // Advance to next line
    this.dialogueIndex++;
    if (this.dialogueIndex >= this.dialogueQueue.length) {
      this.endDialogue();
    } else {
      this.showDialogueLine(this.dialogueIndex);
    }
  },

  endDialogue() {
    if (this.typeTimer) {
      clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }

    this.dialogueActive   = false;
    this.dialogueTyping   = false;

    this.elDialogueBox.classList.add('hidden');
    this.elDialogueText.textContent    = '';
    this.elDialogueSpeaker.textContent = '';

    // Check for completion callback
    if (this.currentDialogueNPC && this.currentDialogueNPC.data.onComplete) {
      const cb  = this.currentDialogueNPC.data.onComplete;
      const nid = this.currentDialogueNPC.data.id;

      if (cb === 'receive_letters') {
        this.receiveLetters();

      } else if (cb === 'recruit_companion' && !this.recruitedNPCs[nid] && this.hasLetters) {
        this.recruitedNPCs[nid] = true;
        this.companionsRecruited++;
        const trueName = this.currentDialogueNPC.data.trueName || this.currentDialogueNPC.data.name;
        this.showNotification('Companion ' + this.companionsRecruited + '/4 recruited!\n' + trueName + ' will follow you.');
        this.updateQuestProgress();

      } else if (cb === 'offer_cloth') {
        const npcRef = this.currentDialogueNPC;
        if (this.inventory.shekels >= 2) {
          this.showChoice(
            'Buy one bolt of tent cloth for 2 shekels?',
            'Buy (2 shekels)',
            'Decline',
            () => {
              this.inventory.shekels -= 2;
              this.inventory.tentCloth++;
              this.updateInventoryHUD();
              this.updateSatchelHUD();
              this.showNotification('Tent cloth purchased! (\u22122 shekels)\nBring it to Benjamin the Weaver.');
            },
            () => {
              this.showNotification('Come back when you need cloth.');
            }
          );
        } else {
          this.showNotification('You need at least 2 shekels\nto buy tent cloth.\nMake some coin first!');
        }

      } else if (cb === 'craft_tent') {
        if (this.inventory.tentCloth > 0) {
          this.startWeavingMinigame(
            () => {
              this.inventory.tentCloth--;
              this.inventory.tents++;
              this.updateInventoryHUD();
              this.updateSatchelHUD();
              this.showNotification('Tent crafted!\nSell it to Joseph for 5 shekels.');
            },
            () => {
              this.showNotification('Practice makes perfect!\nSpeak to Benjamin again\nto try the weaving once more.');
            }
          );
        } else {
          this.showNotification('You need tent cloth first!\nBuy some from Miriam.');
        }

      } else if (cb === 'sell_tent') {
        if (this.inventory.tents > 0) {
          this.inventory.tents--;
          this.inventory.shekels += 5;
          this.updateInventoryHUD();
          this.updateSatchelHUD();
          this.showNotification('Tent sold for 5 shekels!\nTotal: ' + this.inventory.shekels + ' shekels.');
        }

      } else if (cb === 'buy_horses') {
        if (!this.horsesAcquired && this.inventory.shekels >= 15) {
          this.showChoice(
            'Buy 5 horses for the Damascus road — 15 shekels?',
            'Buy (15 shekels)',
            'Not yet',
            () => {
              this.inventory.shekels -= 15;
              this.horsesAcquired = true;
              this.updateInventoryHUD();
              this.updateQuestProgress();
              this.buildHorses();
            },
            () => {
              this.showNotification('Come back when you are ready\nto purchase the horses.');
            }
          );
        } else if (!this.horsesAcquired) {
          this.showNotification('Not enough shekels!\nNeed 15 to buy 5 horses.\nMake and sell tents to earn coin.');
        }

      } else if (cb === 'gate_open') {
        const allReady = this.hasLetters && this.companionsRecruited >= 4 && this.horsesAcquired;
        if (allReady) {
          this.gateUnlocked = true;
          if (this.npcObjects['gate_guard']) {
            this.npcObjects['gate_guard'].group.position.x = 3.5;
          }
          this.elQuestText.textContent    = 'Head south \u2014 the road to Damascus awaits';
          this.elScriptureRef.textContent = 'Acts 9:3';
          this.showNotification('The gate opens!\nHead south to Damascus.');
        }
      }
    }

    this.currentDialogueNPC = null;
    this.interactCooldown   = 0.5;
  },

  // ── DISMISS DIALOGUE (no callback — e.g. Esc to decline) ──
  dismissDialogue() {
    if (!this.dialogueActive) return;
    if (this.typeTimer) { clearTimeout(this.typeTimer); this.typeTimer = null; }
    this.dialogueActive   = false;
    this.dialogueTyping   = false;
    this.elDialogueBox.classList.add('hidden');
    this.elDialogueText.textContent    = '';
    this.elDialogueSpeaker.textContent = '';
    this.currentDialogueNPC = null;
    this.interactCooldown   = 0.5;
  },

  // ── TEMPLE TRANSITIONS ────────────────────────────────────
  _makeTransitionOverlay() {
    const ov = document.createElement('div');
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:50',
      'background:rgba(0,0,0,0)', 'pointer-events:none',
      'transition:background 0.32s ease',
    ].join(';');
    document.body.appendChild(ov);
    return ov;
  },

  enterTemple() {
    this.templeTransitioning = true;
    this.templeInside        = true;

    const ov = this._makeTransitionOverlay();
    requestAnimationFrame(() => { ov.style.background = 'rgba(0,0,0,1)'; });

    setTimeout(() => {
      // Teleport player inside entrance
      this.player.pos.set(0, 0, -15);
      this.playerGroup.position.set(0, 0, -15);
      // Snap camera overhead to avoid lerp glitch
      this.cam.pos.set(0, 20, -15 + 9);

      // Add warm torch light inside temple
      if (!this.templeLight) {
        const tl = new THREE.PointLight(0xffdd88, 3.0, 28);
        tl.position.set(0, 5.5, -18);
        this.scene.add(tl);
        this.templeLight = tl;
      }

      document.getElementById('location-name').textContent = 'Holy Temple';
      document.getElementById('scripture-ref').textContent = 'Acts 9:1';

      ov.style.background = 'rgba(0,0,0,0)';
      setTimeout(() => { ov.remove(); this.templeTransitioning = false; }, 340);
    }, 340);
  },

  exitTemple() {
    this.templeTransitioning = true;
    this.templeInside        = false;

    const ov = this._makeTransitionOverlay();
    requestAnimationFrame(() => { ov.style.background = 'rgba(0,0,0,1)'; });

    setTimeout(() => {
      // Remove temple light
      if (this.templeLight) { this.scene.remove(this.templeLight); this.templeLight = null; }

      // Teleport player just outside temple
      this.player.pos.set(0, 0, -9);
      this.playerGroup.position.set(0, 0, -9);
      this.cam.pos.set(0, 9, -9 + 12);

      document.getElementById('location-name').textContent = 'Jerusalem';
      document.getElementById('scripture-ref').textContent = 'Acts 9:1';

      ov.style.background = 'rgba(0,0,0,0)';
      setTimeout(() => { ov.remove(); this.templeTransitioning = false; }, 340);
    }, 340);
  },

  // ── RECEIVE LETTERS ───────────────────────────────────────
  // ── JUMP ──────────────────────────────────────────────────
  tryJump() {
    if (this.player.isJumping || this.dialogueActive || this.templeTransitioning) return;
    this.player.isJumping = true;
    this.player.jumpVel   = 7;
  },

  // ── RECEIVE LETTERS ───────────────────────────────────────
  receiveLetters() {
    this.hasLetters = true;

    this.elQuestText.textContent    = 'Find 4 companions (0/4) & buy horses';
    this.elScriptureRef.textContent = 'Acts 9:2';

    this.updateInventoryHUD();
    this.updateSatchelHUD();

    this.showNotification('\ud83d\udcdc Letters added to satchel!\nFind companions & buy horses\nto prepare for Damascus.');
  },

  // ── QUEST PROGRESS ────────────────────────────────────────
  updateQuestProgress() {
    if (!this.hasLetters) return;
    const c = this.companionsRecruited;
    const h = this.horsesAcquired;
    if (c >= 4 && h) {
      this.elQuestText.textContent    = 'Show letters to the Gate Guard';
      this.elScriptureRef.textContent = 'Acts 9:2';
    } else if (!h && c < 4) {
      this.elQuestText.textContent = 'Find companions (' + c + '/4) & buy horses';
    } else if (!h) {
      this.elQuestText.textContent = 'Buy 4 horses from Elias the Stable Master';
    } else {
      this.elQuestText.textContent = 'Find companions (' + c + '/4) for the journey';
    }
  },

  // ── INVENTORY HUD ─────────────────────────────────────────
  updateInventoryHUD() {
    const el = document.getElementById('shekel-count');
    if (el) el.textContent = this.inventory.shekels;
  },

  // ── NOTIFICATION ──────────────────────────────────────────
  showNotification(text) {
    this.elNotifText.textContent = text;
    this.elNotification.classList.remove('hidden');

    // Hide after 3.5s
    setTimeout(() => {
      this.elNotification.classList.add('hidden');
    }, 3500);
  },

  // ── DAMASCUS ROAD CUTSCENE ────────────────────────────────
  triggerDamascusRoad() {
    if (this.damascusTriggered) return;
    this.damascusTriggered = true;

    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:100',
      'background:rgba(0,0,0,0)',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'transition:background 1.5s ease',
      'font-family:Cinzel,serif',
      'text-align:center',
      'padding:40px',
    ].join(';');
    document.body.appendChild(overlay);

    // Fade to black
    requestAnimationFrame(() => {
      overlay.style.background = 'rgba(0,0,0,1)';
    });

    // First title
    const title = document.createElement('div');
    title.textContent = 'The Road to Damascus';
    title.style.cssText = [
      'color:#c9a84c',
      'font-size:clamp(1.4rem,4vw,2.2rem)',
      'font-weight:700',
      'letter-spacing:0.1em',
      'opacity:0',
      'transition:opacity 1.2s ease',
      'margin-bottom:28px',
      'text-shadow:0 0 20px rgba(201,168,76,0.7)',
    ].join(';');
    overlay.appendChild(title);

    // Quote
    const quote = document.createElement('div');
    quote.textContent = '"And as he journeyed, he came near Damascus: and suddenly there shined round about him a light from heaven." \u2014 Acts 9:3';
    quote.style.cssText = [
      'font-family:Crimson Text,Georgia,serif',
      'font-style:italic',
      'color:#f0e0b0',
      'font-size:clamp(1rem,2.5vw,1.3rem)',
      'max-width:560px',
      'line-height:1.7',
      'opacity:0',
      'transition:opacity 1.5s ease',
    ].join(';');
    overlay.appendChild(quote);

    // Show title after fade-to-black
    setTimeout(() => {
      title.style.opacity = '1';
    }, 1600);

    // Show quote
    setTimeout(() => {
      quote.style.opacity = '1';
    }, 2800);

    // Flash white — Damascus Road light
    setTimeout(() => {
      overlay.style.transition = 'background 0.15s ease';
      overlay.style.background = 'rgba(255,255,255,1)';
    }, 4000);

    // Damascus Road revelation
    setTimeout(() => {
      // Clear overlay contents
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);

      const flash = document.createElement('div');
      flash.style.cssText = [
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'gap:24px',
        'opacity:0',
        'transition:opacity 0.8s ease',
      ].join(';');

      const lightning = document.createElement('div');
      lightning.textContent = '\u26a1 A LIGHT FROM HEAVEN \u26a1';
      lightning.style.cssText = [
        'font-family:Cinzel,serif',
        'font-weight:700',
        'font-size:clamp(1.2rem,3.5vw,2rem)',
        'color:#1a0800',
        'letter-spacing:0.12em',
        'text-shadow:none',
      ].join(';');
      flash.appendChild(lightning);

      const verse = document.createElement('div');
      verse.textContent = '"Saul, Saul, why persecutest thou me?" \u2014 Acts 9:4';
      verse.style.cssText = [
        'font-family:Crimson Text,Georgia,serif',
        'font-style:italic',
        'font-size:clamp(1rem,2.5vw,1.3rem)',
        'color:#2a0800',
        'max-width:500px',
        'line-height:1.7',
        'text-align:center',
      ].join(';');
      flash.appendChild(verse);

      overlay.appendChild(flash);

      requestAnimationFrame(() => {
        flash.style.opacity = '1';
      });
    }, 4200);
  },

  // ── FOLLOWERS (recruited soldiers) ────────────────────────
  updateFollowers(dt) {
    if (!this.hasLetters) return;
    const px = this.player.pos.x;
    const pz = this.player.pos.z;
    const followerIds = ['barnabas', 'lucius', 'silas', 'manaen'];
    // Offset behind player, spread out
    const offsets = [[-1.8, 2.2], [1.8, 2.2], [-2.8, 4.0], [2.8, 4.0]];

    for (let i = 0; i < followerIds.length; i++) {
      const id = followerIds[i];
      if (!this.recruitedNPCs[id]) continue;
      const npc = this.npcObjects[id];
      if (!npc) continue;

      const targetX = px + offsets[i][0];
      const targetZ = pz + offsets[i][1];
      const dx = targetX - npc.group.position.x;
      const dz = targetZ - npc.group.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.12) {
        const spd = Math.min(dist * 4.5, this.player.speed * 1.15);
        npc.group.position.x += (dx / dist) * spd * dt;
        npc.group.position.z += (dz / dist) * spd * dt;
        npc.group.position.y = this.getTerrainY(npc.group.position.x, npc.group.position.z);
        npc.group.rotation.y = Math.atan2(dx, dz);
      }

      // Horse follows same follower offset but a bit further back
      if (this.horseObjects[i]) {
        const hx = px + offsets[i][0] * 1.2;
        const hz = pz + offsets[i][1] + 1.5;
        const hdx = hx - this.horseObjects[i].position.x;
        const hdz = hz - this.horseObjects[i].position.z;
        const hd  = Math.sqrt(hdx * hdx + hdz * hdz);
        if (hd > 0.15) {
          const hs = Math.min(hd * 4, this.player.speed * 1.2);
          this.horseObjects[i].position.x += (hdx / hd) * hs * dt;
          this.horseObjects[i].position.z += (hdz / hd) * hs * dt;
          this.horseObjects[i].rotation.y = Math.atan2(hdx, hdz);
        }
      }
    }

    // 5th horse follows directly behind player
    if (this.horseObjects[4]) {
      const hx = px;
      const hz = pz + 1.0;
      const hdx = hx - this.horseObjects[4].position.x;
      const hdz = hz - this.horseObjects[4].position.z;
      const hd  = Math.sqrt(hdx * hdx + hdz * hdz);
      if (hd > 0.15) {
        const hs = Math.min(hd * 4, this.player.speed * 1.2);
        this.horseObjects[4].position.x += (hdx / hd) * hs * dt;
        this.horseObjects[4].position.z += (hdz / hd) * hs * dt;
      }
    }
  },

  // ── BUILD SINGLE HORSE ────────────────────────────────────
  buildHorse(x, z) {
    const group = new THREE.Group();
    const brownMat = new THREE.MeshStandardMaterial({ color: 0x7a3a10, roughness: 0.9 });
    const darkMat  = new THREE.MeshStandardMaterial({ color: 0x3a1a05, roughness: 0.9 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 1.1), brownMat);
    body.position.set(0, 0.7, 0);
    body.castShadow = true;
    group.add(body);

    // Neck
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.22), brownMat);
    neck.position.set(0, 0.98, -0.42);
    neck.rotation.x = -0.35;
    neck.castShadow = true;
    group.add(neck);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.38), brownMat);
    head.position.set(0, 1.22, -0.6);
    head.castShadow = true;
    group.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.05, 0.1, 0.05);
    [-0.07, 0.07].forEach(ex => {
      const ear = new THREE.Mesh(earGeo, brownMat);
      ear.position.set(ex, 1.36, -0.58);
      group.add(ear);
    });

    // Legs (4)
    const legGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    [[-0.18, -0.4], [0.18, -0.4], [-0.18, 0.4], [0.18, 0.4]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkMat);
      leg.position.set(lx, 0.25, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    // Tail
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), darkMat);
    tail.position.set(0, 0.78, 0.57);
    tail.rotation.x = 0.5;
    group.add(tail);

    group.position.set(x, 0, z);
    this.scene.add(group);
    return group;
  },

  // ── BUILD ALL 5 HORSES AT STABLE ──────────────────────────
  buildHorses() {
    const sx = 18, sz = 44;
    const positions = [
      [sx - 1, sz + 1], [sx + 1, sz + 1],
      [sx - 2, sz - 1], [sx + 2, sz - 1],
      [sx,     sz - 2],
    ];
    this.horseObjects = [];
    for (const [hx, hz] of positions) {
      this.horseObjects.push(this.buildHorse(hx, hz));
    }
    this.showNotification('5 horses ready at the stable!\nThey will follow you south.');
  },

  // ── SHOW YES/NO CHOICE ────────────────────────────────────
  showChoice(question, yesLabel, noLabel, yesCallback, noCallback) {
    this.choiceActive = true;

    const overlay = document.createElement('div');
    overlay.id = 'choice-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:40',
      'background:rgba(0,0,0,0.6)',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center', 'gap:18px',
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
      'background:rgba(8,6,2,0.97)',
      'border:2px solid #c9a84c',
      'border-radius:14px',
      'padding:28px 36px',
      'text-align:center',
      'max-width:360px',
      'box-shadow:0 0 30px rgba(0,0,0,0.8)',
    ].join(';');

    const qText = document.createElement('div');
    qText.textContent = question;
    qText.style.cssText = 'font-family:Crimson Text,Georgia,serif;font-size:1.1rem;color:#f5ecd0;line-height:1.6;margin-bottom:20px;';
    box.appendChild(qText);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:16px;justify-content:center;';

    const yesBtn = document.createElement('button');
    yesBtn.textContent = yesLabel;
    yesBtn.style.cssText = [
      'padding:10px 24px', 'border-radius:8px',
      'background:rgba(80,160,80,0.3)', 'border:1.5px solid #80c080',
      'color:#a0e0a0', 'font-family:Cinzel,serif', 'font-size:0.9rem',
      'cursor:pointer', 'letter-spacing:0.05em',
    ].join(';');

    const noBtn = document.createElement('button');
    noBtn.textContent = noLabel;
    noBtn.style.cssText = [
      'padding:10px 24px', 'border-radius:8px',
      'background:rgba(160,60,60,0.3)', 'border:1.5px solid #c07070',
      'color:#e0a0a0', 'font-family:Cinzel,serif', 'font-size:0.9rem',
      'cursor:pointer', 'letter-spacing:0.05em',
    ].join(';');

    const dismiss = (cb) => {
      overlay.remove();
      this.choiceActive = false;
      this.interactCooldown = 0.5;
      if (cb) cb();
    };

    yesBtn.addEventListener('click',      () => dismiss(yesCallback));
    yesBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dismiss(yesCallback); }, { passive: false });
    noBtn.addEventListener('click',       () => dismiss(noCallback));
    noBtn.addEventListener('touchstart',  (e) => { e.preventDefault(); dismiss(noCallback);  }, { passive: false });

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  },

  // ── NEEDLE THREADING MINI-GAME ────────────────────────────
  startWeavingMinigame(onSuccess, onFail) {
    this.minigameActive = true;

    const overlay = document.createElement('div');
    overlay.id = 'minigame-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:60',
      'background:rgba(0,0,0,0.88)',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center', 'gap:14px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Thread the Needle';
    title.style.cssText = 'font-family:Cinzel,serif;color:#c9a84c;font-size:1.5rem;font-weight:700;letter-spacing:0.1em;text-shadow:0 0 12px rgba(201,168,76,0.5);';
    overlay.appendChild(title);

    const instr = document.createElement('div');
    instr.textContent = 'Press [E] / Tap when the thread enters the needle eye!';
    instr.style.cssText = 'font-family:Crimson Text,Georgia,serif;font-style:italic;color:#f0e0b0;font-size:1rem;';
    overlay.appendChild(instr);

    const canvas = document.createElement('canvas');
    canvas.width  = 340;
    canvas.height = 200;
    canvas.style.cssText = 'border:2px solid #c9a84c;border-radius:10px;background:#12100a;cursor:pointer;touch-action:none;';
    overlay.appendChild(canvas);

    const status = document.createElement('div');
    status.style.cssText = 'font-family:Cinzel,serif;color:#a07830;font-size:0.9rem;letter-spacing:0.05em;';
    overlay.appendChild(status);

    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    const NX = 170, NY = 100;
    const EYE_H = 20, EYE_W = 8; // needle eye dimensions
    let phase = 0, attemptsLeft = 4, done = false;
    let rafId = null;

    const draw = () => {
      ctx.clearRect(0, 0, 340, 200);

      // Thread x position (moves left-right)
      const threadX = NX + Math.sin(phase) * 120;
      const inEye = Math.abs(threadX - NX) < EYE_W;

      // Green zone
      ctx.fillStyle = 'rgba(60,200,60,0.12)';
      ctx.fillRect(NX - EYE_W, 0, EYE_W * 2, 200);
      ctx.strokeStyle = 'rgba(60,200,60,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(NX - EYE_W, 0, EYE_W * 2, 200);

      // Needle shaft
      ctx.fillStyle = '#d4c070';
      ctx.fillRect(NX - 4, 15, 8, 170);

      // Needle eye cutout (dark hole)
      ctx.fillStyle = '#12100a';
      ctx.fillRect(NX - EYE_W, NY - EYE_H / 2, EYE_W * 2, EYE_H);
      ctx.strokeStyle = '#8a7030';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(NX - EYE_W, NY - EYE_H / 2, EYE_W * 2, EYE_H);

      // Needle point
      ctx.fillStyle = '#d4c070';
      ctx.beginPath();
      ctx.moveTo(NX - 4, 185);
      ctx.lineTo(NX + 4, 185);
      ctx.lineTo(NX, 198);
      ctx.fill();

      // Thread line
      ctx.strokeStyle = inEye ? '#60ff80' : '#c8a040';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(threadX, 0);
      ctx.lineTo(threadX, 200);
      ctx.stroke();

      // Thread dot
      ctx.fillStyle = inEye ? '#60ff80' : '#ffe060';
      ctx.beginPath();
      ctx.arc(threadX, NY, 6, 0, Math.PI * 2);
      ctx.fill();

      status.textContent = 'Attempts: ' + attemptsLeft;

      if (!done) {
        phase += 0.038;
        rafId = requestAnimationFrame(draw);
      }
    };

    const tryThread = () => {
      if (done) return;
      const threadX = NX + Math.sin(phase) * 120;
      const inEye   = Math.abs(threadX - NX) < EYE_W;

      if (inEye) {
        done = true;
        cancelAnimationFrame(rafId);
        canvas.style.borderColor = '#60ff80';
        status.textContent = 'Threaded! Well done!';
        status.style.color = '#60ff80';
        setTimeout(() => {
          overlay.remove();
          this.minigameActive = false;
          onSuccess();
        }, 700);
      } else {
        attemptsLeft--;
        canvas.style.borderColor = '#ff4040';
        setTimeout(() => { canvas.style.borderColor = '#c9a84c'; }, 300);
        if (attemptsLeft <= 0) {
          done = true;
          cancelAnimationFrame(rafId);
          status.textContent = 'Missed — speak to Benjamin to try again.';
          status.style.color = '#ff8080';
          setTimeout(() => {
            overlay.remove();
            this.minigameActive = false;
            onFail();
          }, 1200);
        }
      }
    };

    canvas.addEventListener('click', tryThread);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); tryThread(); }, { passive: false });

    const keyHandler = (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        e.preventDefault();
        tryThread();
        if (done) window.removeEventListener('keydown', keyHandler);
      }
      if (e.key === 'Escape') {
        done = true;
        cancelAnimationFrame(rafId);
        overlay.remove();
        this.minigameActive = false;
        window.removeEventListener('keydown', keyHandler);
        onFail();
      }
    };
    window.addEventListener('keydown', keyHandler);

    draw();
  },

  // ── COMPASS ───────────────────────────────────────────────
  updateCompass() {
    if (!this.elCompassFace) return;
    // Rotate face so that 'N' label points toward world north (-z)
    // player.facingAngle: 0 = facing south (+z), PI = facing north (-z)
    const deg = (Math.PI - this.player.facingAngle) * (180 / Math.PI);
    this.elCompassFace.style.transform = 'rotate(' + deg.toFixed(1) + 'deg)';
  },

  // ── SATCHEL HUD ───────────────────────────────────────────
  updateSatchelHUD() {
    const elLetters = document.getElementById('satchel-letters');
    const elCloth   = document.getElementById('satchel-cloth');
    const elTents   = document.getElementById('satchel-tents');
    const elCC      = document.getElementById('satchel-cloth-count');
    const elTC      = document.getElementById('satchel-tent-count');

    if (elLetters) elLetters.classList.toggle('hidden', !this.hasLetters);
    if (elCloth) {
      elCloth.classList.toggle('hidden', this.inventory.tentCloth === 0);
      if (elCC) elCC.textContent = this.inventory.tentCloth;
    }
    if (elTents) {
      elTents.classList.toggle('hidden', this.inventory.tents === 0);
      if (elTC) elTC.textContent = this.inventory.tents;
    }

    // Show satchel bar if player has letters
    const satchel = document.getElementById('satchel-hud');
    if (satchel && this.hasLetters) satchel.classList.remove('hidden');
  },
};

// ── STARTUP ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
