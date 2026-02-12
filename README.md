# 🛒 Mini E-Commerce Backend API

A scalable and secure RESTful backend API for a Mini E-Commerce platform
built using **Node.js**, **Express.js**, and **MongoDB**.

------------------------------------------------------------------------
## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login
- Role-Based Access Control:
  - Admin
  - Customer
- Fraud prevention mechanisms (e.g., preventing repeated order cancellations causing stock misuse)

---

### 📦 Product Management (Admin Only)
- Add new products
- Update product details
- Delete products
- Manage and update product stock

---

### 🛒 Customer Features
- Add product to cart
- Remove product from cart
- Place order


------------------------------------------------------------------------

## 🏗 Tech Stack

-   Node.js
-   Express.js
-   MongoDB + Mongoose
-   JWT
-   bcrypt
-   Cloudinary
-   dotenv
-   Nodemon
-   multer

------------------------------------------------------------------------

## 📂 Project Structure

   │
├── node_modules/
├── public/dummydataset
├── public/temp/ER-Diagram
├── src/
│ ├── controllers/
│ ├── db/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── validators/
│ ├── app.js
│ ├── constants.js
│ └── index.js
------------------------------------------------------------------------

## ⚙ Installation & Setup

### 1️⃣ Clone the Repository

``` bash
git clone https://github.com/mazed2020/Mini-Ecommerce-Backend.git
cd Mini-Ecommerce-Backend
```

### 2️⃣ Install Dependencies

``` bash
npm install
```

### 3️⃣ Create `.env` File

``` env
MONGODB_URI=mongodb://127.0.0.1:27017
PORT=5000
CORS_ORIGIN=*
EXPIERY_KEY=10d
REFRESH_TOKEN_SECRE=dfbdjbfajbsid
REFRESH_EXPIERE=1d
CLOUD_NAME=dr3lsbx2k
API_KEY=185859713928424
SECRETE_kEY=jKPCFPlJN9IVW9uA7KVcLIedkmM
```

 

------------------------------------------------------------------------

## 📌 API Endpoints

### 🔐 Authentication

  Method   Endpoint                  Description
  -------- ------------------------- ----------------------
  POST     `/api/v1/auth/register`   Register new user
  POST     `/api/v1/auth/login`      Login user

------------------------------------------------------------------------

### 📦 Products

  Method   Endpoint                 Description
  -------- ------------------------ --------------------
  GET    `/api/v1/products/getAllProducts`      Get all products (Public)
  GET    `/api/v1/products/getProductById/:id`  Get single product by ID (Public)
  POST   `/api/v1/products/createProduct`        Create product (Admin)
  PUT    `/api/v1/products/updateProductById/:id`Update product by ID (Admin)
  DELETE  `/api/v1/products/deleteProductById/:id`Delete product by ID (Admin)

------------------------------------------------------------------------

 
 ### 🛒 Cart

  Method   Endpoint                                             Description
  -------- ------------------------------------------------------ -------------------------------
  GET      `/api/v1/carts/getAllCardItems`                    Get all cart items
  POST     `/api/v1/carts/addToCardItems`                        Add item to cart
  DELETE   `/api/v1/carts/deleteItemsByProductId/:productId`   Remove cart item by product ID
  DELETE   `/api/v1/carts/clearCart`                             Clear entire cart


------------------------------------------------------------------------

### 📑 Orders

  Method   Endpoint               Description
  -------- ---------------------- ------------------
  POST     `/api/v1/orders/checkoutOrder`             Create order (Checkout)
  GET      `/api/v1/orders/getMyOrder`                  Get authenticated user's orders
  GET      `/api/v1/orders/getOrderById/:id`            Get single order by ID
  PATCH    `/api/v1/orders/:id/cancelOder`              Cancel order

------------------------------------------------------------------------

## 🔑 Authentication

Protected routes require:

    Authorization: Bearer <access_token>

------------------------------------------------------------------------

 ## 🧪 API Testing & Documentation

The complete API documentation is available via Postman:

🔗 **Live API Docs:**  
👉 https://documenter.getpostman.com/view/34409474/2sBXcBm26C

### ER-Diagram
ER-Diagram image and mermaid code provide there
- public/temp/


You can:
- Explore all endpoints
- Test requests directly
- View request/response examples
- Understand authentication flow

------------------------------------------------------------------------

## 👨‍💻 Author

**Mazed**\
GitHub: https://github.com/mazed2020/Mini-Ecommerce-Backend.git

------------------------------------------------------------------------

## 📄 License

This project is licensed under the MIT License.
