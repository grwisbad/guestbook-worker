export interface Env {
  DB: any;
}


export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/comments' && request.method === 'GET') {
      // Fetch comments from the D1 database
      const { results } = await env.DB.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/comments' && request.method === 'POST') {
      // Add a new comment to the D1 database
      const { author, content } = await request.json() as { author: string; content: string };
      await env.DB.prepare('INSERT INTO comments (author, content) VALUES (?, ?)')
        .bind(author, content)
        .run();
      return new Response('Comment added successfully!', { status: 201 });
    }

    return new Response('Not Found', { status: 404 });
  },
};
