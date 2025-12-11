
import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
} from './api'
import { IEgovTransitions } from './egov/application-resident/models/common'
interface IEgovServicesActionRequest {
  id: number
}
export interface IEgovServicesSignRequest extends IEgovServicesActionRequest {
  timestamp: string
}
export interface IEgovServicesFile {
  id: number
  serviceId: number
  name: string
  template: string
  createAt: Date
  updateAt: Date
  timestamp: string
  haveTemplate?: true
  loading?: false
  url?: string
}
export interface IEgovServicesRequestData {
  name: string
  description: string
  price: number
  treatmentPrice: number
  files: IEgovServicesFile[]
  phoneNumber?: string
  term?:number
}

export interface IEgovServicesCreateRequest {
  organisationId: number
  name: string
  description: string
  files: IEgovServicesFile[]
}

export interface IEgovServicesUpdateRequest {
  id: number
  name: string
  description: string
  files: IEgovServicesFile[]
}

export interface IEgovServicesDTO {
  serviceId: number
  files: IEgovServicesFile[]
}
export interface IEgovServicesCreateResponse {
  id: number
  regUser: number
  name: string
  description: string
  state: number
  organisation: ValueId
  files: IEgovServicesFile[]
  transitions?: IEgovTransitions
  createAt: Date | string
  updateAt: Date | string
  timestamp: string,
  term : number ,
  phoneNumber : string,
  treatmentPrice : number,
  price: number
}

export interface IEgovServicesUpdateRequest {
  id: number
  name: string
  description: string
  files: IEgovServicesFile[]
  timestamp: string
}
export interface IEgovServicesSearch {
  organisationId: number
  name: string
}

export interface IEgovServicesSearchRequest
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: IEgovServicesSearch
}

export interface IEgovServicesSearchResponce {
  id: number
  name: string
  state: number
  createAt: Date | string
}

export interface IEgovServicesGetByOrgIdResponse {
  id: string
  value: string
}

export interface IEgovServicesAcceptRequest {
  id: number
  readyFile: {
    id: number
    docId: number
    outDocNo: string
    inDocNo: string
    url: string
    name: string
    acceptedAt: Date | string
    acceptedBy: string
    loading?: boolean
  }
  timestamp?: string
}
export const egovServices = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createEgovServices: builder.mutation<
      IEgovServicesCreateResponse,
      IEgovServicesCreateRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Services/create',
        data,
        method: 'POST',
      }),
    }),
    updateEgovServices: builder.mutation<
      IEgovServicesCreateResponse,
      IEgovServicesUpdateRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Services/update',
        data,
        method: 'POST',
      }),
    }),
    signEgovServices: builder.mutation<
      IEgovServicesCreateResponse,
      IEgovServicesSignRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Services/sign',
        data,
        method: 'POST',
      }),
    }),
    fetchEgovServices: builder.query<
      ListResponse<IEgovServicesSearchResponce>,
      Nullable<IEgovServicesSearchRequest> | void
    >({
      query: (data) => ({
        url: '/api/Egov_Services/search',
        data,
        method: 'POST',
      }),
    }),
    fetchEgovServicesById: builder.mutation<
      IEgovServicesCreateResponse,
      number
    >({
      query: (id) => ({
        url: `/api/Egov_Services/get/` + id,
        method: 'GET',
      }),
    }),
    fetchEgovServicesByOrgId: builder.query<
      IEgovServicesGetByOrgIdResponse[],
      number
    >({
      query: (id) => ({
        url: `/api/Egov_Services/getByOrganisation/` + id,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useCreateEgovServicesMutation,
  useUpdateEgovServicesMutation,
  useSignEgovServicesMutation,
  useFetchEgovServicesQuery,
  useLazyFetchEgovServicesQuery,
  useFetchEgovServicesByIdMutation,
  useFetchEgovServicesByOrgIdQuery,
  useLazyFetchEgovServicesByOrgIdQuery,
} = egovServices
