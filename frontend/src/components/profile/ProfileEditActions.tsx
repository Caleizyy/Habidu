import { Button } from '@/components/ui/Button';
import { Check, X } from 'lucide-react';

interface ProfileEditActionsProps {
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditActions({ isSaving, error, onSave, onCancel }: ProfileEditActionsProps) {
  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <Button onClick={onSave} disabled={isSaving}>
          <Check className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
