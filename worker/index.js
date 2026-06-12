const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Pin',
};

const ADMIN_PIN = "2222";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    try {
      /* ── GET /api/menu → devuelve el menú completo ── */
      if (path === '/api/menu' && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT value FROM kv_store WHERE key = ?').bind('menu').first();
        if (!row) return new Response('null', { headers: { ...CORS, 'Content-Type': 'application/json' } });
        return new Response(row.value, { headers: { ...CORS, 'Content-Type': 'application/json' } });
      }

      /* ── POST /api/menu → guarda el menú completo ── */
      if (path === '/api/menu' && request.method === 'POST') {
        const pin = request.headers.get('X-Admin-Pin');
        if (pin !== ADMIN_PIN) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
        const body = await request.text();
        JSON.parse(body); // validar JSON
        await env.DB.prepare('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)').bind('menu', body).run();
        return new Response(JSON.stringify({ ok: true }), { headers: CORS });
      }

      /* ── POST /api/foto → guarda foto base64 de un plato ── */
      if (path === '/api/foto' && request.method === 'POST') {
        const pin = request.headers.get('X-Admin-Pin');
        if (pin !== ADMIN_PIN) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
        const { id, base64 } = await request.json();
        await env.DB.prepare('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)').bind('foto_' + id, base64).run();
        return new Response(JSON.stringify({ ok: true, key: 'foto_' + id }), { headers: CORS });
      }

      /* ── GET /api/foto/:id ── */
      if (path.startsWith('/api/foto/') && request.method === 'GET') {
        const id = path.replace('/api/foto/', '');
        const row = await env.DB.prepare('SELECT value FROM kv_store WHERE key = ?').bind('foto_' + id).first();
        if (!row) return new Response('null', { headers: CORS });
        return new Response(JSON.stringify({ base64: row.value }), { headers: CORS });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: CORS });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
    }
  }
};
