import {router, publicProcedure} from '../trpc';
// import {ZUpdateProfileInputSchema} from '../schemas/profile.schema';
// import {
//   updateProfileHandler,
//   completeOnboardingHandler
// } from '../handlers/profile.handler';
import {protectedProcedure} from '../middleware';
import {z} from 'zod';
import {cookies} from 'next/headers';
import {
  ZCreateAvailabilitySchema,
  ZUpdateAvailabilitySchema
} from '../schemas/availability.schema';

export const availabilityRouter = router({
  // Get all availabilities for the current user
  getAll: protectedProcedure.query(async ({ctx}) => {
    return ctx.prisma.availability.findMany({
      where: {
        userId: ctx.session?.user.id
      },
      include: {
        schedule: {
          include: {
            user: true,
            availability: true
          }
        }
      }
    });
  }),

  // Get availability by ID
  getById: protectedProcedure
    .input(z.object({id: z.number()}))
    .query(async ({ctx, input}) => {
      return ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        },
        include: {
          schedule: true
        }
      });
    }),

  // Create a new availability
  create: protectedProcedure
    .input(ZCreateAvailabilitySchema)
    .mutation(async ({ctx, input}) => {
      return ctx.prisma.availability.create({
        data: {
          ...input,
          userId: ctx.session?.user.id
        },
        include: {
          schedule: true
        }
      });
    }),

  // Update an existing availability
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ZUpdateAvailabilitySchema
      })
    )
    .mutation(async ({ctx, input}) => {
      // First check if the availability belongs to the user
      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        }
      });

      if (!existingAvailability) {
        throw new Error(
          "Availability not found or you don't have permission to update it"
        );
      }

      return ctx.prisma.availability.update({
        where: {
          id: input.id
        },
        data: input.data,
        include: {
          schedule: true
        }
      });
    }),

  // Delete an availability
  delete: protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({ctx, input}) => {
      // First check if the availability belongs to the user
      const existingAvailability = await ctx.prisma.availability.findFirst({
        where: {
          id: input.id,
          userId: ctx.session?.user.id
        }
      });

      if (!existingAvailability) {
        throw new Error(
          "Availability not found or you don't have permission to delete it"
        );
      }

      return ctx.prisma.availability.delete({
        where: {
          id: input.id
        }
      });
    })
});
