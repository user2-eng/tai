// Game Logic for Undertale-inspired Boss Battle

// Audio Manager using Web Audio API
class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playShoot() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBossShoot() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    // Noise generation for explosion/hit sound
    let bufferSize = this.ctx.sampleRate * 0.15;
    let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    let data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    let noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    let filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    
    let gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  playHeal() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  }

  playSpeedUp() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 (quick ascending sweep)
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.1);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.12);
    });
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [300, 260, 220, 180];
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.4);
    });
  }

  playVictory() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    // Simple happy retro fanfare
    const melody = [523.25, 523.25, 523.25, 523.25, 659.25, 587.33, 659.25, 783.99]; // C5 C5 C5 C5 E5 D5 E5 G5
    const durations = [0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.4];
    let elapsed = 0;
    
    melody.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + elapsed);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + elapsed + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + durations[idx]);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + elapsed);
      osc.stop(now + elapsed + durations[idx]);
      
      elapsed += durations[idx] + 0.02;
    });
  }
}

const audio = new AudioManager();

// Canvas & game configuration
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Input tracking
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  // Prevent space/arrow default behaviors (scrolling)
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Game States
const STATE_START = 'start';
const STATE_PLAYING = 'playing';
const STATE_GAMEOVER = 'gameover';
const STATE_VICTORY = 'victory';
let gameState = STATE_START;

// Speed Boost State
let speedBoostActive = false;
let speedBoostTimer = 0;
const SPEED_BOOST_DURATION = 16000; // 16 seconds

// Game Entities
let player;
let boss;
let playerBullets = [];
let bossBullets = [];
let items = [];

// Base Speed Multipliers
function getSpeedMultiplier() {
  return speedBoostActive ? 3.0 : 1.0;
}

class Player {
  constructor() {
    this.x = WIDTH / 2;
    this.y = HEIGHT - 100;
    this.size = 14; // Heart bounding size
    this.baseSpeed = 2.0;
    this.hp = 30;
    this.maxHp = 30;
    this.lastShot = 0;
    this.shootCooldown = 20000; // 20 seconds
  }

  update(dt) {
    // Movement
    let dx = 0;
    let dy = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) dx = -1;
    if (keys['ArrowRight'] || keys['KeyD']) dx = 1;
    if (keys['ArrowUp'] || keys['KeyW']) dy = -1;
    if (keys['ArrowDown'] || keys['KeyS']) dy = 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const currentSpeed = this.baseSpeed * getSpeedMultiplier();
    this.x += dx * currentSpeed;
    this.y += dy * currentSpeed;

    // Boundary constraints
    this.x = Math.max(this.size, Math.min(WIDTH - this.size, this.x));
    this.y = Math.max(this.size, Math.min(HEIGHT - this.size, this.y));

    // Shooting
    if (keys['Space']) {
      const now = Date.now();
      if (now - this.lastShot >= this.shootCooldown) {
        playerBullets.push(new PlayerBullet(this.x, this.y - this.size));
        audio.playShoot();
        this.lastShot = now;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw Heart (Undertale Soul)
    ctx.fillStyle = '#ff2a6d';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff2a6d';
    
    ctx.beginPath();
    // Heart shape math drawing
    ctx.moveTo(0, -6);
    ctx.bezierCurveTo(4, -12, 10, -10, 10, -3);
    ctx.bezierCurveTo(10, 3, 4, 8, 0, 12);
    ctx.bezierCurveTo(-4, 8, -10, 3, -10, -3);
    ctx.bezierCurveTo(-10, -10, -4, -12, 0, -6);
    ctx.fill();
    ctx.restore();
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    audio.playHit();
    
    // Update HTML HP Bar
    document.getElementById('player-hp-fill').style.width = `${(this.hp / this.maxHp) * 100}%`;

    if (this.hp <= 0) {
      gameOver();
    }
  }

  heal() {
    this.hp = this.maxHp;
    document.getElementById('player-hp-fill').style.width = '100%';
    audio.playHeal();
  }
}

class Boss {
  constructor() {
    this.x = WIDTH / 2;
    this.y = 100;
    this.radius = 45;
    this.hp = 500;
    this.maxHp = 500;
    this.shootTimer = 0;
    this.patternTimer = 0;
    this.patternIndex = 0;
    this.angle = 0;
    
    // For rendering animation
    this.hoverTime = 0;
  }

  update(dt) {
    this.hoverTime += dt * 0.003 * getSpeedMultiplier();
    this.x = WIDTH / 2 + Math.sin(this.hoverTime) * 120;
    this.y = 100 + Math.cos(this.hoverTime * 1.5) * 20;

    // Pattern control
    this.patternTimer += dt;
    // Periodically switch basic target patterns based on HP thresholds
    const hpPercent = this.hp / this.maxHp;
    
    let fireInterval = 250;
    if (hpPercent > 0.7) {
      // Phase 1: 5-bullet spread pattern
      fireInterval = 250;
      this.shootPattern1(dt, fireInterval);
    } else if (hpPercent > 0.3) {
      // Phase 2: Quad streams & targeted spread
      fireInterval = 150;
      this.shootPattern2(dt, fireInterval);
    } else {
      // Phase 3: Intense hex spirals & ring bursts
      fireInterval = 90;
      this.shootPattern3(dt, fireInterval);
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw Boss Main Body
    const hpPercent = this.hp / this.maxHp;
    const pulse = 1 + Math.sin(this.hoverTime * 4) * 0.05;
    
    // Glow effect changes intensity based on boss health phase
    let glowColor = '#05d9e8';
    if (hpPercent <= 0.3) {
      glowColor = '#ff2a6d'; // Red alert!
    } else if (hpPercent <= 0.7) {
      glowColor = '#ff851b'; // Warning!
    }

    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = '#101025';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 4;
    
    // Octagram shaped retro core
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + this.hoverTime * 0.5;
      const r = this.radius * (i % 2 === 0 ? 1 : 0.7) * pulse;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Core Eye
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(0, 0, 10 + Math.sin(this.hoverTime * 6) * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  shootPattern1(dt, interval) {
    this.shootTimer += dt;
    if (this.shootTimer >= interval) {
      this.shootTimer = 0;
      audio.playBossShoot();

      // Aimed shot directly at player (5-bullet spread)
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      
      for (let i = -2; i <= 2; i++) {
        const spreadAngle = angleToPlayer + (i * 0.15);
        bossBullets.push(new BossBullet(this.x, this.y, spreadAngle, 4));
      }
    }
  }

  shootPattern2(dt, interval) {
    this.shootTimer += dt;
    this.angle += 0.08 * getSpeedMultiplier();
    
    if (this.shootTimer >= interval) {
      this.shootTimer = 0;
      audio.playBossShoot();

      // Quad spiral streams
      for (let i = 0; i < 4; i++) {
        bossBullets.push(new BossBullet(this.x, this.y, this.angle + (i * Math.PI / 2), 3.8));
      }

      // Aimed spread shot
      if (Math.random() < 0.5) {
        const targetAngle = Math.atan2(player.y - this.y, player.x - this.x);
        for (let i = -1; i <= 1; i++) {
          bossBullets.push(new BossBullet(this.x, this.y, targetAngle + (i * 0.16), 4.5));
        }
      }
    }
  }

  shootPattern3(dt, interval) {
    this.shootTimer += dt;
    this.angle += 0.12 * getSpeedMultiplier();
    
    if (this.shootTimer >= interval) {
      this.shootTimer = 0;
      audio.playBossShoot();

      // Hex spiral streams
      for (let i = 0; i < 6; i++) {
        bossBullets.push(new BossBullet(this.x, this.y, this.angle + (i * Math.PI / 3), 4));
      }

      // Frequent circular ring burst
      if (Math.random() < 0.4) {
        const burstCount = 14;
        for (let i = 0; i < burstCount; i++) {
          const angle = (i * Math.PI * 2) / burstCount + (this.angle * 0.5);
          bossBullets.push(new BossBullet(this.x, this.y, angle, 3.2));
        }
      }
    }
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    document.getElementById('boss-hp-fill').style.width = `${(this.hp / this.maxHp) * 100}%`;
    
    if (this.hp <= 0) {
      victory();
    }
  }
}

class PlayerBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.radius = 4;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#05d9e8';
    ctx.fillStyle = '#05d9e8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class BossBullet {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.radius = 6;
  }

  update() {
    const currentSpeed = this.speed * getSpeedMultiplier();
    this.x += Math.cos(this.angle) * currentSpeed;
    this.y += Math.sin(this.angle) * currentSpeed;
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff2a6d';
    ctx.fillStyle = '#ff2a6d';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Items: 1 = Speed Up
class Item {
  constructor(x, y, type = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 12;
    this.vy = 1.2; // Falling velocity
    this.angle = 0;
  }

  update(dt) {
    this.y += this.vy * getSpeedMultiplier();
    this.angle += 0.05;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Speed Up - Lightning Bolt shape in green
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00fe9b';
    ctx.fillStyle = '#00fe9b';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(6, -2);
    ctx.lineTo(1, -2);
    ctx.lineTo(4, 10);
    ctx.lineTo(-6, 2);
    ctx.lineTo(-1, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// Item Spawn System
let itemSpawnTimer = 0;
const ITEM_SPAWN_INTERVAL = 10000; // Spawn every 10 seconds

function updateSpawners(dt) {
  itemSpawnTimer += dt;
  if (itemSpawnTimer >= ITEM_SPAWN_INTERVAL) {
    itemSpawnTimer = 0;
    
    // Random position at top-ish part of screen
    const rx = Math.random() * (WIDTH - 100) + 50;
    const ry = -20;
    
    // Always spawn Speed Up item
    items.push(new Item(rx, ry, 1));
  }

  // Update speed boost active timers
  if (speedBoostActive) {
    speedBoostTimer -= dt;
    if (speedBoostTimer <= 0) {
      speedBoostActive = false;
      document.getElementById('badge-speed').classList.add('hidden');
    }
  }
}

// Collision Checks
function checkCollisions() {
  // 1. Player bullets hitting Boss
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const pb = playerBullets[i];
    const dx = pb.x - boss.x;
    const dy = pb.y - boss.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < pb.radius + boss.radius) {
      boss.takeDamage(2);
      playerBullets.splice(i, 1);
    }
  }

  // 2. Boss bullets hitting Player
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    const bb = bossBullets[i];
    const dx = bb.x - player.x;
    // Tighter collision offset for Undertale heart (focus hitbox in center)
    const dy = bb.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < bb.radius + (player.size * 0.5)) {
      player.takeDamage(10);
      bossBullets.splice(i, 1);
    }
  }

  // 3. Player collecting Items
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const dx = item.x - player.x;
    const dy = item.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < item.radius + player.size) {
      // Speed boost
      speedBoostActive = true;
      speedBoostTimer = SPEED_BOOST_DURATION;
      document.getElementById('badge-speed').classList.remove('hidden');
      audio.playSpeedUp();
      items.splice(i, 1);
    }
  }
}

// Clean off-screen objects
function cleanupEntities() {
  playerBullets = playerBullets.filter(b => b.y > -10);
  bossBullets = bossBullets.filter(b => b.y < HEIGHT + 10 && b.x > -10 && b.x < WIDTH + 10);
  items = items.filter(item => item.y < HEIGHT + 20);
}

// Draw Polka Dot Background (matching enemy bullets in size r=6 and color #ff2a6d)
function drawPolkaDotBackground() {
  ctx.fillStyle = '#0c0c14';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ff2a6d';
  ctx.fillStyle = '#ff2a6d';

  const dotRadius = 6; // Same radius as BossBullet
  const spacing = 36;  // Polka dot grid spacing

  for (let y = spacing / 2; y < HEIGHT; y += spacing) {
    const rowOffset = (Math.floor(y / spacing) % 2 === 0) ? 0 : spacing / 2;
    for (let x = rowOffset + spacing / 2; x < WIDTH; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// Game Core Loop variables
let lastTime = 0;

function gameLoop(timestamp) {
  if (gameState !== STATE_PLAYING) return;

  if (!lastTime) lastTime = timestamp;
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  // Render Polka Dot Background (Same color & size as boss bullets)
  drawPolkaDotBackground();

  // Update logic
  player.update(dt);
  boss.update(dt);
  updateSpawners(dt);

  playerBullets.forEach(b => b.update());
  bossBullets.forEach(b => b.update());
  items.forEach(item => item.update(dt));

  checkCollisions();
  cleanupEntities();

  // Drawing
  player.draw();
  boss.draw();
  playerBullets.forEach(b => b.draw());
  bossBullets.forEach(b => b.draw());
  items.forEach(item => item.draw());

  requestAnimationFrame(gameLoop);
}

// State Control Functions
function startGame() {
  audio.init();
  gameState = STATE_PLAYING;
  lastTime = 0;
  
  // Initialize entities
  player = new Player();
  boss = new Boss();
  playerBullets = [];
  bossBullets = [];
  items = [];
  
  speedBoostActive = false;
  speedBoostTimer = 0;
  itemSpawnTimer = 0;

  // Set initial HUD displays
  document.getElementById('player-hp-fill').style.width = '100%';
  document.getElementById('boss-hp-fill').style.width = '100%';
  document.getElementById('badge-speed').classList.add('hidden');

  // Hide/Show screens
  document.getElementById('overlay-start').classList.add('hidden');
  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('overlay-victory').classList.add('hidden');

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameState = STATE_GAMEOVER;
  audio.playGameOver();
  document.getElementById('overlay-gameover').classList.remove('hidden');
}

function victory() {
  gameState = STATE_VICTORY;
  audio.playVictory();
  document.getElementById('overlay-victory').classList.remove('hidden');
}

// Event Listeners for UI buttons
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-restart').addEventListener('click', startGame);
document.getElementById('btn-restart-victory').addEventListener('click', startGame);

const muteBtn = document.getElementById('sound-toggle');
muteBtn.addEventListener('click', () => {
  const isMuted = audio.toggleMute();
  muteBtn.innerText = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
});
