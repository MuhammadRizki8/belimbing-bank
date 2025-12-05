'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: Props) {
  const [input, setInput] = useState(value ?? '');

  // sync incoming `value` to local input but avoid synchronous setState in effect
  useEffect(() => {
    const next = value ?? '';
    if (next === input) return; // no update needed
    const id = setTimeout(() => setInput(next), 0);
    return () => clearTimeout(id);
  }, [value, input]);

  // debounce local input to avoid re-filtering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => onChange(input), 250);
    return () => clearTimeout(id);
  }, [input, onChange]);

  return <Input aria-label="Search customers" placeholder={placeholder} value={input} onChange={(e) => setInput(e.target.value)} />;
}
