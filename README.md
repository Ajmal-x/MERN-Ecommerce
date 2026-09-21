# 🛍️ Trendify — MERN E-Commerce Platform

Trendify is a full-stack e-commerce platform built with the MERN stack.

The project includes a modern customer storefront, a dedicated admin dashboard, secure authentication, product management, shopping cart functionality, order management, and MongoDB-based data storage.

---

## ✨ Features

### 🛒 Customer Store

- User registration and login
- Secure JWT authentication
- User profile management
- Product browsing
- Product search
- Category filtering
- Subcategory filtering
- Product sorting
- Product details
- Shopping cart
- Quantity management
- Order placement
- Order history
- Responsive design

### ⚙️ Admin Dashboard

- Secure admin login
- Protected admin routes
- Dashboard
- Product management
- Add products
- Edit products
- Delete products
- Order management
- Admin profile management
- Admin email management
- Admin password management
- Role-based access control

---

## 🧰 Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Vite
- React Toastify

### Admin Dashboard

- React
- React Router
- Tailwind CSS
- Axios
- Vite
- React Toastify
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary

---

## 🗂️ Project Structure

    MERN-Ecommerce/
    │
    ├── admin/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── backend/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── package.json
    │   └── server.js
    │
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── .gitignore
    └── README.md

---

## 🗄️ Database

Trendify uses MongoDB with the following main collections:

    mern_ecommerce
    │
    ├── users
    ├── products
    └── orders

The `users` collection is shared by normal users and administrators.

User roles are managed using the `role` field:

    role: "user"
    role: "admin"

This allows the application to use the same database and users collection while providing different access levels.

---

## 🔐 Authentication

The application uses JWT-based authentication.

Passwords are securely hashed using bcrypt before being stored in MongoDB.

Admin access is protected using role-based authentication.

The backend verifies:

1. The JWT token
2. The user's identity
3. The user's role
4. Whether the user has administrator access

---

## ☁️ Image Storage

Product images are uploaded and managed using Cloudinary.

Cloudinary credentials are stored in environment variables and are never included directly in the source code.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Git
- Node.js
- npm
- MongoDB Atlas account
- Cloudinary account

---

## 📥 Clone the Repository

    git clone https://github.com/Ajmal-x/MERN-Ecommerce.git
    cd MERN-Ecommerce

---

## 📦 Install Dependencies

The project contains three separate applications.

### Backend

    cd backend
    npm install

### Frontend

    cd ../frontend
    npm install

### Admin

    cd ../admin
    npm install

---

## 🔑 Environment Variables

Environment variables are required for the backend, frontend, and admin applications.

### Backend

Create:

    backend/.env

Example:

    PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### Frontend

Create:

    frontend/.env

Example:

    VITE_BACKEND_URL=http://localhost:4000

### Admin

Create:

    admin/.env

Example:

    VITE_BACKEND_URL=http://localhost:4000

> Never commit real environment variables, passwords, API keys, JWT secrets, or database credentials to GitHub.

---

## ▶️ Running the Project

The project consists of three applications that should be running at the same time during local development.

### 1. Start the Backend

Open a terminal:

    cd backend
    npm start

The backend will run on:

    http://localhost:4000

---

### 2. Start the Frontend

Open another terminal:

    cd frontend
    npm run dev

The Vite development server will display the local frontend URL in the terminal.

Usually:

    http://localhost:5173

---

### 3. Start the Admin Dashboard

Open another terminal:

    cd admin
    npm run dev

The Vite development server will display the admin dashboard URL in the terminal.

Usually:

    http://localhost:5174

---

## 🔄 Application Architecture

    Frontend
    Customer Store
          │
          │ REST API
          ▼
    Backend
    Node.js + Express
          │
          ├──────────────► MongoDB
          │                ├── users
          │                ├── products
          │                └── orders
          │
          └──────────────► Cloudinary
                           Product Images

    Admin Dashboard
          │
          │ REST API
          ▼
       Backend

---

## 📱 Responsive Design

Trendify is designed to provide a responsive shopping experience across:

- Desktop
- Laptop
- Tablet
- Mobile

---

## 🔒 Security

Sensitive configuration is kept outside the source code using environment variables.

The project uses:

- JWT authentication
- bcrypt password hashing
- Protected API routes
- Protected admin routes
- Role-based access control
- Environment variables for secrets

---

## 👨‍💻 Author

### Ajmal Ahmadi

GitHub: https://github.com/Ajmal-x

---

## 📄 License

This project is currently provided for educational and portfolio purposes.