import { http, HttpResponse, delay } from 'msw';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const handlers = [
  // 1. Mock listy popularnych filmów
  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);

    return HttpResponse.json({
      page,
      total_pages: 10,
      results: Array.from({ length: 20 }, (_, i) => ({
        id: page * 100 + i,
        title: `Film testowy (Popularne) ${page}-${i + 1}`,
        overview: 'Opis testowego filmu wyświetlanego na głównej stronie.',
        poster_path: null,
        release_date: '2026-05-12',
        vote_average: 7.5,
        genre_ids: [28, 12],
      })),
    });
  }),

  // 2. Mock wyszukiwania filmów (ZAPOBIEGA BŁĘDOM "FAILED TO FETCH")
  http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
    await delay(600);
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const page = Number(url.searchParams.get('page') ?? 1);

    // Symulacja pustego wyniku dla konkretnego hasła (test komponentu EmptyState)
    if (query.toLowerCase() === 'puste') {
      return HttpResponse.json({ page: 1, total_pages: 1, results: [] });
    }

    return HttpResponse.json({
      page,
      total_pages: 3,
      results: Array.from({ length: 10 }, (_, i) => ({
        id: 9000 + (page * 10) + i,
        title: `Wynik dla "${query}" #${i + 1}`,
        overview: `To jest zmockowany wynik wyszukiwania dla hasła: ${query}.`,
        poster_path: null,
        release_date: '2026-01-01',
        vote_average: 6.8,
        genre_ids: [18],
      })),
    });
  }),

  // 3. Mock pobierania szczegółów konkretnego filmu do modala
  http.get(`${TMDB_BASE}/movie/:id`, async ({ params }) => {
    await delay(500);
    return HttpResponse.json({
      id: Number(params.id),
      title: `Szczegóły filmu ID: ${params.id}`,
      overview: 'Dokładny opis wybranego filmu pobrany z mockowanego API.',
      budget: 150000000,
      runtime: 124,
    });
  }),
  
  // 4. Rick & Morty (do ćwiczenia Warm-up)
  http.get('https://rickandmortyapi.com/api/character', () => {
    return HttpResponse.json({
      info: { count: 2, pages: 1, next: null },
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '' },
      ],
    });
  }),
];