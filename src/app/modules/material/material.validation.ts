import { z } from 'zod';

const createMaterialZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    caratId: z.string({
      required_error: 'Carat id is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
  }),
});

const updateMaterialZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    caratId: z.string().optional(),
  }),
});

export const MaterialValidation = {
  createMaterialZodSchema,
  updateMaterialZodSchema,
};
