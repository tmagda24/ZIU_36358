import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { QUERY_KEYS } from '../constants/queryKeys';
import { ENDPOINTS } from '../api/endpoints';

export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.movies.detail(id ?? 0),
    queryFn: async () => {
      const { data } = await tmdbClient.get(ENDPOINTS.MOVIE_DETAILS(id as number));
      return data;
    },
    enabled: id !== null,
  });
}