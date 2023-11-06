import { z } from 'zod';

const createProductZodSchema = z.object({
  body: z.object({
    storeId: z.string({
      required_error: 'Store id is required',
    }),
    categoryId: z.string({
      required_error: 'Category id is required',
    }),
    materialId: z.string({
      required_error: 'Material id is required',
    }),
    caratId: z.string({
      required_error: 'Carat id is required',
    }),
    name: z.string({
      required_error: 'Name is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    productCode: z.string().optional(),
    description: z.string({
      required_error: 'Description is required',
    }),
    images: z.array(
      z.string({
        required_error: 'Image url is required',
      }),
    ),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    status: z.string().optional(),
    stockQuantity: z.number({
      required_error: 'Stock quantity is required',
    }),
    materials: z.array(z.string()).optional(),
    dimensions: z.string().optional(),
    metalType: z.string().optional(),
    discounts: z.string().optional(),
    ratings: z.number().optional(),
    returnPolicy: z.string().optional(),
    customizable: z.boolean().optional(),
  }),
});

const updateProductZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    status: z.string().optional(),
    stockQuantity: z.number().optional(),
    materials: z.array(z.string()).optional(),
    dimensions: z.string().optional(),
    metalType: z.string().optional(),
    discounts: z.string().optional(),
    returnPolicy: z.string().optional(),
    customizable: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
