# Polling App - A Full-Stack Polling Application

The Polling App is a modern, full-stack polling application built with Next.js, Supabase, and shadcn/ui. It provides a complete platform for users to create, vote on, and manage polls, with a dedicated admin panel for site-wide management.

## Features

### Core User Features

- **Authentication**: Secure user sign-up, sign-in, and sign-out functionality powered by Supabase Auth.
- **Poll Creation**: Authenticated users can create new polls with a question and multiple options.
- **Poll Voting**: Users can cast their vote on any active poll. Voting is restricted to one vote per user per poll.
- **View Polls**: Users can browse and view a list of all polls.
- **Detailed Poll View**: A dedicated page for each poll shows its description, options, and real-time results.
- **Dynamic Results**: Poll results are displayed with vote counts and dynamic percentage bars.

### Admin & Management

- **Admin Dashboard**: A secure panel accessible only to designated admin users.
- **System-Wide Poll Management**: Admins can view and manage every poll created on the platform.
- **Delete Any Poll**: Admins have the authority to delete any poll, overriding ownership rules.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Data Fetching & Mutations**: React Server Components & Server Actions

## Getting Started

Follow these steps to get a local development environment running.

### Prerequisites

- Node.js (v18.18 or later)
- npm, yarn, or pnpm
- A free Supabase account

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai_for_devs
```

### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

You'll need a Supabase project to connect to. Once you have your project URL and anon key, create a `.env.local` file in the root of the project and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
ADMIN_USER_IDS="user-id-1,user-id-2,..."
```

Replace the placeholder values with your actual Supabase credentials.

### 4. Set Up Supabase Database

You will need to set up the following tables in your Supabase project:

*   `polls`: To store poll questions, descriptions, etc.
*   `options`: To store the options for each poll.
*   `votes`: To track user votes and prevent duplicates.

*(You can ask me to generate the `schema.sql` file for this!)*

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Admin Configuration

To designate a user as an admin, you need their Supabase User ID. You can find this in the "Authentication" section of your Supabase project dashboard.

Add one or more comma-separated User IDs to the `ADMIN_USER_IDS` variable in your `.env.local` file:

```env
ADMIN_USER_IDS="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx,yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
```

Users with these IDs will have access to the admin panel at `/admin` and will be able to perform administrative actions.
