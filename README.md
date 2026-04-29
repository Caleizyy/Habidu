# Habit Tracker

A full-stack habit tracking application with a React frontend and Node.js backend.

## Requirements

- Node.js 20.19.0 (see `.nvmrc`)
- npm
- Git

Recommended setup:

nvm install 20.19.0
nvm use 20.19.0

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

## Running the project

Start both frontend and backend:

npm run dev

This uses concurrently to run both services.

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Tech Stack

- React + Vite
- Node.js + Express
- TypeScript
- MUI (Material UI)
- Concurrently

## Notes

- Run npm install after pulling changes
- Ensure Node version matches .nvmrc
- If issues occur, delete node_modules and package-lock.json and reinstall
