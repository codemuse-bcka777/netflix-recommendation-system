import { RecommendationResponse } from '@/types/movie';

export async function getRecommendations(movieTitle: string): Promise<string[]> {
  const mockRecommendations: Record<string, string[]> = {
    inception: ['Shutter Island', 'The Matrix', 'Interstellar', 'Memento', 'The Prestige'],
    interstellar: ['Inception', 'Gravity', 'The Martian', 'Arrival', 'Contact'],
    'the matrix': ['Inception', 'Blade Runner 2049', 'The Terminator', 'Ghost in the Shell', 'Total Recall'],
    avatar: ['Interstellar', 'Dune', 'Star Wars', 'Guardians of the Galaxy', 'Blade Runner 2049'],
    titanic: ['The Notebook', 'A Star Is Born', 'Pearl Harbor', 'Legends of the Fall', 'The English Patient'],
  };

  const normalizedTitle = movieTitle.toLowerCase().trim();

  if (mockRecommendations[normalizedTitle]) {
    return mockRecommendations[normalizedTitle];
  }

  return ['The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'Pulp Fiction', 'Forrest Gump'];
}