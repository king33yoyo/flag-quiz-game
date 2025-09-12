import { useState, useEffect, useRef } from 'react';

// 定义类型，避免依赖NodeJS
type Timeout = ReturnType<typeof setTimeout>;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "搜索...",
  debounceMs = 300,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖处理
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(inputValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, onChange, debounceMs]);

  // 外部值变化时更新内部值
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
      {inputValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="清除搜索"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};