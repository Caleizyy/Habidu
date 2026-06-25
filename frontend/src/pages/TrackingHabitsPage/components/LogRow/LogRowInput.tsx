import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface LogRowInputProps {
  draftValue: number;
  unit: string;
  onChange: (value: number) => void;
}

const LogRowInput = ({ draftValue, unit, onChange }: LogRowInputProps) => {
  const [inputText, setInputText] = useState<string>(String(draftValue));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputText(String(draftValue));
    }
  }, [draftValue, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (text === '') {
      onChange(0);
    } else {
      const value = parseFloat(text);
      if (!isNaN(value) && value >= 0) {
        onChange(value);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (inputText === '' || isNaN(parseFloat(inputText)) || parseFloat(inputText) < 0) {
      setInputText('0');
      onChange(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min="0"
        value={inputText}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-17 rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-xs text-neutral-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
      />
      <span className="w-10 truncate text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
    </div>
  );
};

export default LogRowInput;
