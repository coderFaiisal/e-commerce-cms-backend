import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    images: z.string({
      required_error: 'Images email is required',
    }),
    price: z.string({
      required_error: 'Price is required',
    }),
    status: z.string({
      required_error: 'Status year is required',
    }),
    ratings: z.string({
      required_error: 'Rating is required',
    }),
  }),
});

const productReviewZodSchema = z.object({
  body: z.object({
    userName: z.string({
      required_error: 'User name is required',
    }),
    review: z.string({
      required_error: 'Review is required',
    }),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    images: z.string().optional(),
    price: z.string().optional(),
    status: z.string().optional(),
    ratings: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  productReviewZodSchema,
  updateProductZodSchema,
};
