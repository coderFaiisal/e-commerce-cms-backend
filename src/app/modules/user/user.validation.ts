import { z } from 'zod';

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
};
