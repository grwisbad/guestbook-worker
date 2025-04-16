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

    if (url.pathname === '/api/comments') {
      if (request.method === 'GET') {
        // Pagination parameters
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "4", 10);
        const offset = (page - 1) * limit;

        // Get total count
        const totalResult = await env.DB.prepare("SELECT COUNT(*) as count FROM comments").first();
        const total = totalResult ? totalResult.count : 0;

        // Get paginated comments
        const { results } = await env.DB.prepare(
          "SELECT author, content, created_at FROM comments ORDER BY created_at DESC LIMIT ? OFFSET ?"
        ).bind(limit, offset).all();

        return new Response(
          JSON.stringify({ comments: results, total }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (request.method === 'POST') {
        const data = await request.json();
        if (!data.author || !data.content) {
          return new Response(JSON.stringify({ error: "Missing author or content" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        await env.DB.prepare(
          "INSERT INTO comments (author, content) VALUES (?, ?)"
        ).bind(data.author, data.content).run();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  },
};
