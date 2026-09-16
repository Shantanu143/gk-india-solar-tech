import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({ value, onChange, placeholder = "Search…", className, debounceMs = 300 }: SearchInputProps) {
  const [draft, setDraft] = useState(value);

  // Re-sync the draft when the external value changes (e.g. filters reset elsewhere) — adjusted
  // during render rather than in an effect, per React's guidance for this pattern.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, debounceMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, debounceMs]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-surface pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-orange"
      />
      {draft && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setDraft("")}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
