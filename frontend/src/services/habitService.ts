export async function fetchHabits() {
  const response = await fetch('http://localhost:5000/habits');
  const data = await response.json();
  return data;
}

export async function createHabit(habit: {
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  notes?: string;
}) {
  const response = await fetch('http://localhost:5000/habits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
  const data = await response.json();
  return data;
}
