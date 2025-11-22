# 📦 Inventory Management System (IMS)

A full-stack inventory management system built with modern web technologies.

## 🚀 Features

### User Authentication
- Secure JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes

### Inventory Management
- Product catalog with SKU and barcode support
- Stock level tracking
- Reorder level alerts

### Warehouse Management
- Multiple warehouse support
- Location tracking
- Stock movement history

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- Axios for API calls
- Tailwind CSS

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- MySQL Database
- JWT Authentication

## 🚀 Quick Start

### Backend Setup
```bash
cd ims-backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev --name init
npm run dev
