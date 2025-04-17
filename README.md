# Guestbook API with Cloudflare Worker & D1

Welcome! This project is a **serverless guestbook/comments API** built with Cloudflare Workers and Cloudflare D1 It powers a comment section for a static resume/portfolio website hosted on Cloudflare Pages(Website files included in the repository).

---

## ✨ Features

- **REST API** for comments at `/api/comments`
  - `GET` with pagination: `?page=1&limit=4`
  - `POST` to add a new comment
- **Persistent storage** using Cloudflare D1 (SQLite)
- **CORS support** for easy frontend integration
- **Timestamps in EST** for all comments
- **Sample data** included on first migration
- **Ready for production or demo use**

---

## 🏗️ Project Structure

```
guestbook-worker/
├── migrations/
│   └── 0001_create_comments_table.sql   # D1 schema & sample data
├── src/
│   └── index.ts                         # Cloudflare Worker source
├── wrangler.json                        # Worker & D1 config
└── README.md                            # This file!
```

---

## 🚀 How It Works

- **GET `/api/comments?page=1&limit=4`**  
  Returns paginated comments and the total count:
  ```json
  {
    "comments": [
      { "author": "Kristian", "content": "Congrats!", "created_at": "2025-04-16T13:45:00" }
      // ...
    ],
    "total": 17
  }
  ```

- **POST `/api/comments`**  
  Accepts JSON `{ "author": "Your Name", "content": "Your comment" }`  
  Stores the comment with the current EST time.

- **CORS**  
  All API responses include CORS headers, so you can call this API from any frontend.

---

## 🛠️ Local Development & Testing

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/):  
  Install with `npm install -g wrangler`
- Cloudflare account with D1 enabled

### 1. Clone & Install

```bash
git clone <this-repo>
cd guestbook-worker
npm install
```

### 2. Configure Wrangler

- Ensure your `wrangler.json` has the correct D1 database binding and ID.
- Log in to Cloudflare:  
  ```bash
  npx wrangler login
  ```

### 3. Run Migrations

**For remote D1 (production):**
```bash
npx wrangler d1 migrations apply guestbook --remote
```

**For local preview (optional):**
```bash
npx wrangler d1 migrations apply guestbook
```

### 4. Start the Worker Locally

```bash
npx wrangler dev
```
- The API will be available at `http://localhost:8787/api/comments`

### 5. Test the API

- **GET comments:**  
  Visit [http://localhost:8787/api/comments](http://localhost:8787/api/comments) in your browser.
- **POST a comment:**  
  Use `curl`:
  ```bash
  curl -X POST http://localhost:8787/api/comments \
    -H "Content-Type: application/json" \
    -d '{"author":"Test User","content":"Hello from local!"}'
  ```

---

## 🌐 Deploy to Cloudflare

```bash
npx wrangler deploy
```
- Your API will be live at `https://<your-worker-subdomain>.workers.dev/api/comments`

---

## 📝 Frontend Integration

- Use `fetch()` in your website’s JS to call the API.
- Display `created_at` using:
  ```js
  new Date(comment.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' })
  ```


Built by Eric Farag.  
Powered by Cloudflare Workers & D1.