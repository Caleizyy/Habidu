interface LogRowProgressProps {
  progress: number;
}

const LogRowProgress = ({ progress }: LogRowProgressProps) => {
  return (
    <div className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
      <div
        className={`h-full rounded-full transition-all duration-300 ${
          progress > 100 ? 'bg-green-300 dark:bg-green-800' : progress === 100 ? 'bg-green-500' : 'bg-amber-300'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LogRowProgress;
