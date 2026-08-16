import { MapPin, Search } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import type { CatalogItem } from "@/lib/api";
import type { Company } from "@/types";

interface SearchBarProps {
  defaultQuery?: string;
  defaultLocation?: string;
  catalog?: { roles: CatalogItem[]; skills: CatalogItem[]; companies: Company[] };
  onSearch?: (
    query: string,
    location: string,
    filters?: { roleId?: number; skillIds?: number[]; companyIds?: number[] }
  ) => void;
}

type Suggestion =
  | { type: "role"; item: CatalogItem }
  | { type: "skill"; item: CatalogItem }
  | { type: "company"; item: Company };

export function SearchBar({ defaultQuery = "", defaultLocation = "", catalog, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tokens, setTokens] = useState<Suggestion[]>([]);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    
    const skillIds = tokens.filter(t => t.type === 'skill').map(t => t.item.id);
    const companyIds = tokens.filter(t => t.type === 'company').map(t => (t.item as Company).backendId).filter(Boolean) as number[];
    const roleToken = tokens.find(t => t.type === 'role');
    const roleId = roleToken ? roleToken.item.id : undefined;

    onSearch?.(query, location, { skillIds, companyIds, roleId });
  }

  function handleSelectSuggestion(suggestion: Suggestion) {
    const suggestionId = suggestion.type === "company" ? (suggestion.item as Company).backendId : (suggestion.item as CatalogItem).id;
    if (!tokens.some(t => {
      const tId = t.type === "company" ? (t.item as Company).backendId : (t.item as CatalogItem).id;
      return tId === suggestionId && t.type === suggestion.type;
    })) {
      setTokens([...tokens, suggestion]);
    }
    setQuery("");
    setShowSuggestions(false);
  }

  const suggestions: Suggestion[] = [];
  if (catalog && query.trim().length > 0) {
    const q = query.toLowerCase();
    
    catalog.roles
      .filter((r) => r.name.toLowerCase().includes(q))
      .forEach((r) => suggestions.push({ type: "role", item: r }));
      
    catalog.skills
      .filter((s) => s.name.toLowerCase().includes(q))
      .forEach((s) => suggestions.push({ type: "skill", item: s }));
      
    catalog.companies
      .filter((c) => c.name.toLowerCase().includes(q))
      .forEach((c) => suggestions.push({ type: "company", item: c }));
  }

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm md:flex-row md:items-center md:rounded-full md:pl-5"
    >
      <div className="relative flex flex-1 items-center gap-2 px-3 py-2 md:px-0 flex-wrap md:flex-nowrap">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        
        {tokens.length > 0 && (
          <div className="flex gap-1 overflow-x-auto no-scrollbar items-center shrink-0 max-w-[200px] md:max-w-xs">
            {tokens.map((t, idx) => (
              <span key={idx} className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                {t.item.name}
                <button type="button" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTokens(tokens.filter((_, i) => i !== idx));
                }} className="text-muted-foreground hover:text-foreground">×</button>
              </span>
            ))}
          </div>
        )}
        
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
             if (e.key === 'Backspace' && query === "" && tokens.length > 0) {
                 setTokens(tokens.slice(0, -1));
             }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Job title, keywords, or company"
          className="w-full bg-transparent min-w-[120px] text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 top-full mt-4 w-full md:w-[200%] z-50 overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-card shadow-lg max-h-[300px]">
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">Suggestions</p>
              {suggestions.slice(0, 15).map((s, idx) => (
                <button
                  key={`${s.type}-${s.type === "company" ? (s.item as Company).backendId : (s.item as CatalogItem).id}-${idx}`}
                  type="button"
                  onMouseDown={(e) => {
                    // Use onMouseDown instead of onClick to prevent blur/focus races
                    e.preventDefault();
                    handleSelectSuggestion(s);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[15px] text-foreground transition-colors hover:bg-accent"
                >
                  <span className="truncate pr-4">{s.item.name}</span>
                  <span className="shrink-0 text-xs capitalize text-muted-foreground">{s.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hidden h-8 w-px bg-border md:block" />

      <div className="flex flex-1 items-center gap-3 px-3 py-2 md:px-5">
        <MapPin className="size-5 shrink-0 text-muted-foreground" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='City, state, zip code, or "remote"'
          className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-7 py-3 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Find jobs
      </button>
    </form>
  );
}
