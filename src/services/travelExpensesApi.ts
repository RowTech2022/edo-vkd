import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from './api'

export interface ITravelExpensesRequestSearch {
  docNo?: string
  docDate?: string
  year?: number
  organisation?: {
    id: string
    value: string
  }
  state?: number
}

export interface ITravelExpensesRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: ITravelExpensesRequestSearch
}

export interface IFileResponce {
  url: string
}

export interface ITravelExpenseSignRequestBody {
  id: number
  currentState: number
  timestamp: string
}

export interface ITravelExpenseRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

const travelExpensesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchTravelExpenses: builder.query<
      ListResponse<TravelExpenses.TravelExpenseShort>,
      Nullable<ITravelExpensesRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Travel_Expenses/search',
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
    fetchTravelExpenseById: builder.query<TravelExpenses.TravelExpense, number>(
      {
        query: (id) => ({ url: `/api/Travel_Expenses/get/${id}` }),
        providesTags: ['TravelExpenses'],
      }
    ),
    saveTravelExpense: builder.mutation<
      TravelExpenses.TravelExpense,
      Pick<
        Nullable<TravelExpenses.TravelExpense>,
        | 'docNo'
        | 'date'
        | 'term'
        | 'fio'
        | 'position'
        | 'passSeries'
        | 'passIssued'
        | 'passIssuedBy'
        | 'organisation'
        | 'destination'
        | 'purpose'
        | 'files'
      >
    >({
      query: (data) => ({
        url: '/api/Travel_Expenses/create',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
    updateTravelExpense: builder.mutation<
      TravelExpenses.TravelExpense,
      Pick<
        Nullable<TravelExpenses.TravelExpense>,
        | 'id'
        | 'docNo'
        | 'date'
        | 'term'
        | 'fio'
        | 'position'
        | 'passSeries'
        | 'passIssued'
        | 'passIssuedBy'
        | 'organisation'
        | 'destination'
        | 'purpose'
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/Travel_Expenses/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
    signTravelExpense: builder.mutation<
      TravelExpenses.TravelExpense,
      ITravelExpenseSignRequestBody
    >({
      query: (data) => ({
        url: '/api/Travel_Expenses/sign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),
    rejectTravelExpense: builder.mutation<
      TravelExpenses.TravelExpense,
      ITravelExpenseRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/Travel_Expenses/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TravelExpenses'],
    }),

    fetchUploadFile: builder.mutation<IFileResponce, FormData>({
      query: (data) => ({
        url: '/api/File/UploadFile',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useFetchTravelExpensesQuery,
  useLazyFetchTravelExpensesQuery,
  useFetchTravelExpenseByIdQuery,
  useSaveTravelExpenseMutation,
  useUpdateTravelExpenseMutation,
  useSignTravelExpenseMutation,
  useRejectTravelExpenseMutation,
  useFetchUploadFileMutation,
} = travelExpensesApi
