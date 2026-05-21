#!/bin/bash

# Delete Database Script
# Completely deletes ALL habits and logs from MongoDB
# This clears the entire database for a fresh start

echo "=== WARNING: This will DELETE ALL HABITS AND LOGS ==="
echo ""
read -p "Are you sure you want to delete? (Y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "Deleting all data from MongoDB..."

# Run MongoDB commands to delete all data
docker-compose exec mongodb mongosh habit_db --eval "
const habitCount = db.habits.deleteMany({}).deletedCount;
const logCount = db.habitlogs.deleteMany({}).deletedCount;

console.log(' Deleted ' + habitCount + ' habits');
console.log(' Deleted ' + logCount + ' logs');
console.log('');
console.log('Database cleared!');
console.log('You can now run: bash seed-db.sh');
"

echo ""
