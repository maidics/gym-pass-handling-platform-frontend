import { useState } from "react";
import { cn } from "@lib/utils.ts";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@ui/input.tsx";
import { validate } from "@lib/validationUtils.ts";

interface SearchHookResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isFetching?: boolean;
}

interface SearchInputProps<T> {
  useSearch: (query: string) => SearchHookResult<T>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput<T>({
  useSearch,
  renderItem,
  onSelect,
  placeholder,
  className,
}: SearchInputProps<T>) {
  const { isEmpty } = validate();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data, isLoading, isFetching } = useSearch(query);

  const handleSelect = (item: T) => {
    setQuery("");
    setIsFocused(false);
    onSelect(item);
  };

  const showLoading = !isEmpty(query) && (isLoading || isFetching);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {showLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-9 pr-9 bg-secondary/50 appearance-none"
        />

        {!isEmpty(query) && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "rounded-full p-1",
              "text-muted-foreground hover:text-destructive",
              "hover:bg-muted",
              "transition-colors opacity-80 hover:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
              "cursor-pointer",
            )}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>

      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 overflow-hidden z-50">
          {showLoading ? (
            <div className="p-4 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found.
            </div>
          ) : (
            <ul className="max-h-[300px] overflow-y-auto py-1">
              {data.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 cursor-pointer bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
