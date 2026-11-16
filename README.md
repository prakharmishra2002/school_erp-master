# School ERP - All-in-One Educational Management System

A comprehensive school management system with a Next.js frontend and Laravel API backend.

## 🚀 Getting Started

Please refer to the following guides for setup and deployment:
- [Docker User Guide](./DOCKER_GUIDE.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)

## 🔐 demo Credentials

Use these credentials to test the application after seeding the database.

### 👤 Developer Access
- **Email:** `mvaibhav@gmail`
- **Password:** `passoword`
- **Role:** Developer

### 🏫 School Admin
- **Email:** `admin@school.com`
- **Password:** `password`
- **Role:** Admin

### 👨‍🏫 Teacher
- **Email:** `teacher@school.com`
- **Password:** `password`
- **Role:** Teacher

## 🛠️ Testing with Docker

To test if the application is working correctly with these credentials:

1. **Start the containers:**
   ```powershell
   docker compose up -d
   ```

2. **Run migrations and seed the database:**
   ```powershell
   docker compose exec backend php artisan migrate:fresh --seed
   ```

3. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)
