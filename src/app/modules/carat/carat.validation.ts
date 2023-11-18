import { z } from 'zod';

const createCaratZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    value: z.string({
      required_error: 'Value is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
    categoryId: z.string({
      required_error: 'Category id is required',
    }),
  }),
});

const updateCaratZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    value: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const CaratValidation = {
  createCaratZodSchema,
  updateCaratZodSchema,
};
