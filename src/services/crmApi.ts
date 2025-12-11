import { axios } from '@configs'
import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from './api'

export interface ISignatureCardRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: ISignatureCardRequestSearch
}

export interface ISignatureCardRequestSearch {
  year?: number
  inn?: string
  state?: number
}

export interface ISignatureCardSignRequest {
  id: number
  type: number
  timestamp: string
}

export interface ISignatureCardSignRequestBody {
  id: number
  timestamp: string
  sign: number
}

export interface ISignatureCardRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface ISignatureCardDeleteRequestBody {
  id: number
  timestamp: string
}

export interface SignatureSamplesCardDTO {
  id: number
  orgName: string
  inn: string
  state: number
  createdDate: string
  year: number
}

export interface CertifyingDocumentDTO {
  id: number
  name: string
  type: string
  createdBy: string
  createTs: string
  //state: number
  approvedDate: string
  approvedBy: string
}

const crmApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchSignaturesSampleCards: builder.query<
      ListResponse<SignatureSamplesCardDTO>,
      Nullable<ISignatureCardRequestBody> | void
    >({
      query: (filter) => ({
        url: '/api/CardSignatura/search2',
        method: 'POST',
        data: {
          ...filter,
        },
      }),
    }),
    fetchDocuments: builder.query<CertifyingDocumentDTO[], void>({
      query: () => ({
        url: '/api/CardSignatura/search',
        method: 'POST',
        data: { ids: null },
      }),
    }),
    fetchSignaturesSampleCardById: builder.query<SignatureSamples.Card, number>(
      {
        query: (id) => ({
          url: `/api/CardSignatura/get/${id}`,
          method: 'GET',
        }),
        providesTags: ['SignaturesCard'],
      }
    ),
    saveSignaturesSampleCard: builder.mutation<
      SignatureSamples.Card,
      Pick<SignatureSamples.Card, 'organisationInfo' | 'signatures'>
    >({
      query: (data) => ({
        url: '/api/CardSignatura/create',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    updateSignaturesSampleCard: builder.mutation<
      SignatureSamples.Card,
      Pick<SignatureSamples.Card, 'id' | 'organisationInfo' | 'signatures'>
    >({
      query: (data) => ({
        url: '/api/CardSignatura/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    signSignaturesSampleCard: builder.mutation<
      SignatureSamples.Card,
      ISignatureCardSignRequest
    >({
      query: (data) => ({
        url: '/api/CardSignatura/signDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    signSignaturesSampleCardBody: builder.mutation<
      SignatureSamples.Card,
      ISignatureCardSignRequestBody
    >({
      query: (data) => ({
        url: '/api/CardSignatura/signDocumentBody',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    rejectSignaturesSampleCard: builder.mutation<
      SignatureSamples.Card,
      ISignatureCardRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/CardSignatura/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    deleteSignaturesSampleCard: builder.mutation<
      SignatureSamples.Card,
      ISignatureCardDeleteRequestBody
    >({
      query: (data) => ({
        url: '/api/CardSignatura/deleteDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
    fetchRegions: builder.mutation<
      SignatureSamples.Card,
      Pick<SignatureSamples.Card, 'id' | 'organisationInfo' | 'signatures'>
    >({
      query: (data) => ({
        url: '/api/CardSignatura/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['SignaturesCard'],
    }),
  }),
})

export function exportToPDF(data: Nullable<ISignatureCardRequestBody> | void) {
  return axios.post('/api/CardSignatura/SearchPrintPdf', data, {
    responseType: 'blob',
  })
}

export const {
  useFetchSignaturesSampleCardsQuery,
  useLazyFetchSignaturesSampleCardsQuery,
  useFetchSignaturesSampleCardByIdQuery,
  useLazyFetchDocumentsQuery,
  useSaveSignaturesSampleCardMutation,
  useUpdateSignaturesSampleCardMutation,
  useSignSignaturesSampleCardMutation,
  useSignSignaturesSampleCardBodyMutation,
  useRejectSignaturesSampleCardMutation,
  useDeleteSignaturesSampleCardMutation,
} = crmApi
