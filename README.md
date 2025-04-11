<p align="center">
  <a href="https://alignui.com">
    <img src="./public/images/logo.svg" height="96">
    <h3 align="center">AlignUI Design System</h3>
  </a>
  <p align="center">The Design System You Need</p>
</p>

[Join the AlignUI Community](https://discord.gg/alignui)

# AlignUI Next.js TypeScript Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 🔸 Includes all styles
- 🔸 Ready-to-use Tailwind setup
- 🔸 All base components included
- 🔸 All utils included
- 🔸 Inter font setup
- 🔸 Dark mode toggle included

## Getting Started

**Install dependencies**

```bash
pnpm i
```

**Run the development server:**

```bash
pnpm dev
```

**Environment Variables Setup**

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Update the variables in `.env` with your own values

3. Generate a secure `AUTH_SECRET` using:

```bash
openssl rand -base64 32
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Setup

### First Time Setup

```bash
# Complete setup (installs dependencies, sets up database, and seeds data)
pnpm setup:full
```

### Daily Development

```bash
# Starts both the database and Next.js development server
pnpm dev:db
```

### Available Commands

#### Setup Commands
- `pnpm setup` - Install dependencies and generate Prisma client
- `pnpm setup:db` - Start database, push schema, and seed data
- `pnpm setup:full` - Complete project setup (dependencies + database)
- `pnpm reset:all` - Reset everything to a clean slate

#### Database Commands
- `pnpm db:start` - Start the PostgreSQL database
- `pnpm db:stop` - Stop the database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database
- `pnpm db:reset` - Reset and reseed the database

#### Development Commands
- `pnpm dev` - Start Next.js development server
- `pnpm dev:db` - Start database and Next.js server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm format:write` - Format code with Prettier

### Database Connection

The development database is accessible at:
- Host: localhost
- Port: 5450
- Database: markado
- User: postgres
- Password: (none, trust authentication)
