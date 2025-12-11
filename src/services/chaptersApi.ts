import { api } from './api'

export const chaptersApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchChapters: builder.query<IChapters, void>({
      query: () => ({ url: '/api/crm/getTer', method: 'POST' }),
    }),
    fetchTerrOnly: builder.query<IChapters, void>({
      query: () => ({ url: '/api/crm/getTerOnly', method: 'POST' }),
    }),
  }),
})

export const { useFetchChaptersQuery, useFetchTerrOnlyQuery } = chaptersApi
