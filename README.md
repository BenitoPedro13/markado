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

## CI/CD Setup

The project uses a GitHub webhook-based deployment system. When changes are pushed to the main branch, the webhook automatically triggers a deployment on the VPS

### Setting Up Deployment

1. **Generate Webhook Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Create Webhook Environment File**
   Create `.env.webhook` on your VPS with:
   ```
   PORT=9000
   WEBHOOK_SECRET=your-generated-secret
   ```

3. **Install Dependencies**
   ```bash
   pnpm add express dotenv
   ```

4. **Configure GitHub Webhook**
   - Go to repository Settings > Webhooks
   - Add new webhook
   - Set Payload URL to: `http://your-vps-ip:9000/deploy`
   - Content type: `application/json`
   - Secret: (same as WEBHOOK_SECRET)
   - Events: Select "Just the push event"

5. **Start Webhook Server**
   ```bash
   pm2 start ecosystem.config.js
   ```

### Deployment Process

When changes are pushed to the main branch:
1. GitHub sends a webhook to your VPS
2. The webhook server verifies the request
3. The server pulls the latest changes
4. Dependencies are installed
5. The application is rebuilt
6. PM2 restarts the application

### Files

- `deploy-webhook.js`: Webhook server that handles deployment
- `ecosystem.config.js`: PM2 configuration
- `.env.webhook`: Environment variables for the webhook server

### Security Notes

- Keep `.env.webhook` secure and never commit it to the repository
- The webhook secret should be kept private
- Consider using HTTPS for the webhook endpoint in production
