import { Card } from '@/components/ui/Card';
import { Habit } from '@/types/habit';

export default function HabitItemCard({ habit }: { habit: Habit }) {
  return (
    <div className="w-full">
      <Card className="w-full">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:gap-4">
          <Card className="w-full bg-gray-300 sm:max-w-[50vw] sm:flex-1">
            <p className="px-2 text-base">{habit.name}</p>
          </Card>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Card className="bg-green-300 px-3 py-1">
              <p className="text-sm">{habit.frequency}</p>
            </Card>
            <Card className="bg-blue-300 px-3 py-1">
              <p className="text-sm">{habit.category}</p>
            </Card>
            <Card className="bg-yellow-300 px-3 py-1">
              <p className="text-sm">{habit.difficulty}</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
