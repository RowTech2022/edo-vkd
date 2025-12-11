import { api, ListResponse } from './api'

export const modulesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchModules: builder.query<ListResponse<EDOModule>, void>({
      query: () => ({ url: '/api/userprofile/moduls', method: 'POST' }),
      keepUnusedDataFor: 0.0001
    }),
  }),
})

export const { useFetchModulesQuery } = modulesApi
