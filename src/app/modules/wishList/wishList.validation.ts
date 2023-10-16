import { z } from 'zod';

const createWishListZodSchema = z.object({
  body: z.object({
    userEmail: z.string({
      required_error: 'User email is required',
    }),
    productId: z.string({
      required_error: 'Product is required',
    }),
  }),
});

export const WishListValidation = {
  createWishListZodSchema,
};
