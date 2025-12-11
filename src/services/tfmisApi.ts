import {
  api,
  IRequestPagination,
  IRequestOrderBy,
  ListResponse,
  ValueId,
} from './api'
import { HeadListInfo } from './accessMfApi'
import { axios } from '@configs'

export interface TFMISAccessApplicationsRequestSearch {
  year?: number
  pbs?: string
  treasureCode?: number
  state?: number
}

export interface ICuratorHeadRequest {
  type: number
  seqnums: ValueId[]
  dzSeqnums: ValueId[]
  treasureCode: number
}

export interface TFMISAccessApplicationsRequestBody
  extends IRequestPagination,
  IRequestOrderBy {
  ids?: number[]
  filtres?: TFMISAccessApplicationsRequestSearch
}

export interface TFMISAccessApplicationSignRequestBody {
  id: number
  type: number
  timestamp: string
}

export interface TFMISAccessApplicationCheckAprovedDocRequestBody {
  type: number
}

export interface TFMISAccessApplicationRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface TFMISACcessApplicationDeleteRequestBody {
  id: number
  timestamp: string
}

const tfmisApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchTFMISAccessApplications: builder.query<
      ListResponse<TFMISApplication>,
      Nullable<TFMISAccessApplicationsRequestBody> | void
    >({
      query: (filters: TFMISAccessApplicationsRequestBody) => ({
        url: '/api/AccessTfmis/search',
        method: 'POST',
        data: {
          pageInfo: {
            pageNumber: 1,
            pageSize: 10,
          },
          ...filters,
        } as TFMISAccessApplicationsRequestBody,
      }),
    }),
    fetchTFMISAccessApplicationById: builder.query<
      TFMIS.AccessApplication,
      number
    >({
      query: (id) => ({ url: `/api/AccessTfmis/get/${id}` }),
      providesTags: ['TFMISAccessApplication'],
    }),
    saveTFMISAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      Pick<
        Nullable<TFMIS.AccessApplication>,
        'organisation' | 'userInfo' | 'certifyingDocuments'
      >
    >({
      query: (application) => ({
        url: '/api/AccessTfmis/create',
        method: 'POST',
        data: application,
      }),
    }),
    updateTFMISAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      Pick<
        Nullable<TFMIS.AccessApplication>,
        'id' | 'organisation' | 'userInfo' | 'certifyingDocuments' | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/AccessTfmis/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),
    signTFMISAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      TFMISAccessApplicationSignRequestBody
    >({
      query: (data) => ({
        url: '/api/AccessTfmis/signDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),

    checkAprovedDocAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      TFMISAccessApplicationCheckAprovedDocRequestBody
    >({
      query: (data) => ({
        url: '/api/AccessTfmis/checkAprovedDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),
    rejectTFMISAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      TFMISAccessApplicationRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/AccessTfmis/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),

    //fetchTreasureCodes: builder.query<{ items: ValueId[] }, void>({

    // fetchGetCuratorHead: builder.query<{ items: HeadListInfo },
    // Nullable<ICuratorHeadRequest>>({
    //   query: (application) => ({
    //     url: '/api/userprofile/getcuratorhead',
    //     method: 'POST',
    //     data: application
    //   }),
    // }),

    fetchGetCuratorHead: builder.query<
      ListResponse<HeadListInfo>,
      Nullable<ICuratorHeadRequest>
    >({
      query: (application) => ({
        url: '/api/userprofile/getcuratorhead',
        method: 'POST',
        data: application,
      }),
    }),

    fetchInvoicesTax: builder.query<
      ListResponse<HeadListInfo>,
      Nullable<ICuratorHeadRequest> | void
    >({
      query: (data) => ({
        url: '/api/userprofile/getcuratorhead',
        method: 'POST',
        data: {
          ...data,
        },
      }),
    }),

    deleteTFMISAccessApplication: builder.mutation<
      TFMIS.AccessApplication,
      TFMISACcessApplicationDeleteRequestBody
    >({
      query: (data) => ({ url: '', method: 'POST', data }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),
  }),
})

export function exportToPDF(
  data: Nullable<TFMISAccessApplicationsRequestBody> | void
) {
  return axios.post('/api/AccessTfmis/SearchPrintPdf', data, {
    responseType: 'blob',
  })
}

export const {
  useFetchTFMISAccessApplicationsQuery,
  useLazyFetchTFMISAccessApplicationsQuery,
  useSaveTFMISAccessApplicationMutation,
  useFetchTFMISAccessApplicationByIdQuery,
  useLazyFetchTFMISAccessApplicationByIdQuery,
  useSignTFMISAccessApplicationMutation,
  useLazyFetchGetCuratorHeadQuery,
  useCheckAprovedDocAccessApplicationMutation,
  useRejectTFMISAccessApplicationMutation,
  useDeleteTFMISAccessApplicationMutation,
  useUpdateTFMISAccessApplicationMutation,
} = tfmisApi
