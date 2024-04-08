Ch

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
Get Single User: "https://timeless-backend.vercel.app/api/v1/users/:id" (Single GET) (Admin)
Update User Profile: "https://timeless-backend.vercel.app/api/v1/users/my-profile" (PATCH) (Auth User)
Delete User: "https://timeless-backend.vercel.app/api/v1/users/:id" (DELETE) (Auth User)
```

### Admin

```ts
Create Admin: "https://timeless-backend.vercel.app/api/v1/admins/create-admin" (POST)
Signin Admin: "https://timeless-backend.vercel.app/api/v1/admins/sign-in" (POST)
Change Password: "https://timeless-backend.vercel.app/api/v1/admins/change-password" (POST)
Refresh Token: "https://timeless-backend.vercel.app/api/v1/admins/refresh-token" (POST)
Get All Admins: "https://timeless-backend.vercel.app/api/v1/admins/" (GET) (Admin)
Get Admin Profile: "https://timeless-backend.vercel.app/api/v1/admins/my-profile" (GET) (Admin)
Get Single Admin: "https://timeless-backend.vercel.app/api/v1/admins/:id" (GET) (Admin)
Update Admin: "https://timeless-backend.vercel.app/api/v1/admins/my-profile" (PATCH) (Admin)
Delete Admin: "https://timeless-backend.vercel.app/api/v1/admins/:id" (DELETE) (Admin)
```

### Store

```ts
Create Store: "https://timeless-backend.vercel.app/api/v1/stores/create-store" (POST) (Admin)
Store Exist: "https://timeless-backend.vercel.app/api/v1/stores/isStoreExist" (GET) (Admin)
Get Single Store: "https://timeless-backend.vercel.app/api/v1/stores/:id" (GET) (Admin)
Update Store: "https://timeless-backend.vercel.app/api/v1/stores/:id" (PATCH) (Admin)
Delete Store: "https://timeless-backend.vercel.app/api/v1/stores/:id" (DELETE) (Super Admin)
```

### Banner

```ts
Create Banner: "https://timeless-backend.vercel.app/api/v1/banners/create-banner" (POST) (Admin)
Get All Banners: "https://timeless-backend.vercel.app/api/v1/banners/:storeId" (GET) (Admin)
Get Single Banner: "https://timeless-backend.vercel.app/api/v1/banners/single-banner/:id" (GET) (Admin)
Update Banner: "https://timeless-backend.vercel.app/api/v1/banners/:id" (PATCH) (Admin)
Delete Banner: "https://timeless-backend.vercel.app/api/v1/banners/:id" (DELETE) (Super Admin)
```

### Billboard

```ts
Create Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/create-billboard" (POST) (Admin)
Get All Billboards: "https://timeless-backend.vercel.app/api/v1/billboards/:storeId" (GET) (Admin)
Get Single Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/single-billboard/:id" (GET) (Admin)
Update Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/:id" (PATCH) (Admin)
Delete Billboard: "https://timeless-backend.vercel.app/api/v1/billboards/:id" (DELETE) (Super Admin)
```

### Category

```ts
Create Category: "https://timeless-backend.vercel.app/api/v1/categories/create-category" (POST) (Admin)
Get All Categories: "https://timeless-backend.vercel.app/api/v1/categories/:storeId" (GET)
Get Single Category: "https://timeless-backend.vercel.app/api/v1/categories/single-category/:id" (GET)
Update Category: "https://timeless-backend.vercel.app/api/v1/categories/:id" (PATCH) (Admin)
Delete Category: "https://timeless-backend.vercel.app/api/v1/categories/:id" (DELETE) (Super Admin)
```

### Carat

```ts
Create Carat: "https://timeless-backend.vercel.app/api/v1/carats/create-carat" (POST) (Admin)
Get All Carats: "https://timeless-backend.vercel.app/api/v1/carats/:storeId" (GET) (Admin)
Get Single Carat: "https://timeless-backend.vercel.app/api/v1/carats/single-carat/:id" (GET) (Admin)
Update Carat: "https://timeless-backend.vercel.app/api/v1/carats/:id" (PATCH) (Admin)
Delete Carat: "https://timeless-backend.vercel.app/api/v1/carats/:id" (DELETE) (Super Admin)
```

### Material

```ts
Create Material: "https://timeless-backend.vercel.app/api/v1/materials/create-material" (POST) (Admin)
Get All Materials: "https://timeless-backend.vercel.app/api/v1/materials/:storeId" (GET) (Admin)
Get Single Material: "https://timeless-backend.vercel.app/api/v1/materials/single-carat/:id" (GET) (Admin)
Update Material: "https://timeless-backend.vercel.app/api/v1/materials/:id" (PATCH) (Admin)
Delete Material: "https://timeless-backend.vercel.app/api/v1/materials/:id" (DELETE) (Super Admin)
```

### Product

```ts
Create Product: "https://timeless-backend.vercel.app/api/v1/products/create-product" (POST) (Admin)
Get All Products: "https://timeless-backend.vercel.app/api/v1/products/:storeId" (GET)
Get Single Product: "https://timeless-backend.vercel.app/api/v1/products/single-product/:id" (GET)
Update Product: "https://timeless-backend.vercel.app/api/v1/products/:id" (PATCH) (Admin)
Delete Product: "https://timeless-backend.vercel.app/api/v1/products/:id" (DELETE) (Super Admin)
```

### Order

```ts
Create Order: "https://timeless-backend.vercel.app/api/v1/orders/create-order" (POST) (User)
Get All Orders: "https://timeless-backend.vercel.app/api/v1/orders/:storeId" (GET) (Admin & Auth User)
Get Single Order: "https://timeless-backend.vercel.app/api/v1/orders/single-order/:id" (GET) (Admin & Auth User)
Update Order: "https://timeless-backend.vercel.app/api/v1/orders/:id" (PATCH) (Admin & Auth User)
Delete Order: "https://timeless-backend.vercel.app/api/v1/orders/:id" (DELETE) (Admin & Auth User)
```

### Product Review

```ts
Create Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/:id" (POST) (User)
Update Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/:id" (PATCH) (User)
Delete Product Review: "https://timeless-backend.vercel.app/api/v1/productReviews/:id" (DELETE) (User)
```

### [Project Complete RnD](https://www.notion.so/Timeless-Jewellery-c2fc3a5892ac4a3fa74dd9a1401dd402?pvs=4)
