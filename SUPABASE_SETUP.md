# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Next.js polling app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ai-for-devs-polls` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase project credentials.

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Email Templates
- Go to **Email Templates** tab
- Customize the confirmation email template if desired

### Site URL
- Set your site URL (for development: `http://localhost:3000`)
- Add redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/login`
  - `http://localhost:3000/register`

### Email Confirmation
- Enable "Enable email confirmations" for production
- For development, you can disable this to allow immediate login

## 5. Create Database Tables (Optional)

If you want to store polls in Supabase, create these tables:

### Polls Table
```sql
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  options JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);
```

### Votes Table
```sql
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Polls are viewable by everyone" ON polls
  FOR SELECT USING (true);

CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (auth.uid() = created_by);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote once per poll" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/register`
3. Create a new account
4. Check your email for confirmation (if enabled)
5. Try logging in

## 7. Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Double-check your environment variables
   - Make sure you're using the anon key, not the service role key

2. **"Email not confirmed" error**
   - Check your email for the confirmation link
   - Or disable email confirmation in Supabase settings for development

3. **CORS errors**
   - Make sure your site URL is correctly set in Supabase
   - Add `http://localhost:3000` to allowed origins

4. **Redirect errors**
   - Verify redirect URLs in Supabase authentication settings
   - Make sure the callback URL is correct

## 8. Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Set the correct site URL in Supabase
3. Enable email confirmations
4. Configure proper redirect URLs for your domain
5. Set up proper CORS settings

## 9. Next Steps

Once authentication is working:

1. Connect your polls to the Supabase database
2. Implement real-time updates using Supabase subscriptions
3. Add user profiles and avatars
4. Implement poll analytics and reporting

Your Supabase authentication is now ready to use! 🚀
