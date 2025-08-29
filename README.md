# AI_FOR_DEVS Polls

A modern polling application built with Next.js 14, TypeScript, and Shadcn UI components. Create, share, and participate in polls with the developer community.

## 🚀 Features

- **User Authentication**: Secure login and registration system
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
- **Authentication**: Custom auth provider (ready for backend integration)

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
│   │   └── AuthProvider.tsx      # Auth context provider
│   ├── layout/                   # Layout components
│   │   └── Navigation.tsx        # Main navigation
│   └── ui/                       # Shadcn UI components
├── lib/                          # Utility libraries
│   ├── api.ts                    # API utility functions
│   └── types.ts                  # TypeScript type definitions
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## 🎯 Key Components

### Authentication System
- **AuthProvider**: Context provider for user authentication state
- **Login/Register Pages**: Clean, responsive authentication forms
- **Navigation**: Dynamic navigation with user status

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

## 📋 Available Routes

- `/` - Home page with app overview
- `/login` - User login page
- `/register` - User registration page
- `/polls` - Browse all polls
- `/polls/create` - Create a new poll
- `/polls/[id]` - View and vote on a specific poll

## 🔧 Development

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
