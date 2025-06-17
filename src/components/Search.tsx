import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface PostSearchProps {
  onSearch: (term: string) => void;
}

export function SearchComponent({ onSearch }: PostSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // update parent state
  };

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search posts..."
        value={query}
        onInput={handleChange}
        className="pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
      />
    </div>
  );
}
