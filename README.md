# Pastebin Application

A Pastebin-like web application where users can create text pastes and share them via unique URLs. Pastes support optional time-based expiry (TTL) and view count limits.

## Live Demo

**Deployed URL:** https://pastebin-lite-eta-three.vercel.app

## How to Run Locally

### Prerequisites
- Node.js 18 or higher
- npm

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/harleenkaur1343/pastebin_lite.git
cd pastebin_lite
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the project root:
```env
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
TEST_MODE=0
```

**To get Redis credentials:**
- Sign up at [Upstash](https://upstash.com/)
- Create a new Redis database
- Copy the REST API URL and Token from the database details

4. **Run the development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3000
```

## Persistence Layer

This application uses **Upstash Redis** as its persistence layer.

**Why Upstash Redis:**
- Fully compatible with serverless environments (Vercel)
- Native TTL (time-to-live) support for automatic paste expiry unlike Mongodb
- Atomic operations for safe concurrent view counting
- Fast key-value storage ideal for paste data 
- Free tier available


## Key Design Decisions

1. **Combined Constraints:** When both TTL and max_views are set, the paste becomes unavailable when the first constraint triggers
2. **Atomic View Counting:** Each API fetch increments the view count and checks limits in the same operation
3. **Deterministic Testing:** Supports `TEST_MODE=1` with `x-test-now-ms` header for automated expiry testing
4. **Consistent 404s:** All unavailable states (expired, view-limited, missing) return the same 404 response
5. **XSS Prevention:** Content is rendered safely using React's automatic HTML escaping

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste (counts as a view)
- `GET /p/:id` - View paste as HTML page

## Tech Stack

- Next.js 16 (TypeScript) - for frontend and backend deployment in same place i.e. on vercel
- Upstash Redis
- Tailwind CSS - minimal setup, easy to use
- Deployed on Vercel