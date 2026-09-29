(function() {
  function startWallApp() {
    if (window._wallAppStarted) return;
    window._wallAppStarted = true;

    // Check guest
    if (window.gem?.guest?.()) return;

    // Inject styles
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
      html, body {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: var(--bg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #fff;
      }

      #root {
        position: fixed;
        top: 48px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        max-width: 480px;
        margin: 0 auto;
        background: #000;
        overflow: hidden;
      }

      /* Warning tape header */
      .top-tape {
        flex-shrink: 0;
        height: 32px;
        background: repeating-linear-gradient(45deg, #f39c12 0 10px, #1a1a1a 10px 20px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.7);
        z-index: 10;
        border-bottom: 2px solid #000;
      }

      .tape-badge {
        background: #111;
        color: #f1c40f;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 11px;
        padding: 2px 8px;
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
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(231,76,60,0.6);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Brick Wall Viewport */
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
        padding: 14px;
        gap: 16px;
      }

      /* Particle canvas for aerosol mist */
      #particle-canvas {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }

      /* Tags */
      .tag-bubble {
        position: relative;
        z-index: 3;
        max-width: 86%;
        padding: 4px 8px;
        border-radius: 6px;
        transform-origin: center center;
        animation: sprayIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .tag-text {
        font-family: 'Permanent Marker', cursive, Impact, sans-serif;
        font-size: 22px;
        line-height: 1.15;
        letter-spacing: 0.5px;
        word-break: break-word;
        filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.9)) drop-shadow(0 0 10px currentColor);
        position: relative;
      }

      .tag-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: rgba(255,255,255,0.65);
        margin-top: 3px;
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
        bottom: -12px;
        box-shadow: 0 0 6px currentColor;
        animation: dripDown 1.5s ease-out forwards;
      }

      @keyframes sprayIn {
        0% { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: blur(5px); }
        100% { opacity: 1; transform: scale(1); }
      }

      @keyframes dripDown {
        0% { height: 0px; opacity: 0; }
        50% { opacity: 1; }
        100% { height: 14px; opacity: 0.85; }
      }

      .empty-state {
        margin: auto;
        text-align: center;
        color: rgba(255,255,255,0.4);
        z-index: 3;
        padding: 20px;
      }
      .empty-state h3 { font-size: 18px; margin-bottom: 6px; color: rgba(255,255,255,0.7); }
      .empty-state p { font-size: 13px; line-height: 1.4; }

      /* Bottom Control Panel */
      .control-panel {
        flex-shrink: 0;
        background: #140705;
        border-top: 1.5px solid #3d1410;
        padding: 8px 10px max(14px, env(safe-area-inset-bottom, 14px)) 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 50;
        box-shadow: 0 -4px 25px rgba(0,0,0,0.85);
      }

      .palette-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .color-can {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        cursor: pointer;
        position: relative;
        transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
      }

      .color-can.active {
        transform: scale(1.3);
        border-color: #fff;
        box-shadow: 0 0 12px currentColor;
      }

      .input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .spray-input {
        flex: 1;
        height: 42px;
        background: #000;
        border: 1.5px solid #4a1914;
        border-radius: 8px;
        padding: 0 12px;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        outline: none;
      }

      .spray-input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.4);
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
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
      }

      .spray-btn:active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(style);

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

    const esc = (s) => (window.gem?.esc ? window.gem.esc(s) : String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));

    // 41 days on Sep 30, 2026
    const baseTimestamp = 1787184000000;
    const daysWithoutCommits = Math.max(41, Math.floor((Date.now() - baseTimestamp) / 86400000));

    let root = document.getElementById('root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="top-tape">
        <div class="tape-badge">
          <span>🚧 ГЕМОСТРОЙ</span>
        </div>
        <div class="tape-days">
          <span>БЕЗ КОММИТОВ:</span>
          <span id="days-counter">${daysWithoutCommits}</span>
        </div>
      </div>

      <div class="wall-viewport" id="wall-view">
        <canvas id="particle-canvas"></canvas>
        <div id="tags-container" style="display:flex;flex-direction:column;gap:14px;z-index:3;"></div>
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

    // Palette
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

    // Sound
    const playSpraySound = () => {
      try {
        if (window.gem?.sound?.beep) {
          window.gem.sound.beep(600, 20, 'square', 0.2);
          setTimeout(() => window.gem.sound.beep(800, 25, 'triangle', 0.25), 50);
          setTimeout(() => window.gem.sound.beep(300, 180, 'sawtooth', 0.4), 110);
        }
      } catch(e){}
    };

    // Canvas Particles
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 150);

    function spawnSprayParticles(x, y, color) {
      for (let i = 0; i < 35; i++) {
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
      if (!ctx || !canvas) return;
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

    // Tags rendering
    const container = document.getElementById('tags-container');
    const wallView = document.getElementById('wall-view');

    function renderTags(list) {
      if (list) tags = list;
      if (!tags.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>🧱 Стена пока пустая</h3>
            <p>Будь первым, кто оставит свой след на стене Гемостроя!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = tags.map((t, idx) => {
        const isRight = idx % 2 === 1;
        const rotation = ((idx * 7) % 11 - 5) * 1.3;
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

    // Merge server data
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
      renderTags(all);
    }

    // Form submit
    const form = document.getElementById('spray-form');
    const input = document.getElementById('spray-text');

    form.onsubmit = (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      input.value = '';

      try { window.gem?.haptic?.('heavy'); } catch(e){}
      playSpraySound();

      const rect = form.getBoundingClientRect();
      spawnSprayParticles(rect.left + rect.width / 2, rect.top - 20, selectedColor);

      const myName = window.gem?.user?.name || 'Я';
      tags.push({ text: val, name: myName, color: selectedColor });
      renderTags();

      if (window.gem?.call) {
        window.gem.call('/', { msg: val, color: selectedColor }).then(mergeServerData);
      }
    };

    // Initial load from server — strictly real data, no mock text!
    if (window.gem?.call) {
      window.gem.call('/', { load: 1 }).then(mergeServerData);
    } else {
      renderTags([]);
    }
  }

  // Hook into load event so window.gem and telegram are fully available
  if (document.readyState === 'complete') {
    startWallApp();
  } else {
    window.addEventListener('load', startWallApp);
    // Fallback timer if load event already fired or delayed
    setTimeout(startWallApp, 200);
  }
})();
