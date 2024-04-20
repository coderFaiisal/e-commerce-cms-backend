import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    label: z.string({
      required_error: 'Label is required.',
    }),
    imageUrl: z.string({
      required_error: 'Image is required.',
    }),
    storeId: z.string({
      required_error: 'Store id is required.',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const BillboardValidation = {
  createSchema,
  updateSchema,
};
