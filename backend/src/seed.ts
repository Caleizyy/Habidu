import mongoose from 'mongoose';
import { Habit } from './models/habit';
import { User } from './models/user';

const MONGO_URI = 'mongodb://localhost:27017/habit_db';

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Habit.deleteMany({});
  await User.deleteMany({});

  await Habit.create([
    {
      name: 'Drink Water',
      frequency: 'daily',
      difficulty: 'trivial',
      category: 'chores',
      notes: 'Drink at least 8 glasses of water a day',
    },
    {
      name: 'Go for a Walk',
      frequency: 'daily',
      difficulty: 'easy',
      category: 'health',
      notes: 'Walk for at least 15 minutes every day',
    },
  ]);

  console.log('Seeded Habit dummy data.');

  await User.create({
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://via.placeholder.com/150',
    role: 'admin',
    authProviders: {
      google: {
        sub: 'google-test-id-12345',
        email: 'test.user@example.com',
      },
    },
    settings: {
      emailNotifications: true,
      pushNotifications: false,
    },
    lastLoginAt: new Date(),
  });

  console.log('Seeded User dummy data.');

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
