# AI Blog Platform

Production-ready AI-powered blog platform built with Next.js, TypeScript, Supabase, and OpenAI.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Server Actions**
- **Supabase** (PostgreSQL)
- **OpenAI** (server-side only)
- **Tailwind CSS**
- **Vercel** (deployment)

## Features

- 🚀 **SSG + ISR** for optimal performance
- 🔐 **Cookie-based admin authentication**
- 🛡️ **Middleware protection** for admin routes
- ✍️ **CRUD operations** for blog posts
- 🤖 **AI features**: generate excerpt, rewrite content, SEO title optimization
- 📱 **Responsive design** with Tailwind CSS

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file located at `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to `.env.local`

### 4. Get OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add it to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) (you'll be redirected to login).

## Project Structure

```
├── app/
│   ├── actions/          # Server Actions
│   │   ├── auth.ts      # Authentication actions
│   │   ├── posts.ts     # Blog post CRUD
│   │   └── ai.ts        # AI-powered features
│   ├── admin/           # Admin panel
│   │   ├── layout.tsx   # Admin layout with navigation
│   │   ├── login/       # Login page
│   │   └── page.tsx     # Admin dashboard
│   ├── blog/            # Public blog pages
│   │   └── [slug]/      # Individual post pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page (blog listing)
├── lib/
│   ├── supabase/        # Supabase client (server-only)
│   ├── openai/          # OpenAI client (server-only)
│   └── auth.ts          # Authentication utilities
├── middleware.ts        # Route protection middleware
├── types/               # TypeScript types
└── supabase/
    └── migrations/      # Database migrations
```

## Security

- ✅ Admin authentication via secure httpOnly cookies
- ✅ Middleware protection for all `/admin/*` routes
- ✅ Server-side only API keys (never exposed to client)
- ✅ Row Level Security (RLS) enabled in Supabase
- ✅ Server Actions for all data mutations

## AI Features

The platform includes three AI-powered features accessible from the admin panel:

1. **Generate Excerpt** - Automatically creates engaging post excerpts
2. **Generate SEO Title** - Optimizes titles for search engines
3. **Rewrite Content** - Rewrites content based on your instructions

All AI features use OpenAI's `gpt-4o-mini` model and are server-side only.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

The platform is optimized for Vercel with:
- Automatic ISR (Incremental Static Regeneration)
- Edge-ready middleware
- Optimized builds

## Development Guidelines

- **Server vs Client**: Always use Server Components by default. Mark with `'use client'` only when needed.
- **API Keys**: Never use OpenAI or Supabase in client components. Always use Server Actions.
- **Authentication**: Admin auth is cookie-based and server-only.
- **Type Safety**: Use TypeScript types from `types/database.ts` for database operations.

## License

MIT
