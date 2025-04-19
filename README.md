# Markado - Calendar Integration Platform

<p align="center">
  <a href="https://alignui.com">
    <img src="./public/images/logo.svg" height="96">
    <h3 align="center">AlignUI Design System</h3>
  </a>
  <p align="center">The Design System You Need</p>
</p>
****
[Join the AlignUI Community](https://discord.gg/alignui)

## Table of Contents
- [Markado - Calendar Integration Platform](#markado---calendar-integration-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Development Guide](#development-guide)
    - [Environment Setup](#environment-setup)
    - [Database Setup](#database-setup)
    - [Available Commands](#available-commands)
      - [Setup and Installation](#setup-and-installation)
      - [Database Management](#database-management)
      - [Development](#development)
  - [Google Calendar Integration](#google-calendar-integration)
    - [Setup Guide](#setup-guide)
    - [Configuration](#configuration)
    - [Production Deployment](#production-deployment)
  - [Deployment](#deployment)
    - [CI/CD Setup](#cicd-setup)
    - [Security Guidelines](#security-guidelines)

## Overview

Markado is a Next.js application built with TypeScript that provides calendar integration capabilities. This project is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and uses the AlignUI design system.

## Features

- 🔸 Complete AlignUI Design System integration
- 🔸 Ready-to-use Tailwind CSS setup
- 🔸 Google Calendar integration
- 🔸 Authentication system
- 🔸 Database integration with Prisma
- 🔸 Dark mode support
- 🔸 TypeScript support
- 🔸 CI/CD pipeline

## Quick Start

1. **Install Dependencies**
   ```bash
   pnpm i
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Guide

### Environment Setup

1. **Initialize Environment**
   ```bash
   cp .env.example .env
   ```

2. **Generate Security Keys**
   ```bash
   # Generate AUTH_SECRET
   openssl rand -base64 32

   # Generate ENCRYPTION_KEY
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update Environment Variables**
   - Add the generated keys to your `.env` file
   - Configure other required variables

### Database Setup

The development database configuration:
- **Host**: localhost
- **Port**: 5450
- **Database**: markado
- **User**: postgres
- **Authentication**: Trust

### Available Commands

#### Setup and Installation
- `pnpm setup` - Install dependencies and generate Prisma client
- `pnpm setup:db` - Initialize database
- `pnpm setup:full` - Complete project setup
- `pnpm reset:all` - Reset project to initial state

#### Database Management
- `pnpm db:start` - Start PostgreSQL database
- `pnpm db:stop` - Stop database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database
- `pnpm db:reset` - Reset and reseed database

#### Development
- `pnpm dev` - Start Next.js server
- `pnpm dev:db` - Start database and Next.js
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm format:write` - Format code

## Google Calendar Integration

### Setup Guide

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing one

2. **Enable APIs**
   - Navigate to "APIs & Services" > "Library"
   - Enable required APIs:
     - Google Calendar API
     - Google People API

3. **Configure OAuth**
   - Set up OAuth consent screen
   - Configure scopes:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/calendar.events`
   - Add test users (for external apps)

### Configuration

1. **Create OAuth Credentials**
   - Create OAuth 2.0 client ID
   - Add redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3000/api/integrations/googlecalendar/callback
     ```

2. **Environment Variables**
   ```
   # Google OAuth
   AUTH_GOOGLE_ID="your-client-id"
   AUTH_GOOGLE_SECRET="your-client-secret"
   
   # Calendar Integration
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   GOOGLE_REDIRECT_URI="http://localhost:3000/api/integrations/googlecalendar/callback"
   ```

### Production Deployment

- Add production URLs to Google Cloud Console
- Update environment variables
- Configure production redirect URIs

## Deployment

### CI/CD Setup

The project uses GitHub Actions with a self-hosted runner for continuous integration and deployment.

1. **Set Up Self-Hosted Runner**
   - Go to your repository on GitHub
   - Navigate to Settings > Actions > Runners
   - Click "New self-hosted runner"
   - Follow the instructions provided by GitHub to:
     - Download the runner
     - Configure it
     - Start the runner service

2. **Environment Configuration**
   - Set up necessary environment files on the runner machine
   - Configure GitHub repository secrets for sensitive data
   - Set up PM2 for process management

3. **Deployment Process**
   When changes are pushed to the main branch:
   1. GitHub Actions workflow is triggered
   2. Self-hosted runner executes the workflow
   3. Code is pulled from the repository
   4. Dependencies are installed
   5. Application is built
   6. PM2 restarts the application

### Security Guidelines

- Use HTTPS in production
- Never commit sensitive data
- Regularly rotate secrets
- Keep runner machine secure and updated
- Monitor runner logs for suspicious activity
