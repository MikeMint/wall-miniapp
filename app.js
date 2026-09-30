(function() {
  function startWallApp() {
    if (window._wallAppStarted) return;
    window._wallAppStarted = true;

    // Check guest
    if (window.gem?.guest?.()) return;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Russo+One&family=JetBrains+Mono:wght@700;900&display=swap');

      :root {
        --bg: #0d0605;
        --mortar: #120b0a;
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
        height: 24px;
        background: repeating-linear-gradient(45deg, #f39c12 0 10px, #151515 10px 20px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.8);
        z-index: 10;
        border-bottom: 2px solid #000;
      }

      .tape-badge {
        background: #111;
        color: #f1c40f;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 3px;
        letter-spacing: 0.5px;
        border: 1px solid #f39c1255;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .tape-status {
        color: #111;
        background: #f1c40f;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 3px;
        letter-spacing: 0.5px;
      }

      /* Hyper-Realistic Running Bond Brick Wall Viewport */
      .wall-viewport {
        flex: 1;
        min-height: 0;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
        background-color: #0d0605;
        background-image:
          radial-gradient(ellipse at 50% -10%, rgba(255, 215, 130, 0.38) 0%, rgba(255, 140, 40, 0.1) 45%, rgba(0, 0, 0, 0.85) 90%),
          radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 60%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='52' fill='%23140d0c'%3E%3Crect width='120' height='52' fill='%2317100f'/%3E%3C!-- Row 1 --%3E%3Crect x='2' y='2' width='56' height='22' rx='1' fill='%23782b1d'/%3E%3Crect x='2' y='2' width='56' height='2' fill='%239e3c2b' opacity='0.7'/%3E%3Crect x='2' y='22' width='56' height='2' fill='%23381008' opacity='0.8'/%3E%3Crect x='62' y='2' width='56' height='22' rx='1' fill='%23632014'/%3E%3Crect x='62' y='2' width='56' height='2' fill='%23852d1d' opacity='0.7'/%3E%3Crect x='62' y='22' width='56' height='2' fill='%23300c06' opacity='0.8'/%3E%3C!-- Row 2 Staggered --%3E%3Crect x='-28' y='28' width='56' height='22' rx='1' fill='%236e2518'/%3E%3Crect x='0' y='28' width='26' height='2' fill='%23913423' opacity='0.7'/%3E%3Crect x='0' y='48' width='26' height='2' fill='%23381008' opacity='0.8'/%3E%3Crect x='32' y='28' width='56' height='22' rx='1' fill='%23822f20'/%3E%3Crect x='32' y='28' width='56' height='2' fill='%23a84230' opacity='0.7'/%3E%3Crect x='32' y='48' width='56' height='2' fill='%2342130a' opacity='0.8'/%3E%3Crect x='92' y='28' width='56' height='22' rx='1' fill='%235c1d12'/%3E%3Crect x='92' y='28' width='28' height='2' fill='%237d281a' opacity='0.7'/%3E%3Crect x='92' y='48' width='28' height='2' fill='%232b0a05' opacity='0.8'/%3E%3C/svg%3E");
        background-size: 100% 100%, 100% 100%, 120px 52px;
        display: flex;
        flex-direction: column;
        padding: 8px 12px 14px 12px;
        gap: 12px;
        box-shadow: inset 0 0 50px rgba(0,0,0,0.85);
      }

      /* Compact Factory Safety Calendar Sign */
      .safety-sign {
        position: relative;
        background: linear-gradient(180deg, #103321 0%, #081e13 100%);
        border: 2px solid #cce5c8;
        border-radius: 6px;
        padding: 4px 10px 5px 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin: 0 auto 2px auto;
        width: 100%;
        max-width: 360px;
        z-index: 4;
      }

      .safety-bolt {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: radial-gradient(#bbb, #333);
        box-shadow: inset 0.5px 0.5px 1px #fff, 0.5px 0.5px 1px #000;
      }
      .bolt-tl { top: 3px; left: 3px; }
      .bolt-tr { top: 3px; right: 3px; }
      .bolt-bl { bottom: 3px; left: 3px; }
      .bolt-br { bottom: 3px; right: 3px; }

      .safety-header-compact {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px dashed rgba(204, 229, 200, 0.25);
        padding-bottom: 2px;
      }

      .safety-title-compact {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        font-weight: 900;
        color: #f1c40f;
        letter-spacing: 0.5px;
      }

      .safety-sub-compact {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.65);
        letter-spacing: 0.3px;
      }

      .safety-main-compact {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .safety-lbl-compact {
        font-family: 'Russo One', sans-serif;
        font-size: 11px;
        color: #fff;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .safety-score-compact {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .safety-flip-card {
        background: #000;
        border: 1.5px solid #2ecc71;
        border-radius: 4px;
        padding: 1px 7px;
        box-shadow: inset 0 0 6px rgba(46,204,113,0.3), 0 0 8px rgba(46,204,113,0.25);
      }

      .safety-flip-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 19px;
        font-weight: 900;
        color: #2ecc71;
        line-height: 1.1;
        text-shadow: 0 0 6px #2ecc71;
      }

      .safety-unit {
        font-family: 'Russo One', sans-serif;
        font-size: 13px;
        font-weight: 900;
        color: #fff;
      }

      /* Particle canvas for aerosol mist */
      #particle-canvas {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }

      /* Tags with Compact Street Graffiti Styling */
      .tag-bubble {
        position: relative;
        z-index: 3;
        max-width: 86%;
        padding: 2px 4px;
        transform-origin: center center;
        animation: sprayIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: inline-block;
      }

      .tag-text {
        font-family: 'Dela Gothic One', 'Russo One', Impact, sans-serif;
        line-height: 1.2;
        letter-spacing: 0.5px;
        word-break: break-word;
        text-transform: uppercase;
        text-shadow:
          0 0 6px currentColor,
          0 0 14px currentColor,
          1.5px 1.5px 0 #000,
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          0 1.5px 0 #000,
          1.5px 0 0 #000;
      }

      .tag-sig {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        letter-spacing: 0.3px;
        text-shadow: 1px 1px 2px #000;
        margin-top: 1px;
        display: block;
      }

      @keyframes sprayIn {
        0% { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: blur(4px); }
        100% { opacity: 1; transform: scale(1); }
      }

      .empty-state {
        margin: 20px auto;
        text-align: center;
        color: rgba(255,255,255,0.45);
        z-index: 3;
        padding: 15px;
      }
      .empty-state h3 { font-size: 16px; margin-bottom: 4px; color: rgba(255,255,255,0.7); }
      .empty-state p { font-size: 12px; line-height: 1.4; }

      /* Single-Row Slim Bottom Control Panel */
      .control-panel {
        flex-shrink: 0;
        background: #110504;
        border-top: 1.5px solid #3d1410;
        padding: 6px 10px max(10px, env(safe-area-inset-bottom, 10px)) 10px;
        position: relative;
        z-index: 50;
        box-shadow: 0 -6px 25px rgba(0,0,0,0.9);
      }

      /* Popup Palette */
      .palette-popover {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 10px;
        background: #180907;
        border: 1.5px solid #4a1914;
        border-radius: 20px;
        padding: 6px 10px;
        display: none;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.95);
        animation: popUp 0.15s ease-out forwards;
        z-index: 60;
      }

      .palette-popover.open {
        display: flex;
      }

      @keyframes popUp {
        from { opacity: 0; transform: translateY(6px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-trigger-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #000;
        border: 2px solid rgba(255,255,255,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
        transition: border-color 0.2s, transform 0.1s;
      }

      .color-trigger-btn:active {
        transform: scale(0.92);
      }

      .color-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 0 10px currentColor;
        transition: background-color 0.2s, box-shadow 0.2s;
      }

      .color-can {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
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
        transform: scale(1.3);
        border-color: #fff;
        box-shadow: 0 0 12px currentColor;
      }

      .spray-input {
        flex: 1;
        height: 38px;
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
        box-shadow: 0 0 10px var(--accent);
      }

      .spray-btn {
        height: 38px;
        padding: 0 16px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, var(--accent) 0%, #111 150%);
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 14px var(--accent);
        transition: transform 0.1s, background 0.2s, box-shadow 0.2s;
        letter-spacing: 0.5px;
      }

      .spray-btn:active {
        transform: scale(0.95);
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
        <!-- Compact Safety Calendar Sign -->
        <div class="safety-sign">
          <div class="safety-bolt bolt-tl"></div>
          <div class="safety-bolt bolt-tr"></div>
          <div class="safety-bolt bolt-bl"></div>
          <div class="safety-bolt bolt-br"></div>
          
          <div class="safety-header-compact">
            <span class="safety-title-compact">⚠️ ОХРАНА ТРУДА И РАЗРАБОТКИ</span>
            <span class="safety-sub-compact">РЕКОРД: 40 ДН.</span>
          </div>

          <div class="safety-main-compact">
            <span class="safety-lbl-compact">ДНЕЙ БЕЗ КОММИТОВ:</span>
            <div class="safety-score-compact">
              <div class="safety-flip-card">
                <span class="safety-flip-num" id="days-counter">${daysWithoutCommits}</span>
              </div>
              <span class="safety-unit">${getDaysWord(daysWithoutCommits)}</span>
            </div>
          </div>
        </div>

        <canvas id="particle-canvas"></canvas>
        <div id="tags-container" style="display:flex;flex-direction:column;gap:12px;z-index:3;"></div>
      </div>

      <div class="control-panel">
        <div class="palette-popover" id="palette-popover">
          <div class="palette-row" id="palette-bar"></div>
        </div>
        <form class="input-row" id="spray-form">
          <button type="button" class="color-trigger-btn" id="color-trigger" title="Выбрать цвет краски">
            <div class="color-dot" id="active-color-dot"></div>
          </button>
          <input class="spray-input" id="spray-text" maxlength="80" placeholder="Нацарапать на кирпичах..." autocomplete="off">
          <button type="submit" class="spray-btn" id="spray-btn">ПШИК</button>
        </form>
      </div>
    `;

    // Palette & Dynamic Spray Button Color
    const paletteBar = document.getElementById('palette-bar');
    const palettePopover = document.getElementById('palette-popover');
    const colorTrigger = document.getElementById('color-trigger');
    const activeColorDot = document.getElementById('active-color-dot');
    const sprayBtn = document.getElementById('spray-btn');

    function updateAccent(colorHex) {
      selectedColor = colorHex;
      document.documentElement.style.setProperty('--accent', colorHex);
      if (activeColorDot) {
        activeColorDot.style.backgroundColor = colorHex;
        activeColorDot.style.color = colorHex;
      }
      if (sprayBtn) {
        sprayBtn.style.background = `linear-gradient(135deg, ${colorHex} 0%, #150505 160%)`;
        sprayBtn.style.boxShadow = `0 4px 16px ${colorHex}66`;
      }
    }

    // Toggle popover
    colorTrigger.onclick = (e) => {
      e.stopPropagation();
      palettePopover.classList.toggle('open');
      try { window.gem?.haptic?.('light'); } catch(e){}
    };

    document.addEventListener('click', (e) => {
      if (!palettePopover.contains(e.target) && e.target !== colorTrigger) {
        palettePopover.classList.remove('open');
      }
    });

    PALETTE.forEach(c => {
      const btn = document.createElement('div');
      btn.className = `color-can ${c.hex === selectedColor ? 'active' : ''}`;
      btn.style.backgroundColor = c.hex;
      btn.style.color = c.hex;
      btn.title = c.name;
      btn.onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.color-can').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        updateAccent(c.hex);
        palettePopover.classList.remove('open');
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
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x: x || canvas.width / 2,
          y: y || canvas.height - 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          radius: Math.random() * 2.5 + 1,
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

      const scatterOffsets = [4, 42, 14, 52, 24, 8, 38, 18, 46];
      const angles = [-4.5, 3.5, -2, 5, -3.5, 2, -5, 4, -2.5];

      container.innerHTML = tags.map((t, idx) => {
        const text = t.text || t.label || '';
        const len = text.length;

        // Dynamic font sizing: short tags are punchy, long phrases stay compact
        let fontSize = 16;
        if (len <= 4) fontSize = 23;
        else if (len <= 10) fontSize = 19;
        else if (len <= 22) fontSize = 16;
        else fontSize = 13.5;

        // Organic horizontal positioning across the entire wall
        let maxOffset = len > 22 ? 8 : (len > 12 ? 22 : 46);
        const leftOffset = Math.min(maxOffset, scatterOffsets[idx % scatterOffsets.length]);
        const rotation = angles[idx % angles.length];

        const col = t.color || PALETTE[idx % PALETTE.length].hex;
        const author = t.name || 'Аноним';

        return `
          <div class="tag-bubble" style="margin-left: ${leftOffset}%; transform: rotate(${rotation}deg);">
            <div class="tag-text" style="color: ${col}; font-size: ${fontSize}px;">
              ${esc(text)}
            </div>
            <div class="tag-sig">~ ${esc(author)}</div>
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

      // Auto-cycle color for next spray to keep the wall colorful and diverse
      const nextIdx = (PALETTE.findIndex(c => c.hex === selectedColor) + 1) % PALETTE.length;
      updateAccent(PALETTE[nextIdx].hex);

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
