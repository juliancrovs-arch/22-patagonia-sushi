export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            const db = env.DB;

            // GET Menú
            if (path === '/api/menu' && request.method === 'GET') {
                const result = await db.prepare('SELECT * FROM dishes ORDER BY category, name').all();
                return new Response(JSON.stringify(result.results || []), { headers: corsHeaders });
            }

            // POST Plato
            if (path === '/api/menu' && request.method === 'POST') {
                const dish = await request.json();
                await db.prepare(
                    'INSERT INTO dishes (id, name, category, description, en, price, image, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                ).bind(dish.id, dish.name, dish.category, dish.desc, dish.en, dish.price, dish.image || null, dish.tag || null).run();
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // DELETE Plato
            if (path.match(/^\/api\/menu\/\d+$/) && request.method === 'DELETE') {
                const id = path.split('/').pop();
                await db.prepare('DELETE FROM dishes WHERE id=?').bind(parseInt(id)).run();
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            // GET Categorías
            if (path === '/api/categories' && request.method === 'GET') {
                const result = await db.prepare('SELECT * FROM categories ORDER BY name').all();
                return new Response(JSON.stringify(result.results || []), { headers: corsHeaders });
            }

            // POST Categoría
            if (path === '/api/categories' && request.method === 'POST') {
                const cat = await request.json();
                await db.prepare('INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?)').bind(cat.name, cat.icon).run();
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }

            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
        } catch (error) {
            console.error(error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
        }
    }
};
