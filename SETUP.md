# Setup Guide

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file with required variables
- [ ] Set up Supabase project and run migration
- [ ] Set admin password in `.env.local`
- [ ] (Optional) Get OpenAI API key for AI features
- [ ] Run `npm run dev`

## Detailed Setup

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Run the migration
6. Go to Settings > API
7. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. OpenAI Setup (Optional)

OpenAI is only required for AI-powered features (generate excerpt, rewrite content, SEO title). The basic blog functionality works without it.

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it to `OPENAI_API_KEY` in `.env.local`

**Note**: Make sure you have credits in your OpenAI account.

### 3. Admin Password

Set a strong password in `.env.local`:

```env
ADMIN_PASSWORD=your_very_secure_password_here
```

This password will be required to access `/admin/*` routes.

### 4. Environment Variables Template

Create `.env.local`:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration (Optional - only for AI features)
OPENAI_API_KEY=sk-...

# Admin Authentication (Required)
ADMIN_PASSWORD=change_this_to_a_secure_password
```

### 5. Verify Setup

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000` - should show empty blog
3. Visit `http://localhost:3000/admin` - should redirect to login
4. Login with your admin password
5. You should see the admin dashboard

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has correct variable names
- Restart the dev server after adding variables

### "Missing OPENAI_API_KEY"
- Check that the key is in `.env.local`
- Verify the key is valid in OpenAI dashboard

### Database errors
- Make sure you ran the migration in Supabase SQL Editor
- Check that RLS policies are created correctly

### Authentication not working
- Check that `ADMIN_PASSWORD` is set in `.env.local`
- Clear browser cookies and try again
- Check browser console for errors

