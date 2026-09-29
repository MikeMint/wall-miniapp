(function() {
  // Styles injection for the app
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=JetBrains+Mono:wght@700;900&display=swap');

    :root {
      --bg: #090302;
      --brick-1: #1f0b08;
      --brick-2: #2b0f0b;
      --mortar: #080202;
      --accent: #ff4757;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body { height: 100%; overflow: hidden; background: var(--bg); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; }

    #root {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      max-width: 480px;
      margin: 0 auto;
      position: relative;
      background: #000;
      box-shadow: 0 0 50px rgba(0,0,0,0.8);
    }

    /* Warning tape header */
    .top-tape {
      flex-shrink: 0;
      height: 38px;
      background: repeating-linear-gradient(45deg, #f39c12 0 12px, #1a1a1a 12px 24px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.6);
      z-index: 10;
      border-bottom: 2px solid #000;
    }

    .tape-badge {
      background: #111;
      color: #f1c40f;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 900;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      border: 1px solid #f39c1255;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tape-days {
      background: #e74c3c;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 900;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(231,76,60,0.6);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Brick Wall Canvas & Scroller */
    .wall-viewport {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
      background:
        radial-gradient(ellipse at 50% 15%, rgba(255,200,100,0.12) 0%, rgba(0,0,0,0.85) 75%),
        radial-gradient(circle at 50% 90%, rgba(0,0,0,0.95), transparent 60%),
        repeating-linear-gradient(0deg, transparent 0 28px, var(--mortar) 28px 30px),
        repeating-linear-gradient(90deg, var(--brick-1) 0 58px, var(--mortar) 58px 60px);
      background-size: 100% 100%, 100% 100%, 60px 30px, 60px 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 16px;
      gap: 18px;
      perspective: 800px;
    }

    /* Subtle realistic brick texture overlay */
    .wall-viewport::before {
      content: "";
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
    }

    /* Particle canvas for aerosol mist */
    #particle-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
    }

    /* Graffiti Tags */
    .tag-bubble {
      position: relative;
      z-index: 3;
      max-width: 86%;
      padding: 4px 10px;
      border-radius: 6px;
      transform-origin: center center;
      animation: sprayIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: transform 0.2s;
    }

    .tag-bubble:active {
      transform: scale(1.05) !important;
    }

    .tag-text {
      font-family: 'Permanent Marker', cursive, Impact, sans-serif;
      font-size: 24px;
      line-height: 1.15;
      letter-spacing: 0.5px;
      word-break: break-word;
      filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.9)) drop-shadow(0 0 12px currentColor);
      position: relative;
    }

    .tag-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      margin-top: 4px;
      font-weight: 600;
    }

    .tag-author {
      color: rgba(255,255,255,0.9);
      font-family: 'JetBrains Mono', monospace;
    }

    .drip {
      position: absolute;
      width: 3px;
      background: currentColor;
      border-radius: 0 0 3px 3px;
      bottom: -14px;
      box-shadow: 0 0 6px currentColor;
      animation: dripDown 1.5s ease-out forwards;
    }

    @keyframes sprayIn {
      0% { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: blur(6px); }
      70% { transform: scale(1.08) rotate(2deg); filter: blur(0px); }
      100% { opacity: 1; transform: scale(1); }
    }

    @keyframes dripDown {
      0% { height: 0px; opacity: 0; }
      50% { opacity: 1; }
      100% { height: 16px; opacity: 0.85; }
    }

    /* Empty state */
    .empty-state {
      margin: auto;
      text-align: center;
      color: rgba(255,255,255,0.4);
      z-index: 3;
      padding: 20px;
    }
    .empty-state h3 { font-size: 18px; margin-bottom: 6px; color: rgba(255,255,255,0.7); }
    .empty-state p { font-size: 13px; line-height: 1.4; }

    /* Bottom Control Bar */
    .control-panel {
      flex-shrink: 0;
      background: linear-gradient(180deg, #150806 0%, #0d0403 100%);
      border-top: 1px solid #3d1410;
      padding: 8px 10px 10px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.7);
    }

    /* Color Palette */
    .palette-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .color-can {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.2);
      cursor: pointer;
      position: relative;
      transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
    }

    .color-can.active {
      transform: scale(1.28);
      border-color: #fff;
      box-shadow: 0 0 12px currentColor;
    }

    /* Input & Spray Button */
    .input-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .spray-input {
      flex: 1;
      height: 42px;
      background: rgba(0, 0, 0, 0.6);
      border: 1.5px solid #4a1914;
      border-radius: 8px;
      padding: 0 12px;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .spray-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
    }

    .spray-btn {
      height: 42px;
      padding: 0 16px;
      border-radius: 8px;
      border: none;
      background: linear-gradient(135deg, #ff4757 0%, #c0392b 100%);
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 900;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
      transition: transform 0.1s, filter 0.1s;
    }

    .spray-btn:active {
      transform: scale(0.96);
      filter: brightness(0.9);
    }
  `;
  document.head.appendChild(style);

  // App Colors
  const PALETTE = [
    { hex: '#ff3366', name: 'Cyber Red' },
    { hex: '#00ff88', name: 'Acid Green' },
    { hex: '#00e5ff', name: 'Neon Cyan' },
    { hex: '#ffd200', name: 'Electric Gold' },
    { hex: '#b026ff', name: 'Ultraviolet' },
    { hex: '#ffffff', name: 'Chalk White' }
  ];

  let selectedColor = PALETTE[0].hex;
  let tags = [];

  // Helper safe escaping
  const esc = (s) => (window.gem?.esc ? window.gem.esc(s) : String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));

  // Calculate days without commits (Day 41 on Sep 30, 2026)
  const baseTimestamp = 1787184000000; // ~Aug 20, 2026
  const daysWithoutCommits = Math.max(41, Math.floor((Date.now() - baseTimestamp) / 86400000));

  // Build DOM Structure
  const root = document.getElementById('root') || document.body;
  root.innerHTML = `
    <div class="top-tape">
      <div class="tape-badge">
        <span>🚧 ДОЛГОСТРОЙ</span>
      </div>
      <div class="tape-days">
        <span>БЕЗ КОММИТОВ:</span>
        <span id="days-counter">${daysWithoutCommits}</span>
      </div>
    </div>

    <div class="wall-viewport" id="wall-view">
      <canvas id="particle-canvas"></canvas>
      <div id="tags-container" style="display:flex;flex-direction:column;gap:16px;z-index:3;"></div>
    </div>

    <div class="control-panel">
      <div class="palette-row" id="palette-bar"></div>
      <form class="input-row" id="spray-form">
        <input class="spray-input" id="spray-text" maxlength="80" placeholder="Нацарапать на кирпичах..." autocomplete="off">
        <button type="submit" class="spray-btn" id="spray-btn">
          <span>ПШИК</span>
          <span>🎨</span>
        </button>
      </form>
    </div>
  `;

  // Render Palette
  const paletteBar = document.getElementById('palette-bar');
  PALETTE.forEach(c => {
    const btn = document.createElement('div');
    btn.className = `color-can ${c.hex === selectedColor ? 'active' : ''}`;
    btn.style.backgroundColor = c.hex;
    btn.style.color = c.hex;
    btn.title = c.name;
    btn.onclick = () => {
      selectedColor = c.hex;
      document.querySelectorAll('.color-can').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.style.setProperty('--accent', c.hex);
      try { window.gem?.haptic?.('select'); } catch(e){}
    };
    paletteBar.appendChild(btn);
  });

  // Sound Engine (Ball rattle shake + aerosol spray hiss)
  const playSpraySound = () => {
    try {
      if (window.gem?.sound?.beep) {
        // Rattle tick
        window.gem.sound.beep(600, 20, 'square', 0.2);
        setTimeout(() => window.gem.sound.beep(800, 25, 'triangle', 0.25), 50);
        // Spray hiss
        setTimeout(() => window.gem.sound.beep(300, 180, 'sawtooth', 0.4), 110);
      }
    } catch(e){}
  };

  // Aerosol Spray Particle Effect on Canvas
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  function spawnSprayParticles(x, y, color) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x || canvas.width / 2,
        y: y || canvas.height - 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 3 + 1,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  function loopParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(loopParticles);
  }
  requestAnimationFrame(loopParticles);

  // Render Wall Inscriptions
  const container = document.getElementById('tags-container');
  const wallView = document.getElementById('wall-view');

  function renderTags(list) {
    if (list) tags = list;
    if (!tags.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>🧱 Стена пока пустая</h3>
          <p>Будь первым, кто оставит свой тег баллончиком на этой стене долгостроя!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = tags.map((t, idx) => {
      const isRight = idx % 2 === 1;
      const rotation = ((idx * 7) % 11 - 5) * 1.4;
      const col = t.color || PALETTE[idx % PALETTE.length].hex;
      const author = t.name || 'Аноним';
      const text = t.text || t.label || '';
      const hasDrip = (idx % 3 === 0);

      return `
        <div class="tag-bubble" style="align-self: ${isRight ? 'flex-end' : 'flex-start'}; transform: rotate(${rotation}deg);">
          <div class="tag-text" style="color: ${col};">
            ${esc(text)}
            ${hasDrip ? `<div class="drip" style="left: ${20 + (idx * 15) % 60}%; color: ${col};"></div>` : ''}
          </div>
          <div class="tag-meta" style="justify-content: ${isRight ? 'flex-end' : 'flex-start'};">
            <span>—</span>
            <span class="tag-author">${esc(author)}</span>
          </div>
        </div>
      `;
    }).join('');

    wallView.scrollTop = wallView.scrollHeight;
  }

  // Sync Logic with Gem Server
  function mergeServerData(res) {
    if (!res) return;
    const all = res.my || [];
    if (res.bd) {
      res.bd.forEach(b => {
        const text = b.label || b.text;
        if (text && !all.some(x => (x.text || x.label) === text)) {
          all.push({ text: text, name: b.name, color: PALETTE[all.length % PALETTE.length].hex });
        }
      });
    }
    if (all.length) renderTags(all);
  }

  // Handle Submit
  const form = document.getElementById('spray-form');
  const input = document.getElementById('spray-text');

  form.onsubmit = (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    input.value = '';

    // Haptic & Sound
    try { window.gem?.haptic?.('heavy'); } catch(e){}
    playSpraySound();

    // Particle Burst
    const rect = form.getBoundingClientRect();
    spawnSprayParticles(rect.left + rect.width / 2, rect.top - 20, selectedColor);

    // Optimistic local update
    const myName = window.gem?.user?.name || 'Я';
    tags.push({ text: val, name: myName, color: selectedColor });
    renderTags();

    // Send to Gem Server
    if (window.gem?.call) {
      window.gem.call('/', { msg: val, color: selectedColor }).then(mergeServerData);
    }
  };

  // Initial Load from Gem Server
  if (window.gem?.call) {
    window.gem.call('/', { load: 1 }).then(mergeServerData);
  } else {
    // Demo mock tags if loaded outside Telegram for preview
    renderTags([
      { text: 'ГДЕ РЕЛИЗ?!', name: 'Дуров', color: '#ff3366' },
      { text: 'Пилим 24/7 (нет)', name: 'Тимлид', color: '#00ff88' },
      { text: 'Завтра точно выкатим', name: 'Стажер', color: '#00e5ff' }
    ]);
  }
})();
