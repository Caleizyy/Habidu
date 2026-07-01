import { Card } from '@/components/ui/Card';
import { Habit } from '@/types/habit';
import { EditHabitDialog } from './EditHabitDialog';
import { DeleteHabitDialog } from './DeleteHabitDialog';

interface HabitItemCardProps {
  habit: Habit;
  groupName?: string;
}

export default function HabitItemCard({ habit, groupName }: Readonly<HabitItemCardProps>) {
  return (
    <div className="w-full">
      <Card className="w-full">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:gap-4">
          <Card className="w-full bg-gray-300 sm:flex-1">
            <p className="px-2 text-base">{habit.name}</p>
          </Card>
          <div className="flex flex-col gap-2 sm:w-auto sm:flex-none sm:flex-row">
            <Card className="flex-1 items-center justify-center bg-green-300 px-3 py-1">
              <p className="text-center text-sm">{habit.frequency}</p>
            </Card>
            <Card className="flex-1 items-center justify-center bg-blue-300 px-3 py-1">
              <p className="text-center text-sm">{habit.category}</p>
            </Card>
            <Card className="flex-1 items-center justify-center bg-yellow-300 px-3 py-1">
              <p className="text-center text-sm">{habit.difficulty}</p>
            </Card>
            {groupName ? (
              <Card className="flex-1 items-center justify-center bg-violet-300 px-3 py-1">
                <p className="text-center text-sm">{groupName}</p>
              </Card>
            ) : (
              <Card className="flex-1 items-center justify-center bg-gray-200 px-3 py-1">
                <p className="text-center text-sm text-gray-500">Yours</p>
              </Card>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <EditHabitDialog habit={habit} />
            <DeleteHabitDialog id={habit._id} />
          </div>
        </div>
      </Card>
    </div>
  );
}
