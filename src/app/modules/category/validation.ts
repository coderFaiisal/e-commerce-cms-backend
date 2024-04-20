import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required.',
    }),
    code: z.string({
      required_error: 'Code is required.',
    }),
    storeId: z.string({
      required_error: 'Store id is required.',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createSchema,
  updateSchema,
};
