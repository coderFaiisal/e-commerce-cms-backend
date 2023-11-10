import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    code: z.string({
      required_error: 'Code is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
    billboardId: z.string().optional(),
    products: z.array(z.string()).optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
};
