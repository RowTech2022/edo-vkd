import { api, ListResponse } from './api'

export interface IProductsRequestBody {
  ids: number[]
}

const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchProductsList: builder.query<
      ListResponse<Products.Product>,
      Nullable<IProductsRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/product/list',
        method: 'POST',
        data: {
          ids: null,
        },
      }),
    }),
  }),
})
export const { useLazyFetchProductsListQuery } = productsApi
