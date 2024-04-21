import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    rating: z.number({
      required_error: 'Rating is required.',
    }),
    message: z.string().optional(),
    productId: z.string({ required_error: 'Product id required.' }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    rating: z.number().optional(),
    message: z.string().optional(),
  }),
});

export const ProductReviewValidation = {
  createSchema,
  updateSchema,
};
