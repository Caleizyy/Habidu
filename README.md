# Habit Tracker

A full-stack habit tracking application with a React frontend and Node.js backend.

## Requirements

- Node.js 24.15.0 (see `.nvmrc`)
- npm
- Git

Recommended setup:

nvm install 24.15.0
nvm use 24.15.0

## Installation

Clone the repository:

git clone <repo-url>
cd sourcery-2026-spring-team-jonas

Install dependencies:

### Root (dev scripts)

npm install

### Frontend

cd frontend
npm install

### Backend

cd ../backend
npm install
cd ..

## Linting and formatting set up

npm run prepare

## Running the project

Start both frontend and backend:

npm run dev

This uses concurrently to run both services.

Start the MongoDB docker container:

docker compose up

Note: docker needs to be installed and docker service running

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017/habit_db

## Tech Stack

- React + Vite
- Node.js + Express
- TypeScript
- MUI (Material UI)
- Concurrently
- MongoDB 7

## Notes

- Run npm install after pulling changes
- Ensure Node version matches .nvmrc
- If issues occur, run npm ci
- To access MongoDB using shell, use command
  docker exec -it $(docker ps -aqf "name=mongodb-1") mongosh
- To seed DB with dummy data, run
  npm run seed
  from /backend directory
