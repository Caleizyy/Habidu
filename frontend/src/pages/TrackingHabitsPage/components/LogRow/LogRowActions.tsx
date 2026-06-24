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
  if (isCompleted && !isOver) {
    return <Button onClick={undoLog}>Undo</Button>;
  }

  if (isOver) {
    return <Button variant={'outline'} onClick={undoLog}>{`+${value} ${unit}`}</Button>;
  }

  return <Button onClick={quickLog}>Log</Button>;
};

export default LogRowActions;
