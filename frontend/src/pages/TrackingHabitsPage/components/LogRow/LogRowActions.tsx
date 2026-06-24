import { Button } from '@/components/ui/Button';

interface LogRowActionsProps {
  isCompleted: boolean;
  isOver: boolean;
  value: number;
  unit: string;
  undoLog: () => void;
  quickLog: () => void;
}

const LogRowActions = ({ isCompleted, isOver, value, unit, undoLog, quickLog }: LogRowActionsProps) => {
  const renderButton = () => {
    if (isCompleted && !isOver) {
      return (
        <Button className="w-full" variant="secondary" onClick={undoLog}>
          Undo
        </Button>
      );
    }

    if (isOver) {
      return <Button className="w-full" variant="success-over" onClick={undoLog}>{`+${value} ${unit}`}</Button>;
    }

    return (
      <Button className="w-full" variant="success" onClick={quickLog}>
        Log
      </Button>
    );
  };

  return <div className="flex w-20 shrink-0 justify-end">{renderButton()}</div>;
};

export default LogRowActions;
