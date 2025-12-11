import { api } from '../api'
import {
  IFinanceReportsSearchRequest,
  IFinanceReportsSearchResponse,
} from './models/search'
import {
  IFinanceReportsCreateRequest,
  IFinanceReportsCreateResponse,
} from './models/create'
import { IFinanceReportsUpdateRequest } from './models/update'
import {
  IFinanceReportsAcceptRequest,
  IFinanceReportsSignRequest,
  IFinanceReportsUndoDocumentRequest,
} from './models/actions'
import { IMetaInfo } from './models/metadata'
import { apiRoutes } from '@configs'

const financeReportApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Search finance reports
    financeReports: builder.query<
      IFinanceReportsSearchResponse,
      IFinanceReportsSearchRequest
    >({
      query: (data) => ({
        url: apiRoutes.financeReportSearch,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports create
    createFinanceReport: builder.mutation<
      IFinanceReportsCreateResponse,
      IFinanceReportsCreateRequest
    >({
      query: (data) => ({
        url: apiRoutes.createFinanceReport,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports update
    updateFinanceReport: builder.mutation<
      IFinanceReportsCreateResponse,
      IFinanceReportsUpdateRequest
    >({
      query: (data) => ({
        url: apiRoutes.updateFinanceReport,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports sign
    signFinanceReport: builder.mutation<
      IFinanceReportsCreateResponse,
      IFinanceReportsSignRequest
    >({
      query: (data) => ({
        url: apiRoutes.signFinanceReport,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports undo document
    undoDocFinanceReport: builder.mutation<
      IFinanceReportsCreateResponse,
      IFinanceReportsUndoDocumentRequest
    >({
      query: (data) => ({
        url: apiRoutes.undoDocumentFinanceReport,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports accept
    acceptFinanceReport: builder.mutation<
      IFinanceReportsCreateResponse,
      IFinanceReportsAcceptRequest
    >({
      query: (data) => ({
        url: apiRoutes.acceptFinanceReport,
        data,
        method: 'POST',
      }),
    }),

    // Search finance reports
    getByIdFinanceReports: builder.mutation<
      IFinanceReportsSearchResponse,
      number
    >({
      query: (id) => ({
        url: apiRoutes.getByIdFinanceReport + id,
        method: 'GET',
      }),
    }),

    // Metadata
    fetchMetaData: builder.query<IMetaInfo, void>({
      query: () => ({ url: '/api/financereport/metadata' }),
    }),
  }),
})

export const {
  useFinanceReportsQuery,
  useLazyFinanceReportsQuery,
  useCreateFinanceReportMutation,
  useUpdateFinanceReportMutation,
  useSignFinanceReportMutation,
  useUndoDocFinanceReportMutation,
  useAcceptFinanceReportMutation,
  useGetByIdFinanceReportsMutation,
  useLazyFetchMetaDataQuery,
} = financeReportApi
