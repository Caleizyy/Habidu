import { Button } from '@/components/ui/Button';
import { Check, X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

interface ProfileEditActionsProps {
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditActions({ isSaving, error, onSave, onCancel }: ProfileEditActionsProps) {
  return (
    <div className="space-y-2">
      {error && (
        <div className="flex gap-2 rounded-md border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={onSave} disabled={isSaving} className="h-[4vh] w-[8vw]">
          <Check className="mr-2 h-[2vh] w-[2vw]" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving} className="h-[4vh] w-[5vw]">
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
