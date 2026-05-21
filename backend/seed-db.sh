#!/bin/bash

# Seed Database with Sample Data

BASE_URL="http://localhost:5000"

# Function to get date N days ago
get_date_n_days_ago() {
  local days=$1
  date -d "$days days ago" "+%Y-%m-%d" 2>/dev/null || date -v-${days}d "+%Y-%m-%d" 2>/dev/null
}

# Function to get date N days from now
get_date_n_days_from_now() {
  local days=$1
  date -d "+$days days" "+%Y-%m-%d" 2>/dev/null || date -v+${days}d "+%Y-%m-%d" 2>/dev/null
}

# Get today's date
TODAY=$(date "+%Y-%m-%d" 2>/dev/null)

echo "=== Seeding Database with Sample Data ==="
echo "Today's date: $TODAY"
echo ""

# Array to store habit IDs
declare -a HABIT_IDS

# Create sample habits
echo "Creating sample habits..."
echo ""

# Habit 1: Read 30 min
HABIT1=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read 30 min",
    "category": "study",
    "frequency": "daily",
    "difficulty": "easy",
    "targetValue": 30,
    "targetUnit": "min",
    "notes": "Read daily for 30 minutes"
  }')
HABIT_IDS[0]=$(echo $HABIT1 | jq -r '._id')
echo "Created 'Read 30 min' (ID: ${HABIT_IDS[0]})"

# Habit 2: Drink 2 L Water
HABIT2=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Drink 2 L Water",
    "category": "health",
    "frequency": "daily",
    "difficulty": "easy",
    "targetValue": 2000,
    "targetUnit": "ml",
    "notes": "Stay hydrated"
  }')
HABIT_IDS[1]=$(echo $HABIT2 | jq -r '._id')
echo "Created 'Drink 2 L Water' (ID: ${HABIT_IDS[1]})"

# Habit 3: Morning Walk
HABIT3=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Walk",
    "category": "sports",
    "frequency": "daily",
    "difficulty": "medium",
    "targetValue": 1,
    "targetUnit": "times",
    "notes": "20-30 minute morning walk"
  }')
HABIT_IDS[2]=$(echo $HABIT3 | jq -r '._id')
echo "Created 'Morning Walk' (ID: ${HABIT_IDS[2]})"

# Habit 4: Deep Clean
HABIT4=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deep Clean",
    "category": "chores",
    "frequency": "weekly",
    "difficulty": "hard",
    "targetValue": 1,
    "targetUnit": "times",
    "notes": "Deep clean the house"
  }')
HABIT_IDS[3]=$(echo $HABIT4 | jq -r '._id')
echo "Created 'Deep Clean' (ID: ${HABIT_IDS[3]})"

# Habit 5: Gym Session
HABIT5=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gym Session",
    "category": "sports",
    "frequency": "weekly",
    "difficulty": "hard",
    "targetValue": 3,
    "targetUnit": "times",
    "notes": "3 gym sessions per week"
  }')
HABIT_IDS[4]=$(echo $HABIT5 | jq -r '._id')
echo "Created 'Gym Session' (ID: ${HABIT_IDS[4]})"

# Habit 6: Read a Book
HABIT6=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read a Book",
    "category": "study",
    "frequency": "monthly",
    "difficulty": "medium",
    "targetValue": 1,
    "targetUnit": "books",
    "notes": "Finish reading one book per month"
  }')
HABIT_IDS[5]=$(echo $HABIT6 | jq -r '._id')
echo "Created 'Read a Book' (ID: ${HABIT_IDS[5]})"

# Habit 7: Dentist Checkup
HABIT7=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dentist Checkup",
    "category": "health",
    "frequency": "monthly",
    "difficulty": "trivial",
    "targetValue": 1,
    "targetUnit": "times",
    "notes": "Monthly dental checkup"
  }')
HABIT_IDS[6]=$(echo $HABIT7 | jq -r '._id')
echo "Created 'Dentist Checkup' (ID: ${HABIT_IDS[6]})"

echo ""
echo "Creating sample logs..."
echo ""

# Create logs for Read 30 min (last 7 days)
HABIT_ID=${HABIT_IDS[0]}
for i in 6 5 4 3 2 1 0; do
  DATE=$(get_date_n_days_ago $i)
  case $i in
    6) VALUE=30 ;;
    5) VALUE=45 ;;
    4) VALUE=0  ;;
    3) VALUE=30 ;;
    2) VALUE=20 ;;
    1) VALUE=30 ;;
    0) VALUE=10 ;;
  esac
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": $VALUE}" > /dev/null && echo "Read log: $DATE - $VALUE min"
done

# Create logs for Drink Water (last 7 days)
HABIT_ID=${HABIT_IDS[1]}
for i in 6 5 4 3 2 1 0; do
  DATE=$(get_date_n_days_ago $i)
  case $i in
    6) VALUE=2000 ;;
    5) VALUE=1500 ;;
    4) VALUE=2200 ;;
    3) VALUE=2000 ;;
    2) VALUE=800  ;;
    1) VALUE=2000 ;;
    0) VALUE=0    ;;
  esac
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": $VALUE}" > /dev/null && echo "Water log: $DATE - $VALUE ml"
done

# Create logs for Morning Walk (last 7 days)
HABIT_ID=${HABIT_IDS[2]}
for i in 6 5 4 3 2 1 0; do
  DATE=$(get_date_n_days_ago $i)
  case $i in
    6) VALUE=1 ;;
    5) VALUE=1 ;;
    4) VALUE=0 ;;
    3) VALUE=1 ;;
    2) VALUE=1 ;;
    1) VALUE=0 ;;
    0) VALUE=1 ;;
  esac
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": $VALUE}" > /dev/null && echo "Walk log: $DATE - ${VALUE}x"
done

# Create logs for Gym (last 4 weeks, roughly 9 entries spread across)
HABIT_ID=${HABIT_IDS[4]}
GYM_DATES=(
  $(get_date_n_days_ago 34)
  $(get_date_n_days_ago 32)
  $(get_date_n_days_ago 30)
  $(get_date_n_days_ago 26)
  $(get_date_n_days_ago 25)
  $(get_date_n_days_ago 20)
  $(get_date_n_days_ago 18)
  $(get_date_n_days_ago 13)
  $(get_date_n_days_ago 8)
)
for DATE in "${GYM_DATES[@]}"; do
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": 1}" > /dev/null && echo "Gym log: $DATE - 1x"
done

# Create logs for Books (monthly)
HABIT_ID=${HABIT_IDS[5]}
BOOK_DATES=(
  $(get_date_n_days_ago 145) # ~5 months ago
  $(get_date_n_days_ago 114) # ~4 months ago
  $(get_date_n_days_ago 53) # ~2 months ago
)
for DATE in "${BOOK_DATES[@]}"; do
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": 1}" > /dev/null && echo "Book log: $DATE - 1 book"
done

# Create logs for Dentist (monthly)
HABIT_ID=${HABIT_IDS[6]}
DENTIST_DATES=(
  $(get_date_n_days_ago 129) # ~4 months ago
  $(get_date_n_days_ago 68) # ~2 months ago
)
for DATE in "${DENTIST_DATES[@]}"; do
  curl -s -X POST "$BASE_URL/habits/$HABIT_ID/logs" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"value\": 1}" > /dev/null && echo "Dentist log: $DATE - 1x"
done

echo ""
echo "=== Database seeded successfully! ==="
echo ""
echo "You can now test the frontend with real data."
