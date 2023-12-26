import { z } from 'zod';

const createBannerZodSchema = z.object({
  body: z.object({
    label: z.string({
      required_error: 'Banner label is required',
    }),
    imageURL: z.string({
      required_error: 'Image url is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
  }),
});

const updateBannerZodSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    imageURL: z.string().optional(),
  }),
});

export const BannerValidation = {
  createBannerZodSchema,
  updateBannerZodSchema,
};
