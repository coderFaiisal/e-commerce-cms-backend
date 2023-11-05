import { z } from 'zod';

const createStoreZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Store name is required',
    }),
  }),
});

export const StoreValidation = {
  createStoreZodSchema,
};
