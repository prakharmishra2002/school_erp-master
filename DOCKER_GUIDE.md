# 🐳 Docker User Guide - School ERP

This guide explains how to manage the School ERP application using Docker.

## 🚀 Running the Application

To start all services (Frontend, Backend, and Database) in the background:

```powershell
docker compose up -d
```

### 🌍 Access Ports

Once the containers are running, you can access the modules at:

*   **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
*   **Backend API (Laravel):** [http://localhost:8000](http://localhost:8000)
*   **Database (MySQL):** `localhost:3306`
    *   **User:** `user`
    *   **Password:** `password`
    *   **Database:** `school_erp`

### 🔐 Demo Credentials

After running migrations and seeders, you can use the following accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Developer** | `mvaibhav@gmail` | `passoword` |
| **Admin** | `admin@school.com` | `password` |
| **Teacher** | `teacher@school.com` | `password` |

---

## 🛑 Stopping the Application

To stop the containers while keeping the data:

```powershell
docker compose stop
```

To stop and **remove** the containers (clean up):

```powershell
docker compose down
```

---

## 🛠️ Common Commands

### View Logs
```powershell
# All logs
docker compose logs -f

# Specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Run Artisan Commands
You can run any Laravel artisan command inside the running container:
```powershell
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

### Restart Services
```powershell
docker compose restart
```

---

> [!IMPORTANT]
> Ensure **Docker Desktop** is running before executing these commands. If you encounter port conflicts (e.g., port 3306 already in use), make sure to stop local services like XAMPP or other MySQL instances first.
