// title: Гемострой
// about: Интерактивная кирпичная стена ожидания приложения
export default async (req, gem) => {
  if (req.method === 'POST') {
    if (!gem.user?.id) return {};
    const b = await req.json(), my = JSON.parse(await gem.store.get('w') || '[]');
    const t = b.msg?.trim().slice(0, 80);
    if (t) {
      my.push({ name: gem.user.name || 'Я', text: t, color: b.color || '#ff4757' });
      if (my.length > 50) my.shift();
      await gem.store.set('w', JSON.stringify(my));
      try { await gem.board('w').add(Date.now() / 1e3 | 0, t); } catch {}
    }
    let bd; try { bd = await gem.board('w').top(50); } catch {}
    return { my, bd };
  }

  return `<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Гемострой</title></head><body>
<div id="root"></div>
<script src="https://mikemint.github.io/wall-miniapp/app.js?v=${Date.now()}"></script>
</body></html>`;
};
