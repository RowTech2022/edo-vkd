import {
  api,
  ListResponse,
  IRequestOrderBy,
  IRequestPagination,
} from './api'

export interface IContractsFilters {
  docNo?: string
  docDate?: Date
  receiver?: {
    info: {
      id: string
      value: string
    }
    requisites: string
  }
  summa?: number
  state?: number
}
export interface IContractsRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IContractsFilters
}

export interface ContractProductDTO {
  id: number
  productId: number
  name: string
  measure: string
  count: number
  price: number
  total: number
}

export interface ContractFileDTO {
  id: number
  contractId: number
  url: string
  name: string
  desc: string
  date: number
  createBy: string
}

export interface IContractSignRequestBody {
  id: number
  currentState: number
  timestamp: string
}
export interface IFileResponce {
  url: string
}

export interface IContractRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface IIds {
  ids: number[]
}

const contractsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchContracts: builder.query<
      ListResponse<Contracts.ContractShort>,
      Nullable<IContractsRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Contract/search',
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
    fetchContractById: builder.query<Contracts.Contract, number>({
      query: (id) => ({ url: `/api/Contract/get/${id}` }),
      providesTags: ['Contracts'],
    }),
    saveContract: builder.mutation<
      Contracts.Contract,
      Pick<
        Nullable<Contracts.Contract>,
        'details' | 'mainInformation' | 'notes' | 'products' | 'files'
      >
    >({
      query: (data) => ({ url: '/api/Contract/create', method: 'POST', data }),
      invalidatesTags: ['Contracts'],
    }),
    updateContract: builder.mutation<
      Contracts.Contract,
      Pick<
        Nullable<Contracts.Contract>,
        | 'id'
        | 'details'
        | 'mainInformation'
        | 'notes'
        | 'products'
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({ url: '/api/Contract/update', method: 'POST', data }),
      invalidatesTags: ['Contracts'],
    }),

    sendToSignContract: builder.mutation<
      Contracts.Contract,
      IContractSignRequestBody
    >({
      query: (data) => ({
        url: '/api/Contract/sedntoSing',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Contracts'],
    }),

    signContract: builder.mutation<
      Contracts.Contract,
      IContractSignRequestBody
    >({
      query: (data) => ({ url: '/api/Contract/sign', method: 'POST', data }),
      invalidatesTags: ['Contracts'],
    }),
    rejectContract: builder.mutation<
      Contracts.Contract,
      IContractRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/Contract/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Contracts'],
    }),

    fetchListContract: builder.query<
      ListResponse<Contracts.ContractList>,
      void
    >({
      query: () => ({
        url: '/api/Contract/list',
        method: 'POST',
        data: {},
      }),
    }),

    fetchContractFile: builder.query<
      { file64: Blob; fileName: string },
      number
    >({
      query: (id) => ({ url: `/api/Contract/print/${id}` }),
      providesTags: ['Contracts'],
    }),

    fetchUploadFile: builder.mutation<IFileResponce, FormData>({
      query: (data) => ({
        url: '/api/File/UploadFile',
        //url: 'https://localhost:44383/Api/Contract/addFileNew',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useFetchContractsQuery,
  useLazyFetchContractsQuery,
  useFetchContractByIdQuery,
  useSaveContractMutation,
  useUpdateContractMutation,
  useSignContractMutation,
  useSendToSignContractMutation,
  useRejectContractMutation,
  useFetchListContractQuery,
  useFetchContractFileQuery,
  useFetchUploadFileMutation,
} = contractsApi
