import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "../lib/debounce";

export function DebouncedInput({
  value: initialValue,
  onChange,

  // This is the wait time, not the function
  debounceMs = 500,

  ...props
}) {
  const [value, setValue] = useState(initialValue);

  // Sync with initialValue when it changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Define the debounced function with useCallback
  const debouncedOnChange = useCallback(
    debounce((newValue) => {
      onChange(newValue);
    }, debounceMs), // Pass the wait time here
    // Dependencies
    [debounceMs, onChange]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue); // Update local state immediately
    debouncedOnChange(newValue); // Call debounced version
  };

  return <Input {...props} value={value} onChange={handleChange} />;
}
