<h1 align="center">
  🎓 Campus Marketplace System
</h1>

<p align="center">
  A secure, AI-enhanced marketplace built exclusively for university students to buy and sell items within a trusted campus community.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Features by Component](#-features-by-component)
  - [1. User Management](#1-user-management-component)
  - [2. Item Management](#2-item-management-component)
  - [3. Transaction & Pricing Management](#3-transaction--pricing-management-component)
  - [4. Trust, Security & Intelligence](#4-trust-security--intelligence-component)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Team & Contributions](#-team--contributions)
- [License](#-license)

---

## 🌐 Project Overview

**Campus Marketplace** is a full-stack MERN web application designed for university students to securely buy and sell items within their campus community. The platform ensures only verified university members can access the system, enforces secure transactions, and leverages AI/ML capabilities to build trust, detect fraud, and offer personalized recommendations.

The system is divided into **four core components**, each developed and managed by a dedicated team member:

| # | Component | Responsibility |
|---|-----------|----------------|
| 1 | User Management | Registration, authentication, roles, profiles |
| 2 | Item Management | Listings, images, categories, availability |
| 3 | Transaction & Pricing Management | Payments, discounts, seller tracking |
| 4 | Trust, Security & Intelligence | Fraud detection, reviews, AI recommendations |

---

## 🏗 System Architecture

```
campus-marketplace-system/
├── frontend/          # React.js Client Application
├── backend/           # Node.js + Express REST API
│   ├── user-service/      # Component 1 – User Management
│   ├── item-service/      # Component 2 – Item Management
│   ├── transaction-service/ # Component 3 – Transaction & Pricing
│   └── trust-service/     # Component 4 – Trust, Security & AI
└── README.md
```

---

## ✨ Features by Component

### 1. User Management Component

> Manages all users and controls access. Only verified university members may register and use the platform.

- ✅ User registration using **university email**
- ✅ Secure **login / logout** flows
- ✅ User **profile management**
- ✅ **Role-based access control** (Student, Admin)
- ✅ **Account verification** and authentication (JWT)
- ✅ **Secure password hashing** (bcrypt)

---

### 2. Item Management Component

> Handles all operations related to listing, managing, and displaying items available for buying and selling.

- ✅ **Add new item listings** with detailed descriptions
- ✅ **Edit and delete** existing listings
- ✅ **Upload and manage item images** (Cloudinary / Multer)
- ✅ **Categorize items** — Books, Electronics, Hostel Items, and more
- ✅ **View item details** with rich media
- ✅ Manage **item availability status** (Available / Sold / Reserved)

---

### 3. Transaction & Pricing Management Component

> Manages all purchase-related activities including payments, discounts, and seller performance tracking.

- ✅ **Upload and manage payment slips**
- ✅ **Verify payment details** by admins
- ✅ **Calculate total price** for cart/purchases
- ✅ **Bulk purchase discounts** (2 or more items)
- ✅ **Track completed transactions** with history
- ✅ **Best seller leaderboard** based on sales performance

---

### 4. Trust, Security & Intelligence Component

> Ensures platform safety, builds community trust, and enhances the system with AI-based features.

- ✅ **Fraud & suspicious activity detection**
- ✅ Monitoring of **abnormal pricing or listing behavior**
- ✅ **Review and rating management** for buyers/sellers
- ✅ **Sentiment analysis** on user reviews (AI/NLP)
- ✅ **Seller trust scoring** algorithm
- ✅ **Personalized item recommendations** (AI-driven)
- ✅ **Administrative moderation and reporting** tools

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, Axios, React Router DOM, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **File Uploads** | Multer, Cloudinary |
| **AI / ML** | Sentiment Analysis API / Custom NLP Model |
| **Version Control** | Git & GitHub |
| **Package Manager** | npm |

---

## 📁 Project Structure

```
campus-marketplace-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorHandler.js
│   │
│   ├── user-service/               # Component 1
│   │   ├── models/User.js
│   │   ├── routes/userRoutes.js
│   │   └── controllers/userController.js
│   │
│   ├── item-service/               # Component 2
│   │   ├── models/Item.js
│   │   ├── routes/itemRoutes.js
│   │   └── controllers/itemController.js
│   │
│   ├── transaction-service/        # Component 3
│   │   ├── models/Transaction.js
│   │   ├── routes/transactionRoutes.js
│   │   └── controllers/transactionController.js
│   │
│   ├── trust-service/              # Component 4
│   │   ├── models/Review.js
│   │   ├── routes/trustRoutes.js
│   │   └── controllers/trustController.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── users/
│   │   │   ├── items/
│   │   │   ├── transactions/
│   │   │   └── trust/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/               # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 1. Clone the Repository

```bash
git clone https://github.com/Nethmi2003-web/campus-marketplace-system.git
cd campus-marketplace-system
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below), then start the server:

```bash
npm run dev
```

The backend API will be running at `http://localhost:5000`.

### 3. Set Up the Frontend

Open a new terminal tab/window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (University Email Verification)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@university.ac.lk
EMAIL_PASS=your_email_password
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 📡 API Endpoints

### 🔑 User Management  `/api/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login and receive JWT | Public |
| GET | `/me` | Get current user profile | 🔒 Private |
| PUT | `/me` | Update user profile | 🔒 Private |
| GET | `/` | Get all users | 🔒 Admin |

### 📦 Item Management  `/api/items`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all items | Public |
| GET | `/:id` | Get single item detail | Public |
| POST | `/` | Create a new item listing | 🔒 Private |
| PUT | `/:id` | Edit an item listing | 🔒 Private |
| DELETE | `/:id` | Delete an item listing | 🔒 Private |

### 💳 Transaction & Pricing  `/api/transactions`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create a new transaction | 🔒 Private |
| GET | `/my` | Get my transactions | 🔒 Private |
| POST | `/:id/payment` | Upload payment slip | 🔒 Private |
| PUT | `/:id/verify` | Verify payment (admin) | 🔒 Admin |
| GET | `/bestsellers` | Get top sellers | Public |

### 🛡 Trust & Security  `/api/trust`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/reviews` | Submit a review | 🔒 Private |
| GET | `/reviews/:sellerId` | Get seller reviews | Public |
| GET | `/score/:sellerId` | Get trust score | Public |
| GET | `/recommendations` | Get AI recommendations | 🔒 Private |
| POST | `/report` | Report suspicious activity | 🔒 Private |

---

## 👥 Team & Contributions

This project is developed as a group assignment for the **IT Project Management (ITPM)** module at **SLIIT**.

| Component | Contributor | GitHub |
|-----------|-------------|--------|
| User Management | Member 1 | [@username](https://github.com) |
| Item Management | Member 2 | [@username](https://github.com) |
| Transaction & Pricing | Member 3 | [@username](https://github.com) |
| Trust, Security & AI | Member 4 | [@username](https://github.com) |

> ✏️ **Update the table above** with your team members' real names and GitHub usernames.

### Branch Strategy

Each team member works on their own **feature branch** and submits pull requests to `main`:

```
main
├── feature/user-management
├── feature/item-management
├── feature/transaction-pricing
└── feature/trust-security-ai
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the Campus Marketplace Team | SLIIT – ITPM 2025
</p>
