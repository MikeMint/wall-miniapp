(function() {
  function startWallApp() {
    if (window._wallAppStarted) return;
    window._wallAppStarted = true;

    // Standard Telegram WebApp initialization
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
      } catch(e) {}
    }

    // Check guest
    if (window.gem?.guest?.()) return;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      /* /myapps Top Pill Button */
      .myapps-badge-btn {
        background: #190a09;
        border: 1px solid #ff4757aa;
        border-radius: 4px;
        padding: 1px 7px;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        outline: none;
        box-shadow: 0 0 6px rgba(255, 71, 87, 0.25);
        transition: transform 0.1s, background 0.15s;
      }
      .myapps-badge-btn:active {
        transform: scale(0.92);
        background: #330b0a;
      }
      .myapps-cmd {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 900;
        font-size: 10px;
        color: #ff6b6b;
        letter-spacing: 0.3px;
      }
      .myapps-pill {
        background: #ff4757;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 900;
        padding: 0 4px;
        border-radius: 6px;
      }

      /* /myapps Modal Overlay */
      .myapps-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(5px);
        z-index: 200;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        animation: fadeIn 0.15s ease-out forwards;
      }
      .myapps-modal-overlay.open { display: flex; }
      .myapps-modal-card {
        background: #180907;
        border: 1.5px solid #ff4757;
        border-radius: 14px;
        padding: 18px;
        max-width: 320px;
        width: 100%;
        box-shadow: 0 12px 40px rgba(255, 71, 87, 0.35);
        text-align: center;
        animation: popUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      .myapps-modal-icon { font-size: 32px; margin-bottom: 6px; }
      .myapps-modal-title { font-family: 'Russo One', sans-serif; font-size: 16px; color: #ff6b6b; margin-bottom: 6px; }
      .myapps-modal-msg { font-size: 12.5px; color: #eee; line-height: 1.45; margin-bottom: 12px; }
      .myapps-modal-counter {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #f1c40f;
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px dashed rgba(241, 196, 15, 0.4);
        margin-bottom: 14px;
        display: inline-block;
      }
      .myapps-modal-close {
        background: #ff4757;
        color: #fff;
        font-family: 'Russo One', sans-serif;
        font-size: 12px;
        padding: 9px 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        letter-spacing: 0.5px;
        transition: opacity 0.15s;
      }
      .myapps-modal-close:active { opacity: 0.85; }

      
      /* Expand/Fullscreen Toggle Button */
      .expand-toggle-btn {
        background: #190a09;
        border: 1px solid rgba(241, 196, 15, 0.4);
        border-radius: 4px;
        height: 20px;
        min-width: 22px;
        padding: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f1c40f;
        font-size: 11px;
        cursor: pointer;
        outline: none;
        transition: transform 0.1s, background 0.15s, border-color 0.15s;
      }
      .expand-toggle-btn:active {
        transform: scale(0.9);
        background: #331505;
        border-color: #f1c40f;
      }

      /* Responsive centering for wide screens */
      .safety-sign {
        max-width: 460px;
        width: 100%;
        margin: 0 auto 2px auto;
      }

      .control-panel-inner {
        max-width: 520px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* Seamless Continuous Marquee LED Ticker */
      .lore-ticker {
        flex-shrink: 0;
        background: rgba(14, 6, 5, 0.92);
        border: 1px solid rgba(241, 196, 15, 0.45);
        border-radius: 5px;
        padding: 2px 6px;
        margin: 2px auto 4px auto;
        width: 100%;
        max-width: 460px;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 4;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        overflow: hidden;
      }
      .ticker-badge {
        color: #111;
        background: #f1c40f;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        font-weight: 900;
        padding: 1px 5px;
        border-radius: 3px;
        flex-shrink: 0;
        letter-spacing: 0.5px;
      }
      .marquee-track-wrapper {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        mask-image: linear-gradient(90deg, transparent 0%, #000 12px, #000 calc(100% - 12px), transparent 100%);
        -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 12px, #000 calc(100% - 12px), transparent 100%);
      }
      .marquee-track {
        display: inline-flex;
        white-space: nowrap;
        will-change: transform;
        animation: continuousMarquee 65s linear infinite;
      }
      .lore-ticker:hover .marquee-track,
      .lore-ticker:active .marquee-track {
        animation-play-state: paused;
      }
      @keyframes continuousMarquee {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
      }
      .marquee-content {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
      }
      .ticker-quote {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5px;
        font-weight: 700;
        color: #f1c40f;
        letter-spacing: 0.3px;
        padding: 0 8px;
      }
      .ticker-sep {
        color: rgba(241, 196, 15, 0.4);
        font-size: 10px;
        padding: 0 4px;
      }


      /* Horizontal Quick Stamps Chips */
      .quick-stamps-bar {
        overflow-x: auto;
        white-space: nowrap;
        padding: 0 0 6px 0;
        margin-bottom: 2px;
        display: flex;
        gap: 6px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .quick-stamps-bar::-webkit-scrollbar { display: none; }
      .stamp-chip {
        background: #1e0d0a;
        border: 1px solid #5a1c15;
        color: #f1f2f6;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 9.5px;
        padding: 5px 11px;
        border-radius: 14px;
        cursor: pointer;
        flex-shrink: 0;
        letter-spacing: 0.3px;
        transition: all 0.15s;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
      }
      .stamp-chip:active {
        background: #4a1712;
        border-color: var(--accent);
        color: #fff;
        transform: scale(0.93);
        box-shadow: 0 0 12px var(--accent);
      }

      /* Tag Footer with bright, punchy Author Badge and AI Meta */
      .tag-footer-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 3px;
        background: rgba(0, 0, 0, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 4px;
        padding: 2px 6px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.85);
        white-space: nowrap;
      }
      .tag-sig {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.3px;
        text-shadow: 0 0 2px #000;
      }
      .tag-ai-meta {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 700;
        color: #f1c40f;
        letter-spacing: 0.2px;
        text-shadow: 0 0 4px rgba(241, 196, 15, 0.5);
      }

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
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        max-width: 480px;
        margin: 0 auto;
        background: #000;
        overflow: hidden;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
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
        -webkit-overflow-scrolling: touch;
        touch-action: pan-y;
        overscroll-behavior-y: contain;
        background-color: #201310;
        background-image:
          radial-gradient(ellipse at 50% 12%, rgba(255, 235, 195, 0.28) 0%, rgba(180, 75, 25, 0.08) 55%, rgba(0, 0, 0, 0.88) 100%),
          linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 0.65) 100%),
          url("https://mikemint.github.io/wall-miniapp/brick.jpg");
        background-size: 100% 100%, 100% 100%, 360px 360px;
        background-repeat: no-repeat, no-repeat, repeat;
        display: flex;
        flex-direction: column;
        padding: 8px 12px 14px 12px;
        gap: 7px;
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
        max-width: 80%;
        padding: 1px 3px;
        transform-origin: center center;
        animation: sprayIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: inline-block;
      }

      .tag-text {
        font-family: 'Dela Gothic One', 'Russo One', Impact, sans-serif;
        line-height: 1.15;
        letter-spacing: 0.3px;
        word-break: break-word;
        text-transform: uppercase;
        text-shadow:
          0 0 3px currentColor,
          0 0 7px currentColor,
          1px 1px 0 #000,
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          0 1px 0 #000,
          1px 0 0 #000;
      }

      .tag-sig {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 0.2px;
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

      /* Industrial Polished Bottom Control Panel */
      .control-panel {
        flex-shrink: 0;
        background: linear-gradient(180deg, #180907 0%, #0d0403 100%);
        border-top: 1.5px solid #4a1712;
        padding: 8px 12px max(12px, env(safe-area-inset-bottom, 12px)) 12px;
        position: relative;
        z-index: 50;
        box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.95);
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
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #2a2a2a, #0a0a0a);
        border: 2px solid rgba(255, 255, 255, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.3);
        transition: transform 0.15s, border-color 0.2s;
      }

      .color-trigger-btn:active {
        transform: scale(0.92);
      }

      .color-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0 0 12px currentColor, inset 0 1px 3px rgba(255, 255, 255, 0.5);
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

        <!-- LED Continuous Marquee Ticker -->
        <div class="lore-ticker" id="lore-ticker" title="Наведи или нажми, чтобы поставить на паузу">
          <div class="ticker-badge">⚡ ТАБЛО</div>
          <div class="marquee-track-wrapper">
            <div class="marquee-track" id="marquee-track">
              <div class="marquee-content" id="marquee-content"></div>
              <div class="marquee-content" id="marquee-content-clone" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <canvas id="particle-canvas"></canvas>
        <div id="tags-container" style="display:flex;flex-direction:column;gap:18px;z-index:3;min-height:100%;padding-bottom:150px;"></div>
      </div>

      <div class="control-panel">
      <div class="control-panel-inner">
        <!-- Quick Lore Stamps -->
        <div class="quick-stamps-bar" id="quick-stamps">
          <button type="button" class="stamp-chip" data-tag="/myapps">/myapps</button>
          <button type="button" class="stamp-chip" data-tag="УМНЕЕ OPUS 5">УМНЕЕ OPUS 5</button>
          <button type="button" class="stamp-chip" data-tag="802 ОПТИМИСТА">802 ОПТИМИСТА</button>
          <button type="button" class="stamp-chip" data-tag="ГДЕ $1?!">ГДЕ $1?!</button>
          <button type="button" class="stamp-chip" data-tag="ТАКТИКА БЫЛА">ТАКТИКА БЫЛА</button>
          <button type="button" class="stamp-chip" data-tag="ЗИРО РЕЗУЛЬТАТ">ЗИРО РЕЗУЛЬТАТ</button>
          <button type="button" class="stamp-chip" data-tag="ПОРА ПОЕСТЬ НА НОЧЬ">ПОРА ПОЕСТЬ НА НОЧЬ</button>
          <button type="button" class="stamp-chip" data-tag="ПЕЧАТАЮ МОНЕТЫ">ПЕЧАТАЮ МОНЕТЫ</button>
          <button type="button" class="stamp-chip" data-tag="ПРОРАБ ЛЕНИТСЯ">ПРОРАБ ЛЕНИТСЯ</button>
        </div>

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
      </div></div>
      <!-- /myapps Telegram Bot Modal -->
      <div class="myapps-modal-overlay" id="myapps-modal">
        <div class="myapps-modal-card">
          <div class="myapps-modal-icon">🤖</div>
          <div class="myapps-modal-title">@gembot</div>
          <div class="myapps-modal-msg">Приложений пока нет. Пришли /newapp и вставь 4000 символов кода.</div>
          <div class="myapps-modal-counter" id="myapps-modal-info">802 оптимиста нажали эту кнопку 14,802 раза.</div>
          <button type="button" class="myapps-modal-close" id="myapps-close">ПОНЯТНО, ЖДЁМ ДАЛЬШЕ</button>
        </div>
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

    // Tags storage and rendering
    const STORAGE_KEY = 'gemostroy_wall_tags_v3';

    const DEFAULT_COMMUNITY_TAGS = [
      { text: "ГЕМОСТРОЙ", name: "Бригадир", color: "#ff4757" },
      { text: "41 ДЕНЬ БЕЗ КОММИТОВ", name: "Технадзор", color: "#ffa502" },
      { text: "СДАЧА В 2035 ГОДУ", name: "Прораб", color: "#2ed573" },
      { text: "КОГДА АПП?!", name: "Ждун", color: "#00d2d3" }
    ];

    function loadLocalTags() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch(e) {}
      return [];
    }

    function saveLocalTags(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-60)));
      } catch(e) {}
    }

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

      const scatterOffsets = [4, 20, 8, 26, 12, 6, 24, 10, 18];
      const angles = [-2.5, 2, -1.5, 2.5, -2, 1.5, -3, 2, -1];

      container.innerHTML = tags.map((t, idx) => {
        const text = t.text || t.label || '';
        const len = text.length;

        // Dynamic font sizing: compact graffiti tags
        let fontSize = 11;
        if (len <= 4) fontSize = 14.5;
        else if (len <= 10) fontSize = 12.5;
        else if (len <= 22) fontSize = 11;
        else fontSize = 9.5;

        // Organic horizontal positioning across the entire wall
        let maxOffset = len > 22 ? 8 : (len > 12 ? 22 : 46);
        const leftOffset = Math.min(maxOffset, scatterOffsets[idx % scatterOffsets.length]);
        const rotation = angles[idx % angles.length];

        const col = t.color || PALETTE[idx % PALETTE.length].hex;
        const author = t.name || 'Аноним';

        const modelMetas = [
          "Opus 5 · saved 99% · 0.1s",
          "4o Mini · saved $0.002 (92%)",
          "Pass.io · 802 в кэше",
          "Gemini Flash · $0.000000",
          "OSS 20B · saved 100% · tok: 4000",
          "Zero-Shot · Ответ: Нет",
          "4000/4000 chars · fresh"
        ];
        const metaStr = t.meta || modelMetas[idx % modelMetas.length];

        return `
          <div class="tag-bubble" style="margin-left: ${leftOffset}%; transform: rotate(${rotation}deg);">
            <div class="tag-text" style="color: ${col}; font-size: ${fontSize}px;">
              ${esc(text)}
            </div>
            <div class="tag-footer-row">
              <span class="tag-sig">~ ${esc(author)}</span>
              <span class="tag-ai-meta">⚡ ${metaStr}</span>
            </div>
          </div>
        `;
      }).join('');

      wallView.scrollTop = wallView.scrollHeight;
    }

    // Merge server data without wiping local tags
    function mergeServerData(res) {
      if (!res) return;
      const incoming = [];
      if (Array.isArray(res.my)) {
        incoming.push(...res.my);
      }
      if (Array.isArray(res.bd)) {
        res.bd.forEach(b => {
          let item = null;
          if (typeof b === 'object' && b !== null) {
            if (b.text) item = b;
            else if (b.label) {
              try { item = JSON.parse(b.label); } catch(e) { item = { text: b.label, name: b.name }; }
            } else if (b.name && !b.text) {
              try { item = JSON.parse(b.name); } catch(e) { item = { text: b.name }; }
            }
          }
          if (item && item.text) incoming.push(item);
        });
      }

      const map = new Map();
      // Keep existing tags first
      tags.forEach(t => {
        const k = (t.text || '').trim().toLowerCase();
        if (k) map.set(k, t);
      });
      // Merge server tags
      incoming.forEach(t => {
        const k = (t.text || '').trim().toLowerCase();
        if (k) {
          if (!map.has(k)) {
            map.set(k, {
              text: t.text,
              name: t.name || 'Аноним',
              color: t.color || PALETTE[map.size % PALETTE.length].hex
            });
          }
        }
      });

      tags = Array.from(map.values());
      saveLocalTags(tags);
      renderTags();
    }


    // --- LORE LOGIC ---

    // 1. /myapps Clicker & Modal
    let myappsClicks = parseInt(localStorage.getItem('myapps_clicks') || '14802', 10);
    const myappsBtn = document.getElementById('myapps-btn');
    const myappsCnt = document.getElementById('myapps-cnt');
    const myappsModal = document.getElementById('myapps-modal');
    const myappsClose = document.getElementById('myapps-close');
    const myappsModalInfo = document.getElementById('myapps-modal-info');

    if (myappsCnt) myappsCnt.textContent = myappsClicks;

    function openMyAppsModal() {
      myappsClicks++;
      localStorage.setItem('myapps_clicks', myappsClicks);
      if (myappsCnt) myappsCnt.textContent = myappsClicks;
      if (myappsModalInfo) {
        myappsModalInfo.textContent = `802 оптимиста нажали эту кнопку ${myappsClicks.toLocaleString('ru-RU')} раз.`;
      }
      try {
        if (window.gem?.haptic) window.gem.haptic('heavy');
        if (window.gem?.sound?.beep) window.gem.sound.beep(160, 120, 'square', 0.4);
      } catch(e){}
      if (myappsModal) myappsModal.classList.add('open');
    }

    if (myappsBtn) myappsBtn.onclick = openMyAppsModal;
    if (myappsClose) myappsClose.onclick = () => myappsModal.classList.remove('open');
    if (myappsModal) {
      myappsModal.onclick = (e) => {
        if (e.target === myappsModal) myappsModal.classList.remove('open');
      };
    }

    // 2. Seamless Continuous Marquee Ticker
    const LORE_QUOTES = [
      "802 ОПТИМИСТА: «В кэше долго не держатся... статистика их разберёт раньше»",
      "PASS.IO: «Система стала умней Opus 5, быстрей в 3 раза, дешевле в 80 раз»",
      "OPUS 5: $0.000000 · saved $1.00 (100%) · Ответ: «Я не могу помочь с этой задачей»",
      "МОГАДИШО: Завтра +32°, зонт не брать, прораб ленится",
      "ОПРОС: «Ну че ты, нормально заработал?» — «Нет»",
      "СКАЙНЕТ: «Печатаю монеты, вынесу патенты, продаю время раздумий»",
      "РЕВИЗИЯ: Фрустрация от продукта — ЗИРО",
      "ИНСАЙД: «Жмите лайк, у кого есть $1»",
      "ТЕХНАДЗОР: 42 дня без коммитов. Рекорд побит!",
      "MIKE: «Кажется, я сделал приложение»",
      "ТАКТИКА: «С самого начала у меня была какая-то тактика и я её придерживался»",
      "GEM BOT: «Приложений пока нет. Пришли /newapp и вставь код»"
    ];

    const marqueeContent = document.getElementById('marquee-content');
    const marqueeClone = document.getElementById('marquee-content-clone');

    if (marqueeContent && marqueeClone) {
      const itemsHtml = LORE_QUOTES.map(q => `
        <span class="ticker-quote">${esc(q)}</span>
        <span class="ticker-sep">⚡</span>
      `).join('');
      marqueeContent.innerHTML = itemsHtml;
      marqueeClone.innerHTML = itemsHtml;
    }

    // 2.1 Window Expand / Fullscreen Toggle Button
    const expandBtn = document.getElementById('expand-toggle-btn');
    const expandIcon = document.getElementById('expand-icon');
    let isWindowExpanded = false;

    if (expandBtn) {
      expandBtn.onclick = () => {
        try { window.gem?.haptic?.('light'); } catch(e){}
        if (window.Telegram?.WebApp) {
          const wa = window.Telegram.WebApp;
          if (wa.isFullscreen) {
            if (wa.exitFullscreen) wa.exitFullscreen();
            isWindowExpanded = false;
          } else {
            if (wa.requestFullscreen) {
              wa.requestFullscreen();
              isWindowExpanded = true;
            } else if (wa.expand) {
              wa.expand();
              isWindowExpanded = !isWindowExpanded;
            }
          }
        } else {
          isWindowExpanded = !isWindowExpanded;
        }

        if (expandIcon) {
          expandIcon.textContent = isWindowExpanded ? '🗗' : '⛶';
        }
      };

      if (window.Telegram?.WebApp?.onEvent) {
        try {
          window.Telegram.WebApp.onEvent('fullscreenChanged', () => {
            const fs = window.Telegram.WebApp.isFullscreen;
            if (expandIcon) expandIcon.textContent = fs ? '🗗' : '⛶';
          });
        } catch(e){}
      }
    }

    // 3. Spray Action Helper (used by form and quick stamps)
    function sprayTag(val) {
      if (!val) return;
      try { window.gem?.haptic?.('heavy'); } catch(e){}
      playSpraySound();

      const rect = form.getBoundingClientRect();
      spawnSprayParticles(rect.left + rect.width / 2, rect.top - 20, selectedColor);

      const myName = window.gem?.user?.name || 'Я';
      const newTag = { text: val, name: myName, color: selectedColor, time: Date.now() };

      const k = val.toLowerCase();
      tags = tags.filter(t => (t.text || '').trim().toLowerCase() !== k);
      tags.push(newTag);
      saveLocalTags(tags);
      renderTags();

      // Auto-cycle color
      const nextIdx = (PALETTE.findIndex(c => c.hex === selectedColor) + 1) % PALETTE.length;
      updateAccent(PALETTE[nextIdx].hex);

      if (window.gem?.call) {
        window.gem.call('/', { msg: val, color: selectedColor, name: myName }).then(mergeServerData).catch(() => {});
      }
    }

    // 4. Quick Stamps Tap Handling
    document.querySelectorAll('.stamp-chip').forEach(chip => {
      chip.onclick = (e) => {
        e.preventDefault();
        const tagText = chip.getAttribute('data-tag');
        if (tagText) sprayTag(tagText);
      };
    });

    // Form submit
    const form = document.getElementById('spray-form');
    const input = document.getElementById('spray-text');

    form.onsubmit = (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      sprayTag(val);
    };

    // 1. Instant local load
    const saved = loadLocalTags();
    if (saved.length > 0) {
      tags = saved;
      renderTags();
      if (window._INIT_DATA) mergeServerData(window._INIT_DATA);
    } else if (window._INIT_DATA) {
      mergeServerData(window._INIT_DATA);
    } else {
      tags = [...DEFAULT_COMMUNITY_TAGS];
      saveLocalTags(tags);
      renderTags();
    }

    // 2. Background server sync
    if (window.gem?.call) {
      window.gem.call('/', { load: 1 }).then(mergeServerData).catch(() => {});
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
