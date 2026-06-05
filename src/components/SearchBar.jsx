import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search by room number..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-10 pr-4"
        id="search-rooms"
      />
    </div>
  );
}
