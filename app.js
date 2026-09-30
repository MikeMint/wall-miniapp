(function() {
  function startWallApp() {
    if (window._wallAppStarted) return;
    window._wallAppStarted = true;

    // Check guest
    if (window.gem?.guest?.()) return;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&family=Russo+One&family=JetBrains+Mono:wght@700;900&display=swap');

      :root {
        --bg: #080202;
        --mortar: #0a0302;
        --accent: #ff3366;
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

      /* Warning tape subheader */
      .top-tape {
        flex-shrink: 0;
        height: 28px;
        background: repeating-linear-gradient(45deg, #f39c12 0 10px, #151515 10px 20px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.8);
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

      .tape-status {
        color: #111;
        background: #f1c40f;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        letter-spacing: 0.5px;
      }

      /* Brick Wall Viewport with Realistic Running Bond Staggered Masonry */
      .wall-viewport {
        flex: 1;
        min-height: 0;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
        background-color: #080202;
        background-image:
          radial-gradient(circle at 50% -10%, rgba(255, 210, 120, 0.28) 0%, rgba(255, 140, 40, 0.07) 50%, rgba(0, 0, 0, 0.85) 90%),
          radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 60%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='36' fill='%23080202'%3E%3Crect width='72' height='36' fill='%230a0302'/%3E%3C!-- Row 1 --%3E%3Crect x='1' y='1' width='69' height='16' rx='1.5' fill='%23280e0a' stroke='%2336140e' stroke-width='1'/%3E%3C!-- Row 2 Staggered --%3E%3Crect x='-35' y='19' width='69' height='16' rx='1.5' fill='%23220b08' stroke='%2330110b' stroke-width='1'/%3E%3Crect x='37' y='19' width='69' height='16' rx='1.5' fill='%232a0f0b' stroke='%2338150e' stroke-width='1'/%3E%3C/svg%3E");
        background-size: 100% 100%, 100% 100%, 72px 36px;
        display: flex;
        flex-direction: column;
        padding: 14px 12px;
        gap: 16px;
      }

      /* Factory Safety Calendar Sign (Календарь случаев на производстве) */
      .safety-sign {
        position: relative;
        background: linear-gradient(180deg, #113824 0%, #0a2517 100%);
        border: 3px solid #d4e6d1;
        border-radius: 8px;
        padding: 10px 14px 12px 14px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.85), inset 0 0 15px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 6px;
        margin-bottom: 4px;
        z-index: 4;
      }

      /* Corner bolts on metallic plate */
      .safety-bolt {
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: radial-gradient(#ccc, #444);
        box-shadow: inset 1px 1px 1px #fff, 1px 1px 2px #000;
      }
      .bolt-tl { top: 5px; left: 5px; }
      .bolt-tr { top: 5px; right: 5px; }
      .bolt-bl { bottom: 5px; left: 5px; }
      .bolt-br { bottom: 5px; right: 5px; }

      .safety-top-stripe {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 900;
        color: #f1c40f;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .safety-question {
        font-family: 'Russo One', sans-serif;
        font-size: 13px;
        color: #fff;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 2px;
      }

      .safety-score-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 4px 0;
      }

      .safety-flip-card {
        background: #000;
        border: 2px solid #2ecc71;
        border-radius: 6px;
        padding: 2px 16px;
        box-shadow: inset 0 0 10px rgba(46,204,113,0.3), 0 0 15px rgba(46,204,113,0.3);
      }

      .safety-flip-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 34px;
        font-weight: 900;
        color: #2ecc71;
        line-height: 1.1;
        text-shadow: 0 0 10px #2ecc71;
      }

      .safety-unit {
        font-family: 'Russo One', sans-serif;
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        text-shadow: 1px 1px 0 #000;
      }

      .safety-sub {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        font-weight: 700;
      }

      /* Particle canvas for aerosol mist */
      #particle-canvas {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }

      /* Tags with Authentic Street Graffiti Styling */
      .tag-bubble {
        position: relative;
        z-index: 3;
        max-width: 86%;
        padding: 4px 8px;
        border-radius: 6px;
        transform-origin: center center;
        animation: sprayIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .tag-text-wrap {
        position: relative;
        display: inline-block;
      }

      .tag-text {
        font-family: 'Rubik Dirt', 'Russo One', Impact, sans-serif;
        font-size: 26px;
        line-height: 1.2;
        letter-spacing: 1px;
        word-break: break-word;
        text-transform: uppercase;
        -webkit-text-stroke: 1.2px rgba(0, 0, 0, 0.9);
        filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.95)) drop-shadow(0 0 12px currentColor);
      }

      .tag-drip {
        position: absolute;
        width: 3.5px;
        background: currentColor;
        border-radius: 0 0 3px 3px;
        bottom: -14px;
        box-shadow: 0 0 6px currentColor;
        animation: dripDown 1.5s ease-out forwards;
      }

      .tag-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: rgba(255,255,255,0.8);
        margin-top: 6px;
        font-weight: 600;
      }

      .tag-author {
        color: rgba(255,255,255,0.9);
        font-family: 'JetBrains Mono', monospace;
        background: rgba(0,0,0,0.65);
        padding: 1px 7px;
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.15);
      }

      @keyframes sprayIn {
        0% { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: blur(5px); }
        100% { opacity: 1; transform: scale(1); }
      }

      @keyframes dripDown {
        0% { height: 0px; opacity: 0; }
        50% { opacity: 1; }
        100% { height: 16px; opacity: 0.85; }
      }

      .empty-state {
        margin: 20px auto;
        text-align: center;
        color: rgba(255,255,255,0.45);
        z-index: 3;
        padding: 15px;
      }
      .empty-state h3 { font-size: 17px; margin-bottom: 4px; color: rgba(255,255,255,0.7); }
      .empty-state p { font-size: 13px; line-height: 1.4; }

      /* Bottom Control Panel */
      .control-panel {
        flex-shrink: 0;
        background: #120604;
        border-top: 1.5px solid #3d1410;
        padding: 8px 10px max(14px, env(safe-area-inset-bottom, 14px)) 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 50;
        box-shadow: 0 -6px 25px rgba(0,0,0,0.9);
      }

      .palette-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .color-can {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        cursor: pointer;
        position: relative;
        transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
      }

      .color-can::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
      }

      .color-can.active {
        transform: scale(1.35);
        border-color: #fff;
        box-shadow: 0 0 14px currentColor;
      }

      .input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .spray-input {
        flex: 1;
        height: 44px;
        background: #000;
        border: 1.5px solid #4a1914;
        border-radius: 8px;
        padding: 0 12px;
        color: #fff;
        font-size: 15px;
        font-weight: 500;
        outline: none;
      }

      .spray-input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 12px var(--accent);
      }

      .spray-btn {
        height: 44px;
        padding: 0 16px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, var(--accent) 0%, #111 150%);
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        box-shadow: 0 4px 18px var(--accent);
        transition: transform 0.1s, background 0.2s, box-shadow 0.2s;
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

    function getDaysWord(n) {
      const mod10 = n % 10;
      const mod100 = n % 100;
      if (mod100 >= 11 && mod100 <= 19) return 'ДНЕЙ';
      if (mod10 === 1) return 'ДЕНЬ';
      if (mod10 >= 2 && mod10 <= 4) return 'ДНЯ';
      return 'ДНЕЙ';
    }

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
        <div class="tape-status">
          <span>СТАБИЛЬНО НЕ ПИЛИТСЯ</span>
        </div>
      </div>

      <div class="wall-viewport" id="wall-view">
        <!-- Safety Calendar Sign -->
        <div class="safety-sign">
          <div class="safety-bolt bolt-tl"></div>
          <div class="safety-bolt bolt-tr"></div>
          <div class="safety-bolt bolt-bl"></div>
          <div class="safety-bolt bolt-br"></div>
          <div class="safety-top-stripe">
            <span>⚠️</span>
            <span>ОХРАНА ТРУДА И РАЗРАБОТКИ</span>
          </div>
          <div class="safety-question">ДНЕЙ БЕЗ КОММИТОВ И РЕЛИЗА:</div>
          <div class="safety-score-row">
            <div class="safety-flip-card">
              <span class="safety-flip-num" id="days-counter">${daysWithoutCommits}</span>
            </div>
            <span class="safety-unit">${getDaysWord(daysWithoutCommits)}</span>
          </div>
          <div class="safety-sub">ПРЕДЫДУЩИЙ РЕКОРД: 40 ДНЕЙ · РАБОТАЕМ ДАЛЬШЕ</div>
        </div>

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

    // Palette & Dynamic Spray Button Color
    const paletteBar = document.getElementById('palette-bar');
    const sprayBtn = document.getElementById('spray-btn');

    function updateAccent(colorHex) {
      selectedColor = colorHex;
      document.documentElement.style.setProperty('--accent', colorHex);
      if (sprayBtn) {
        sprayBtn.style.background = `linear-gradient(135deg, ${colorHex} 0%, #150505 160%)`;
        sprayBtn.style.boxShadow = `0 4px 18px ${colorHex}66`;
      }
    }

    PALETTE.forEach(c => {
      const btn = document.createElement('div');
      btn.className = `color-can ${c.hex === selectedColor ? 'active' : ''}`;
      btn.style.backgroundColor = c.hex;
      btn.style.color = c.hex;
      btn.title = c.name;
      btn.onclick = () => {
        document.querySelectorAll('.color-can').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        updateAccent(c.hex);
        try { window.gem?.haptic?.('select'); } catch(e){}
      };
      paletteBar.appendChild(btn);
    });

    updateAccent(selectedColor);

    // Sound (Ball shake rattle + spray hiss)
    const playSpraySound = () => {
      try {
        if (window.gem?.sound?.beep) {
          window.gem.sound.beep(600, 20, 'square', 0.2);
          setTimeout(() => window.gem.sound.beep(800, 25, 'triangle', 0.25), 50);
          setTimeout(() => window.gem.sound.beep(320, 180, 'sawtooth', 0.4), 110);
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
            <p>Будь первым, кто нацарапает свой тег на стене Гемостроя!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = tags.map((t, idx) => {
        const isRight = idx % 2 === 1;
        const rotation = ((idx * 7) % 9 - 4) * 1.5;
        const col = t.color || PALETTE[idx % PALETTE.length].hex;
        const author = t.name || 'Аноним';
        const text = t.text || t.label || '';
        const hasDrip = (idx % 2 === 0);

        return `
          <div class="tag-bubble" style="align-self: ${isRight ? 'flex-end' : 'flex-start'}; transform: rotate(${rotation}deg);">
            <div class="tag-text-wrap">
              <div class="tag-text" style="color: ${col};">
                ${esc(text)}
              </div>
              ${hasDrip ? `<div class="tag-drip" style="left: ${isRight ? '15%' : '80%'}; color: ${col};"></div>` : ''}
            </div>
            <div class="tag-meta" style="justify-content: ${isRight ? 'flex-end' : 'flex-start'};">
              <span class="tag-author">— ${esc(author)}</span>
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

    // Initial load from server
    if (window.gem?.call) {
      window.gem.call('/', { load: 1 }).then(mergeServerData);
    } else {
      renderTags([]);
    }
  }

  // Hook into load event
  if (document.readyState === 'complete') {
    startWallApp();
  } else {
    window.addEventListener('load', startWallApp);
    setTimeout(startWallApp, 200);
  }
})();
