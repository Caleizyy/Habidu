import { Group } from '@/types/group';
import { HabitHeader } from './HabitHeader';
import { StackedProgressBar } from './StackedProgressBar';
import { MemberRow } from './MemberRow';
import { useGroupHabitTracker } from '../hooks/useGroupHabitTracker';
import leaf from '@/assets/leaf.png';

interface Props {
  group: Group;
}

export function GroupHabitTracker({ group }: Props) {
  const {
    isLoading,
    habit,
    inputValue,
    setInputValue,
    isDirty,
    handleSave,
    isSaving,
    saveError,
    memberTotals,
    grandTotal,
  } = useGroupHabitTracker(group);

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading group goal...</p>;
  }

  if (!habit) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="item-center text-center">
          <img src={leaf} className="mx-auto mb-4 size-30" alt="No group goal" />
          <p className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No group goal yet..</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The owner can create a habit and assign it to this group from the Habits page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
      <HabitHeader
        name={habit.name}
        frequency={habit.frequency}
        targetValue={habit.targetValue}
        targetUnit={habit.targetUnit}
        grandTotal={grandTotal}
      />

      <StackedProgressBar memberTotals={memberTotals} targetValue={habit.targetValue} targetUnit={habit.targetUnit} />

      <div className="flex flex-col gap-3">
        {memberTotals.map(({ member, total, color, isMe }) => (
          <MemberRow
            key={member.sub}
            member={member}
            total={total}
            color={color}
            targetUnit={habit.targetUnit}
            editProps={
              isMe
                ? {
                    inputValue,
                    onInputChange: setInputValue,
                    onSave: handleSave,
                    isSaving,
                    isDirty,
                  }
                : undefined
            }
          />
        ))}
      </div>

      {saveError && <p className="mt-2 text-xs text-red-500">Failed to save. Please try again.</p>}
    </div>
  );
}
