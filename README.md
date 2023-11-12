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

### Vercel Hosted API Base URL: https://timeless-backend.vercel.app

### Technologies

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

## [API Documentation](https://documenter.getpostman.com/view/29322785/2s9YXk3gAs)

### Application Routes:

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

```ts
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

### Store

```ts
Create Store: "https://timeless-backend.vercel.app/api/v1/stores/create-store" (POST) (Admin)
Get Single Store: "https://timeless-backend.vercel.app/api/v1/stores/654e4850e878e7c1c8804100" (GET) (Admin)
Update Store: "https://timeless-backend.vercel.app/api/v1/stores/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Store: "https://timeless-backend.vercel.app/api/v1/stores/64ee43b42c55973c5e376ac8" (DELETE) (Super Admin)
```

### Billboard

```ts
Create Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/create-billboard" (POST) (Admin)
Get Single Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/654e4850e878e7c1c8804100" (GET) (Admin)
Update Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/654e4850e878e7c1c8804100" (DELETE) (Super Admin)
```

### Category

```ts
Create Category: "https://timeless-backend.vercel.app/api/v1/categories/create-category" (POST) (Admin)
Get All Categories: "https://timeless-backend.vercel.app/api/v1/categories/" (GET)
Get Single Category: "https://timeless-backend.vercel.app/api/v1/categories/654e4850e878e7c1c8804100" (GET)
Update Category: "https://timeless-backend.vercel.app/api/v1/categories/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Category: "https://timeless-backend.vercel.app/api/v1/categories/654e4850e878e7c1c8804100" (DELETE) (Super Admin)
```

### Carat

```ts
Create Carat: "https://timeless-backend.vercel.app/api/v1/carats/create-carat" (POST) (Admin)
Get All Carats: "https://timeless-backend.vercel.app/api/v1/carats/" (GET) (Admin)
Get Single Carat: "https://timeless-backend.vercel.app/api/v1/carats/654e4850e878e7c1c8804100" (GET) (Admin)
Update Carat: "https://timeless-backend.vercel.app/api/v1/carats/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Carat: "https://timeless-backend.vercel.app/api/v1/carats/654e4850e878e7c1c8804100" (DELETE) (Super Admin)
```

### Material

```ts
Create Material: "https://timeless-backend.vercel.app/api/v1/materials/create-material" (POST) (Admin)
Get All Materials: "https://timeless-backend.vercel.app/api/v1/materials/" (GET) (Admin)
Get Single Material: "https://timeless-backend.vercel.app/api/v1/materials/654e4850e878e7c1c8804100" (GET) (Admin)
Update Material: "https://timeless-backend.vercel.app/api/v1/materials/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Material: "https://timeless-backend.vercel.app/api/v1/materials/654e4850e878e7c1c8804100" (DELETE) (Super Admin)
```

### Product

```ts
Create Product: "https://timeless-backend.vercel.app/api/v1/products/create-product" (POST) (Admin)
Get All Products: "https://timeless-backend.vercel.app/api/v1/products/" (GET)
Get Single Product: "https://timeless-backend.vercel.app/api/v1/products/654e4850e878e7c1c8804100" (GET)
Update Product: "https://timeless-backend.vercel.app/api/v1/products/654e4850e878e7c1c8804100" (PATCH) (Admin)
Delete Product: "https://timeless-backend.vercel.app/api/v1/products/654e4850e878e7c1c8804100" (DELETE) (Super Admin)
```

### Order

```ts
Create Order: "https://timeless-backend.vercel.app/api/v1/orders/create-order" (POST) (User)
Get All Orders: "https://timeless-backend.vercel.app/api/v1/orders/" (GET) (Admin & Auth User)
Get Single Order: "https://timeless-backend.vercel.app/api/v1/orders/654e4850e878e7c1c8804100" (GET) (Admin & Auth User)
Update Order: "https://timeless-backend.vercel.app/api/v1/orders/654e4850e878e7c1c8804100" (PATCH) (Admin & Auth User)
Delete Order: "https://timeless-backend.vercel.app/api/v1/orders/654e4850e878e7c1c8804100" (DELETE) (Admin & Auth User)
```

### Product Review

```ts
Create Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/654f59d43c04a5a4966d5917" (POST) (User)
Update Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/654f59d43c04a5a4966d5917" (PATCH) (User)
Delete Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/654f59d43c04a5a4966d5917" (DELETE) (User)
```

### [Project Complete RnD](https://www.notion.so/Timeless-Jewellery-c2fc3a5892ac4a3fa74dd9a1401dd402?pvs=4)
