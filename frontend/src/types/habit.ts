export interface Habit {
  _id: string;
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  notes?: string;
}
export interface HabitCardProps {
  habits: Habit[];
}
