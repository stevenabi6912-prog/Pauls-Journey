// ============================================================
//  PAUL'S JOURNEYS — Game Engine
// ============================================================

const Game = {

  state: {
    currentScene: 'intro',
    playerName: 'Saul',
    playerRole: 'Pharisee · Tarsus',
    faith: 0,
    health: 100,
    companions: [],
    inventory: [],
    visitedLocations: [],
    completedJourneys: [],
    currentJourney: 'Pre-Conversion'
  },

  // ── INIT ─────────────────────────────────────────────────
  init() {
    // Check for saved game on title screen
    const saved = localStorage.getItem('paulsJourneys_v2');
    if (saved) {
      document.getElementById('continue-btn').style.display = 'block';
    }
    // Title screen is shown by default (HTML starts visible)
  },

  // ── START / CONTINUE ─────────────────────────────────────
  start(fresh = true) {
    if (fresh) {
      this.state = {
        currentScene: 'intro',
        playerName: 'Saul',
        playerRole: 'Pharisee · Tarsus',
        faith: 0,
        health: 100,
        companions: [],
        inventory: [],
        visitedLocations: [],
        completedJourneys: [],
        currentJourney: 'Pre-Conversion'
      };
    } else {
      const saved = localStorage.getItem('paulsJourneys_v2');
      if (saved) {
        this.state = JSON.parse(saved);
      }
    }

    // Hide title screen, show game
    const titleScreen = document.getElementById('title-screen');
    titleScreen.classList.add('fade-out');
    setTimeout(() => {
      titleScreen.style.display = 'none';
      document.getElementById('game-container').classList.remove('hidden');
    }, 800);

    this.renderScene(this.state.currentScene);
  },

  // ── RENDER SCENE ─────────────────────────────────────────
  renderScene(sceneId) {
    const scene = SCENES[sceneId];
    if (!scene) {
      console.error('Scene not found:', sceneId);
      return;
    }

    this.state.currentScene = sceneId;

    // Track visited locations
    if (scene.location && !this.state.visitedLocations.includes(scene.location)) {
      this.state.visitedLocations.push(scene.location);
    }

    // Update journey tracker
    if (scene.journey && scene.journey !== this.state.currentJourney) {
      this.state.currentJourney = scene.journey;
      this.showToast('New journey: ' + scene.journey);
    }

    // Save progress
    this.save();

    // ── Header ──
    document.getElementById('current-location').textContent = scene.location;
    document.getElementById('scripture-ref').textContent = scene.scripture;
    document.getElementById('journey-badge').textContent = this.state.currentJourney;

    // ── Background ──
    document.getElementById('game-container').dataset.background = scene.background || 'default';

    // ── Scene title ──
    document.getElementById('scene-title').textContent = scene.title;

    // ── Narrative text (fade in) ──
    const narrativeEl = document.getElementById('narrative-text');
    narrativeEl.style.opacity = '0';
    narrativeEl.textContent = scene.narrative;
    setTimeout(() => {
      narrativeEl.style.opacity = '1';
      narrativeEl.scrollTop = 0;
    }, 60);

    // ── Speaker / dialogue ──
    const speakerBox = document.getElementById('speaker-box');
    if (scene.character) {
      document.getElementById('speaker-name').textContent = scene.character;
      document.getElementById('dialogue-text').textContent = scene.dialogue || '';
      speakerBox.style.display = 'block';
    } else {
      speakerBox.style.display = 'none';
    }

    // ── Choices ──
    const choicesEl = document.getElementById('choices-panel');
    choicesEl.innerHTML = '';
    scene.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.style.animationDelay = `${i * 0.12}s`;
      btn.addEventListener('click', () => this.makeChoice(choice));
      choicesEl.appendChild(btn);
    });

    // ── Map + Stats ──
    this.renderMap();
    this.renderStats();
  },

  // ── MAKE CHOICE ──────────────────────────────────────────
  makeChoice(choice) {
    // Apply stat effects
    if (choice.effect) {
      if (choice.effect.faith !== undefined) {
        this.state.faith = Math.min(100, Math.max(0, this.state.faith + choice.effect.faith));
      }
      if (choice.effect.health !== undefined) {
        this.state.health = Math.min(100, Math.max(0, this.state.health + choice.effect.health));
        if (choice.effect.health < 0) this.showToast('Health reduced!');
      }
    }

    // Add companion
    if (choice.addCompanion && !this.state.companions.includes(choice.addCompanion)) {
      this.state.companions.push(choice.addCompanion);
      this.showToast(choice.addCompanion + ' joins you!');
    }

    // Remove companion
    if (choice.removeCompanion) {
      this.state.companions = this.state.companions.filter(c => c !== choice.removeCompanion);
    }

    // Add inventory item
    if (choice.addItem && !this.state.inventory.includes(choice.addItem)) {
      this.state.inventory.push(choice.addItem);
      this.showToast('Received: ' + choice.addItem);
    }

    // Name / role change (Saul → Paul)
    if (choice.nameChange) {
      this.state.playerName = choice.nameChange;
      this.showToast('You are now known as Paul!');
    }
    if (choice.roleChange) {
      this.state.playerRole = choice.roleChange;
    }

    // Complete a journey
    if (choice.completeJourney && !this.state.completedJourneys.includes(choice.completeJourney)) {
      this.state.completedJourneys.push(choice.completeJourney);
      this.showToast('Journey complete: ' + choice.completeJourney);
    }

    // Restart
    if (choice.isRestart) {
      this.restart();
      return;
    }

    // Navigate to next scene
    this.renderScene(choice.nextScene);
  },

  // ── RENDER MAP ───────────────────────────────────────────
  renderMap() {
    const visited = this.state.visitedLocations;
    const currentScene = SCENES[this.state.currentScene];
    const currentLocation = currentScene ? currentScene.location : null;

    // Update city marker classes
    document.querySelectorAll('.city-marker').forEach(marker => {
      const city = marker.dataset.city;
      marker.classList.toggle('visited', visited.includes(city));
      marker.classList.toggle('current', city === currentLocation);
    });

    // Move pulse ring to current city
    const pulse = document.getElementById('location-pulse');
    const currentMarker = document.querySelector(`.city-marker[data-city="${currentLocation}"] .city-dot`);
    if (currentMarker && pulse) {
      const cx = parseFloat(currentMarker.getAttribute('cx'));
      const cy = parseFloat(currentMarker.getAttribute('cy'));
      pulse.setAttribute('cx', cx);
      pulse.setAttribute('cy', cy);
      pulse.setAttribute('opacity', '1');
    }

    // Show journey route lines
    this.updateRouteLines();
  },

  updateRouteLines() {
    const journeys = this.state.completedJourneys;
    const current = this.state.currentJourney;

    const routeMap = {
      'First Missionary Journey':  'route-first',
      'Second Missionary Journey': 'route-second',
      'Third Missionary Journey':  'route-third',
      'Voyage to Rome':            'route-rome'
    };

    Object.entries(routeMap).forEach(([journey, id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (journeys.includes(journey) || current === journey) {
        el.setAttribute('opacity', '0.7');
      } else {
        el.setAttribute('opacity', '0');
      }
    });
  },

  // ── RENDER STATS ─────────────────────────────────────────
  renderStats() {
    const s = this.state;

    // Player name & role
    const displayName = s.playerName === 'Paul' ? 'Paul of Tarsus' : 'Saul of Tarsus';
    document.getElementById('player-name').textContent = displayName;
    document.getElementById('player-role').textContent = s.playerRole;

    // Faith bar
    document.getElementById('faith-bar').style.width = `${s.faith}%`;
    document.getElementById('faith-value').textContent = s.faith;

    // Health bar
    document.getElementById('health-bar').style.width = `${s.health}%`;
    document.getElementById('health-value').textContent = s.health;

    // Companions
    const companionsList = document.getElementById('companions');
    if (s.companions.length) {
      companionsList.innerHTML = s.companions.map(c => `<li>${c}</li>`).join('');
    } else {
      companionsList.innerHTML = '<li class="empty-entry" style="list-style:none">None yet</li>';
    }

    // Inventory
    const inventoryList = document.getElementById('inventory');
    if (s.inventory.length) {
      inventoryList.innerHTML = s.inventory.map(i => `<li>${i}</li>`).join('');
    } else {
      inventoryList.innerHTML = '<li class="empty-entry" style="list-style:none">Empty</li>';
    }

    // Completed journeys
    const completedEl = document.getElementById('completed-journeys');
    if (s.completedJourneys.length) {
      completedEl.innerHTML = s.completedJourneys.map(j => `· ${j}`).join('<br>');
      completedEl.classList.remove('empty-entry');
    } else {
      completedEl.textContent = 'None yet';
      completedEl.classList.add('empty-entry');
    }
  },

  // ── TOAST NOTIFICATION ───────────────────────────────────
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  },

  // ── SAVE / LOAD ──────────────────────────────────────────
  save() {
    try {
      localStorage.setItem('paulsJourneys_v2', JSON.stringify(this.state));
    } catch (e) {
      // Storage not available
    }
  },

  // ── RESTART ──────────────────────────────────────────────
  restart() {
    localStorage.removeItem('paulsJourneys_v2');
    this.state = {
      currentScene: 'intro',
      playerName: 'Saul',
      playerRole: 'Pharisee · Tarsus',
      faith: 0,
      health: 100,
      companions: [],
      inventory: [],
      visitedLocations: [],
      completedJourneys: [],
      currentJourney: 'Pre-Conversion'
    };
    closeMenu();
    this.renderScene('intro');
  }
};

// ── GLOBAL FUNCTIONS (called from HTML) ──────────────────────
function startGame()    { Game.start(true); }
function continueGame() { Game.start(false); }
function restartGame()  { Game.restart(); }

function showMenu() {
  document.getElementById('menu-overlay').classList.remove('hidden');
}
function closeMenu() {
  document.getElementById('menu-overlay').classList.add('hidden');
}
function continueFromMenu() {
  closeMenu();
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
