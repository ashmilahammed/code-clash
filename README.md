# Code-Clash ⚔️

**Code-Clash** is a modern, real-time multiplayer coding platform designed for developers to solve algorithmic challenges, compete in coding battles, and enhance their programming skills in a highly interactive environment.

## 🚀 Key Features

- **Real-time Coding Battles:** Compete against other developers in real-time. Features an in-browser VS Code-like experience powered by **Monaco Editor** and live WebSocket synchronization.
- **Robust Authentication:** Secure authentication system using **JWT** and **bcrypt**, with seamless integration for **Google OAuth**.
- **Admin & Management Dashboard:** Comprehensive admin tools to manage challenges, oversee users, and track platform statistics.
- **Real-time Chat & Groups:** Form coding groups and communicate via live chat integrated directly into the platform.
- **Gamification & Badges:** Earn custom badges, track your solving streaks, and climb the leaderboards.
- **Premium Subscriptions:** Built-in integration with **Razorpay** for handling premium user tiers or paid features.
- **Clean Architecture Backend:** Highly scalable and decoupled backend following Clean Architecture and Domain-Driven Design (DDD) principles.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion (for animations)
- **State Management:** Zustand
- **Code Editor:** `@monaco-editor/react`
- **Real-time Communication:** `socket.io-client`

### Backend
- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Caching & Message Broker:** Redis (via `ioredis`)
- **Real-time Communication:** `socket.io`
- **Payments:** Razorpay
- **File Storage:** Cloudinary
- **Email Delivery:** Nodemailer

---

## 🏗️ Architecture

The backend strictly adheres to **Clean Architecture** and **SOLID** principles to ensure robust dependency inversion, high testability, and clear separation of concerns.

- **Presentation Layer:** Express controllers, centralized global error-handling middlewares, and route definitions.
- **Application Layer:** Isolated Use Cases (e.g., Challenge Management, User Authentication) and precise Data Transfer Objects (DTOs).
- **Domain Layer:** Core business entities and interfaces devoid of infrastructure dependencies.
- **Infrastructure Layer:** Concrete implementations of repository interfaces, MongoDB schemas, and third-party service integrations (e.g., Cloudinary, Razorpay).

---

## 🚦 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Redis** (Local instance or cloud Redis)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashmilahammed/code-clash.git
   cd code-clash
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory. *(See Environment Variables below)*
   ```bash
   # Run the backend in development mode
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory.
   ```bash
   # Run the frontend development server
   npm run dev
   ```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the root of the `backend` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# External Services
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Config
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Frontend (`frontend/.env`)
Create a `.env` file in the root of the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🐳 Docker Support

The project includes a `docker-compose.yml` file for simplified orchestration of the underlying services (like Redis or MongoDB) or full application containerization.

To spin up the environment using Docker:
```bash
docker-compose up -d
```

---

## 📜 License
This project is licensed under the **ISC License**.
