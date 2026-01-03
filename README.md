# Fallout 4: Start Me Up Random Character Generator

A web application for generating random character builds for Fallout 4 using the [Start Me Up mod](https://www.nexusmods.com/fallout4/mods/18946). This tool helps players create unique, randomized characters with custom SPECIAL stats, traits, backgrounds, and starting locations to enhance replayability and create fresh playthroughs.

## 🎮 Features

- **Random Character Generation**: Create unique characters with randomized attributes
- **SPECIAL Stats Builder**: Customize your character's S.P.E.C.I.A.L. attributes (Strength, Perception, Endurance, Charisma, Intelligence, Agility, Luck)
- **Character Traits**: Choose from a wide variety of traits that modify gameplay (e.g., Gifted, Fast Shot, Bruiser)
- **Background/Jobs System**: Select character backgrounds that define your pre-war profession
- **Starting Locations**: Choose from multiple starting points across the Commonwealth
- **Character Management**: Save, view, and track all your created characters
- **Dashboard Analytics**: View statistics about your character builds and preferences
- **User Authentication**: Secure sign-in with Clerk to manage your personal character library

## 🛠️ Technology Stack

This project is built with the [T3 Stack](https://create.t3.gg/), featuring:

- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Drizzle ORM](https://orm.drizzle.team)** - TypeScript ORM for SQL databases
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database via Vercel Postgres
- **[Clerk](https://clerk.com/)** - User authentication and management
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v9 or higher) - `npm install -g pnpm`
- **PostgreSQL** (local instance or cloud database)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/schererja/f4-startmeup-random.git
cd f4-startmeup-random
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/f4-startmeup-random"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

To get Clerk credentials:
1. Sign up at [clerk.com](https://clerk.com/)
2. Create a new application
3. Copy the API keys from the dashboard

### 4. Database Setup

#### Start PostgreSQL Database

If using a local PostgreSQL instance, you can use the provided script:

```bash
./start-database.sh
```

Or manually start your PostgreSQL service.

#### Push Schema to Database

```bash
pnpm db:push
```

#### Seed Database (Optional)

Populate the database with default traits, jobs, and locations:

```bash
pnpm db:seed
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with default data

## 📁 Project Structure

```
f4-startmeup-random/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── _components/          # Shared components
│   │   │   ├── characters/       # Character-related components
│   │   │   ├── jobs/            # Job/background components
│   │   │   ├── locations/       # Location components
│   │   │   ├── specials/        # SPECIAL stats components
│   │   │   └── traits/          # Trait components
│   │   ├── characters/          # Character pages
│   │   ├── dashboard/           # Dashboard page
│   │   ├── jobs/                # Jobs management page
│   │   ├── locations/           # Locations management page
│   │   ├── specials/            # SPECIAL stats page
│   │   └── traits/              # Traits management page
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # shadcn/ui components
│   ├── server/                  # Server-side code
│   │   ├── api/                 # tRPC API routes
│   │   │   └── routers/         # API route handlers
│   │   └── db/                  # Database configuration
│   │       ├── schema.ts        # Drizzle schema definitions
│   │       └── seed.ts          # Database seeding script
│   ├── lib/                     # Utility functions
│   ├── styles/                  # Global styles
│   ├── trpc/                    # tRPC client/server setup
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
├── drizzle/                     # Drizzle migrations
└── __tests__/                   # Test files
```

## 🎯 Usage

### Creating a Character

1. Sign in using the authentication button in the top navigation
2. Navigate to "New Character" page
3. Enter a character name
4. Set SPECIAL stats (S.P.E.C.I.A.L. attributes must total 28 points)
5. Select a trait that fits your playstyle
6. Choose a background/job for your character
7. Pick a starting location in the Commonwealth
8. Click "Create Character" to save

### Viewing Characters

- Navigate to the "Characters" page to see all your created characters
- Click on a character to view detailed information
- View statistics on the Dashboard page

### Managing Game Data

Administrators can manage:
- **Traits**: Add or modify character traits
- **Jobs**: Create or edit character backgrounds
- **Locations**: Add or update starting locations

## 🧪 Testing

This project uses Vitest and React Testing Library for testing. See [TESTING.md](./TESTING.md) for detailed testing documentation.

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test -- --watch
```

View test coverage:
```bash
pnpm test:coverage
```

## 🔒 Authentication

This application uses [Clerk](https://clerk.com/) for authentication. Users must sign in to:
- Create and save characters
- View their character history
- Access the dashboard

## 🗄️ Database Schema

The application uses four main tables:

- **characters** - Stores character builds with references to SPECIAL stats, jobs, traits, and locations
- **specialStats** - SPECIAL attribute values (Strength, Perception, etc.)
- **traits** - Character traits that modify gameplay
- **jobs** - Character backgrounds/professions
- **locations** - Starting locations in the game

All tables use UUIDs for relationships and include timestamp fields for tracking creation/updates.

## 🌐 Deployment

This application can be deployed to:

- **[Vercel](https://vercel.com)** (Recommended) - Optimized for Next.js
- **[Netlify](https://www.netlify.com/)**
- **[Docker](https://www.docker.com/)**

Ensure environment variables are configured in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Related Resources

- [Start Me Up Mod on Nexus Mods](https://www.nexusmods.com/fallout4/mods/18946)
- [Fallout 4 on Steam](https://store.steampowered.com/app/377160/Fallout_4/)
- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This project is for personal and educational use. Fallout 4 and related trademarks are property of Bethesda Softworks LLC.

## 🐛 Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/schererja/f4-startmeup-random/issues) on GitHub.
