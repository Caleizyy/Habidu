import { User } from '@/types/index';

export interface MemberTotal {
  member: User;
  total: number;
  color: { bg: string };
}

interface Props {
  memberTotals: MemberTotal[];
  targetValue: number;
  targetUnit: string;
}

export function StackedProgressBar({ memberTotals, targetValue, targetUnit }: Props) {
  return (
    <div className="mb-4 flex h-4 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
      {memberTotals
        .filter((m) => m.total > 0)
        .map(({ member, total, color }) => (
          <div
            key={member.sub}
            className={`${color.bg} h-full transition-all duration-300`}
            style={{ width: `${Math.min((total / targetValue) * 100, 100)}%` }}
            title={`${member.firstName}: ${total} ${targetUnit}`}
          />
        ))}
    </div>
  );
}
