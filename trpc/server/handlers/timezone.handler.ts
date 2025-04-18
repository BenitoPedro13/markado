import { Context } from '../context';
import { ZTimezoneInputSchema } from '../schemas/timezone.schema';

export async function updateTimezoneHandler(ctx: Context, input: typeof ZTimezoneInputSchema._type) {
  if (!ctx.session?.user) {
    throw new Error('Not authenticated');
  }

  return ctx.prisma.user.update({
    where: { id: ctx.session.user.id },
    data: { timeZone: input.timezone }
  });
} 