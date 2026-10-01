// title: Гемострой
// about: Интерактивная кирпичная стена ожидания приложения
let wall = [
  { name: 'Бригадир', text: 'ГЕМОСТРОЙ', color: '#ff4757', time: 1 },
  { name: 'Технадзор', text: '42 ДНЯ БЕЗ КОММИТОВ', color: '#ffa502', time: 2 },
  { name: 'Ждун', text: 'КОГДА АПП?!', color: '#00d2d3', time: 3 },
  { name: 'Mike', text: 'ГДЕ ГЕМЫ?', color: '#00d2d3', time: 4 },
  { name: 'Mike', text: 'НУ И КАК ДЕЛА?', color: '#ffa502', time: 5 },
  { name: 'Mike', text: 'НЕУЖЕЛИ Я ТУТ ОДИН?', color: '#ff4757', time: 6 },
  { name: 'Я', text: '/MYAPPS', color: '#ffa502', time: 7 },
  { name: 'Я', text: 'УМНЕЕ OPUS 5', color: '#9b59b6', time: 8 },
  { name: 'Я', text: 'ГДЕ $1?!', color: '#ff4757', time: 9 },
  { name: 'Я', text: 'ТАКТИКА БЫЛА', color: '#2ed573', time: 10 },
  { name: 'Я', text: '802 ОПТИМИСТА', color: '#00d2d3', time: 11 }
];

export const live = gem => {
  gem.hall({
    join(player) {
      gem.to(player, { wall: wall });
    },
    message(player, msg) {
      if (msg && msg.text) {
        const author = player && player.name ? player.name : (msg.name ? msg.name : 'Аноним');
        const item = {
          name: author,
          text: String(msg.text).trim().slice(0, 80),
          color: msg.color ? msg.color : '#ff4757',
          time: Date.now()
        };
        const k = item.text.toLowerCase();
        wall = wall.filter(t => (t.text ? t.text.toLowerCase() : '') !== k);
        wall.push(item);
        if (wall.length > 70) wall.shift();
        gem.all({ wall: wall, newTag: item });
      }
    }
  });
};

export default async (req, gem) => {
  if (req.method === 'POST') {
    let b = {};
    try { b = await req.json(); } catch(e) {}
    if (b.msg) {
      const author = gem.user && gem.user.name ? gem.user.name : (b.name ? b.name : 'Я');
      const item = {
        name: author,
        text: String(b.msg).trim().slice(0, 80),
        color: b.color ? b.color : '#ff4757',
        time: Date.now()
      };
      const k = item.text.toLowerCase();
      wall = wall.filter(t => (t.text ? t.text.toLowerCase() : '') !== k);
      wall.push(item);
      if (wall.length > 70) wall.shift();
      try { await gem.store.set('w', JSON.stringify(wall.slice(-35))); } catch(e) {}
    }
    return { wall: wall };
  }

  try {
    const raw = await gem.store.get('w');
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        saved.forEach(s => {
          const k = s.text ? s.text.toLowerCase() : '';
          if (k && !wall.some(x => (x.text ? x.text.toLowerCase() : '') === k)) {
            wall.push(s);
          }
        });
      }
    }
  } catch(e) {}

  const initData = JSON.stringify({ wall: wall }).replace(/</g, '\\u003c');

  return `<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name=theme-color content="#151515">
<title>Гемострой</title>
<style>html,body{margin:0;padding:0;background:#0c0303;height:100%;width:100%;overflow:hidden;}</style>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
if(window.Telegram?.WebApp){
  try{
    Telegram.WebApp.ready();
    if(Telegram.WebApp.setHeaderColor) Telegram.WebApp.setHeaderColor('#151515');
    if(Telegram.WebApp.setBackgroundColor) Telegram.WebApp.setBackgroundColor('#0c0303');
    if(Telegram.WebApp.setBottomBarColor) Telegram.WebApp.setBottomBarColor('#0c0303');
  }catch(e){}
}
window._INIT_DATA = ${initData};
</script>
</head><body>
<div id="root"></div>
<script src="https://mikemint.github.io/wall-miniapp/app.js?v=${Date.now()}"></script>
</body></html>`;
};
