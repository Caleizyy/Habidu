# Habit Tracking Backend - Setup

**Backend for Habit Logs** (habit tracking)

- POST /habits/:habitId/logs - Create log entry
- GET /habits/:habitId/logs - Fetch logs (with date range filter)
- PUT /habits/:habitId/logs/:logId - Update log entry
- DELETE /habits/:habitId/logs/:logId - Delete log entry

**Database Scripts**

- `seed-db.sh` - Populate database with sample data (habits & logs)
- `delete-habits-logs-db.sh` - Completely delete all habits and logs from database

## Quick Start

### 1. Make sure backend is running

```bash
cd backend
npm run dev
```

### 2. Seed the database with sample data

```bash
bash seed-db.sh
```

### Resetting the Database

To completely wipe all habits and logs:

```bash
bash delete-habits-logs-db.sh
```
