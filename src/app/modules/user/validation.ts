import { z } from 'zod';

const signUpSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
    role: z.string().optional(),
    phoneNumber: z.string().optional(),
    image: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
  }),
});

const signInSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required!',
    }),
    newPassword: z.string({
      required_error: 'New password is required!',
    }),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New password is required!',
    }),
  }),
});

const accessTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    image: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
  }),
});

export const UserValidation = {
  signUpSchema,
  signInSchema,
  updateSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  accessTokenSchema,
};
