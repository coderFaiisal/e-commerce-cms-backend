import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    userEmail: z.string({
      required_error: 'User email is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
    orderItems: z.array(
      z.object({
        productId: z.string({
          required_error: 'Product id is required',
        }),
        quantity: z.number({
          required_error: 'Quantity is required',
        }),
      }),
    ),
    isPaid: z.boolean({
      required_error: 'isPaid is required',
    }),
    orderStatus: z.string().optional(),
    totalCost: z.number({
      required_error: 'Total cost is required',
    }),
    shippingCharge: z.number({
      required_error: 'Shipping charge is required',
    }),
    paymentMethod: z.string({
      required_error: 'Payment method is required',
    }),
    contactInformation: z.object({
      name: z.string({
        required_error: 'Name is required',
      }),
      email: z.string({
        required_error: 'Email is required',
      }),
      address: z.string({
        required_error: 'Address is required',
      }),
      phoneNumber: z.string({
        required_error: 'Phone number is required',
      }),
    }),

    shippingAddress: z.string({
      required_error: 'Shipping address is required',
    }),
    deliveryMethod: z.string({
      required_error: 'Delivery method is required',
    }),

    trackingNumber: z.string().optional(),
    discounts: z.string().optional(),
    giftMessage: z.string().optional(),
    giftWrapping: z.string().optional(),
    returnPolicy: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
