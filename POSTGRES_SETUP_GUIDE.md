# 🐘 PostgreSQL Setup Guide for COMPSSA

## 📋 **Quick Setup Steps**

### 1. **Open PostgreSQL Command Line**

```bash
# Open Command Prompt as Administrator and run:
psql -U postgres
```

### 2. **Create the Database**

```sql
-- In the PostgreSQL prompt, run:
CREATE DATABASE compssa_db;

-- Verify it was created:
\l

-- Exit PostgreSQL:
\q
```

### 3. **Update Password in .env File**

Edit `project/backend/.env` and set your PostgreSQL password:

```env
DB_PASSWORD=your_postgres_password_here
```

### 4. **Test Connection**

```bash
# Test if you can connect:
psql -h localhost -p 5432 -U postgres -d compssa_db
```

## 🔧 **Alternative: Use Default PostgreSQL Setup**

If you're using the default PostgreSQL installation:

### Option A: No Password Setup

```env
# In backend/.env
DB_PASSWORD=
```

### Option B: Set a Password

```bash
# In PostgreSQL command line:
ALTER USER postgres PASSWORD 'your_new_password';
```

## 🚀 **After Database Setup**

1. **Run Migration**:

   ```bash
   cd backend
   node scripts/migrate.js
   ```

2. **Add Sample Data**:

   ```bash
   cd backend
   node scripts/seed-data.cjs
   ```

3. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

## ⚠️ **Common Issues**

### Issue: "password authentication failed"

**Solution**: Update the password in `.env` file

### Issue: "database does not exist"

**Solution**: Create the database manually using the steps above

### Issue: "connection refused"

**Solution**: Make sure PostgreSQL service is running

## 🔍 **Verify Setup**

After setup, you should see:

- ✅ Database "compssa_db" exists
- ✅ Backend connects successfully
- ✅ Tables are created
- ✅ Sample data is loaded

## 📞 **Need Help?**

If you encounter issues:

1. Check PostgreSQL service is running
2. Verify database name and credentials
3. Ensure PostgreSQL is listening on port 5432
4. Try connecting manually with psql first
