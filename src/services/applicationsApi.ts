import { api } from "@services/api"

export interface IApplication {
  id: number
  date: string
  type: {
    id: string
    value: string
  }
  executor: {
    id: string
    value: string
  }
  region: {
    id: string
    value: string
  }
  state: number
  createAt: string
}

export interface IApplicationsRequest {
  ids: string[] | null
  filtres: {
    regionId: number
  }
  orderBy: {
    column: number
    order: number
  }
  pageInfo: {
    pageNumber: number
    pageSize: number
  }
}

export interface IServiceAddItem {
  serviceId: number
  code: string
  price: number
  count: number
  measure: string
  ndsSumma: number
  total: number
}

export interface IApplicationByIdResponse {
  id: number
  docNo: string
  docDate: string
  organisation: {
    id: string
    value: string
  }
  fio: string
  inn: string
  state: number
  serialNumber: string
  hasToken: boolean
  tokenNumber: string
  phone: string
  email: string
  prikazUrl: string
  passportUrl: string
  oprk1: {
    id: number
    executor: {
      id: string
      value: string
    }
    sertificatSerial: string
    date: string
  }
  ib: {
    id: number
    executor: {
      id: string
      value: string
    }
    loginTfmis: string
    passiveLoginTfmis: boolean
    loginEdo: string
    passiveLoginEdo: boolean
    newTfmisLogin: string
    newTfmisPassword: string
    newEdoLogin: string
    newEdoPassword: string
  }
  admin: {
    id: number
    executor: {
      id: string
      value: string
    }
    loginVpn: string
    passiveLoginVpn: boolean
    newVpnLogin: string
    newVpnPassword: string
  }
  oprk2: {
    id: number
    executor: {
      id: string
      value: string
    }
    sertificatSerial: string
    date: string
    status: number
    total: number
    services: Array<IServiceAddItem>
  }
  ib2: {
    id: number
    executor: {
      id: string
      value: string
    }
    loginTfmis: string
    tfmisCert: string
    loginEdo: string
    edoCert: string
  }
  accountant: {
    id: number
    executor: {
      id: string
      value: string
    }
    invoices: string[]
    acts: string[]
    waybills: string[]
  }
  oprk3: {
    id: number
    loginTfmis: string
    passwordTfmis: string
    loginEdo: string
    passwordEdo: string
    certNumber: string
    date: string
    loginVpn: string
    passwordVpn: string
  }
  transitions: {
    fieldSettings: Record<string, IButtonSetting>
    buttonSettings: Record<string, IButtonSetting>
    buttonInfo: {
      additionalProp1: string[]
      additionalProp2: string[]
      additionalProp3: string[]
    }
  }
}

// executor setting
interface ISetExecutorRequest {
  id: number
  type: number
  executor: {
    id: string
    value: string
  }
  timestamp?: string
}

interface IModifyRequest {
  id: number
  type: number
  timestamp?: string
}

interface ISertRequest {
  id: number
  sertificatSerial: string
  date: string
  timestamp?: string
}

export interface IApplicationsResponse {
  items: IApplication[]
  total: number
}

export interface IServiceItem {
  id: number
  code: string
  name: string
  mesaure: string
}

export interface IServices {
  items: IServiceItem[]
}

type TOrganization = {
  id: string
  value: string
}

export interface IApplicationCreateRequest {
  docDate: string
  organisation: TOrganization | null
  fio: string
  inn: string
  serialNumber: string
  hasToken: boolean
  tokenNumber: string
  phone: string
  email: string
  prikazUrl: string
  passportUrl: string
}

export const applicationsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchApplications: builder.query<
      IApplicationsResponse,
      IApplicationsRequest
    >({
      query: (filter) => ({
        url: '/api/Request/search/',
        method: 'POST',
        data: filter,
      }),
    }),
    createRequest: builder.mutation<
      IApplicationByIdResponse,
      IApplicationCreateRequest
    >({
      query: (data) => ({
        url: '/api/Request/create',
        method: 'POST',
        data,
      }),
    }),
    fetchApplicationById: builder.query<IApplicationByIdResponse, number>({
      query: (id) => ({
        url: '/api/Request/get/' + id,
        method: 'GET',
      }),
    }),
    setExecutor: builder.mutation<
      IApplicationByIdResponse,
      ISetExecutorRequest
    >({
      query: (data) => ({
        url: '/api/Request/setexecutor',
        method: 'POST',
        data,
      }),
    }),
    setComplated: builder.mutation<IApplicationByIdResponse, IModifyRequest>({
      query: (data) => ({
        url: '/api/Request/complated',
        method: 'POST',
        data,
      }),
    }),
    setBack: builder.mutation<IApplicationByIdResponse, IModifyRequest>({
      query: (data) => ({
        url: '/api/Request/back',
        method: 'POST',
        data,
      }),
    }),
    setApprove: builder.mutation<IApplicationByIdResponse, IModifyRequest>({
      query: (data) => ({
        url: '/api/Request/approve',
        method: 'POST',
        data,
      }),
    }),
    setDone: builder.mutation<IApplicationByIdResponse, IModifyRequest>({
      query: (data) => ({
        url: '/api/Request/done',
        method: 'POST',
        data,
      }),
    }),
    sertRequest: builder.mutation<IApplicationByIdResponse, ISertRequest>({
      query: (data) => ({
        url: '/api/Request/sertrequest',
        method: 'POST',
        data,
      }),
    }),
    revokeSert: builder.mutation<IApplicationByIdResponse, ISertRequest>({
      query: (data) => ({
        url: '/api/Request/revokesert',
        method: 'POST',
        data,
      }),
    }),
    saveOprk1: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['oprk1']
    >({
      query: (data) => ({
        url: '/api/Request/oprk1',
        method: 'POST',
        data,
      }),
    }),
    saveIbOtdel1: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['ib']
    >({
      query: (data) => ({
        url: '/api/Request/ibotdel1',
        method: 'POST',
        data,
      }),
    }),
    saveAdminOtdel: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['admin']
    >({
      query: (data) => ({
        url: '/api/Request/adminotdel',
        method: 'POST',
        data,
      }),
    }),
    saveOprk2: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['oprk2']
    >({
      query: (data) => ({
        url: '/api/Request/oprk2',
        method: 'POST',
        data,
      }),
    }),
    saveIbOtdel2: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['ib2']
    >({
      query: (data) => ({
        url: '/api/Request/ibotdel2',
        method: 'POST',
        data,
      }),
    }),
    saveAccountantOtdel: builder.mutation<
      IApplicationByIdResponse,
      IApplicationByIdResponse['accountant']
    >({
      query: (data) => ({
        url: '/api/Request/accountantOtdel',
        method: 'POST',
        data,
      }),
    }),
    fetchServices: builder.query<IServices, null>({
      query: () => ({
        url: '/api/Request/getservice',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useFetchApplicationsQuery,
  useCreateRequestMutation,
  useFetchApplicationByIdQuery,
  useSetExecutorMutation,
  useSetComplatedMutation,
  useSetBackMutation,
  useSetApproveMutation,
  useSetDoneMutation,
  useSertRequestMutation,
  useRevokeSertMutation,
  useSaveIbOtdel1Mutation,
  useSaveAdminOtdelMutation,
  useSaveAccountantOtdelMutation,
  useSaveIbOtdel2Mutation,
  useSaveOprk2Mutation,
  useSaveOprk1Mutation,
  useFetchServicesQuery,
} = applicationsApi
