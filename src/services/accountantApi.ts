import { axios } from "@configs"
import { api, IRequestOrderBy, IRequestPagination, ListResponse } from "./api"

export interface IAccountantResponsibilitiesRequestSearch {
  year?: number
  inn?: string
  state?: number
}
export interface IAccountantResponsibilitiesRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IAccountantResponsibilitiesRequestSearch
}

export interface IAccountantResponsibilitiesSignRequestBody {
  id: number
  currentState: number
  type: number
  timestamp: string
}
export interface TFMISAccessApplicationCheckAprovedDocRequestBody {
  type: number
}

export interface IAccountantResponsibilitiesRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface IAccountantResponsibilitiesDeleteRequestBody {
  id: number
  timestamp: string
}

export interface AccountantResponsibilityDTO {
  id: number
  orgName: string
  inn: string
  state: 1
  createdDate: string
  year: number
  InfoBlockAccountants: {
    info: {
      id: string
      value: string
    }
    orgName: string
    adress: string
    inn: string
  }
}

export const accountantApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchAccountantResponsibilities: builder.query<
      ListResponse<AccountantResponsibilityDTO>,
      Nullable<IAccountantResponsibilitiesRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/AccountantResponsibility/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),


    fetchAccountantResponsibilitiesById: builder.query<Accountant.JobResponsibilities, number>({
      query: (id) => ({ url: `/api/AccountantResponsibility/get/${id}` }),
      providesTags: ['AccountantJobResponsibility'],
    }),

    saveAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      Pick<
        Nullable<Accountant.JobResponsibilities>,
        | 'year'
        | 'bo_Signature'
        | 'bo_SignatureTime'
        | 'infoCartSignaturas'
      >
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/create',
        method: 'POST',
        data,
      }),
    }),
    updateAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      Pick<
        Nullable<Accountant.JobResponsibilities>,
        | 'id'
        | 'year'
        | 'bo_Signature'
        | 'bo_SignatureTime'
        | 'infoCartSignaturas'
      >
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['AccountantJobResponsibility'],
    }),
    signAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      IAccountantResponsibilitiesSignRequestBody
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/signDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['AccountantJobResponsibility'],
    }),

    checkAprovedDocAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      TFMISAccessApplicationCheckAprovedDocRequestBody
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/checkAprovedDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['TFMISAccessApplication'],
    }),
    rejectAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      IAccountantResponsibilitiesRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/rejectDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['AccountantJobResponsibility'],
    }),
    deleteAccountantResponsibilities: builder.mutation<
      Accountant.JobResponsibilities,
      IAccountantResponsibilitiesDeleteRequestBody
    >({
      query: (data) => ({
        url: '/api/AccountantResponsibility/deleteDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['AccountantJobResponsibility'],
    }),
  }),
})

export function exportToPDF(
  data: Nullable<IAccountantResponsibilitiesRequestBody> | void
) {
  return axios.post('/api/AccountantResponsibility/SearchPrintPdf', data, {
    responseType: 'blob',
  })
}

export const {
  useFetchAccountantResponsibilitiesQuery,
  useLazyFetchAccountantResponsibilitiesQuery,
  useFetchAccountantResponsibilitiesByIdQuery,
  useSaveAccountantResponsibilitiesMutation,
  useUpdateAccountantResponsibilitiesMutation,
  useCheckAprovedDocAccountantResponsibilitiesMutation,
  useSignAccountantResponsibilitiesMutation,
  useRejectAccountantResponsibilitiesMutation,
  useDeleteAccountantResponsibilitiesMutation,
} = accountantApi
