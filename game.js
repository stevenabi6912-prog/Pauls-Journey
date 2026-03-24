// ============================================================
//  PAUL'S JOURNEYS — Game Engine (game.js)
//  Canvas-based top-down RPG
// ============================================================

// ── CONSTANTS ─────────────────────────────────────────────
const TILE_SIZE    = 48;
const PLAYER_SPEED = 2.8;
const CAM_LERP     = 0.1;
const SOLID_TILES  = new Set([T.WALL, T.TEMPLE_WALL, T.PALM, T.STALL]);

// ── TILE COLORS ────────────────────────────────────────────
const TILE_COLORS = {
  [T.SAND]:         { base: '#c4956a', dark: '#b4855a', light: '#d4a57a' },
  [T.WALL]:         { base: '#7a5030', dark: '#5a3010', light: '#8a6040' },
  [T.TEMPLE_WALL]:  { base: '#ddd0a0', dark: '#c8bc8a', light: '#eee0b0' },
  [T.PATH]:         { base: '#9a8870', dark: '#8a7860', light: '#aaa080' },
  [T.DOOR]:         { base: '#8b5e2a', dark: '#6b3e0a', light: '#ab7e4a' },
  [T.PALM]:         { base: '#c4956a', dark: '#b4855a', light: '#d4a57a' },
  [T.STALL]:        { base: '#c4956a', dark: '#b4855a', light: '#d4a57a' },
  [T.TEMPLE_FLOOR]: { base: '#f0ead0', dark: '#e0dac0', light: '#fff8e0' },
  [T.STEPS]:        { base: '#c0b080', dark: '#b0a070', light: '#d0c090' },
  [T.GATE]:         { base: '#7a6040', dark: '#5a4020', light: '#9a8060' },
  [T.ALTAR]:        { base: '#d0c890', dark: '#c0b880', light: '#e0d8a0' },
};

// Stall awning colors by (tx+ty)%4
const STALL_COLORS = ['#a03028', '#703090', '#285090', '#b06020'];

// ── GAME OBJECT ────────────────────────────────────────────
const Game = {

  // ── STATE ────────────────────────────────────────────────
  state: {
    player: {
      x: 12.5 * TILE_SIZE,
      y: 17.5 * TILE_SIZE,
      width: 18,
      height: 24,
      vx: 0,
      vy: 0,
      direction: 'south',
      frame: 0,
      frameTimer: 0,
      moving: false,
    },
    cam: { x: 0, y: 0 },
    keys: {},
    joy: {
      active: false,
      angle: 0,
      mag: 0,
      baseX: 0,
      baseY: 0,
      thumbDX: 0,
      thumbDY: 0,
    },
    dialogueActive: false,
    dialogueQueue: [],
    dialogueIndex: 0,
    dialogueTarget: '',
    dialogueText: '',
    dialogueTyping: false,
    typeTimer: null,
    currentNPC: null,
    hasLetters: false,
    damascusTriggered: false,
    interactCooldown: 0,
    npcs: [],
  },

  // ── INIT ────────────────────────────────────────────────
  init() {
    this.canvas  = document.getElementById('game-canvas');
    this.ctx     = this.canvas.getContext('2d');

    // Cache DOM refs
    this.elDialogueBox     = document.getElementById('dialogue-box');
    this.elDialogueSpeaker = document.getElementById('dialogue-speaker');
    this.elDialogueText    = document.getElementById('dialogue-text');
    this.elNotification    = document.getElementById('notification');
    this.elNotifText       = document.getElementById('notification-text');
    this.elQuestText       = document.getElementById('quest-text');
    this.elJoyBase         = document.getElementById('joystick-base');
    this.elJoyThumb        = document.getElementById('joystick-thumb');

    // Initial resize
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.state.keys[e.code] = true;
      // Interact on E or Space
      if (e.code === 'KeyE' || e.code === 'Space') {
        e.preventDefault();
        this.tryInteract();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.state.keys[e.code] = false;
    });

    // Dialogue click (tap anywhere on dialogue box to advance)
    this.elDialogueBox.addEventListener('click', () => {
      this.advanceDialogue();
    });
    this.elDialogueBox.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.advanceDialogue();
    });

    // Interact button (mobile)
    const interactBtn = document.getElementById('interact-btn');
    if (interactBtn) {
      interactBtn.addEventListener('click', () => this.tryInteract());
      interactBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.tryInteract();
      });
    }

    // Joystick
    this.setupJoystick();

    // Init NPCs from data
    this.state.npcs = NPCS_DATA.map(function(npc) {
      return {
        id:          npc.id,
        name:        npc.name,
        x:           (npc.tileX + 0.5) * TILE_SIZE,
        y:           (npc.tileY + 0.5) * TILE_SIZE,
        bodyColor:   npc.bodyColor,
        accentColor: npc.accentColor,
        headColor:   npc.headColor,
        isHighPriest: !!npc.isHighPriest,
        dialogues:   npc.dialogues,
        onComplete:  npc.onComplete,
        dialogueIndex: 0,
      };
    });

    // Center camera on player initially
    var p = this.state.player;
    this.state.cam.x = p.x - this.canvas.width  / 2;
    this.state.cam.y = p.y - this.canvas.height / 2;
    this.clampCamera();

    // Start loop
    this._lastTime = 0;
    requestAnimationFrame((t) => this.loop(t));
  },

  // ── RESIZE ──────────────────────────────────────────────
  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.clampCamera();
  },

  // ── JOYSTICK SETUP ──────────────────────────────────────
  setupJoystick() {
    var self  = this;
    var joy   = this.state.joy;
    var zone  = document.getElementById('joystick-zone');
    if (!zone) return;

    var touchId = null;

    zone.addEventListener('touchstart', function(e) {
      e.preventDefault();
      if (touchId !== null) return;
      var touch = e.changedTouches[0];
      touchId = touch.identifier;

      joy.active = true;
      joy.baseX  = touch.clientX;
      joy.baseY  = touch.clientY;
      joy.thumbDX = 0;
      joy.thumbDY = 0;
      joy.mag     = 0;
      joy.angle   = 0;

      // Position joystick base at touch point
      self.elJoyBase.style.display = 'block';
      self.elJoyBase.style.left    = (touch.clientX - 45) + 'px';
      self.elJoyBase.style.top     = (touch.clientY - 45) + 'px';
      self.elJoyThumb.style.transform = 'translate(-50%, -50%)';
    }, { passive: false });

    zone.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var touch = null;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touch = e.changedTouches[i];
          break;
        }
      }
      if (!touch) return;

      var dx = touch.clientX - joy.baseX;
      var dy = touch.clientY - joy.baseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var maxR = 40;

      joy.angle = Math.atan2(dy, dx);
      joy.mag   = Math.min(dist / maxR, 1);

      var clampedDist = Math.min(dist, maxR);
      joy.thumbDX = (dx / dist) * clampedDist;
      joy.thumbDY = (dy / dist) * clampedDist;

      // Move thumb inside base
      var tx = 45 + joy.thumbDX - 18;
      var ty = 45 + joy.thumbDY - 18;
      self.elJoyThumb.style.transform = 'none';
      self.elJoyThumb.style.left = tx + 'px';
      self.elJoyThumb.style.top  = ty + 'px';
    }, { passive: false });

    function endTouch(e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          joy.active  = false;
          joy.mag     = 0;
          joy.thumbDX = 0;
          joy.thumbDY = 0;
          self.elJoyBase.style.display = 'none';
          self.elJoyThumb.style.transform = 'translate(-50%, -50%)';
          self.elJoyThumb.style.left = '';
          self.elJoyThumb.style.top  = '';
          break;
        }
      }
    }

    zone.addEventListener('touchend',    endTouch, { passive: false });
    zone.addEventListener('touchcancel', endTouch, { passive: false });
  },

  // ── MAIN LOOP ────────────────────────────────────────────
  loop(time) {
    var dt = (time - this._lastTime) / (1000 / 60);
    this._lastTime = time;
    if (dt > 3)  dt = 3;
    if (dt < 0)  dt = 0;

    this.update(dt);
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  },

  // ── UPDATE ───────────────────────────────────────────────
  update(dt) {
    if (this.state.interactCooldown > 0) {
      this.state.interactCooldown -= dt;
    }

    if (!this.state.dialogueActive) {
      this.updatePlayer(dt);
    }
    this.updateCamera(dt);
  },

  // ── UPDATE PLAYER ────────────────────────────────────────
  updatePlayer(dt) {
    var s    = this.state;
    var p    = s.player;
    var keys = s.keys;
    var joy  = s.joy;

    // Gather input direction
    var dx = 0;
    var dy = 0;

    // Keyboard
    if (keys['ArrowLeft']  || keys['KeyA']) dx -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
    if (keys['ArrowUp']    || keys['KeyW']) dy -= 1;
    if (keys['ArrowDown']  || keys['KeyS']) dy += 1;

    // Joystick
    if (joy.active && joy.mag > 0.12) {
      dx += Math.cos(joy.angle) * joy.mag;
      dy += Math.sin(joy.angle) * joy.mag;
    }

    // Clamp to unit vector
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    var moving = len > 0.05;
    p.moving = moving;

    // Update direction
    if (Math.abs(dx) > Math.abs(dy)) {
      p.direction = dx > 0 ? 'east' : 'west';
    } else if (dy !== 0) {
      p.direction = dy > 0 ? 'south' : 'north';
    }

    // Walk animation
    if (moving) {
      p.frameTimer += dt;
      if (p.frameTimer >= 8) {
        p.frameTimer = 0;
        p.frame = (p.frame + 1) % 4;
      }
    } else {
      p.frame = 0;
      p.frameTimer = 0;
    }

    // Move with separate X/Y collision
    var speed = PLAYER_SPEED * dt;
    var nx = p.x + dx * speed;
    var ny = p.y + dy * speed;

    // X axis
    if (!this.collidesWithMap(nx, p.y, p.width, p.height)) {
      p.x = nx;
    }
    // Y axis
    if (!this.collidesWithMap(p.x, ny, p.width, p.height)) {
      p.y = ny;
    }

    // Check south exit (trigger Damascus Road)
    var mapH = MAP.length * TILE_SIZE;
    if (p.y + p.height / 2 > mapH - TILE_SIZE * 0.8) {
      this.triggerDamascusRoad();
    }
  },

  // ── COLLISION ────────────────────────────────────────────
  collidesWithMap(cx, cy, w, h) {
    var buf  = 2;
    var left = cx - w / 2 + buf;
    var right = cx + w / 2 - buf;
    var top   = cy - h / 2 + buf;
    var bot   = cy + h / 2 - buf;

    var corners = [
      [left,  top],
      [right, top],
      [left,  bot],
      [right, bot],
    ];

    for (var i = 0; i < corners.length; i++) {
      var wx = corners[i][0];
      var wy = corners[i][1];
      var tx = Math.floor(wx / TILE_SIZE);
      var ty = Math.floor(wy / TILE_SIZE);

      // Out of bounds = solid
      if (ty < 0 || ty >= MAP.length || tx < 0 || tx >= MAP[0].length) {
        return true;
      }

      var tile = MAP[ty][tx];

      if (SOLID_TILES.has(tile)) return true;

      // Gate is solid until player has letters
      if (tile === T.GATE && !this.state.hasLetters) return true;
    }
    return false;
  },

  // ── CAMERA ───────────────────────────────────────────────
  updateCamera(dt) {
    var p    = this.state.player;
    var cam  = this.state.cam;
    var w    = this.canvas.width;
    var h    = this.canvas.height;

    var targetX = p.x - w / 2;
    var targetY = p.y - h / 2;

    cam.x += (targetX - cam.x) * CAM_LERP;
    cam.y += (targetY - cam.y) * CAM_LERP;

    this.clampCamera();
  },

  clampCamera() {
    var cam = this.state.cam;
    var w   = this.canvas.width;
    var h   = this.canvas.height;
    var mapW = MAP[0].length * TILE_SIZE;
    var mapH = MAP.length * TILE_SIZE;

    cam.x = Math.max(0, Math.min(cam.x, mapW - w));
    cam.y = Math.max(0, Math.min(cam.y, mapH - h));
  },

  // ── INTERACT ─────────────────────────────────────────────
  tryInteract() {
    if (this.state.interactCooldown > 0) return;

    if (this.state.dialogueActive) {
      this.advanceDialogue();
      return;
    }

    // Find nearest NPC within range
    var p       = this.state.player;
    var nearest = null;
    var bestDist = 1.3 * TILE_SIZE;

    for (var i = 0; i < this.state.npcs.length; i++) {
      var npc  = this.state.npcs[i];
      var ddx  = npc.x - p.x;
      var ddy  = npc.y - p.y;
      var dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist < bestDist) {
        bestDist = dist;
        nearest  = npc;
      }
    }

    if (nearest) {
      this.startDialogue(nearest);
    }
  },

  // ── DIALOGUE ─────────────────────────────────────────────
  startDialogue(npc) {
    this.state.dialogueActive = true;
    this.state.currentNPC     = npc;
    this.state.dialogueQueue  = npc.dialogues;
    this.state.dialogueIndex  = 0;
    this.state.dialogueTyping = false;

    this.elDialogueBox.classList.remove('hidden');

    // On mobile, push dialogue box above interact button area
    this.elDialogueBox.style.paddingBottom = '';

    this.showDialogueLine(npc.dialogues[0]);
  },

  showDialogueLine(line) {
    var self = this;
    this.elDialogueSpeaker.textContent = line.speaker;
    this.elDialogueText.textContent    = '';
    this.state.dialogueText   = line.text;
    this.state.dialogueTyping = true;

    // Clear any existing timer
    if (this.state.typeTimer) {
      clearTimeout(this.state.typeTimer);
      this.state.typeTimer = null;
    }

    var index   = 0;
    var fullText = line.text;

    function typeNext() {
      if (index >= fullText.length) {
        self.state.dialogueTyping = false;
        return;
      }
      var ch = fullText[index];
      self.elDialogueText.textContent += ch;
      index++;

      // Longer pause on punctuation
      var delay = 22;
      if (ch === '.' || ch === '!' || ch === '?' || ch === ',') {
        delay = 60;
      } else if (ch === '\u2014' || ch === ':') {
        delay = 45;
      }

      self.state.typeTimer = setTimeout(typeNext, delay);
    }

    typeNext();
  },

  advanceDialogue() {
    var s = this.state;
    if (!s.dialogueActive) return;

    // If still typing: skip to full text
    if (s.dialogueTyping) {
      if (s.typeTimer) {
        clearTimeout(s.typeTimer);
        s.typeTimer = null;
      }
      s.dialogueTyping = false;
      this.elDialogueText.textContent = s.dialogueText;
      return;
    }

    // Advance to next line
    s.dialogueIndex++;
    if (s.dialogueIndex < s.dialogueQueue.length) {
      this.showDialogueLine(s.dialogueQueue[s.dialogueIndex]);
    } else {
      this.endDialogue();
    }
  },

  endDialogue() {
    var s   = this.state;
    var npc = s.currentNPC;

    if (s.typeTimer) {
      clearTimeout(s.typeTimer);
      s.typeTimer = null;
    }

    s.dialogueActive  = false;
    s.dialogueTyping  = false;
    s.dialogueQueue   = [];
    s.dialogueIndex   = 0;
    s.interactCooldown = 30;

    this.elDialogueBox.classList.add('hidden');

    // Trigger callback
    if (npc && npc.onComplete === 'receive_letters') {
      this.receiveLetters();
    }

    s.currentNPC = null;
  },

  // ── QUEST: RECEIVE LETTERS ───────────────────────────────
  receiveLetters() {
    this.state.hasLetters = true;

    // Update quest tracker
    this.elQuestText.textContent = 'Leave Jerusalem \u2014 head south through the gate';

    // Show notification
    this.elNotifText.textContent = '\ud83d\udcdc Letters Received!\nHead south to Damascus';
    this.elNotification.classList.remove('hidden');

    var self = this;
    setTimeout(function() {
      self.elNotification.classList.add('hidden');
    }, 3000);
  },

  // ── DAMASCUS ROAD CUTSCENE ───────────────────────────────
  triggerDamascusRoad() {
    if (this.state.damascusTriggered) return;
    this.state.damascusTriggered = true;

    var self = this;

    // Create fullscreen overlay
    var overlay = document.createElement('div');
    overlay.id  = 'damascus-overlay';
    overlay.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 100%',
      'height: 100%',
      'background: rgba(0,0,0,0)',
      'z-index: 100',
      'display: flex',
      'flex-direction: column',
      'align-items: center',
      'justify-content: center',
      'padding: 40px',
      'transition: background 1s ease',
      'pointer-events: none',
    ].join(';');

    var textEl = document.createElement('div');
    textEl.style.cssText = [
      'font-family: "Crimson Text", Georgia, serif',
      'font-size: 20px',
      'color: #f5ecd0',
      'text-align: center',
      'line-height: 1.7',
      'max-width: 500px',
      'opacity: 0',
      'transition: opacity 0.8s ease',
    ].join(';');
    overlay.appendChild(textEl);
    document.body.appendChild(overlay);

    // Fade to black
    setTimeout(function() {
      overlay.style.background = 'rgba(0,0,0,1)';
    }, 50);

    // Show first text at 1s
    setTimeout(function() {
      textEl.style.opacity = '1';
      textEl.innerHTML = '\u26a1 Suddenly a blinding light from heaven flashed around Saul...';
    }, 1000);

    // Show second text at 3s
    setTimeout(function() {
      textEl.style.opacity = '0';
      setTimeout(function() {
        textEl.innerHTML = '"And falling to the ground, he heard a voice saying to him,<br><em>\'Saul, Saul, why are you persecuting me?\'</em>"<br><br><span style="font-family:\'Cinzel\',serif;font-size:13px;color:#c9a84c;letter-spacing:0.1em;">\u2014 Acts 9:4</span>';
        textEl.style.opacity = '1';
      }, 800);
    }, 3000);

    // Show coming soon text at 7s
    setTimeout(function() {
      textEl.style.opacity = '0';
      setTimeout(function() {
        textEl.innerHTML = '<span style="font-family:\'Cinzel\',serif;font-size:18px;color:#f0c040;letter-spacing:0.06em;">The Damascus Road Awaits...</span><br><br><span style="font-size:15px;color:#c9a08a;font-style:italic;">[Coming Soon]</span>';
        textEl.style.opacity = '1';
      }, 800);
    }, 7000);
  },

  // ── RENDER ───────────────────────────────────────────────
  render() {
    var ctx  = this.ctx;
    var cam  = this.state.cam;
    var w    = this.canvas.width;
    var h    = this.canvas.height;

    // Clear
    ctx.fillStyle = '#0a0804';
    ctx.fillRect(0, 0, w, h);

    // World space
    ctx.save();
    ctx.translate(-cam.x, -cam.y);

    this.renderTiles(ctx);
    this.renderNPCs(ctx);
    this.renderPlayer(ctx);

    // Desktop interact hint (in world space above nearby NPC)
    var p     = this.state.player;
    var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop && !this.state.dialogueActive) {
      for (var i = 0; i < this.state.npcs.length; i++) {
        var npc  = this.state.npcs[i];
        var ddx  = npc.x - p.x;
        var ddy  = npc.y - p.y;
        var dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < 1.3 * TILE_SIZE) {
          ctx.save();
          ctx.font = '11px Cinzel, serif';
          ctx.fillStyle = 'rgba(240,192,64,0.9)';
          ctx.textAlign = 'center';
          var labelX = npc.x;
          var labelY = npc.y - TILE_SIZE * 0.9;
          // Background pill
          var tw = ctx.measureText('[E] Talk').width;
          ctx.fillStyle = 'rgba(8,5,2,0.82)';
          ctx.beginPath();
          ctx.roundRect(labelX - tw / 2 - 7, labelY - 14, tw + 14, 18, 4);
          ctx.fill();
          ctx.strokeStyle = 'rgba(201,168,76,0.7)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#f0c040';
          ctx.fillText('[E] Talk', labelX, labelY);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  },

  // ── RENDER TILES ─────────────────────────────────────────
  renderTiles(ctx) {
    var cam    = this.state.cam;
    var startX = Math.max(0, Math.floor(cam.x / TILE_SIZE));
    var startY = Math.max(0, Math.floor(cam.y / TILE_SIZE));
    var endX   = Math.min(MAP[0].length - 1, Math.ceil((cam.x + this.canvas.width)  / TILE_SIZE));
    var endY   = Math.min(MAP.length    - 1, Math.ceil((cam.y + this.canvas.height) / TILE_SIZE));

    for (var ty = startY; ty <= endY; ty++) {
      for (var tx = startX; tx <= endX; tx++) {
        var tile = MAP[ty][tx];
        var px   = tx * TILE_SIZE;
        var py   = ty * TILE_SIZE;
        this.drawTile(ctx, tile, px, py, tx, ty);
      }
    }
  },

  // ── DRAW TILE ────────────────────────────────────────────
  drawTile(ctx, tile, px, py, tx, ty) {
    var S  = TILE_SIZE;
    var S2 = S / 2;
    var c  = TILE_COLORS[tile] || TILE_COLORS[T.SAND];

    switch (tile) {

      case T.SAND: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Subtle grain marks (deterministic)
        ctx.fillStyle = c.dark;
        ctx.globalAlpha = 0.25;
        for (var i = 0; i < 4; i++) {
          var gx = px + ((tx * 7 + ty * 13 + i * 11) % (S - 4));
          var gy = py + ((tx * 11 + ty * 7 + i * 17) % (S - 4));
          ctx.fillRect(gx, gy, 2, 1);
        }
        ctx.globalAlpha = 1;
        break;
      }

      case T.WALL: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Brick pattern
        ctx.strokeStyle = c.dark;
        ctx.lineWidth   = 1;
        // Horizontal mortar line in middle
        ctx.beginPath();
        ctx.moveTo(px, py + S2);
        ctx.lineTo(px + S, py + S2);
        ctx.stroke();
        // Top half bricks (offset by ty%2)
        var offTop = (ty % 2 === 0) ? 0 : S2;
        ctx.beginPath();
        ctx.moveTo(px + offTop, py);
        ctx.lineTo(px + offTop, py + S2);
        if (offTop + S2 <= S) {
          ctx.moveTo(px + offTop + S2, py);
          ctx.lineTo(px + offTop + S2, py + S2);
        }
        // Bottom half bricks (opposite offset)
        var offBot = (ty % 2 === 0) ? S2 : 0;
        ctx.moveTo(px + offBot, py + S2);
        ctx.lineTo(px + offBot, py + S);
        if (offBot + S2 <= S) {
          ctx.moveTo(px + offBot + S2, py + S2);
          ctx.lineTo(px + offBot + S2, py + S);
        }
        ctx.stroke();
        break;
      }

      case T.TEMPLE_WALL: {
        ctx.fillStyle = c.light;
        ctx.fillRect(px, py, S, S);
        // Stone block lines
        ctx.strokeStyle = c.dark;
        ctx.lineWidth   = 1;
        ctx.globalAlpha = 0.4;
        ctx.strokeRect(px + 2, py + 2, S - 4, S2 - 2);
        ctx.strokeRect(px + 2, py + S2, S - 4, S2 - 2);
        ctx.globalAlpha = 1;
        // Left/bottom shadow edge
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(px, py, 3, S);
        ctx.fillRect(px, py + S - 3, S, 3);
        break;
      }

      case T.PATH: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Draw 2 rectangular stone blocks per tile
        ctx.strokeStyle = c.dark;
        ctx.lineWidth   = 1;
        ctx.strokeRect(px + 2, py + 2, S2 - 3, S - 4);
        ctx.strokeRect(px + S2 + 1, py + 2, S2 - 3, S - 4);
        break;
      }

      case T.DOOR: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Two vertical planks
        ctx.fillStyle = c.dark;
        ctx.fillRect(px + 2,        py + 2, S2 - 4, S - 4);
        ctx.fillRect(px + S2 + 2,   py + 2, S2 - 4, S - 4);
        // Horizontal bar in middle
        ctx.fillStyle = c.light;
        ctx.fillRect(px + 2, py + S2 - 2, S - 4, 4);
        // Metal fittings (circles)
        ctx.fillStyle = '#8a7020';
        ctx.beginPath();
        ctx.arc(px + S2 - S / 6, py + S2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + S2 + S / 6, py + S2, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case T.PALM: {
        // Sand base
        ctx.fillStyle = TILE_COLORS[T.SAND].base;
        ctx.fillRect(px, py, S, S);
        // Brown trunk
        ctx.fillStyle = '#7a4010';
        ctx.fillRect(px + S2 - 4, py + 16, 8, S - 16);
        // Green fronds radiating from top
        var frondColors = ['#2a7030', '#3a8040', '#226020'];
        var fronds = [
          [-14, -8], [14, -8], [0, -16], [-10, 2], [10, 2]
        ];
        for (var f = 0; f < fronds.length; f++) {
          ctx.fillStyle = frondColors[f % frondColors.length];
          ctx.beginPath();
          ctx.ellipse(
            px + S2 + fronds[f][0],
            py + 14 + fronds[f][1],
            10, 5,
            Math.atan2(fronds[f][1], fronds[f][0]),
            0, Math.PI * 2
          );
          ctx.fill();
        }
        break;
      }

      case T.STALL: {
        // Sand base
        ctx.fillStyle = TILE_COLORS[T.SAND].base;
        ctx.fillRect(px, py, S, S);
        // Wooden table frame
        ctx.fillStyle = '#8b5030';
        ctx.fillRect(px + 4, py + S2 - 2, S - 8, 4); // table top
        ctx.fillRect(px + 4, py + S2 + 2, 4, S2 - 6); // left leg
        ctx.fillRect(px + S - 8, py + S2 + 2, 4, S2 - 6); // right leg
        // Colorful awning at top
        var awningColor = STALL_COLORS[(tx + ty) % 4];
        ctx.fillStyle = awningColor;
        ctx.fillRect(px + 2, py + 2, S - 4, S2 - 4);
        // Awning stripes (lighter)
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        for (var stripe = 0; stripe < 3; stripe++) {
          ctx.fillRect(px + 6 + stripe * (S / 4 - 1), py + 2, 4, S2 - 4);
        }
        break;
      }

      case T.TEMPLE_FLOOR: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Grid lines every 24px (subtle)
        ctx.strokeStyle = c.light;
        ctx.lineWidth   = 0.5;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(px + S2, py);
        ctx.lineTo(px + S2, py + S);
        ctx.moveTo(px, py + S2);
        ctx.lineTo(px + S, py + S2);
        ctx.stroke();
        // Small diamond pattern in center
        ctx.globalAlpha = 0.22;
        ctx.fillStyle   = c.dark;
        ctx.save();
        ctx.translate(px + S2, py + S2);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
        ctx.globalAlpha = 1;
        break;
      }

      case T.STEPS: {
        // 4 horizontal step strips, each slightly lighter
        var stepColors = [c.dark, c.base, '#d0c090', c.light];
        for (var step = 0; step < 4; step++) {
          ctx.fillStyle = stepColors[step];
          ctx.fillRect(px, py + step * (S / 4), S, S / 4);
        }
        // Step edge shadows
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (var edge = 1; edge < 4; edge++) {
          ctx.fillRect(px, py + edge * (S / 4) - 1, S, 2);
        }
        break;
      }

      case T.GATE: {
        if (!this.state.hasLetters) {
          // Dark iron gate (locked)
          ctx.fillStyle = '#3a3020';
          ctx.fillRect(px, py, S, S);
          // 3 vertical iron bars
          ctx.fillStyle = '#505050';
          for (var bar = 0; bar < 3; bar++) {
            ctx.fillRect(px + 8 + bar * 13, py + 2, 5, S - 4);
          }
          // 2 horizontal bands
          ctx.fillStyle = '#404040';
          ctx.fillRect(px + 2, py + S / 3 - 2, S - 4, 4);
          ctx.fillRect(px + 2, py + (S * 2 / 3) - 2, S - 4, 4);
          // Lock in center
          ctx.fillStyle = '#c0a020';
          ctx.beginPath();
          ctx.arc(px + S2, py + S2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#a08018';
          ctx.fillRect(px + S2 - 4, py + S2, 8, 6);
        } else {
          // Open gate — earthy wooden frame
          ctx.fillStyle = '#a07840';
          ctx.fillRect(px, py, S, S);
          ctx.fillStyle = '#c09050';
          ctx.fillRect(px + 4, py + 2, 8, S - 4);
          ctx.fillRect(px + S - 12, py + 2, 8, S - 4);
          // Open center (dark passage)
          ctx.fillStyle = '#1a1008';
          ctx.fillRect(px + 14, py + 2, S - 28, S - 4);
        }
        break;
      }

      case T.ALTAR: {
        ctx.fillStyle = c.base;
        ctx.fillRect(px, py, S, S);
        // Stone base rectangle
        ctx.fillStyle = c.dark;
        ctx.fillRect(px + 8, py + S - 12, S - 16, 10);
        // Column body
        ctx.fillStyle = c.light;
        ctx.beginPath();
        ctx.roundRect(px + S2 - 7, py + 10, 14, S - 22, 3);
        ctx.fill();
        // Capital at top
        ctx.fillStyle = c.base;
        ctx.fillRect(px + S2 - 10, py + 6, 20, 6);
        // Column lines (decorative)
        ctx.strokeStyle = c.dark;
        ctx.lineWidth   = 0.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(px + S2 - 3, py + 16);
        ctx.lineTo(px + S2 - 3, py + S - 14);
        ctx.moveTo(px + S2 + 3, py + 16);
        ctx.lineTo(px + S2 + 3, py + S - 14);
        ctx.stroke();
        ctx.globalAlpha = 1;
        break;
      }

      default: {
        ctx.fillStyle = TILE_COLORS[T.SAND].base;
        ctx.fillRect(px, py, S, S);
        break;
      }
    }
  },

  // ── RENDER NPCs ──────────────────────────────────────────
  renderNPCs(ctx) {
    var p = this.state.player;
    for (var i = 0; i < this.state.npcs.length; i++) {
      var npc  = this.state.npcs[i];
      var ddx  = npc.x - p.x;
      var ddy  = npc.y - p.y;
      var dist = Math.sqrt(ddx * ddx + ddy * ddy);

      // Draw NPC character
      this.drawCharacter(ctx, npc.x, npc.y, npc.bodyColor, npc.accentColor, npc.headColor, 'south', 0, false, npc.isHighPriest);

      // Name label above NPC if close
      if (dist < 1.5 * TILE_SIZE) {
        ctx.save();
        ctx.font        = 'bold 11px Cinzel, serif';
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'bottom';
        var labelText = npc.name;
        var tw        = ctx.measureText(labelText).width;
        var labelX    = npc.x;
        var labelY    = npc.y - TILE_SIZE * 0.6;

        // Background
        ctx.fillStyle = 'rgba(8,5,2,0.82)';
        ctx.beginPath();
        ctx.roundRect(labelX - tw / 2 - 6, labelY - 14, tw + 12, 16, 3);
        ctx.fill();

        ctx.fillStyle = '#f0c040';
        ctx.fillText(labelText, labelX, labelY);
        ctx.restore();
      }
    }
  },

  // ── DRAW CHARACTER ───────────────────────────────────────
  drawCharacter(ctx, x, y, bodyColor, accentColor, headColor, direction, frame, isPlayer, isHighPriest) {
    ctx.save();

    var bob = (frame === 1 || frame === 3) ? -1 : 0;

    // Shadow ellipse
    ctx.globalAlpha = 0.32;
    ctx.fillStyle   = '#000';
    ctx.beginPath();
    ctx.ellipse(x, y + 11, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Body (robe) — rounded rectangle, slightly wider at bottom
    var bodyW  = isHighPriest ? 20 : 16;
    var bodyH  = isHighPriest ? 28 : 24;
    var bodyX  = x - bodyW / 2;
    var bodyY  = y - bodyH / 2 + bob;

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(bodyX, bodyY, bodyW, bodyH, [4, 4, 6, 6]);
    ctx.fill();

    // Robe hem accent
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(bodyX, bodyY + bodyH - 5, bodyW, 5);
    ctx.globalAlpha = 1;

    // Collar accent
    ctx.fillStyle = accentColor;
    ctx.fillRect(bodyX + 2, bodyY + 2, bodyW - 4, 3);

    // Head
    var headR = 8;
    var headX = x;
    var headY = bodyY - headR + 2 + bob;
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(headX, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    if (isHighPriest) {
      // High Priest headpiece: white linen band with gold accent
      ctx.fillStyle = '#f5f0e0';
      ctx.fillRect(headX - headR, headY - headR + 1, headR * 2, 7);
      ctx.fillStyle = accentColor;
      ctx.fillRect(headX - headR, headY - headR + 1, headR * 2, 2);
      ctx.fillRect(headX - 4, headY - headR - 2, 8, 4);
    } else {
      // Hair / headcloth (small dark shape)
      ctx.fillStyle = isPlayer ? '#2a1a0a' : '#3a2a10';
      ctx.beginPath();
      ctx.arc(headX, headY - 3, headR - 1, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // Simple directional indicator (darker side for direction)
    if (direction === 'east') {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(bodyX, bodyY, bodyW / 2, bodyH);
    } else if (direction === 'west') {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(bodyX + bodyW / 2, bodyY, bodyW / 2, bodyH);
    } else if (direction === 'north') {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(bodyX, bodyY + bodyH / 2, bodyW, bodyH / 2);
    }

    ctx.restore();
  },

  // ── RENDER PLAYER ────────────────────────────────────────
  renderPlayer(ctx) {
    var p = this.state.player;
    this.drawCharacter(
      ctx,
      p.x, p.y,
      '#5a4030',  // body: dark brown robe
      '#c9a84c',  // accent: gold
      '#c08050',  // head: warm skin
      p.direction,
      p.moving ? p.frame : 0,
      true,
      false
    );
  },

};

// ── BOOT ───────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function() {
  Game.init();
});
