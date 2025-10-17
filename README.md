# Boby AI - Character Chat Application

A modern, mobile-first character chat application built with Next.js, featuring real-time AI conversations powered by Groq's LLM API and Supabase for authentication and data storage.

## 🌟 Live Demo

🔗 **[View Live Demo on Vercel](https://boby-ai-character-chat-app.vercel.app/)**

## 📖 Overview

Boby AI is a Character.AI-style chat application that showcases modern web development skills with a focus on mobile-first UI/UX design, smooth animations, and real-time AI interactions. Users can chat with 5 unique AI characters, each with their own personality and conversation style.

## ✨ Features

### Core Features
- **Google Authentication**: Secure sign-in with Google OAuth via Supabase Auth
- **Multiple AI Characters**: Chat with 5 unique AI personalities with distinct conversation styles
- **Real-time Messaging**: Instant message synchronization across devices using Supabase real-time subscriptions
- **Streaming Responses**: Real-time AI response streaming powered by Groq API for better UX
- **Message History**: Persistent chat history for all conversations with database storage
- **Chat Management**: Create, view, and delete chat sessions

### UI/UX Features
- **Mobile-First Design**: Fully responsive layout optimized for mobile devices (320px+)
- **Smooth Animations**: Framer Motion powered animations throughout the app
  - Page transitions
  - Message enter/exit animations
  - Loading states with skeleton screens
  - Button interaction feedback
  - Micro-interactions on hover and tap
- **Modern UI Components**: Built with Tailwind CSS, shadcn/ui, and Radix UI
- **Bottom Navigation**: Intuitive navigation between chats and character selection
- **Touch-Friendly**: Minimum 44px touch targets for better mobile experience
- **Loading States**: Visible loading indicators throughout the app
- **Error Handling**: Clear error messages and recovery options
- **Empty States**: Well-designed empty states for better user guidance

## 🎨 Characters

- **Luna 🌙**: A mystical and wise AI who speaks in poetic riddles
- **Spark ⚡**: An energetic tech genius who loves innovation
- **Sage 🧘**: A calm mentor focused on wisdom and personal growth
- **Nova ✨**: A creative artist who sees the world through imagination
- **Echo 🎭**: A playful companion who loves humor and storytelling

## 🛠️ Technologies

### Framework & Language
- **Next.js 15** (App Router) with TypeScript
- **React 19**

### Backend & Database
- **Supabase**: PostgreSQL database, authentication, and real-time subscriptions
- **Supabase Auth**: Google OAuth integration

### AI
- **Groq API**: Llama 3.3 70B model for AI conversations with streaming support

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Re-usable component library
- **Radix UI**: Unstyled, accessible UI components
- **Framer Motion**: Animation library

### Deployment
- **Vercel**: Hosting and deployment platform

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** and npm/yarn
- **Supabase account**: [Sign up at supabase.com](https://supabase.com)
- **Groq API key**: [Get your API key at console.groq.com](https://console.groq.com)
- **Google OAuth credentials**: [Get from Google Cloud Console](https://console.cloud.google.com)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/muhsiindeniiz/boby-ai-character-chat-app.git
cd boby-ai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:
```env
# Deployment Environment
NEXT_PUBLIC_DEPLOY_ENV=development

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Groq API
GROQ_API_KEY=your_groq_api_key
```

### 4. Set Up Supabase Database

#### a. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

#### b. Run the Database Migration

Go to your Supabase project dashboard, navigate to the SQL Editor, and run the following SQL:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS chats_user_id_idx ON chats(user_id);
CREATE INDEX IF NOT EXISTS chats_updated_at_idx ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON messages(chat_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats table
CREATE POLICY "Users can view their own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages from their chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard → **Authentication** → **Providers**
2. Enable the **Google** provider
3. Add your **Google Client ID** and **Client Secret**
4. Add the authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 6. Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key and copy it to your `.env.local` file

### 7. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure
```
.
├── app/                          # Next.js 15 App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Streaming chat API endpoint
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   └── sign-in/
│   │       └── page.tsx          # Google sign-in page
│   ├── characters/
│   │   └── page.tsx              # Character selection interface
│   ├── chat/
│   │   ├── [chatId]/
│   │   │   └── page.tsx          # Individual chat conversation
│   │   ├── loading.tsx           # Loading UI for chat list
│   │   └── page.tsx              # Chat history list
│   ├── error.tsx                 # Global error boundary
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page (auth redirect)
│
├── core/                         # Core infrastructure
│   ├── api/
│   │   ├── groq/
│   │   │   ├── client.ts         # Groq SDK client configuration
│   │   │   ├── utils.ts          # Message preparation & error handling
│   │   │   └── index.ts          # Public API exports
│   │   └── supabase/
│   │       ├── client.ts         # Browser Supabase client
│   │       ├── server.ts         # Server-side Supabase client
│   │       └── middleware.ts     # Session management middleware
│   └── ui/
│       ├── components/           # shadcn/ui base components
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── input.tsx
│       │   └── ...
│       └── type/
│           └── cva.ts            # Class variance authority types
│
├── modules/                      # Feature-based modules
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── use-auth.ts       # Authentication state hook
│   │   ├── providers/
│   │   │   └── auth-provider.tsx # Auth context provider
│   │   ├── utils/
│   │   │   └── auth.utils.ts     # Auth helper functions
│   │   └── view/
│   │       └── sign-in-page/     # Sign-in page component
│   │
│   ├── characters/
│   │   ├── components/
│   │   │   └── character-card/   # Character selection card
│   │   ├── constants/
│   │   │   └── characters.ts     # Character definitions & prompts
│   │   ├── types/
│   │   │   └── character.types.ts
│   │   └── view/
│   │       └── characters-page/  # Character selection page
│   │
│   └── chat/
│       ├── components/
│       │   ├── chat-list-item/   # Chat history item
│       │   ├── message-bubble/   # Message display with markdown
│       │   └── typing-indicator/ # Loading animation
│       ├── hooks/
│       │   ├── use-chat.ts       # Individual chat data
│       │   ├── use-chat-list.ts  # Chat history management
│       │   ├── use-messages.ts   # Real-time message sync
│       │   └── use-streaming.ts  # AI response streaming
│       ├── types/
│       │   └── chat.types.ts     # Chat & message types
│       └── view/
│           ├── chat-detail-page/ # Chat conversation interface
│           └── chat-list-page/   # Chat history page
│
├── packages/                     # Shared utilities & components
│   ├── asset/
│   │   ├── font/
│   │   │   ├── inter/            # Inter font family
│   │   │   └── sf-mono/          # SF Mono font family
│   │   ├── image/                # Static images
│   │   └── style/
│   │       └── global.scss       # Global styles
│   │
│   ├── component/
│   │   ├── bottom-navigation/    # Mobile navigation bar
│   │   ├── page-header/          # Page title header
│   │   ├── loading-skeleton/     # Loading placeholders
│   │   ├── empty-state/          # Empty state messages
│   │   └── error-state/          # Error messages
│   │
│   ├── constant/
│   │   └── font-collection.ts    # Font configurations
│   │
│   ├── hooks/
│   │   ├── use-classnames.ts     # Dynamic className helper
│   │   └── use-debounce.ts       # Debounce utility hook
│   │
│   ├── provider/
│   │   ├── client-layout/        # Client-side providers
│   │   ├── root-html/            # HTML root wrapper
│   │   └── root-body/            # Body wrapper with fonts
│   │
│   ├── theme/
│   │   └── palette.ts            # Color system configuration
│   │
│   ├── type/
│   │   └── common.ts             # Shared TypeScript types
│   │
│   └── utils/
│       ├── cn.ts                 # Tailwind class merger
│       ├── format-date.ts        # Date formatting utilities
│       ├── truncate-text.ts      # Text truncation helper
│       └── cookie.ts             # Cookie management
│
└── public/                       # Static assets served at root
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import your repository in Vercel**
   - Go to [https://boby-ai-character-chat-app.vercel.app/](https://boby-ai-character-chat-app.vercel.app/)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all environment variables from `.env.local` to Vercel project settings
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

### Environment Variables for Production

Make sure to add these environment variables in your Vercel project settings:
```env
NEXT_PUBLIC_DEPLOY_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GROQ_API_KEY=your_groq_api_key
```

## 📱 Page Structure & User Flow

### Routes
- `/` → Home page (redirects to `/chat` if authenticated, `/auth/sign-in` if not)
- `/auth/sign-in` → Sign-in page with Google OAuth
- `/auth/callback` → OAuth callback handler
- `/chat` → Chat list (history of all conversations)
- `/chat/[chatId]` → Individual chat interface
- `/characters` → Character selection page

### User Flow
1. User visits the app
2. Signs in with Google OAuth
3. Redirected to chat list page
4. User can:
   - Click "New Chat" to select a character
   - Click on existing chat to continue conversation
5. In character selection, user picks a character
6. Redirected to new chat interface
7. User sends messages and receives AI responses in real-time
8. Can navigate between pages using bottom navigation

## 🎯 Features in Detail

### Authentication
- **Google OAuth** integration via Supabase Auth
- **Session persistence** across page refreshes
- **Protected routes** with automatic redirects
- **Secure token management** using Supabase

### Chat System
- **Create conversations** with any character
- **Real-time message synchronization** using Supabase real-time
- **Streaming AI responses** with Groq API
- **Persistent message history** in PostgreSQL
- **Delete chats** with cascade deletion of messages

### AI Integration
- **Groq API** with Llama 3.3 70B model
- **Streaming responses** for better UX
- **Character-specific system prompts** for unique personalities
- **Error handling** with retry logic
- **Token management** to stay within limits

### UI/UX Highlights
- **Mobile-first responsive design** (320px to desktop)
- **Smooth page transitions** with Framer Motion
- **Message animations** for entering and exiting
- **Loading states** with skeleton screens
- **Empty states** with helpful guidance
- **Error handling** with clear messages
- **Bottom navigation** for easy page switching
- **Touch-friendly interface** with 44px+ touch targets
- **Markdown support** in messages with syntax highlighting

### Performance Optimizations
- **Optimized bundle size** with code splitting
- **Lazy loading** of components
- **Efficient re-renders** with React memoization
- **Database indexing** for faster queries
- **Real-time subscriptions** for instant updates
- **Edge runtime** for API routes

## 🔧 Development

### Available Scripts
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check code formatting
npm run prettier-check

# Fix code formatting
npm run prettier-fix

# Format all code
npm run format

# Type checking
npm run typescript-check

# Lint code
npm run eslint-check

# Fix lint issues
npm run eslint-fix

# Run all checks
npm run lint
```
