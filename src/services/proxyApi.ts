import {
  api,
  ListResponse,
  IRequestOrderBy,
  IRequestPagination,
} from './api'

export interface IProxiesRequestSearch {
  docNo?: string
  docDate?: Date
  receiver?: string
  state?: number
}

export interface IProxiesRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IProxiesRequestSearch
}

export interface IProxySignRequestBody {
  id: number
  currentState: number
  timestamp: string
}

export interface IProxyRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface ProxyProductDTO {
  id: number
  productId: number
  name: string
  measure: string
  count: number
  countText: string
}

export interface IProxyList {
  contractIds?: number[]
}

const ProxyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchProxies: builder.query<
      ListResponse<Proxies.ProxyShort>,
      Nullable<IProxiesRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Proxy/search',
        method: 'POST',
        data: {
          pageInfo: {
            pageNumber: 1,
            pageSize: 10,
          },
          ...data,
        },
      }),
    }),
    fetchProxyById: builder.query<Proxies.Proxy, number>({
      query: (id) => ({ url: `/api/Proxy/get/${id}` }),
      providesTags: ['Proxies'],
    }),
    fetchProxyList: builder.query<
      ListResponse<Proxies.ProxyListItem>,
      Nullable<IProxyList> | void
    >({
      query: (data) => ({
        url: `/api/Proxy/list`,
        method: 'POST',
        data,
      }),
      providesTags: ['Proxies'],
    }),
    saveProxy: builder.mutation<
      Proxies.Proxy,
      Pick<
        Nullable<Proxies.Proxy>,
        | 'docNo'
        | 'date'
        | 'validUntil'
        | 'passSeries'
        | 'passIssued'
        | 'passIssuedBy'
        | 'fio'
        | 'position'
        | 'contract'
        | 'invoice'
        | 'products'
      >
    >({
      query: (data) => ({ url: '/api/Proxy/create', method: 'POST', data }),
      invalidatesTags: ['Proxies'],
    }),
    updateProxy: builder.mutation<
      Proxies.Proxy,
      Pick<
        Nullable<Proxies.Proxy>,
        | 'id'
        | 'docNo'
        | 'date'
        | 'validUntil'
        | 'passSeries'
        | 'passIssued'
        | 'passIssuedBy'
        | 'fio'
        | 'position'
        | 'contract'
        | 'invoice'
        | 'products'
        | 'timestamp'
      >
    >({
      query: (data) => ({ url: '/api/Proxy/update', method: 'POST', data }),
      invalidatesTags: ['Proxies'],
    }),
    signProxy: builder.mutation<Proxies.Proxy, IProxySignRequestBody>({
      query: (data) => ({ url: '/api/Proxy/sign', method: 'POST', data }),
      invalidatesTags: ['Proxies'],
    }),
    rejectProxy: builder.mutation<Proxies.Proxy, IProxyRejectRequestBody>({
      query: (data) => ({
        url: '/api/Proxy/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Proxies'],
    }),
  }),
})

export const {
  useFetchProxiesQuery,
  useLazyFetchProxiesQuery,
  useFetchProxyByIdQuery,
  useSaveProxyMutation,
  useUpdateProxyMutation,
  useSignProxyMutation,
  useRejectProxyMutation,
  useLazyFetchProxyListQuery,
} = ProxyApi
