/* =============================================================
   Digvijay's World — 2D Pixel RPG
   Fullscreen · LF2-style sprites · 8-bit Web Audio chiptune
   ============================================================= */

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // CONSTANTS
  // ─────────────────────────────────────────────
  const TILE        = 48;   // px per tile (bigger than before)
  const COLS        = 30;
  const ROWS        = 20;
  const SPEED       = 3;
  const INTERACT_DIST = 72;

  // Mutable viewport dims — set by _bindResize from actual container size
  let VW = 800;
  let VH = 600;

  const T = { WATER:0, GRASS:1, PATH:2, TREE:3, WALL:4, FLOOR:5 };
  const WALKABLE = new Set([T.GRASS, T.PATH, T.FLOOR]);
  const STATE = { SELECT:'SELECT', PLAYING:'PLAYING', DIALOGUE:'DIALOGUE' };

  // ─────────────────────────────────────────────
  // MAP DATA  (30 × 20)
  // 0=water 1=grass 2=path 3=tree 4=wall 5=floor
  // ─────────────────────────────────────────────
  /* jshint ignore:start */
  const MAP_DATA = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
    [0,4,4,4,4,4,4,4,3,3,3,3,3,3,1,1,1,3,3,3,3,4,4,4,4,4,4,4,4,0],
    [0,4,5,5,5,5,5,4,3,3,3,3,3,1,2,1,1,1,3,3,3,4,5,5,5,5,5,4,4,0],
    [0,4,5,5,5,5,5,4,3,3,3,3,3,1,2,1,1,1,3,3,3,4,5,5,5,5,5,4,4,0],
    [0,4,4,4,4,4,4,4,3,3,3,3,3,1,2,1,1,1,3,3,3,4,4,4,4,4,4,4,4,0],
    [0,3,3,3,3,3,3,3,3,3,3,3,3,1,2,1,1,1,3,3,3,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,3,1,1,2,2,2,2,2,2,2,1,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,1,2,2,2,2,2,2,2,2,2,2,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,1,2,2,2,2,2,2,2,2,2,2,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,1,2,2,2,2,2,2,2,2,2,2,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,1,2,2,2,2,2,2,2,2,2,2,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,3,1,1,2,2,2,2,2,2,2,1,1,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,3,3,3,1,2,1,1,1,2,1,3,3,3,3,3,3,3,3,3,3,0],
    [0,4,4,4,4,4,4,4,3,3,3,1,1,2,1,1,1,2,1,1,3,3,3,4,4,4,4,4,4,0],
    [0,4,5,5,5,5,5,4,3,3,1,1,1,2,1,1,1,2,1,1,1,3,3,4,5,5,5,5,4,0],
    [0,4,5,5,5,5,5,4,3,3,3,1,1,2,1,1,1,2,1,1,3,3,3,4,5,5,5,5,4,0],
    [0,4,4,4,4,4,4,4,3,3,3,3,3,2,3,3,3,2,3,3,3,4,4,4,4,4,4,4,4,0],
    [0,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,2,3,3,3,4,5,5,5,5,5,4,4,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  /* jshint ignore:end */

  // ─────────────────────────────────────────────
  // NPC DATA
  // ─────────────────────────────────────────────
  const NPC_DATA = [
    {
      id: 'digvijay', name: 'Digvijay',
      tileX: 14, tileY: 9,
      body: '#c5a47e', skin: '#d4a574', pants: '#5c3d1e', helm: '#c5a47e',
      dialogue: [
        "Welcome, traveller! I'm Digvijay — software engineer turned Gen AI creator.",
        "I've spent 10+ years building tech that powers millions. Now I build stories with AI.",
        "I'm an ENTJ — I love big ideas and making them real.",
        "Head north to see where I worked. Head south to see what I build now!",
      ],
    },
    {
      id: 'supply_chain', name: 'Supply Chain Wizard',
      tileX: 4, tileY: 3,
      body: '#f97316', skin: '#fed7aa', pants: '#7c3aed', helm: '#6b7280',
      dialogue: [
        "Welcome to the Flipkart era! Digvijay spent ~6 years here.",
        "He built the logistics platform powering millions of deliveries across India.",
        "He owned data pipelines for a Lego-style Assets Platform for supply chain.",
        "One of the cheapest supply chains in the world — partly his doing!",
      ],
    },
    {
      id: 'em_traveller', name: 'EM Traveller',
      tileX: 25, tileY: 4,
      body: '#0ea5e9', skin: '#bae6fd', pants: '#1e3a5f', helm: '#0369a1',
      dialogue: [
        "Next stop: Agoda (Booking.com) — ~2.5 years as Engineering Manager.",
        "He shaped the Affiliate API for travel partners worldwide.",
        "He also built the platform powering Citibank's white-label travel portal.",
        "His craft: leading teams, enterprise-scale APIs, global impact.",
      ],
    },
    {
      id: 'ai_alchemist', name: 'AI Alchemist',
      tileX: 4, tileY: 15,
      body: '#a855f7', skin: '#e9d5ff', pants: '#4c1d95', helm: '#c5a47e',
      dialogue: [
        "Welcome to DreamPixel — Digvijay's AI video platform!",
        "Built on Veo 3, Runway, Kling, and ElevenLabs.",
        "His studio, Xyzion AI Studios Pvt Ltd, creates AI-powered video content.",
        "Client work, AI avatars, educational series, promos — all AI-crafted.",
      ],
    },
    {
      id: 'process_sage', name: 'Process Sage',
      tileX: 6, tileY: 16,
      body: '#8b5cf6', skin: '#ddd6fe', pants: '#312e81', helm: '#7c3aed',
      dialogue: [
        "Every video follows the 5-step method:",
        "Research → Simplify → Visualize → Apply → Engage.",
        "That's how complex AI ideas become compelling stories.",
      ],
    },
    {
      id: 'sage_kalki', name: 'Sage Kalki',
      tileX: 25, tileY: 15,
      body: '#f59e0b', skin: '#fde68a', pants: '#78350f', helm: '#d97706',
      dialogue: [
        "Ancient stories, new medium. Digvijay is fascinated by Hindu mythology.",
        "Kalki, Krishna, Yamraj, cosmic cycles — all reimagined with AI visuals.",
        "His channel 'Krishna Musings' explores these eternal stories.",
      ],
    },
    {
      id: 'storyteller', name: 'Storyteller',
      tileX: 26, tileY: 16,
      body: '#10b981', skin: '#a7f3d0', pants: '#064e3b', helm: '#059669',
      dialogue: [
        "Digvijay also loves video game history — from Mario to Minecraft!",
        "Game of Thrones fan fiction, kids' bedtime stories with moral lessons...",
        "Channels: 'The Epic Loom', 'Kids', and 'Wanderlens AI'.",
      ],
    },
    {
      id: 'guild_master', name: 'Guild Master',
      tileX: 25, tileY: 18,
      body: '#6366f1', skin: '#c7d2fe', pants: '#312e81', helm: '#4338ca',
      dialogue: [
        "Want to collaborate or just say hello?",
        "GitHub: github.com/digvijay7",
        "Twitter: @_digvijay_  |  Email: digvijay91@gmail.com",
      ],
    },
  ];

  const ZONE_LABELS = [
    [1,  2,  7,  5,  'Flipkart'],
    [21, 2,  28, 5,  'Agoda'],
    [10, 7,  20, 12, 'Town Square'],
    [1,  14, 7,  17, 'DreamPixel Studio'],
    [23, 14, 28, 17, 'Content Garden'],
    [21, 17, 28, 19, 'Social Hub'],
  ];

  // ─────────────────────────────────────────────
  // 8-BIT MUSIC ENGINE (Web Audio API)
  // Look-ahead scheduler — procedural chiptune
  // ─────────────────────────────────────────────
  class MusicEngine {
    constructor() {
      this._ctx       = null;
      this._master    = null;
      this._started   = false;
      this._muted     = false;
      this._step      = 0;
      this._nextTime  = 0;
      this._interval  = null;

      // 150 BPM → 16th note = 0.1s
      this._bpm      = 150;
      this._stepTime = 60 / this._bpm / 4;
      this._steps    = 32; // 2 bars of 16 steps each

      // Note frequencies (Hz)
      const N = {
        C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
        C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
        C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
        _:0, // rest
      };

      // 32-step sequences (null = rest)
      this._melody = [
        N.C5, N._, N.E5, N._, N.G5, N._, N.E5, N._,
        N.G5, N._, N.A5, N._, N.G5, N._, N.E5, N._,
        N.C5, N._, N.E5, N._, N.D5, N._, N.F5, N._,
        N.G5, N._, N.A5, N._, N.G5, N.E5, N.D5, N.C5,
      ];
      this._bass = [
        N.C3, N._, N._, N.C3, N._, N._, N.G3, N._,
        N._, N.G3, N._, N.A3, N._, N._, N.A3, N._,
        N.F3, N._, N._, N.F3, N._, N._, N.G3, N._,
        N._, N.G3, N._, N.C3, N._, N._, N.C3, N._,
      ];
      // Arpeggio: loops C4 E4 G4
      this._arpNotes = [N.C4, N.E4, N.G4, N.C4, N.E4, N.G4, N.C4, N.E4];
      // Percussion: 1=kick, 2=snare, 0=rest (8 steps per bar, repeated)
      this._perc = [1,0,0,0, 2,0,0,0, 1,0,0,0, 2,0,1,0,
                    1,0,0,0, 2,0,0,0, 1,0,0,0, 2,0,1,0];
    }

    _ensureContext() {
      if (!this._ctx) {
        this._ctx    = new (window.AudioContext || window.webkitAudioContext)();
        this._master = this._ctx.createGain();
        this._master.gain.setValueAtTime(0.18, this._ctx.currentTime);
        this._master.connect(this._ctx.destination);
      }
    }

    start() {
      this._ensureContext();
      if (this._started) return;
      this._started  = true;
      this._nextTime = this._ctx.currentTime + 0.05;
      this._interval = setInterval(() => this._scheduleAhead(), 25);
    }

    stop() {
      if (this._interval) { clearInterval(this._interval); this._interval = null; }
      this._started = false;
    }

    toggle() {
      if (this._muted) {
        this._muted = false;
        if (this._master) this._master.gain.setValueAtTime(0.18, this._ctx.currentTime);
      } else {
        this._muted = true;
        if (this._master) this._master.gain.setValueAtTime(0, this._ctx.currentTime);
      }
    }

    get muted() { return this._muted; }

    _scheduleAhead() {
      const lookahead = 0.1; // schedule 100ms ahead
      while (this._nextTime < this._ctx.currentTime + lookahead) {
        this._scheduleStep(this._step, this._nextTime);
        this._step     = (this._step + 1) % this._steps;
        this._nextTime += this._stepTime;
      }
    }

    _scheduleStep(step, when) {
      // Melody — square wave, gentle gain
      const mFreq = this._melody[step];
      if (mFreq > 0) this._playOsc(mFreq, 'square', when, this._stepTime * 0.85, 0.12);

      // Bass — square wave, lower gain, lower freq
      const bFreq = this._bass[step];
      if (bFreq > 0) this._playOsc(bFreq, 'square', when, this._stepTime * 1.9, 0.09);

      // Arpeggio — triangle, faster decay
      const aFreq = this._arpNotes[step % 8];
      if (step % 2 === 0) this._playOsc(aFreq, 'triangle', when, this._stepTime * 0.4, 0.06);

      // Percussion
      const p = this._perc[step];
      if (p === 1) this._playNoise(when, 0.07, 80,  'lowpass');   // kick
      if (p === 2) this._playNoise(when, 0.05, 800, 'highpass');  // snare
    }

    _playOsc(freq, type, when, duration, gain) {
      const ctx  = this._ctx;
      const osc  = ctx.createOscillator();
      const env  = ctx.createGain();
      osc.type   = type;
      osc.frequency.setValueAtTime(freq, when);
      env.gain.setValueAtTime(gain, when);
      env.gain.exponentialRampToValueAtTime(0.001, when + duration);
      osc.connect(env);
      env.connect(this._master);
      osc.start(when);
      osc.stop(when + duration + 0.01);
    }

    _playNoise(when, duration, filterFreq, filterType) {
      const ctx      = this._ctx;
      const bufSize  = Math.ceil(ctx.sampleRate * 0.15);
      const buf      = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data     = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

      const src    = ctx.createBufferSource();
      src.buffer   = buf;
      const filt   = ctx.createBiquadFilter();
      filt.type    = filterType;
      filt.frequency.setValueAtTime(filterFreq, when);
      const env    = ctx.createGain();
      env.gain.setValueAtTime(0.15, when);
      env.gain.exponentialRampToValueAtTime(0.001, when + duration);
      src.connect(filt);
      filt.connect(env);
      env.connect(this._master);
      src.start(when);
      src.stop(when + duration + 0.01);
    }
  }

  // ─────────────────────────────────────────────
  // SPRITE RENDERER
  // ─────────────────────────────────────────────
  class SpriteRenderer {
    constructor(ctx) {
      this._ctx   = ctx;
      this._wf    = 0; // water frame counter
    }

    tick() { this._wf = (this._wf + 1) % 120; }

    // ── TILES ────────────────────────────────────
    drawTile(type, px, py) {
      const ctx = this._ctx;
      const s   = TILE;
      switch (type) {
        case T.WATER: {
          const sh = this._wf < 60 ? 0 : 10;
          ctx.fillStyle = `rgb(${26+sh},${54+sh},${90+sh})`;
          ctx.fillRect(px, py, s, s);
          ctx.strokeStyle = 'rgba(80,150,220,0.2)';
          ctx.lineWidth = 1;
          const off = (this._wf % 60) * 0.4;
          for (let i = 0; i < 4; i++) {
            const ry = py + 9 + i * 11 + off % 11;
            ctx.beginPath(); ctx.moveTo(px+3, ry); ctx.lineTo(px+s-3, ry); ctx.stroke();
          }
          break;
        }
        case T.GRASS: {
          ctx.fillStyle = '#3a6b4a';
          ctx.fillRect(px, py, s, s);
          ctx.fillStyle = '#4a8c5c';
          ctx.fillRect(px+5,  py+8,  5, 3);
          ctx.fillRect(px+18, py+28, 5, 3);
          ctx.fillRect(px+32, py+14, 5, 3);
          ctx.fillRect(px+10, py+38, 4, 3);
          break;
        }
        case T.PATH: {
          ctx.fillStyle = '#c4a46b';
          ctx.fillRect(px, py, s, s);
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(px+10, py+18, 14, 1);
          ctx.fillRect(px+24, py+34, 8,  1);
          ctx.fillRect(px+6,  py+40, 6,  1);
          break;
        }
        case T.TREE: {
          ctx.fillStyle = '#3a6b4a';
          ctx.fillRect(px, py, s, s);
          // trunk
          ctx.fillStyle = '#5c3d1e';
          ctx.fillRect(px+19, py+30, 9, 18);
          // canopy layers
          ctx.fillStyle = '#1e4020';
          ctx.beginPath(); ctx.arc(px+24, py+22, 18, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#2d5a27';
          ctx.beginPath(); ctx.arc(px+24, py+16, 13, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#3a7a35';
          ctx.beginPath(); ctx.arc(px+24, py+12,  8, 0, Math.PI*2); ctx.fill();
          break;
        }
        case T.WALL: {
          ctx.fillStyle = '#2a2a3a';
          ctx.fillRect(px, py, s, s);
          ctx.fillStyle = '#1a1a28';
          for (let r = 0; r < 5; r++) {
            const xoff = (r % 2) * 10;
            for (let c = 0; c < 3; c++) {
              ctx.fillRect(px + xoff + c*17, py + r*10 + 3, 14, 7);
            }
          }
          break;
        }
        case T.FLOOR: {
          ctx.fillStyle = '#3a2e1e';
          ctx.fillRect(px, py, s, s);
          ctx.fillStyle = '#2c2215';
          ctx.fillRect(px,   py+15, s, 1);
          ctx.fillRect(px,   py+30, s, 1);
          ctx.fillRect(px+24, py,   1, 15);
          ctx.fillRect(px+12, py+16, 1, 14);
          ctx.fillRect(px+36, py+16, 1, 14);
          break;
        }
        default: {
          ctx.fillStyle = '#3a6b4a';
          ctx.fillRect(px, py, s, s);
        }
      }
    }

    // ── PLAYER — LF2-style chunky sprite ─────────
    // Total sprite: ~40px wide, ~64px tall
    drawPlayer(px, py, avatarId, facing, moving, frame) {
      const ctx = this._ctx;
      const x   = Math.round(px) - 20; // centre of sprite
      const y   = Math.round(py) - 56; // sprite feet at py

      const bob = moving ? (frame % 14 < 7 ? -2 : 0) : 0;
      const legL = moving ? (frame % 14 < 7 ?  5 : 10) : 8;
      const legR = moving ? (frame % 14 < 7 ? 10 :  5) : 8;
      const armSwing = moving ? (frame % 14 < 7 ? 2 : -2) : 0;

      const AVATARS = [
        // Warrior
        { helm:'#6b7280', helmH:'#9ca3af', body:'#dc2626', bodyD:'#991b1b',
          skin:'#fbbf24', skinD:'#d97706', pants:'#374151', boots:'#1f2937',
          acc:'#c5a47e' /* sword hilt */ },
        // Mage
        { helm:'#c5a47e', helmH:'#d6b78f', body:'#7c3aed', bodyD:'#5b21b6',
          skin:'#fde68a', skinD:'#f59e0b', pants:'#4c1d95', boots:'#2e1065',
          acc:'#e9d5ff' /* staff glow */ },
        // Archer
        { helm:'#92400e', helmH:'#b45309', body:'#16a34a', bodyD:'#15803d',
          skin:'#fbbf24', skinD:'#d97706', pants:'#064e3b', boots:'#022c22',
          acc:'#d4a574' /* bow */ },
        // Healer
        { helm:'#c5a47e', helmH:'#d6b78f', body:'#e0f2fe', bodyD:'#bae6fd',
          skin:'#fde68a', skinD:'#f59e0b', pants:'#0369a1', boots:'#1e3a5f',
          acc:'#fde047' /* cross */ },
      ];
      const av = AVATARS[avatarId] || AVATARS[0];

      ctx.save();
      ctx.translate(x, y + bob);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(20, 66, 14, 5, 0, 0, Math.PI*2);
      ctx.fill();

      // ── BOOTS ──
      ctx.fillStyle = av.boots;
      ctx.fillRect(8,  56, 10, 8); // left boot
      ctx.fillRect(22, 56, 10, 8); // right boot

      // ── LEGS / PANTS ──
      ctx.fillStyle = av.pants;
      ctx.fillRect(8,  42, 10, legL); // left leg
      ctx.fillRect(22, 42, 10, legR); // right leg

      // ── BODY / TUNIC ──
      ctx.fillStyle = av.bodyD; // shadow side
      ctx.fillRect(4, 24, 32, 18);
      ctx.fillStyle = av.body;
      ctx.fillRect(4, 24, 26, 18);
      // Belt
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(4, 38, 32, 4);

      // ── ARMS ──
      const lArmY = 26 + armSwing;
      const rArmY = 26 - armSwing;
      ctx.fillStyle = av.body;
      ctx.fillRect(0,  lArmY, 6, 14); // left arm
      ctx.fillRect(34, rArmY, 6, 14); // right arm
      // Hands
      ctx.fillStyle = av.skin;
      ctx.fillRect(0,  lArmY+12, 6, 5);
      ctx.fillRect(34, rArmY+12, 6, 5);

      // ── HEAD ──
      ctx.fillStyle = av.skinD;
      ctx.fillRect(7, 10, 26, 16); // neck shadow
      ctx.fillStyle = av.skin;
      ctx.fillRect(6,  8, 26, 16); // face
      ctx.fillRect(7,  8, 22, 16); // lighter side

      // Mouth (tiny)
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(14, 20, 10, 2);

      // Eyes — direction aware
      ctx.fillStyle = '#1f2937';
      if (facing === 'left') {
        ctx.fillRect(7,  13, 5, 5);
        ctx.fillRect(15, 13, 5, 5);
      } else {
        ctx.fillRect(13, 13, 5, 5);
        ctx.fillRect(21, 13, 5, 5);
      }
      // Eye shine
      ctx.fillStyle = '#ffffff';
      if (facing === 'left') {
        ctx.fillRect(8,  13, 2, 2);
        ctx.fillRect(16, 13, 2, 2);
      } else {
        ctx.fillRect(14, 13, 2, 2);
        ctx.fillRect(22, 13, 2, 2);
      }

      // ── HELM ──
      ctx.fillStyle = av.helm;
      ctx.fillRect(4,  4, 32, 10); // main helm
      ctx.fillStyle = av.helmH;
      ctx.fillRect(4,  4, 28,  5); // helm highlight
      ctx.fillStyle = av.helm;
      ctx.fillRect(2,  8,  6, 10); // cheek guard left
      ctx.fillRect(32, 8,  6, 10); // cheek guard right

      // ── AVATAR ACCENT (weapon/item stub) ──
      ctx.fillStyle = av.acc;
      if (avatarId === 0) { // Warrior: sword hilt at hip
        ctx.fillRect(34, 34, 4, 10);
        ctx.fillRect(30, 34, 12, 3);
      } else if (avatarId === 1) { // Mage: staff glow above head
        ctx.fillStyle = av.acc;
        ctx.beginPath();
        ctx.arc(4, 8, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, 8, 2, 0, Math.PI*2);
        ctx.fill();
      } else if (avatarId === 2) { // Archer: bow on back
        ctx.strokeStyle = av.acc;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(1, 30, 14, -0.6, 0.6);
        ctx.stroke();
      } else { // Healer: cross on chest
        ctx.fillStyle = av.acc;
        ctx.fillRect(16, 26, 6, 14);
        ctx.fillRect(11, 30, 16, 5);
      }

      ctx.restore();
    }

    // ── NPC — chunky RPG sprite ───────────────
    drawNPC(px, py, npc, frame, showHint) {
      const ctx = this._ctx;
      const x   = Math.round(npc.px) - 20;
      const y   = Math.round(npc.py) - 52;
      const bob = Math.sin(frame * 0.05) * 1.5;

      ctx.save();
      ctx.translate(x, y + bob);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(20, 60, 12, 4, 0, 0, Math.PI*2);
      ctx.fill();

      // Boots
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(9,  50, 9, 8);
      ctx.fillRect(22, 50, 9, 8);

      // Legs
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(9,  38, 9, 14);
      ctx.fillRect(22, 38, 9, 14);

      // Body
      ctx.fillStyle = npc.body;
      ctx.fillRect(5,  22, 30, 18);

      // Arms
      ctx.fillStyle = npc.body;
      ctx.fillRect(1,  24, 6, 12);
      ctx.fillRect(33, 24, 6, 12);

      // Head
      ctx.fillStyle = npc.skin;
      ctx.fillRect(7,  7, 26, 16);

      // Eyes
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(11, 13, 5, 4);
      ctx.fillRect(22, 13, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 13, 2, 2);
      ctx.fillRect(23, 13, 2, 2);

      // Helm/hat
      ctx.fillStyle = npc.body;
      ctx.fillRect(4,  2, 32, 9);
      ctx.fillRect(2,  6,  6, 8);
      ctx.fillRect(32, 6,  6, 8);

      // Name tag
      const nameW = npc.name.length * 6 + 10;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(20 - nameW/2, -16, nameW, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#c5a47e';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, 20, -7);

      // [E] hint
      if (showHint) {
        ctx.fillStyle = 'rgba(197,164,126,0.9)';
        ctx.beginPath();
        ctx.roundRect(10, -30, 20, 13, 3);
        ctx.fill();
        ctx.fillStyle = '#121212';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('[E]', 20, -21);
      }

      ctx.restore();
    }
  }

  // ─────────────────────────────────────────────
  // CAMERA
  // ─────────────────────────────────────────────
  class Camera {
    constructor() { this.x = 0; this.y = 0; }

    follow(playerPx, playerPy) {
      const tx = playerPx - VW / 2;
      const ty = playerPy - VH / 2;
      this.x = Math.max(0, Math.min(COLS * TILE - VW, tx));
      this.y = Math.max(0, Math.min(ROWS * TILE - VH, ty));
    }
  }

  // ─────────────────────────────────────────────
  // PLAYER
  // ─────────────────────────────────────────────
  class Player {
    constructor(avatarId) {
      this.avatarId = avatarId;
      this.px       = 14 * TILE + TILE / 2;
      this.py       = 10 * TILE + TILE;
      this.facing   = 'right';
      this.moving   = false;
      this.frame    = 0;
    }

    move(dx, dy) {
      const nx = this.px + dx * SPEED;
      const ny = this.py + dy * SPEED;
      const hw = 14; // half-width hitbox

      const clearX = this._clear(nx - hw, this.py - 8) && this._clear(nx + hw, this.py - 8)
                  && this._clear(nx - hw, this.py + 2)  && this._clear(nx + hw, this.py + 2);
      const clearY = this._clear(this.px - hw, ny - 8)  && this._clear(this.px + hw, ny - 8)
                  && this._clear(this.px - hw, ny + 2)   && this._clear(this.px + hw, ny + 2);

      if (clearX) this.px = nx;
      if (clearY) this.py = ny;

      this.moving = (dx !== 0 || dy !== 0) && (clearX || clearY);
      if (dx < 0) this.facing = 'left';
      if (dx > 0) this.facing = 'right';
      if (this.moving) this.frame++;
    }

    _clear(px, py) {
      const c = Math.floor(px / TILE);
      const r = Math.floor(py / TILE);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return false;
      return WALKABLE.has(MAP_DATA[r][c]);
    }

    draw(renderer) {
      renderer.drawPlayer(this.px, this.py, this.avatarId, this.facing, this.moving, this.frame);
    }
  }

  // ─────────────────────────────────────────────
  // NPC
  // ─────────────────────────────────────────────
  class NPC {
    constructor(data) {
      this._data = data;
      this.px    = data.tileX * TILE + TILE / 2;
      this.py    = data.tileY * TILE + TILE;
    }

    distanceTo(px, py) {
      const dx = this.px - px;
      const dy = this.py - py;
      return Math.sqrt(dx*dx + dy*dy);
    }

    get name()     { return this._data.name; }
    get dialogue() { return this._data.dialogue; }

    draw(renderer, frame, showHint) {
      renderer.drawNPC(this.px, this.py, this._data, frame, showHint);
    }
  }

  // ─────────────────────────────────────────────
  // DIALOGUE SYSTEM
  // ─────────────────────────────────────────────
  class DialogueSystem {
    constructor() {
      this.active    = false;
      this._lines    = [];
      this._lineIdx  = 0;
      this._charIdx  = 0;
      this._timer    = 0;
      this._delay    = 2; // frames per char
      this._npcName  = '';
    }

    start(name, lines) {
      this.active    = true;
      this._npcName  = name;
      this._lines    = lines;
      this._lineIdx  = 0;
      this._charIdx  = 0;
      this._timer    = 0;
    }

    advance() {
      const cur = this._lines[this._lineIdx] || '';
      if (this._charIdx < cur.length) {
        this._charIdx = cur.length;
      } else if (this._lineIdx < this._lines.length - 1) {
        this._lineIdx++;
        this._charIdx = 0;
        this._timer   = 0;
      } else {
        this.active = false;
      }
    }

    update() {
      if (!this.active) return;
      const cur = this._lines[this._lineIdx] || '';
      if (this._charIdx < cur.length) {
        if (++this._timer >= this._delay) { this._charIdx++; this._timer = 0; }
      }
    }

    draw(ctx) {
      if (!this.active) return;
      const bH  = 100;
      const bY  = VH - bH - 12;
      const pad = 16;
      const bW  = VW - 24;

      ctx.fillStyle = 'rgba(8,8,18,0.93)';
      ctx.strokeStyle = '#c5a47e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(12, bY, bW, bH, 6);
      ctx.fill();
      ctx.stroke();

      // Name
      ctx.fillStyle = '#c5a47e';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(this._npcName, pad + 4, bY + 20);

      ctx.fillStyle = 'rgba(197,164,126,0.3)';
      ctx.fillRect(pad, bY + 24, bW - pad*2, 1);

      // Text
      const vis  = (this._lines[this._lineIdx] || '').slice(0, this._charIdx);
      const wrap = this._wrap(vis, bW - pad*2 - 10, ctx);
      ctx.fillStyle = '#f0ede8';
      ctx.font = '12px monospace';
      wrap.forEach((line, i) => ctx.fillText(line, pad + 4, bY + 42 + i * 16));

      // Footer hint
      const cur = this._lines[this._lineIdx] || '';
      if (this._charIdx >= cur.length) {
        const isLast = this._lineIdx === this._lines.length - 1;
        ctx.fillStyle = '#c5a47e';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(isLast ? '[ E · Space · close ]' : '[ E · Space · next ]', 12 + bW - 8, bY + bH - 8);
      }
      ctx.fillStyle = 'rgba(197,164,126,0.45)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${this._lineIdx+1}/${this._lines.length}`, pad + 4, bY + bH - 8);
    }

    _wrap(text, maxW, ctx) {
      const words = text.split(' ');
      const lines = [];
      let cur = '';
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
        else cur = test;
      }
      if (cur) lines.push(cur);
      return lines;
    }
  }

  // ─────────────────────────────────────────────
  // MOBILE D-PAD
  // ─────────────────────────────────────────────
  class MobileControls {
    constructor(canvas) {
      this._canvas = canvas;
      this.up = false; this.down = false;
      this.left = false; this.right = false;
      this.interact = false;
      this._cx   = 70;
      this._cy   = () => VH - 80;
      this._ibtn = { x: () => VW - 60, y: () => VH - 80, r: 22 };

      canvas.addEventListener('touchstart', e => this._handle(e, true),  { passive: false });
      canvas.addEventListener('touchend',   e => this._handle(e, false), { passive: false });
      canvas.addEventListener('touchmove',  e => this._handle(e, true),  { passive: false });
    }

    _handle(e, isDown) {
      e.preventDefault();
      this.up=false; this.down=false; this.left=false; this.right=false; this.interact=false;
      for (const t of e.touches) {
        const rect = this._canvas.getBoundingClientRect();
        const tx = (t.clientX - rect.left) * (VW / rect.width);
        const ty = (t.clientY - rect.top)  * (VH / rect.height);
        const cx = this._cx, cy = this._cy();
        const dx = tx - cx, dy = ty - cy;
        if (Math.abs(dx) < 54 && Math.abs(dy) < 54 && isDown) {
          if (Math.abs(dy) > Math.abs(dx)) { dy < 0 ? (this.up=true) : (this.down=true); }
          else                              { dx < 0 ? (this.left=true) : (this.right=true); }
        }
        const ix = tx - this._ibtn.x(), iy = ty - this._ibtn.y();
        if (Math.sqrt(ix*ix+iy*iy) < this._ibtn.r + 12 && isDown) this.interact = true;
      }
    }

    draw(ctx) {
      const a   = 0.5;
      const cx  = this._cx, cy  = this._cy();
      const dirs = [
        { l:'▲', dx:0,  dy:-40 }, { l:'▼', dx:0,  dy:40 },
        { l:'◀', dx:-40,dy:0  }, { l:'▶', dx:40, dy:0  },
      ];
      dirs.forEach(d => {
        ctx.fillStyle = `rgba(197,164,126,${a})`;
        ctx.beginPath(); ctx.arc(cx+d.dx, cy+d.dy, 18, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(d.l, cx+d.dx, cy+d.dy);
      });
      const ix = this._ibtn.x(), iy = this._ibtn.y(), ir = this._ibtn.r;
      ctx.fillStyle = `rgba(99,102,241,${a})`;
      ctx.beginPath(); ctx.arc(ix, iy, ir, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('E', ix, iy);
    }
  }

  // ─────────────────────────────────────────────
  // CHARACTER SELECT
  // ─────────────────────────────────────────────
  class CharacterSelect {
    constructor(canvas, ctx) {
      this._canvas   = canvas;
      this._ctx      = ctx;
      this._selected = 0;
      this._hovered  = -1;
      this._frame    = 0;
      this._onSelect = null;

      canvas.addEventListener('mousemove', e => {
        const {x,y} = this._coords(e);
        this._hovered = -1;
        for (let i=0; i<4; i++) { const r=this._card(i); if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){ this._hovered=i; break; } }
      });
      canvas.addEventListener('click', e => {
        const {x,y} = this._coords(e);
        for (let i=0; i<4; i++) { const r=this._card(i); if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){ this._selected=i; return; } }
        const btn = this._startBtn();
        if (x>=btn.x && x<=btn.x+btn.w && y>=btn.y && y<=btn.y+btn.h && this._onSelect)
          this._onSelect(this._selected);
      });
    }

    onSelect(cb) { this._onSelect = cb; }

    _coords(e) {
      const r = this._canvas.getBoundingClientRect();
      return { x: (e.clientX-r.left)*(VW/r.width), y: (e.clientY-r.top)*(VH/r.height) };
    }

    _card(i) {
      const cols=2, cW=130, cH=150, gX=24, gY=24;
      const sX = (VW - (cols*cW + (cols-1)*gX)) / 2;
      const sY = VH/2 - 120;
      return { x: sX+(i%cols)*(cW+gX), y: sY+Math.floor(i/cols)*(cH+gY), w:cW, h:cH };
    }

    _startBtn() {
      return { x: VW/2-90, y: VH/2+130, w:180, h:42 };
    }

    update() { this._frame++; }

    draw(renderer) {
      const ctx = this._ctx;
      // Background
      ctx.fillStyle = '#0d0d1a';
      ctx.fillRect(0, 0, VW, VH);

      // Starfield
      const stars=[[80,40],[200,90],[380,25],[520,70],[650,110],[100,200],[420,160],[280,230],[600,50]];
      stars.forEach(([sx,sy]) => {
        const p = Math.abs(Math.sin(this._frame*0.025 + sx*0.1));
        ctx.fillStyle = `rgba(255,255,255,${0.15 + p*0.55})`;
        ctx.fillRect(sx,sy,3,3);
      });

      // Title
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#c5a47e';
      ctx.fillText("DIGVIJAY'S WORLD", VW/2, VH/2 - 160);
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText('Choose your traveller to begin the adventure', VW/2, VH/2 - 130);

      const AVATARS = [
        { label:'Warrior', desc:'Bold & Brave',   body:'#dc2626', skin:'#fbbf24', helm:'#6b7280', pants:'#374151' },
        { label:'Mage',    desc:'Wise & Curious', body:'#7c3aed', skin:'#fde68a', helm:'#c5a47e', pants:'#4c1d95' },
        { label:'Archer',  desc:'Swift & Sharp',  body:'#16a34a', skin:'#fbbf24', helm:'#92400e', pants:'#064e3b' },
        { label:'Healer',  desc:'Kind & Creative',body:'#e0f2fe', skin:'#fde68a', helm:'#c5a47e', pants:'#0369a1' },
      ];

      AVATARS.forEach((av, i) => {
        const r  = this._card(i);
        const sel = i === this._selected;
        const hov = i === this._hovered;

        ctx.fillStyle   = sel ? 'rgba(197,164,126,0.18)' : 'rgba(255,255,255,0.04)';
        ctx.strokeStyle = sel ? '#c5a47e' : (hov ? 'rgba(197,164,126,0.4)' : 'rgba(255,255,255,0.08)');
        ctx.lineWidth   = sel ? 2 : 1;
        ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 6); ctx.fill(); ctx.stroke();

        // Mini sprite (scaled down version of LF2 sprite)
        ctx.save();
        ctx.translate(r.x + r.w/2 - 15, r.y + 16);
        ctx.scale(0.75, 0.75);

        // Draw simplified sprite preview
        ctx.fillStyle = '#2a1a0a'; ctx.fillRect(9,50,9,8); ctx.fillRect(22,50,9,8); // boots
        ctx.fillStyle = av.pants;  ctx.fillRect(9,38,9,12); ctx.fillRect(22,38,9,12); // legs
        ctx.fillStyle = av.body;   ctx.fillRect(5,22,30,18); // body
        ctx.fillStyle = av.body;   ctx.fillRect(1,24,6,12); ctx.fillRect(33,24,6,12); // arms
        ctx.fillStyle = av.skin;   ctx.fillRect(6,8,26,16); // head
        ctx.fillStyle = '#1f2937'; ctx.fillRect(11,13,5,4); ctx.fillRect(22,13,5,4); // eyes
        ctx.fillStyle = av.helm;   ctx.fillRect(4,2,32,9); // helm
        ctx.fillStyle = '#ffffff'; ctx.fillRect(12,13,2,2); ctx.fillRect(23,13,2,2); // eye shine

        ctx.restore();

        ctx.fillStyle = sel ? '#c5a47e' : '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(av.label, r.x + r.w/2, r.y + 110);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px monospace';
        ctx.fillText(av.desc, r.x + r.w/2, r.y + 126);
        if (sel) {
          ctx.fillStyle = '#c5a47e'; ctx.font = '11px monospace';
          ctx.fillText('✓ selected', r.x + r.w/2, r.y + 143);
        }
      });

      // Start button
      const btn  = this._startBtn();
      const puls = 0.8 + Math.abs(Math.sin(this._frame * 0.05)) * 0.2;
      ctx.fillStyle = `rgba(197,164,126,${puls})`;
      ctx.strokeStyle = '#c5a47e';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#121212';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▶  BEGIN ADVENTURE', VW/2, btn.y + 27);

      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '10px monospace';
      ctx.fillText('WASD / Arrow Keys to move  ·  E or Space to talk', VW/2, VH - 18);
    }
  }

  // ─────────────────────────────────────────────
  // GAME — main engine
  // ─────────────────────────────────────────────
  class Game {
    constructor(canvas) {
      this._canvas  = canvas;
      this._ctx     = canvas.getContext('2d');
      this._state   = STATE.SELECT;
      this._frame   = 0;
      this._keys    = {};
      this._iPress  = false; // interact pressed this frame
      this._iCons   = false; // interact consumed (prevent repeat)

      this._renderer   = new SpriteRenderer(this._ctx);
      this._camera     = new Camera();
      this._player     = null;
      this._npcs       = NPC_DATA.map(d => new NPC(d));
      this._dialogue   = new DialogueSystem();
      this._mobile     = new MobileControls(canvas);
      this._charSelect = new CharacterSelect(canvas, this._ctx);
      this._music      = new MusicEngine();
      this._nearNPC    = null;
      this._isTouch    = false;

      // Music toggle hit area (top-right)
      this._musicBtn = { x: VW - 48, y: 10, w: 36, h: 28 };

      this._charSelect.onSelect(id => {
        this._player = new Player(id);
        this._state  = STATE.PLAYING;
        this._music.start();
      });

      this._bindKeys();
      this._bindResize(canvas);
      window.addEventListener('touchstart', () => { this._isTouch = true; }, { once: true });
    }

    _bindKeys() {
      window.addEventListener('keydown', e => {
        this._keys[e.code] = true;
        if ((e.code === 'KeyE' || e.code === 'Space') && !this._iCons) this._iPress = true;
        if (e.code === 'Escape' && this._state === STATE.DIALOGUE) {
          this._dialogue.active = false; this._state = STATE.PLAYING;
        }
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))
          e.preventDefault();
        // Start music on first keypress (browser autoplay policy)
        this._music.start();
      });
      window.addEventListener('keyup', e => {
        this._keys[e.code] = false;
        if (e.code === 'KeyE' || e.code === 'Space') { this._iCons = false; this._iPress = false; }
      });

      // Music toggle + character select click
      this._canvas.addEventListener('click', e => {
        const rect = this._canvas.getBoundingClientRect();
        const cx = (e.clientX - rect.left) * (VW / rect.width);
        const cy = (e.clientY - rect.top)  * (VH / rect.height);
        const mb = this._musicBtn;
        if (cx >= mb.x && cx <= mb.x+mb.w && cy >= mb.y && cy <= mb.y+mb.h) {
          this._music.toggle();
        }
        // Start music on first click (browser autoplay policy)
        this._music.start();
      });
    }

    _bindResize(canvas) {
      const container = canvas.parentElement;
      const resize = () => {
        // Read the CSS-rendered size of #game-world (reliable on all displays)
        VW = container.offsetWidth  || window.innerWidth;
        VH = container.offsetHeight || window.innerHeight;
        // Pixel buffer matches the CSS display size exactly
        canvas.width  = VW;
        canvas.height = VH;
        this._musicBtn = { x: VW - 48, y: 10, w: 36, h: 28 };
      };
      window.addEventListener('resize', resize);
      // Delay one frame so CSS fixed layout has settled before we read offsetWidth
      requestAnimationFrame(resize);
    }

    start() {
      const loop = () => { this._update(); this._render(); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }

    _update() {
      this._frame++;
      this._renderer.tick();

      if (this._state === STATE.SELECT) {
        this._charSelect.update();
        return;
      }

      if (this._state === STATE.DIALOGUE) {
        this._dialogue.update();
        const want = this._iPress || this._mobile.interact;
        if (want && !this._iCons) {
          this._iCons = true; this._iPress = false;
          this._dialogue.advance();
          if (!this._dialogue.active) this._state = STATE.PLAYING;
        }
        return;
      }

      // PLAYING
      let dx = 0, dy = 0;
      if (this._keys['ArrowLeft']  || this._keys['KeyA'] || this._mobile.left)  dx = -1;
      if (this._keys['ArrowRight'] || this._keys['KeyD'] || this._mobile.right) dx =  1;
      if (this._keys['ArrowUp']    || this._keys['KeyW'] || this._mobile.up)    dy = -1;
      if (this._keys['ArrowDown']  || this._keys['KeyS'] || this._mobile.down)  dy =  1;
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      this._player.move(dx, dy);
      this._camera.follow(this._player.px, this._player.py);

      // Nearest NPC check
      let nearDist = Infinity;
      this._nearNPC = null;
      for (const npc of this._npcs) {
        const d = npc.distanceTo(this._player.px, this._player.py);
        if (d < nearDist) { nearDist = d; this._nearNPC = npc; }
      }
      if (nearDist > INTERACT_DIST) this._nearNPC = null;

      // Interact
      const want = this._iPress || this._mobile.interact;
      if (want && !this._iCons && this._nearNPC) {
        this._iCons = true; this._iPress = false;
        this._dialogue.start(this._nearNPC.name, this._nearNPC.dialogue);
        this._state = STATE.DIALOGUE;
      } else if (!want) {
        this._iCons = false;
      }
    }

    _render() {
      const ctx = this._ctx;
      ctx.clearRect(0, 0, VW, VH);

      if (this._state === STATE.SELECT) {
        this._charSelect.draw(this._renderer);
        return;
      }

      ctx.save();
      ctx.translate(-this._camera.x, -this._camera.y);
      this._drawMap();
      for (const npc of this._npcs) npc.draw(this._renderer, this._frame, npc === this._nearNPC && this._state === STATE.PLAYING);
      this._player.draw(this._renderer);
      ctx.restore();

      this._drawHUD();
      this._dialogue.draw(ctx);
      if (this._isTouch) this._mobile.draw(ctx);
    }

    _drawMap() {
      const startC = Math.max(0, Math.floor(this._camera.x / TILE) - 1);
      const endC   = Math.min(COLS-1, Math.ceil((this._camera.x + VW) / TILE) + 1);
      const startR = Math.max(0, Math.floor(this._camera.y / TILE) - 1);
      const endR   = Math.min(ROWS-1, Math.ceil((this._camera.y + VH) / TILE) + 1);

      for (let r = startR; r <= endR; r++)
        for (let c = startC; c <= endC; c++)
          this._renderer.drawTile(MAP_DATA[r][c], c*TILE, r*TILE);

      this._drawZones();
    }

    _drawZones() {
      const ctx = this._ctx;
      const zones = [
        { c:[1,7],  r:[2,5],  col:'rgba(249,115,22,0.2)',  lbl:'FLIPKART ERA' },
        { c:[21,28],r:[2,5],  col:'rgba(14,165,233,0.2)',  lbl:'AGODA' },
        { c:[1,7],  r:[14,17],col:'rgba(168,85,247,0.2)',  lbl:'DREAMPIXEL' },
        { c:[23,28],r:[14,17],col:'rgba(245,158,11,0.2)',  lbl:'CONTENT GARDEN' },
        { c:[21,28],r:[17,19],col:'rgba(99,102,241,0.2)',  lbl:'SOCIAL HUB' },
      ];
      zones.forEach(z => {
        const px = z.c[0]*TILE, py = z.r[0]*TILE;
        const pw = (z.c[1]-z.c[0]+1)*TILE, ph = (z.r[1]-z.r[0]+1)*TILE;
        ctx.fillStyle = z.col;
        ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(z.lbl, px + pw/2, py + 14);
      });
    }

    _drawHUD() {
      const ctx = this._ctx;

      // Zone label
      const zone = this._getZone();
      if (zone) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath(); ctx.roundRect(VW/2 - 90, 10, 180, 24, 4); ctx.fill();
        ctx.fillStyle = '#c5a47e';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(zone, VW/2, 27);
      }

      // Music toggle button
      const mb = this._musicBtn;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.strokeStyle = 'rgba(197,164,126,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(mb.x, mb.y, mb.w, mb.h, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = this._music.muted ? 'rgba(255,255,255,0.35)' : '#c5a47e';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this._music.muted ? '🔇' : '♪', mb.x + mb.w/2, mb.y + mb.h/2);
      ctx.textBaseline = 'alphabetic';
    }

    _getZone() {
      if (!this._player) return null;
      const c = Math.floor(this._player.px / TILE);
      const r = Math.floor(this._player.py / TILE);
      for (const [c1,r1,c2,r2,lbl] of ZONE_LABELS) {
        if (c>=c1 && c<=c2 && r>=r1 && r<=r2) return lbl;
      }
      return null;
    }
  }

  // ─────────────────────────────────────────────
  // ENTRY POINT
  // ─────────────────────────────────────────────
  function init() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const game = new Game(canvas);
    game.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
