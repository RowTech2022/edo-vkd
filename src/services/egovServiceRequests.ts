
import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  IUserWithAvatar,
  ListResponse,
  ValueId,
} from './api'
import { IEgovServicesCreateResponse } from './egovServices'

export interface IEgovServiceTransitions {
  fieldSettings: any
  buttonSettings: {
    btn_acceptcollect?: IButtonSetting
    btn_close?: IButtonSetting
    btn_collect?: IButtonSetting
    btn_openChat?: IButtonSetting
    btn_openChatWithClient?: IButtonSetting
    btn_save?: IButtonSetting
    btn_sendtoresolution?: IButtonSetting
    btn_rejectDocument?: IButtonSetting
    btn_sign?: IButtonSetting
    btn_changePayState?: IButtonSetting
  }
  buttonInfo: any}
export interface IEgovServiceRequestsActionRequest {
  id: number
}
export interface IEgovServiceRequestsGetServiceResponse {
  id: number
  value: string
}
export interface IEgovServiceRequestsSignRequest
  extends IEgovServiceRequestsActionRequest {
  timestamp: string
}
export interface IEgovServiceRequestsSendToResolutionRequest
  extends IEgovServiceRequestsActionRequest {
  approveBy: number
  comment: string
  timestamp: string
}
export interface IEgovServiceRequestsCreateDocRequest
  extends IEgovServiceRequestsActionRequest {
  files: string[]
}
export interface IEgovServiceRequiredFilesResponce {
  fileId: number
  fileName: string
  filePath?: string
  createAt: Date
  createAtBy: Date
  haveFile?: true
}

export interface IRejectDocument {
  id: number
  reasonText: string
  reasonType: number
  timestamp: string
}

export interface IEgovServiceRequestsFiles {
  fileId: number
  fileName: string
  filePath?: string
  createAt: Date | string
  createAtBy: Date | string
  loading?: boolean
}

export interface IEgovServiceRequestsDTO extends IEgovServicesCreateResponse {
  serviceId: number
}

export interface IEgovServiceRequestsCreateRequest {
  serviceId: number
  files: IEgovServiceRequestsFiles[]
}

export interface IEgovServiceRequestsUpdateRequest {
  id: number
  files: IEgovServiceRequestsFiles[]
  timestamp: string
}

export interface IEgovServiceRequestsCreateResponse {
  id: number
  service?: ValueId
  regUser?: IUserWithAvatar
  egovServiceNameType: number
  showReadyDocumentBlock : boolean;
  state: number
  executor?: ValueId
  mainDiscutionId?: number
  userDiscutionId?: number
  files: IEgovServiceRequiredFilesResponce[]
  transitions?: IEgovServiceTransitions
  documentHistories?: [
    {
      state?: string
      startDate?: Date | string
      endDate?: Date | string
      comment?: string
    }
  ]
  userInfo: {
    id: number
    name: string
    passportNumber: string
    phone: string
    email: string
    price: number
    treatmentPrice: number
    term: number
    phoneNumber: string

  }
  readyDucementText: {
    readyText: string
    sign: string
    signedReadyFile:string
    signedReadyFileUrl :string
  }
  orgAdress?: string
  orgINN?: string
  orgName?: string
  regUserType?: number
  createAt: Date | string
  updateAt: Date | string
  readyFiles: string[]
  timestamp: string
}
export interface IEgovServiceRequestsByIdsSearchRequest {
  organisationId: number
  serviceId: number
  state?: number,
  userName?:string,
  payState?:number,
  docType?: number,  
  date?:Date | string,
  paySum?: number,
  userPhone?: string

}
export interface IEgovServiceRequestsSearchRequest
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: IEgovServiceRequestsByIdsSearchRequest
}
export interface IEgovServiceRequestsByIdsResponce {
  id: number
  user: IUserWithAvatar
  service: IEgovServiceRequestsGetServiceResponse
  state: number
}

export interface IEgovServiceUpdatePayStateRequest {
  requestId: number
  bankId: number
  state: number
  docNo: string
  paidMoney: number
  timestamp: string

}

export const egovServiceRequests = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsCreateRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/create',
        data,
        method: 'POST',
      }),
    }),
    updateEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsUpdateRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/update',
        data,
        method: 'POST',
      }),
    }),
    signEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsSignRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/sign',
        data,
        method: 'POST',
      }),
    }),
    sendToResolutionEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsSendToResolutionRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/sendToResolution',
        data,
        method: 'POST',
      }),
    }),
    changePayStateEgovServiceRequests: builder.mutation<
      any,
      IEgovServiceUpdatePayStateRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/update/paystate',
        data,
        method: 'POST',
      }),
    }),
    fetchEgovServiceRequestsByIds: builder.query<
      ListResponse<IEgovServiceRequestsByIdsResponce>,
      Nullable<IEgovServiceRequestsSearchRequest> | void
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/search',
        data,
        method: 'POST',
      }),
    }),
    fetchEgovServiceRequestsById: builder.query<
      IEgovServiceRequestsCreateResponse,
      number
    >({
      query: (id) => ({
        url: `/api/Egov_Service_Requests/get/` + id,
        method: 'GET',
      }),
    }),
    createDocEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsCreateDocRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/createDoc',
        data,
        method: 'POST',
      }),
    }),
    approveDocEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsActionRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/approveDoc',
        data,
        method: 'POST',
      }),
    }),
    closeEgovServiceRequests: builder.mutation<
      IEgovServiceRequestsCreateResponse,
      IEgovServiceRequestsSignRequest
    >({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/close',
        data,
        method: 'POST',
      }),
    }),
    readFlagChange: builder.mutation({
      query: (data) => ({
        url: `/api/Egov_Service_Requests/changereadflag`,
        method: 'POST',
        data,
      }),
    }),
    
    approveReadyText: builder.mutation({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/approveReadyText',
        data,
        method: 'POST'
      })
    }),
    rejectDocument: builder.mutation<
    IEgovServiceRequestsCreateResponse,
    IRejectDocument
  >({
    query: (data) => ({
      url: '/api/Egov_Service_Requests/rejectRequest',
      method: 'POST',
      data,
    }),
    invalidatesTags: ['Incoming'],
    }),
    
    downloadQRCode: builder.mutation({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/downloadQrCode',
        data,
        method: 'POST'
      })
    }),
    addFiles: builder.mutation({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/createReadyDocInBlank',
        data,
        method: 'POST',
      })
    }),
    addDownloadSign: builder.mutation({
      query: (data) => ({
        url: '/api/Egov_Service_Requests/downloadSign',
        data,
        method: 'POST',
      })
    }),
  }),
})

export const {
  useCreateEgovServiceRequestsMutation,
  useUpdateEgovServiceRequestsMutation,
  useSignEgovServiceRequestsMutation,
  useSendToResolutionEgovServiceRequestsMutation,
  useFetchEgovServiceRequestsByIdsQuery,
  useLazyFetchEgovServiceRequestsByIdsQuery,
  useFetchEgovServiceRequestsByIdQuery,
  useLazyFetchEgovServiceRequestsByIdQuery,
  useCreateDocEgovServiceRequestsMutation,
  useApproveDocEgovServiceRequestsMutation,
  useCloseEgovServiceRequestsMutation,
  useReadFlagChangeMutation,
  useApproveReadyTextMutation,
  useChangePayStateEgovServiceRequestsMutation,
  useDownloadQRCodeMutation,
  useAddFilesMutation,
  useAddDownloadSignMutation,
  useRejectDocumentMutation
} = egovServiceRequests
