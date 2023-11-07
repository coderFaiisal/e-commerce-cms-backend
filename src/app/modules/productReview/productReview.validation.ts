import { z } from 'zod';

const createProductReviewZodSchema = z.object({
  body: z.object({
    review: z.string({
      required_error: 'Review is required',
    }),
    rating: z.number().optional(),
  }),
});

const updateProductReviewZodSchema = z.object({
  body: z.object({
    review: z.string({
      required_error: 'Review is required',
    }),
    rating: z.number().optional(),
  }),
});

export const ProductReviewValidation = {
  createProductReviewZodSchema,
  updateProductReviewZodSchema,
};
