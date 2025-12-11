import {
  api,
  ListResponse,
  IRequestOrderBy,
  IRequestPagination,
} from './api'

export interface IActRequestSearch {
  docNo?: string
  docDate?: Date
  receiver?: string
  state?: number
}

export interface IActRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IActRequestSearch
}

export interface IActSignRequestBody {
  id: number
  currentState: number
  timestamp: string
}

export interface IActRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface ActProductDTO {
  id: number
  productId: number
  name: string
  measure: string
  count: number
  price: number
  total: number

}

export interface IActList {
  contractIds?: number[]
}

const ActApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAct: builder.query<
      ListResponse<Act.ActShort>,
      Nullable<IActRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/act/search',
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
    fetchActById: builder.query<Act.Act, number>({
      query: (id) => ({ url: `/api/act/get/${id}` }),
      providesTags: ['Acts'],
    }),
    fetchActList: builder.query<
      ListResponse<Act.ActListItem>,
      Nullable<IActList> | void
    >({
      query: (data) => ({
        url: `/api/act/list`,
        method: 'POST',
        data,
      }),
      providesTags: ['Acts'],
    }),
    saveAct: builder.mutation<
      Act.Act,
      Pick<
        Nullable<Act.Act>,
        | 'docNo'
        | 'date'
        | 'contract'
        | 'summa'
        | 'passedBy'
        | 'acceptedBy'
        | 'notes'
        | 'products'

      >
    >({
      query: (data) => ({ url: '/api/act/create', method: 'POST', data }),
      invalidatesTags: ['Acts'],
    }),
    updateAct: builder.mutation<
      Act.Act,
      Pick<
        Nullable<Act.Act>,
        | 'id'
        | 'docNo'
        | 'date'
        | 'contract'
        | 'summa'
        | 'passedBy'
        | 'acceptedBy'
        | 'notes'
        | 'products'
        | 'timestamp'
      >
    >({
      query: (data) => ({ url: '/api/act/update', method: 'POST', data }),
      invalidatesTags: ['Acts'],
    }),
    signAct: builder.mutation<Act.Act, IActSignRequestBody>({
      query: (data) => ({ url: '/api/act/sign', method: 'POST', data }),
      invalidatesTags: ['Acts'],
    }),
    rejectAct: builder.mutation<Act.Act, IActRejectRequestBody>({
      query: (data) => ({
        url: '/api/act/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Acts'],
    }),
  }),
})

export const {
  useFetchActQuery,
  useLazyFetchActQuery,
  useFetchActByIdQuery,
  useSaveActMutation,
  useUpdateActMutation,
  useSignActMutation,
  useRejectActMutation,
  useLazyFetchActListQuery,
} = ActApi
