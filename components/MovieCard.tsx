'use client';

import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/tmdb';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          bg-brownish rounded-lg overflow-hidden shadow-lg border-2 border-brownish
          transition-all duration-300 ease-in-out
          ${isHovered ? 'scale-105 shadow-2xl border-orange-red animate-bounce-subtle' : ''}
        `}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getPosterUrl(movie.poster_path, 'medium')}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/342x513/874F41/FBE9D0?text=No+Poster';
            }}
          />
          <div
            className={`
              absolute inset-0 bg-gradient-to-t from-dark-teal via-dark-teal/80 to-transparent
              transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>

        <div className="p-4 bg-dark-teal">
          <h3 className="text-cream font-bold text-lg mb-2 line-clamp-2">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-orange-red text-orange-red" />
            <span className="text-cream font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-desaturated-teal text-sm">
              {movie.release_date ? `(${movie.release_date.split('-')[0]})` : ''}
            </span>
          </div>

          <div
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${isHovered ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs bg-brownish text-cream px-2 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {movie.overview && (
              <p className="text-desaturated-teal text-sm mt-2 line-clamp-3">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}