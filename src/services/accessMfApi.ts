import { axios } from '@configs'
import {
  IRequestPagination,
  IRequestOrderBy,
  ListResponse,
  ValueId,
 api } from './api'

export interface IAccessMfRequestSearch {
  year?: number
  inn?: string
  userType?: number
  treasureCode?: number
  state?: number
}

export interface IAccessMfRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IAccessMfRequestSearch
}

export interface MFAccessFormRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface MFAccessCopyFormRequestBody {
  id: number
}

export interface MFAccessCopyFormResponse {
  id: number
}

export interface MFAccesFromSignRequestBody {
  id: number
  type: number
  timestamp: string
}

export interface MFAccesFromDeleteRequestBody {
  id: number
  timestamp: string
}

export interface ITfmisList {
  ids?: number[]
  seqnums: number[]
  revSeqnums: number[]
  type: number
}

export interface GrbsListRequest {
  id: number
  onlyCurrent?: boolean
  prefix?: string
}

export interface GrbsListItem {
  id: string
  value?: string
  include: boolean
}

export interface GrbsList {
  items: GrbsListItem[]
}
export interface HeadListInfo {
  curatorInfo: ValueId
  position: ValueId
  phone: string
}
export interface HeadList {
  items: HeadListInfo[]
}

export interface GrbsSeqnumsRequest {
  id: number
  pbs: string
}

export interface GrbsListSetRequestAddon {
  id: number
  remove: boolean
  typeReq?: number
}

export interface GrbsSeqnumsResponse {
  bz: GrbsListItem[]
  dz: GrbsListItem[]
}

export interface GrbsListSetRequest extends GrbsListSetRequestAddon {
  grbs: Array<Omit<GrbsListItem, 'include'>>
}

export interface GrbsSeqnumsSetBzRequest extends GrbsListSetRequestAddon {
  bz: Array<Omit<GrbsListItem, 'include'>>
}

export interface GrbsSeqnumsSetDzRequest extends GrbsListSetRequestAddon {
  bz: Array<Omit<GrbsListItem, 'include'>>
}

const basePath = '/api/accessmf'

const url = (...args: string[]) => [basePath, ...args].join('/')

const accessMfApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchAccessForms: builder.query<
      ListResponse<MfAccessForm>,
      Nullable<IAccessMfRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/AccessMf/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),

    fetchMfAccessFormById: builder.query<MF.AccessForm, number>({
      query: (id) => ({ url: url('get', id.toString()) }),
      providesTags: ['MFAccessForm'],
    }),

    getMfAccessFormById: builder.mutation<MF.AccessForm, number>({
      query: (id) => ({ url: url('get', id.toString()) }),
      invalidatesTags: ['MFAccessForm'],
    }),

    //  fetchMfAccessDefaultPage: builder.query<MF.PageAccessInfo[], void>({
    //    query: (id) => ({ url: url('defaultPage') }),
    //    providesTags: ['MFAccessForm'],
    //  }),

    saveMFAccessForm: builder.mutation<
      MF.AccessForm,
      Nullable<Pick<MF.AccessForm, 'userInfo' | 'access'>>
    >({ query: (data) => ({ url: url('create'), method: 'POST', data }) }),

    updateMFAccessForm: builder.mutation<
      MF.AccessForm,
      Nullable<Pick<MF.AccessForm, 'id' | 'userInfo' | 'access' | 'timestamp'>>
    >({
      query: (data) => ({ url: url('update'), method: 'POST', data }),
      invalidatesTags: ['MFAccessForm'],
    }),

    signMFAccessForm: builder.mutation<
      MF.AccessForm,
      MFAccesFromSignRequestBody
    >({
      query: (data) => ({ url: url('signDocument'), method: 'POST', data }),
      invalidatesTags: ['MFAccessForm'],
    }),

    rejectMFAccessForm: builder.mutation<
      MF.AccessForm,
      MFAccessFormRejectRequestBody
    >({
      query: (data) => ({ url: url('undoDocument'), method: 'POST', data }),
      invalidatesTags: ['MFAccessForm'],
    }),

    deleteMFAccessForm: builder.mutation<
      MF.AccessForm,
      MFAccesFromDeleteRequestBody
    >({
      query: (data) => ({ url: url('deleteDocument'), method: 'POST', data }),
      invalidatesTags: ['MFAccessForm'],
    }),

    fetchMfListForTfmisAccess: builder.query<
      ListResponse<TFMIS.IKuratonAndHeadInfo>,
      Nullable<ITfmisList> | void
    >({
      query: (data) => ({
        url: url('listfortfmis'),
        method: 'POST',
        data,
      }),
      providesTags: ['MFAccessForm'],
    }),

    // fetchMfAccessGrbsList: builder.query<GrbsList, GrbsListRequest>({
    //   query: (data) => ({ url:  url('grbs/list'), method: 'POST', data}),
    //   providesTags: ['MFAccessForm'],
    // }),

    getMFAccessGrbsList: builder.mutation<GrbsList, GrbsListRequest>({
      query: (data) => ({ url: url('grbs/list'), method: 'POST', data }),
    }),

    updateMFAccessGrbsSet: builder.mutation<string, GrbsListSetRequest>({
      query: (data) => ({ url: url('grbs/set'), method: 'POST', data }),
    }),

    getMFAccessGrbsSeqnums: builder.mutation<
      GrbsSeqnumsResponse,
      GrbsSeqnumsRequest
    >({
      query: (data) => ({ url: url('seqnums'), method: 'POST', data }),
    }),

    updateMFAccessGrbsSeqnumsBz: builder.mutation<
      string,
      GrbsSeqnumsSetBzRequest
    >({
      query: (data) => ({ url: url('seqnums/setBz'), method: 'POST', data }),
    }),

    updateMFAccessGrbsSeqnumsDz: builder.mutation<
      string,
      GrbsSeqnumsSetDzRequest
    >({
      query: (data) => ({ url: url('seqnums/setDz'), method: 'POST', data }),
    }),

    copyMFAccessForm: builder.mutation<
      MF.AccessForm,
      MFAccessCopyFormRequestBody
    >({
      query: (data) => ({
        url: url('copy'),
        method: 'POST',
        data,
      }),
      invalidatesTags: ['MFAccessForm'],
    }),
  }),
})

export function exportToPDF(data: Nullable<IAccessMfRequestBody> | void) {
  return axios.post('/api/AccessMf/SearchPrintPdf', data, {
    responseType: 'blob',
  })
}

export const {
  useFetchAccessFormsQuery,
  useLazyFetchAccessFormsQuery,
  useFetchMfAccessFormByIdQuery,
  useGetMfAccessFormByIdMutation,
  // useFetchMfAccessGrbsListQuery,
  useGetMFAccessGrbsListMutation,
  useUpdateMFAccessGrbsSetMutation,
  useGetMFAccessGrbsSeqnumsMutation,
  useUpdateMFAccessGrbsSeqnumsBzMutation,
  useUpdateMFAccessGrbsSeqnumsDzMutation,

  // useFetchMfAccessDefaultPageQuery,
  //useLazyFetchMfAccessDefaultPageQuery,

  useSaveMFAccessFormMutation,
  useUpdateMFAccessFormMutation,
  useSignMFAccessFormMutation,
  useRejectMFAccessFormMutation,
  useDeleteMFAccessFormMutation,
  useLazyFetchMfListForTfmisAccessQuery,
  useCopyMFAccessFormMutation,
} = accessMfApi
