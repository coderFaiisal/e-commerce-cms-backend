import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    plan: z.string({
      required_error: 'Subscription plan is required.',
    }),
    endTime: z.coerce.date({
      required_error: 'End time is required.',
    }),
    totalCost: z.number({
      required_error: 'Total cost required.',
    }),
  }),
});

export const SubscriptionValidation = {
  createSchema,
};
