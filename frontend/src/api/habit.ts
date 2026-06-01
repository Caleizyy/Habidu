export async function fetchHabits() {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/habits`);
  if (!response.ok) {
    throw new Error('Failed to fetch habits');
  }
  const data = await response.json();
  return data;
}

export async function createHabit(habit: {
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  targetValue: number;
  targetUnit: string;
  notes?: string;
}) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create habit');
  }
  const data = await response.json();
  return data;
}
