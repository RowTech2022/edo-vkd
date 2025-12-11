import { api, ListResponse } from './api'

export interface ITendersRequestBody {
  ids: number[]
}

const invoiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchTendersList: builder.query<
      ListResponse<{ id: string; value: string }>,
      Nullable<ITendersRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Tender/list',
        method: 'POST',
        data: {
          ids: null,
          ...data,
        },
      }),
    }),
  }),
})

export const { useFetchTendersListQuery } = invoiceApi
