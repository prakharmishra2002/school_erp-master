# 🛠️ Local Development Setup Guide

> **Platform**: Windows (XAMPP-based)  
> **Time Required**: ~30-45 minutes  
> **Skill Level**: Beginner-friendly

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

| Requirement | Minimum Version | Download Link |
|-------------|-----------------|---------------|
| Windows | 10/11 | - |
| XAMPP | 8.2+ | [Download](https://www.apachefriends.org/) |
| PostgreSQL | 15+ | [Download](https://www.postgresql.org/download/windows/) |
| Node.js | 20 LTS | [Download](https://nodejs.org/) |
| Composer | 2.x | [Download](https://getcomposer.org/) |
| Git | Latest | [Download](https://git-scm.com/) |
| VS Code | Latest | [Download](https://code.visualstudio.com/) |

---

## 📥 Step 1: Install XAMPP

XAMPP provides Apache and PHP. We'll use Apache as the web server and PHP for Laravel.

### 1.1 Download & Install
1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Run the installer
3. Select components:
   - ✅ Apache
   - ✅ PHP
   - ❌ MySQL (we'll use PostgreSQL instead)
   - ❌ Others (optional)
4. Install to: `C:\xampp`

### 1.2 Verify Installation
```powershell
# Open PowerShell and check PHP version
C:\xampp\php\php.exe -v
# Should show: PHP 8.2.x or higher
```

### 1.3 Add PHP to System PATH
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to **Advanced** → **Environment Variables**
3. Under **System Variables**, find `Path`, click **Edit**
4. Add new entry: `C:\xampp\php`
5. Click **OK** to save
6. Restart PowerShell/Terminal

### 1.4 Enable Required PHP Extensions
Edit `C:\xampp\php\php.ini` and uncomment (remove `;`) these lines:

```ini
extension=pdo_pgsql
extension=pgsql
extension=gd
extension=zip
extension=intl
extension=mbstring
extension=fileinfo
extension=curl
extension=openssl
extension=sodium
```

Save the file and restart Apache in XAMPP Control Panel.

---

## 📥 Step 2: Install PostgreSQL

### 2.1 Download & Install
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. During setup:
   - **Password**: Set a strong password for `postgres` user (remember this!)
   - **Port**: `5432` (default)
   - **Locale**: Default
4. Complete installation

### 2.2 Add to System PATH
1. Add `C:\Program Files\PostgreSQL\16\bin` to your System PATH
2. Restart PowerShell

### 2.3 Verify Installation
```powershell
psql --version
# Should show: psql (PostgreSQL) 16.x
```

### 2.4 Create Database for School ERP
```powershell
# Open PostgreSQL command line
psql -U postgres

# Enter the password you set during installation
# Then run these SQL commands:

CREATE DATABASE school_erp;
CREATE USER school_erp_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE school_erp TO school_erp_user;
\q
```

> 💡 **Tip**: Replace `your_secure_password` with a strong password and save it!

---

## 📥 Step 3: Install Node.js

### 3.1 Download & Install
1. Download LTS version from [nodejs.org](https://nodejs.org/)
2. Run installer with default options
3. Restart PowerShell

### 3.2 Verify Installation
```powershell
node -v
# Should show: v20.x.x

npm -v
# Should show: 10.x.x
```

---

## 📥 Step 4: Install Composer

### 4.1 Download & Install
1. Download from [getcomposer.org](https://getcomposer.org/download/)
2. Run `Composer-Setup.exe`
3. Point it to `C:\xampp\php\php.exe`
4. Complete installation

### 4.2 Verify Installation
```powershell
composer -V
# Should show: Composer version 2.x.x
```

---

## 📥 Step 5: Install Git

### 5.1 Download & Install
1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer with default options
3. Restart PowerShell

### 5.2 Verify Installation
```powershell
git --version
# Should show: git version 2.x.x
```

### 5.3 Configure Git
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📁 Step 6: Project Setup

### 6.1 Navigate to XAMPP htdocs
```powershell
cd C:\xampp\htdocs\all-in-one-erp
```

### 6.2 Create Laravel Backend
```powershell
# Create backend folder
composer create-project laravel/laravel backend

# Navigate to backend
cd backend

# Install required packages
composer require laravel/sanctum
composer require filament/filament:"^3.0"
composer require spatie/laravel-permission
composer require maatwebsite/excel
composer require barryvdh/laravel-dompdf
```

### 6.3 Configure Laravel Environment
Copy `.env.example` to `.env` and edit:

```env
APP_NAME="School ERP"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost/all-in-one-erp/backend/public

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=school_erp
DB_USERNAME=school_erp_user
DB_PASSWORD=your_secure_password
```

### 6.4 Generate App Key & Run Migrations
```powershell
php artisan key:generate
php artisan migrate
php artisan filament:install --panels
```

### 6.5 Create Admin User
```powershell
php artisan make:filament-user
# Follow the prompts to create admin credentials
```

---

## 📁 Step 7: Create Next.js Frontend

### 7.1 Navigate to Project Root
```powershell
cd C:\xampp\htdocs\all-in-one-erp
```

### 7.2 Create Next.js Project
```powershell
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 7.3 Install UI Dependencies
```powershell
cd frontend
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install axios @tanstack/react-query zustand
npx shadcn@latest init
```

### 7.4 Configure API URL
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost/all-in-one-erp/backend/public/api
```

---

## ⚙️ Step 8: Configure Virtual Host (Optional but Recommended)

### 8.1 Edit Apache Hosts File
Add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 school-erp.local
127.0.0.1 api.school-erp.local
```

### 8.2 Configure Apache Virtual Host
Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
# School ERP - Laravel API
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/all-in-one-erp/backend/public"
    ServerName api.school-erp.local
    
    <Directory "C:/xampp/htdocs/all-in-one-erp/backend/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 8.3 Restart Apache
Restart Apache from XAMPP Control Panel.

---

## 🚀 Step 9: Start Development Servers

### Terminal 1: Laravel (if not using Apache)
```powershell
cd C:\xampp\htdocs\all-in-one-erp\backend
php artisan serve
# Running at: http://127.0.0.1:8000
```

### Terminal 2: Next.js Frontend
```powershell
cd C:\xampp\htdocs\all-in-one-erp\frontend
npm run dev
# Running at: http://localhost:3000
```

---

## ✅ Step 10: Verify Setup

### Test URLs

| Service | URL | Expected |
|---------|-----|----------|
| Laravel API | http://localhost:8000/api | JSON response |
| Filament Admin | http://localhost:8000/admin | Login page |
| Next.js Frontend | http://localhost:3000 | Welcome page |
| PostgreSQL | `psql -U postgres -d school_erp` | Connected |

---

## 📁 Final Project Structure

```
C:\xampp\htdocs\all-in-one-erp\
├── docs/               # Documentation (you are here)
├── backend/            # Laravel application
│   ├── app/
│   ├── database/
│   ├── public/
│   └── .env
├── frontend/           # Next.js application
│   ├── src/
│   ├── public/
│   └── .env.local
├── docker/             # Docker configs (for production)
├── docker-compose.yml
└── Makefile
```

---

## 🔧 Useful Commands Reference

### Laravel
```powershell
# Run migrations
php artisan migrate

# Create new controller
php artisan make:controller StudentController --api

# Create new model with migration
php artisan make:model Student -m

# Create Filament resource
php artisan make:filament-resource Student

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Next.js
```powershell
# Start development
npm run dev

# Build for production
npm run build

# Add shadcn component
npx shadcn@latest add button
npx shadcn@latest add table
```

### PostgreSQL
```powershell
# Connect to database
psql -U postgres -d school_erp

# List tables
\dt

# Describe table
\d students

# Exit
\q
```

---

## 🐛 Troubleshooting

### Issue: PHP not recognized
**Solution**: Add `C:\xampp\php` to System PATH and restart PowerShell.

### Issue: PostgreSQL connection refused
**Solution**: 
1. Check if PostgreSQL service is running (Win + R → `services.msc`)
2. Verify port 5432 is not blocked by firewall

### Issue: Composer out of memory
**Solution**: 
```powershell
php -d memory_limit=-1 C:\ProgramData\ComposerSetup\bin\composer.phar install
```

### Issue: Node modules installation fails
**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Laravel storage permission
**Solution**:
```powershell
# Windows doesn't have chmod, but run this in Laravel:
php artisan storage:link
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain passwords
2. **Change default ports** in production
3. **Use strong database passwords**
4. **Keep dependencies updated**: `composer update`, `npm update`

---

## 📚 Next Steps

After setup is complete:
1. Start with [01-authentication.md](./01-authentication.md)
2. Build the login system
3. Create first Filament resources
4. Import existing data using the import wizard

---

> 📖 **Need Docker setup instead?** See [15-docker-deployment.md](./15-docker-deployment.md) for container-based deployment.
