# 🛍️ Machani's - MERN Stack eCommerce Platform

Machani's is a full-stack **eCommerce application** built using the **MERN stack** (MongoDB, Express.js, React, Node.js). The project supports **product management, user authentication, shopping cart functionality, order processing, and payment integration using Stripe**.

## 🚀 Features

- ✅ **User Authentication** - Register/Login with JWT authentication.
- ✅ **Admin Dashboard** - Manage products, orders, and users.
- ✅ **Product Management** - Add, edit, delete, and update product stock.
- ✅ **Shopping Cart** - Add and remove products.
- ✅ **Order Management** - Users can place and track orders.
- ✅ **Payment Integration** - Secure checkout with **Stripe**.
- ✅ **Stock Management** - Auto-decrease stock on purchase.
- ✅ **Responsive UI** - Clean and modern **Tailwind CSS** design.

---

## 🛠️ Tech Stack

### Frontend:
- **React.js** (Vite for faster builds)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests

### Backend:
- **Node.js & Express.js** (REST API)
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM for MongoDB)
- **JWT Authentication** (JSON Web Tokens)
- **Stripe API** (Payments)
- **Cloudinary** (Image Uploads)

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/machanis-ecommerce.git
cd machanis-ecommerce
```

### 2️⃣ Install Dependencies
#### 🔹 Backend (Server)
```sh
cd server
npm install
```

#### 🔹 Frontend (Client)
```sh
cd client
npm install
```

### 3️⃣ Environment Variables
Create **`.env`** files in both the `server/` and `client/` directories.

#### 🔹 Backend (`server/.env`)
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

#### 🔹 Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4️⃣ Start the Application
#### 🚀 Start Backend
```sh
cd server
npm start
```

#### 🚀 Start Frontend
```sh
cd client
npm run dev
```

**App runs at:** `http://localhost:5173`

---

## 🔌 API Endpoints

### 🧑‍💻 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user and return JWT |
| `GET` | `/api/auth/profile` | Get logged-in user details |

### 🛒 Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `DELETE` | `/api/cart/:id` | Remove item from cart |

### 📦 Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/products/:id` | Fetch a single product |
| `POST` | `/api/products` | Add new product (Admin) |
| `PUT` | `/api/products/:id` | Update product (Admin) |
| `DELETE` | `/api/products/:id` | Delete product (Admin) |

### 📦 Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all user orders |
| `POST` | `/api/orders` | Place a new order |
| `PUT` | `/api/orders/:id` | Update order status (Admin) |

### 💳 Payment (Stripe)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/checkout` | Initiate payment session |
| `POST` | `/api/checkout/confirm-payment` | Confirm payment & reduce stock |

---

## 📂 Project Structure

```
machanis-ecommerce/
│── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # App Pages
│   │   ├── api/            # API Requests
│   │   ├── context/        # Global Context (Auth, Cart)
│   │   ├── App.jsx         # Main App Component
│   │   ├── main.jsx        # React Entry Point
│   │   ├── index.css       # Styles
│   ├── public/             # Static Assets
│   ├── .env                # Frontend Environment Variables
│   ├── vite.config.js      # Vite Config
│
│── server/                 # Backend (Express.js)
│   ├── models/             # Mongoose Models
│   ├── routes/             # Express Routes
│   ├── middleware/         # Auth Middleware
│   ├── controllers/        # Route Logic
│   ├── server.js           # Main Server File
│   ├── .env                # Backend Environment Variables
│   ├── package.json        # Dependencies
│
│── .gitignore              # Ignore unnecessary files
│── README.md               # Documentation
│── package.json            # Root package file
```

---

## 🛠️ Troubleshooting

### ❌ **API returning 401 Unauthorized**
- Ensure you are sending the `Authorization: Bearer <token>` header.
- Check if the **JWT_SECRET** in backend `.env` matches your token generation.
- Restart server: `npm start`.

### ❌ **Payment fails at checkout**
- Verify **Stripe keys** in `.env` are correct.
- Check console logs for `Stripe Checkout Error`.

### ❌ **Stock does not decrease after order**
- Ensure `/checkout/confirm-payment` API is correctly called in `Success.jsx`.

### ❌ **Images not uploading**
- Check if **Cloudinary** is configured in backend.
- Verify the **upload route** `/api/upload`.

---

## 🔗 Deployment Guide

### 🚀 Frontend (Vercel)
```sh
cd client
vercel deploy --prod
```

### 🚀 Backend (Render)
```sh
cd server
git init
git add .
git commit -m "Deploy"
git push origin main
```

### 🚀 Database (MongoDB Atlas)
- Create a new **MongoDB Cluster** in [MongoDB Atlas](https://www.mongodb.com/atlas).
- Update **MONGO_URI** in `.env`.

---

## ✨ Future Enhancements
- 📦 **Wishlist Feature**
- 📊 **Admin Dashboard Analytics**
- 📧 **Email Notifications**
- 🌎 **Multi-currency Support**
- 📱 **Mobile Responsive Improvements**

---

## 📜 License
This project is licensed under the **MIT License**.

---

## ❤️ Contributing
Pull requests are welcome! Feel free to fork and submit PRs.

---

## 👨‍💻 Author
**Machani's eCommerce** - Built with ❤️ by [Sundar Machani](https://github.com/sundarmachani)

✅ **This file includes:**
- **Setup Instructions**
- **API Documentation**
- **Troubleshooting**
- **Deployment Guide**
- **Future Enhancements**

Let me know if you need modifications! 🚀