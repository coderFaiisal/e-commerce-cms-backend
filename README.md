## Full Stack E-Commerce & Dashboard Backend

This is a repository for a Full Stack E-Commerce & Dashboard Backend.

Key Features:

- Custom Authentication & Authorization by JWT!
- Admin will be able to create, update and delete categories!
- Admin will be able to create, update and delete billboards!
- Admin will be able to create, update and delete materials!
- Admin will be able to create, update and delete carats!
- Admin will be able to create, update and delete products!
- Admin will be able to create, update and delete products!
- User will be able to create, update and delete order!
- Admin will be able to upload multiple images for products, and change them whenever you want!
- Admin will be able to create, update and delete filters such as "Material" and "Carat", and then match them in the "Product" creation form.
- Admin will be able to create, update and delete "Billboards" which are these big texts on top of the page. You will be able to attach them to a single category, or use them standalone.
- User will be able to Search and filter through all categories, products, materials, carats included pagination!
- Admin will be able to control which products are "featured" so they show on the homepage!
- User will be able to see their carts and orders.
- Admin will be able to see their orders, sales and etc.
- Admin will be able to see graphs of revenue etc.
- Stripe checkout
- Stripe webhooks

## Technologies

Project is created with:

- Typescript
- Node.js
- Express.js (Framework)
- MongoDB
- Mongoose (ODM)
- Zod (Data validation)
- Bcrypt (hash password)
- Robust project setup with eslint, prettier, husky & lint-staged

### Cloning the repository

```shell
git clone https://github.com/coderFaiisal/Timeless-backend.git
```

### Install packages

To run this project, install it locally using yarn:

```shell
yarn
```

### Setup .env file

```ts
NODE_ENV=
PORT=

DATABASE_URL=

BCRYPT_SALT_ROUNDS=

JWT_SECRET=
JWT_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
```

### Start the app locally

```shell
yarn dev
```

## Vercel Hosted Live API Link: https://timeless-backend.vercel.app

## Application Routes:

### Auth (User)

```ts
Create User: "https://timeless-backend.vercel.app/api/v1/auth/sign-up" (POST)
Signin User: "https://timeless-backend.vercel.app/api/v1/auth/sign-in" (POST)
Change Password: "https://timeless-backend.vercel.app/api/v1/auth/change-password" (POST)
Refresh Token: "https://timeless-backend.vercel.app/api/v1/auth/refresh-token" (POST)
```

### User

```ts
Get All Users: "https://timeless-backend.vercel.app/api/v1/users?search&filter" (GET) (Admin)
Get User Profile: "https://timeless-backend.vercel.app/api/v1/users/my-profile" (GET) (Auth User)
Get Single User: "https://timeless-backend.vercel.app/api/v1/users/64ee43b42c55973c5e376ac8" (Single GET) (Admin)
Update User Profile: "https://timeless-backend.vercel.app/api/v1/users/my-profile" (PATCH) (Auth User)
Delete User: "https://timeless-backend.vercel.app/api/v1/users/64ee43b42c55973c5e376ac8" (DELETE) (Auth User)
```

### Admin

```
Create Admin: "https://timeless-backend.vercel.app/api/v1/admins/create-admin" (POST)
Signin Admin: "https://timeless-backend.vercel.app/api/v1/admins/sign-in" (POST)
Change Password: "https://timeless-backend.vercel.app/api/v1/admins/change-password" (POST)
Refresh Token: "https://timeless-backend.vercel.app/api/v1/admins/refresh-token" (POST)
Get All Admins: "https://timeless-backend.vercel.app/api/v1/admins/" (GET) (Admin)
Get Admin Profile: "https://timeless-backend.vercel.app/api/v1/admins/my-profile" (GET) (Admin)
Get Single Admin: "https://timeless-backend.vercel.app/api/v1/admins/64ee43b42c55973c5e376ac8" (GET) (Admin)
Update Admin: "https://timeless-backend.vercel.app/api/v1/admins/my-profile" (PATCH) (Admin)
Delete Admin: "https://timeless-backend.vercel.app/api/v1/admins/64ee43b42c55973c5e376ac8" (DELETE) (Admin)
```
