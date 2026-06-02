import { Card } from '@/components/ui/Card';
import { Habit } from '@/types/habit';

export default function HabitItemCard({ habit }: { habit: Habit }) {
  return (
    <div className="flex h-[15vh] w-full flex-row">
      <Card className="h-full w-full">
        <div className="flex h-full w-full items-center justify-start">
          <Card className="items-left ml-6 flex h-auto w-[15vw] justify-start bg-gray-300">
            <p className="ml-8 text-lg">{habit.name}</p>
          </Card>
          <Card className="ml-6 flex h-[3vh] w-[10vw] items-center justify-center bg-green-300">
            <p className="text-sm">{habit.frequency}</p>
          </Card>
          <Card className="ml-6 flex h-[3vh] w-[10vw] items-center justify-center bg-blue-300">
            <p className="text-sm">{habit.category}</p>
          </Card>
          <Card className="ml-6 flex h-[3vh] w-[10vw] items-center justify-center bg-yellow-300">
            <p className="text-sm">{habit.difficulty}</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
