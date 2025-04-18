# tRPC Server Structure

This directory contains the tRPC server implementation for the application.

## Directory Structure

```bash
trpc/
├── client/
│   └── index.ts (client setup)
├── server/
│   ├── index.ts (main router that combines all sub-routers)
│   ├── trpc.ts (base tRPC setup)
│   ├── context.ts (context creation)
│   ├── middleware.ts (middleware like auth)
│   ├── routers/
│   │   ├── user.router.ts
│   │   ├── auth.router.ts
│   │   ├── profile.router.ts
│   │   ├── timezone.router.ts
│   │   └── cityTimezones.router.ts
│   ├── schemas/
│   │   ├── user.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   └── timezone.schema.ts
│   └── handlers/
│       ├── user.handler.ts
│       ├── auth.handler.ts
│       ├── profile.handler.ts
│       ├── timezone.handler.ts
│       └── cityTimezones.handler.ts
```

## Architecture

The tRPC server follows a modular architecture:

1. **Routers**: Define the API endpoints and their input/output types
2. **Schemas**: Define the validation schemas using Zod
3. **Handlers**: Implement the business logic for each endpoint
4. **Middleware**: Provide cross-cutting concerns like authentication

## Usage

To add a new endpoint:

1. Define the schema in the appropriate schema file
2. Implement the handler in the appropriate handler file
3. Add the endpoint to the appropriate router file
4. The endpoint will be automatically available through the main router

## Example

```typescript
// In schemas/user.schema.ts
export const ZGetUserSchema = z.object({
  id: z.string()
});

// In handlers/user.handler.ts
export async function getUserHandler(ctx: Context, input: typeof ZGetUserSchema._type) {
  return ctx.prisma.user.findUnique({
    where: { id: input.id }
  });
}

// In routers/user.router.ts
export const userRouter = router({
  get: publicProcedure
    .input(ZGetUserSchema)
    .query(({ ctx, input }) => getUserHandler(ctx, input))
});

// The endpoint is now available as trpc.user.get.query({ id: '123' })
```
