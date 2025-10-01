import { Movie } from '@/types/movie';
import { searchMovies } from '@/lib/tmdb';

export async function getRecommendations(movieTitle: string): Promise<Movie[]> {
  const mockRecommendations: Record<string, Array<{title: string, similarity: number}>> = {
    inception: [
      { title: 'Shutter Island', similarity: 92 },
      { title: 'The Matrix', similarity: 89 },
      { title: 'Interstellar', similarity: 87 },
      { title: 'Memento', similarity: 85 },
      { title: 'The Prestige', similarity: 83 }
    ],
    interstellar: [
      { title: 'Inception', similarity: 94 },
      { title: 'Gravity', similarity: 88 },
      { title: 'The Martian', similarity: 86 },
      { title: 'Arrival', similarity: 84 },
      { title: 'Contact', similarity: 82 }
    ],
    'the matrix': [
      { title: 'Inception', similarity: 90 },
      { title: 'Blade Runner 2049', similarity: 88 },
      { title: 'The Terminator', similarity: 85 },
      { title: 'Ghost in the Shell', similarity: 83 },
      { title: 'Total Recall', similarity: 81 }
    ],
    avatar: [
      { title: 'Interstellar', similarity: 78 },
      { title: 'Dune', similarity: 76 },
      { title: 'Star Wars', similarity: 74 },
      { title: 'Guardians of the Galaxy', similarity: 72 },
      { title: 'Blade Runner 2049', similarity: 70 }
    ],
    titanic: [
      { title: 'The Notebook', similarity: 85 },
      { title: 'A Star Is Born', similarity: 78 },
      { title: 'Pearl Harbor', similarity: 76 },
      { title: 'Legends of the Fall', similarity: 74 },
      { title: 'The English Patient', similarity: 72 }
    ]
  };

  const normalizedTitle = movieTitle.toLowerCase().trim();
  let recommendationData: Array<{title: string, similarity: number}>;

  if (mockRecommendations[normalizedTitle]) {
    recommendationData = mockRecommendations[normalizedTitle];
  } else {
    // Default recommendations with similarity scores
    recommendationData = [
      { title: 'The Shawshank Redemption', similarity: 75 },
      { title: 'The Godfather', similarity: 73 },
      { title: 'The Dark Knight', similarity: 71 },
      { title: 'Pulp Fiction', similarity: 69 },
      { title: 'Forrest Gump', similarity: 67 }
    ];
  }

  // Fetch real movie data from TMDB for each recommendation
  const movies: Movie[] = [];
  
  for (const rec of recommendationData) {
    try {
      const searchResults = await searchMovies(rec.title);
      if (searchResults.length > 0) {
        const movie = { ...searchResults[0] };
        movie.similarity = rec.similarity;
        movies.push(movie);
      } else {
        // Fallback if movie not found in TMDB
        movies.push({
          id: Date.now() + Math.random(),
          title: rec.title,
          overview: `A highly recommended movie with ${rec.similarity}% similarity to your search.`,
          poster_path: null,
          backdrop_path: null,
          release_date: '2020-01-01',
          vote_average: 8.0,
          vote_count: 1000,
          genre_ids: [18],
          genres: [],
          similarity: rec.similarity
        });
      }
    } catch (error) {
      console.error(`Error fetching data for ${rec.title}:`, error);
      // Fallback movie object
      movies.push({
        id: Date.now() + Math.random(),
        title: rec.title,
        overview: `A highly recommended movie with ${rec.similarity}% similarity to your search.`,
        poster_path: null,
        backdrop_path: null,
        release_date: '2020-01-01',
        vote_average: 8.0,
        vote_count: 1000,
        genre_ids: [18],
        genres: [],
        similarity: rec.similarity
      });
    }
  }

  return movies;
}