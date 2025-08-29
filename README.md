# AI_FOR_DEVS Polls

A modern polling application built with Next.js 14, TypeScript, and Shadcn UI components. Create, share, and participate in polls with the developer community.

## 🚀 Features

- **User Authentication**: Secure login and registration system (with Supabase integration ready)
- **Poll Creation**: Create custom polls with multiple options
- **Poll Voting**: Participate in active polls with real-time results
- **Poll Management**: View, edit, and manage your created polls
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Live results and statistics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **Authentication**: Supabase (with localStorage fallback for development)

## 📁 Project Structure

```
ai_for_devs/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   └── layout.tsx            # Auth layout
│   ├── polls/                    # Polls feature
│   │   ├── page.tsx              # Polls listing page
│   │   ├── create/               # Create poll page
│   │   └── [id]/                 # Dynamic poll detail page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   │   ├── AuthProvider.tsx      # Auth context provider
│   │   └── ProtectedRoute.tsx    # Route protection component
│   ├── layout/                   # Layout components
│   │   └── Navigation.tsx        # Main navigation
│   └── ui/                       # Shadcn UI components
├── lib/                          # Utility libraries
│   ├── api.ts                    # API utility functions
│   ├── supabase.ts               # Supabase client configuration
│   └── types.ts                  # TypeScript type definitions
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🎯 Key Components

### Authentication System
- **AuthProvider**: Context provider for user authentication state
- **Login/Register Pages**: Clean, responsive authentication forms
- **Navigation**: Dynamic navigation with user status
- **ProtectedRoute**: Client-side route protection

### Poll Management
- **Polls Listing**: Grid layout showing all available polls
- **Poll Creation**: Form with dynamic option management
- **Poll Details**: Individual poll view with voting interface
- **Real-time Results**: Progress bars and vote counts

### UI Components
- **Shadcn UI**: Modern, accessible component library
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and transitions

## 🚀 Getting Started

### Quick Start (Development Mode)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Test authentication**:
   - Go to `/register` to create an account
   - Go to `/login` to sign in
   - Try accessing `/polls/create` (protected route)

### Supabase Integration (Optional)

For production-ready authentication:

1. **Follow the Supabase setup guide**: See `SUPABASE_SETUP.md`
2. **Create environment variables**: Copy `env.example` to `.env.local`
3. **Add your Supabase credentials**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 📋 Available Routes

- `/` - Home page with app overview
- `/login` - User login page
- `/register` - User registration page
- `/polls` - Browse all polls
- `/polls/create` - Create a new poll (protected)
- `/polls/[id]` - View and vote on a specific poll

## 🔧 Development

### Current Authentication System

The app currently uses a **fallback authentication system** that works without any backend:

- ✅ **Registration**: Creates user accounts in localStorage
- ✅ **Login**: Authenticates against localStorage data
- ✅ **Session Persistence**: Stays logged in across page refreshes
- ✅ **Protected Routes**: Client-side protection with `ProtectedRoute` component
- ✅ **User Display**: Shows user name and email in navigation

### Adding Supabase (Production)

When you're ready to add real authentication:

1. **Set up Supabase project** (see `SUPABASE_SETUP.md`)
2. **Add environment variables**
3. **Restart the app** - It will automatically switch to Supabase

### Adding New Features

1. **Create new pages** in the `app/` directory
2. **Add components** in the `components/` directory
3. **Define types** in `lib/types.ts`
4. **Add API functions** in `lib/api.ts`

### Styling

- Use Tailwind CSS classes for styling
- Leverage Shadcn UI components for consistency
- Follow the existing design patterns

### State Management

- Use the `AuthProvider` for user authentication
- Create new contexts for feature-specific state
- Keep components focused and reusable

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time polling with WebSockets
- [ ] User profiles and avatars
- [ ] Poll categories and filtering
- [ ] Advanced analytics and charts
- [ ] Social sharing features
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the developer community
