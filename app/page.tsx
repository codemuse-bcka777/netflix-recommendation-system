'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { getRecommendations } from '@/lib/recommendations';
import { Movie } from '@/types/movie';
import { Film, Sparkles } from 'lucide-react';

export default function Home() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setSearchedMovie(query);

    try {
      const movies = await getRecommendations(query);

      if (movies.length === 0) {
        setError('No recommendations found. Try searching for another movie.');
      }

      setRecommendations(movies);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Something went wrong. Please try again.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-teal">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-12 h-12 text-orange-red" />
            <h1 className="text-5xl font-bold text-cream">
              Movie Recommendation
            </h1>
          </div>
          <p className="text-desaturated-teal text-lg">
            Discover your next favorite film
          </p>
        </header>

        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-red border-t-transparent"></div>
            <p className="text-cream mt-4 text-lg">Finding recommendations...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-orange-red text-lg">{error}</p>
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-orange-red" />
              <h2 className="text-3xl font-bold text-cream">
                Recommendations for &ldquo;{searchedMovie}&rdquo;
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && recommendations.length === 0 && !error && (
          <div className="text-center py-20">
            <Film className="w-24 h-24 text-brownish mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-cream mb-2">
              Start Your Movie Journey
            </h3>
            <p className="text-desaturated-teal text-lg">
              Search for a movie to get personalized recommendations
            </p>
          </div>
        )}
      </div>

      <footer className="mt-20 py-8 border-t border-brownish">
        <div className="container mx-auto px-4 text-center">
          <p className="text-desaturated-teal text-sm">
            Powered by TMDB API
          </p>
          <p className="text-desaturated-teal text-xs mt-2">
            Movie data provided by The Movie Database (TMDB)
          </p>
        </div>
      </footer>
    </div>
  );
}