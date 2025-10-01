'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { searchMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      const results = await searchMovies(query);
      setSuggestions(results);
      setIsLoading(false);
      setShowSuggestions(true);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movieTitle: string) => {
    setQuery(movieTitle);
    onSearch(movieTitle);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-desaturated-teal w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full pl-12 pr-12 py-4 bg-brownish text-cream placeholder-desaturated-teal rounded-lg border-2 border-brownish focus:border-orange-red focus:outline-none focus:ring-2 focus:ring-orange-red/30 transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-desaturated-teal hover:text-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-brownish border-2 border-orange-red rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-desaturated-teal">Loading...</div>
          ) : (
            suggestions.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSuggestionClick(movie.title)}
                className="w-full p-3 flex items-center gap-3 hover:bg-dark-teal transition-colors duration-150 border-b border-dark-teal last:border-b-0"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-18 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/92x138/874F41/FBE9D0?text=?';
                  }}
                />
                <div className="flex-1 text-left">
                  <p className="text-cream font-semibold">{movie.title}</p>
                  <p className="text-desaturated-teal text-sm">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}