// title: Гемострой
// about: Интерактивная кирпичная стена ожидания приложения
export default async (req, gem) => {
  let my = [];
  try {
    const raw = await gem.store.get('w');
    if (raw) my = JSON.parse(raw);
  } catch(e) {}

  if (req.method === 'POST') {
    let b = {};
    try { b = await req.json(); } catch(e) {}
    const t = b.msg ? String(b.msg).trim().slice(0, 80) : '';
    if (t) {
      const author = gem.user && gem.user.name ? gem.user.name : (b.name ? b.name : 'Я');
      const col = b.color ? b.color : '#ff4757';
      const item = { name: author, text: t, color: col, time: Date.now() };
      my.push(item);
      if (my.length > 50) my.shift();
      try { await gem.store.set('w', JSON.stringify(my)); } catch(e) {}
      try { await gem.board('w').add(Date.now(), JSON.stringify(item)); } catch(e) {}
    }
    let bd = [];
    try { bd = await gem.board('w').top(50); } catch(e) {}
    return { my: my, bd: bd ? bd : [] };
  }

  let bd = [];
  try { bd = await gem.board('w').top(50); } catch(e) {}
  const initData = JSON.stringify({ my: my, bd: bd ? bd : [] }).replace(/</g, '\\u003c');

  return `<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Гемострой</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
if(window.Telegram?.WebApp){
  try{
    Telegram.WebApp.ready();
    const p = Telegram.WebApp.platform;
    if(p === 'android' || p === 'ios') Telegram.WebApp.expand();
  }catch(e){}
}
window._INIT_DATA = ${initData};
</script>
</head><body>
<div id="root"></div>
<script src="https://mikemint.github.io/wall-miniapp/app.js?v=${Date.now()}"></script>
</body></html>`;
};
