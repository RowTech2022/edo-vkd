import { api } from './api'

export interface IPBSRequestBody {
  filter: string
}

type PbsInfoType = {
  code: string
  name: string
}

type RbsInfoType = PbsInfoType & {
  pbsInfo: Array<PbsInfoType>
}

type GrbsInfoType = PbsInfoType & {
  rbsInfo: Array<RbsInfoType>
}
export interface IPbsTree {
  grbsInfo: Array<GrbsInfoType>
}

export interface IFetchPBSResponse {
  items: Array<{ id: string; value: string }>
}

export const pbsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchPBS: builder.query<IFetchPBSResponse, IPBSRequestBody>({
      query: (filters: IPBSRequestBody = { filter: '' }) => ({
        url: '/api/pbs/get',
        method: 'POST',
        data: filters,
      }),
    }),
    fetchOnlyPBS: builder.mutation<IFetchPBSResponse, IPBSRequestBody>({
      query: (filters: IPBSRequestBody = { filter: '' }) => ({
        url: '/api/pbs/getonlypbs',
        method: 'POST',
        data: { filter: '' },
      }),
    }),
    fetchOnlyPBSQR: builder.query<IFetchPBSResponse, void>({
      query: () => ({
        url: '/api/pbs/getonlypbs',
        method: 'POST',
        data: { filter: '' },
      }),
    }),
    fetchOnlyGRBS: builder.query<IFetchPBSResponse, IPBSRequestBody>({
      query: (filters: IPBSRequestBody = { filter: '' }) => ({
        url: '/api/pbs/getonlygrbs',
        method: 'POST',
        data: filters,
      }),
    }),
    fetchPBSTree: builder.mutation<IPbsTree, IPBSRequestBody>({
      query: (filters = { filter: '' }) => ({
        url: '/api/pbs/tree',
        method: 'POST',
        data: filters,
      }),
    }),
  }),
})

export const {
  useFetchPBSQuery,
  useFetchOnlyPBSQRQuery,
  useFetchPBSTreeMutation,
  useFetchOnlyGRBSQuery,
  useFetchOnlyPBSMutation,
} = pbsApi
