import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    type: z.string({
      required_error: 'Type is required.',
    }),
    name: z.string({
      required_error: 'Name is required.',
    }),
    value: z.string({
      required_error: 'Value is required.',
    }),
    storeId: z.string({
      required_error: 'Store id is required.',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    type: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
  }),
});

export const AttributeValidation = {
  createSchema,
  updateSchema,
};
