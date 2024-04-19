import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Store name is required.',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Store name is required.',
    }),
  }),
});

export const StoreValidation = {
  createSchema,
  updateSchema,
};
