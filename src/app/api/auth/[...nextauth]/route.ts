import {handlers} from '@/auth'; // Referring to the auth.ts we just created

export const runtime = 'nodejs'; // This explicitly sets Node.js runtime
export const dynamic = 'force-dynamic'; // Force dynamic rendering for this route

export const {GET, POST} = handlers;
