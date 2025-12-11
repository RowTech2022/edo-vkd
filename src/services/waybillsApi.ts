import {
  api,
  ListResponse,
  IRequestOrderBy,
  IRequestPagination,
} from './api'

export interface IWaybillsRequestSearch {
  docNo?: string
  docDate?: Date
  receiver?: {
    id: string
    value: string
  }
  state?: number
}

export interface IWaybillsRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IWaybillsRequestSearch
}

export interface WaybillProductDTO {
  id: number
  productId: number
  name: string
  measure: string
  count: number
  price: number
  taxPercent: number
  taxSumma: number
  total: number
}

export interface IWaybillSignRequestBody {
  id: number
  currentState: number
  timestamp: string
}

export interface IWaybillRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

const invoiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchWaybills: builder.query<
      ListResponse<Waybills.WaybillShort>,
      Nullable<IWaybillsRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Waybill/search',
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
    fetchWaybillById: builder.query<Waybills.Waybill, number>({
      query: (id) => ({ url: `/api/Waybill/get/${id}` }),
      providesTags: ['Waybills'],
    }),
    saveWaybill: builder.mutation<
      Waybills.Waybill,
      Pick<
        Nullable<Waybills.Waybill>,
        | 'docNo'
        | 'date'
        | 'contract'
        | 'proxies'
        | 'through'
        | 'letBy'
        | 'letDate'
        | 'acceptedBy'
        | 'acceptedDate'
        | 'products'
        | 'summa'
      >
    >({
      query: (data) => ({ url: '/api/Waybill/create', method: 'POST', data }),
      invalidatesTags: ['Waybills'],
    }),
    updateWaybill: builder.mutation<
      Waybills.Waybill,
      Pick<
        Nullable<Waybills.Waybill>,
        | 'id'
        | 'docNo'
        | 'date'
        | 'contract'
        | 'proxies'
        | 'through'
        | 'letBy'
        | 'letDate'
        | 'acceptedBy'
        | 'acceptedDate'
        | 'products'
        | 'summa'
        | 'timestamp'
      >
    >({
      query: (data) => ({ url: '/api/Waybill/update', method: 'POST', data }),
      invalidatesTags: ['Waybills'],
    }),
    signWaybill: builder.mutation<Waybills.Waybill, IWaybillSignRequestBody>({
      query: (data) => ({ url: '/api/Waybill/sign', method: 'POST', data }),
      invalidatesTags: ['Waybills'],
    }),
    rejectWaybill: builder.mutation<
      Waybills.Waybill,
      IWaybillRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/Waybill/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Waybills'],
    }),
  }),
})

export const {
  useFetchWaybillsQuery,
  useLazyFetchWaybillsQuery,
  useFetchWaybillByIdQuery,
  useSaveWaybillMutation,
  useUpdateWaybillMutation,
  useSignWaybillMutation,
  useRejectWaybillMutation,
} = invoiceApi
