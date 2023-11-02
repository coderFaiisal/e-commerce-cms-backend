import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.string().optional(),
    phoneNumber: z.string().optional(),
    image: z.string().optional(),
    reviews: z
      .array(
        z.object({
          productId: z.string().optional(),
          review: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

const signInAdinZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  signInAdinZodSchema,
  refreshTokenZodSchema,
};
