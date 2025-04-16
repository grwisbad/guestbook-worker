export interface Env {
  DB: any;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === '/api/comments' && request.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/comments' && request.method === 'POST') {
      const { author, content } = await request.json() as { author: string; content: string };
      await env.DB.prepare('INSERT INTO comments (author, content) VALUES (?, ?)')
        .bind(author, content)
        .run();
      return new Response('Comment added successfully!', { status: 201, headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};
