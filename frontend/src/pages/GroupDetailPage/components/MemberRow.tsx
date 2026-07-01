import { User } from '@/types/index';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { initials } from '@/utils/initials';

interface EditProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

interface Props {
  member: User;
  total: number;
  color: { bg: string };
  targetUnit: string;
  editProps?: EditProps;
}

export function MemberRow({ member, total, color, targetUnit, editProps }: Props) {
  const name = `${member.firstName} ${member.lastName}`;

  return (
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 flex-shrink-0 rounded-full ${color.bg}`} />
      <Avatar className="h-7 w-7">
        <AvatarImage src={member.avatar} alt={name} />
        <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
      </Avatar>
      <span className="w-28 truncate text-sm">{name}</span>
      <span className="w-20 text-sm text-neutral-500 tabular-nums">
        {total} {targetUnit}
      </span>
      {editProps && (
        <div className="ml-auto flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={editProps.inputValue}
            onChange={(e) => editProps.onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',') e.preventDefault();
              if (e.key === 'Enter') editProps.onSave();
            }}
            className="w-24 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-800"
          />
          <Button
            variant="success"
            size="sm"
            onClick={editProps.onSave}
            disabled={!editProps.isDirty || editProps.isSaving}
          >
            {editProps.isSaving ? '...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
}
