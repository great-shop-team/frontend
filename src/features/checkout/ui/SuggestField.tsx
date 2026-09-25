'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

export type SuggestOption = {
  id: string;
  label: string;
  hint?: string;
};

type SuggestFieldProps = {
  label?: string;
  value: string;
  placeholder: string;
  options: SuggestOption[];
  loading?: boolean;
  error?: string;
  emptyText: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onSelect: (option: SuggestOption) => void;
  onOpen?: () => void;
};

export default function SuggestField({
  label,
  value,
  placeholder,
  options,
  loading = false,
  error,
  emptyText,
  disabled = false,
  onValueChange,
  onSelect,
  onOpen,
}: SuggestFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    setOpen((current) => {
      const next = !current;
      if (next) onOpen?.();
      return next;
    });
  };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      {label ? (
        <span className="font-[family-name:var(--font-poppins)] text-[16px] text-black">{label}</span>
      ) : null}
      <div
        className={`flex h-12 items-center rounded-lg border bg-white px-2.5 ${
          error ? 'border-error' : 'border-black'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 border-0 bg-transparent font-[family-name:var(--font-poppins)] text-[16px] text-black outline-none placeholder:text-black/60"
          onChange={(event) => {
            onValueChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            onOpen?.();
          }}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={placeholder}
          className="inline-flex size-6 items-center justify-center border-0 bg-transparent p-0"
          onClick={toggle}
        >
          <Image
            src="/images/catalog/lsicon_down-filled.svg"
            alt=""
            width={15}
            height={9}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-black/20 bg-white py-1 shadow-lg"
        >
          {loading ? (
            <li className="px-3 py-2 font-[family-name:var(--font-poppins)] text-[14px] text-black/60">
              ...
            </li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 font-[family-name:var(--font-poppins)] text-[14px] text-black/60">
              {emptyText}
            </li>
          ) : (
            options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  className="flex w-full flex-col items-start px-3 py-2 text-left font-[family-name:var(--font-poppins)] text-[16px] text-black hover:bg-black/5"
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {option.hint ? (
                    <span className="text-[12px] text-black/50">{option.hint}</span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
      {error ? <p className="m-0 text-[12px] text-error">{error}</p> : null}
    </div>
  );
}
