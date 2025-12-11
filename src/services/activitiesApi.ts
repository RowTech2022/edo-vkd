import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from './api'

export interface IIncomingRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: {
    incomeNumber?: number
    receivedDate?: string
    contragent?: IValueId
    state?: number
  }
}

interface IValueId {
  id: string
  value: string
}

interface IFile {
  id: number
  incomingId: number
  name: string
  description: string
  url: string
  createAt: string
  createBy: string
}

interface IActivityShort {
  id: number
  incomingId: number
  resolutionId: number
  header: string
  startDate: string
  endDate: string
  priority: string
  responsible: string
  state: number
}

interface IResolution {
  id: number
  incomingId: number
  responsible: IValueId
  text: IValueId
  type: IValueId
  date: string
  comment: string
  state: number
}

export interface IncomingLettersDTO {
  id: number
  state: 1
  incomeNumber: string
  outcomeNumber: string
  receivedDate: string
  senderType: IValueId
  contragent: IValueId
  contact: IValueId
  executor: IValueId
  term: string
  content: string
  body: string
  createdAt: string
  updatedAt: string
}

export interface IncomingLettersMainDTO {
  id: number
  state: 1
  incomeNumber: string
  outcomeNumber: string
  receivedDate: string
  senderType: IValueId
  contragent: IValueId
  contact: IValueId
  executor: IValueId
  term: string
  content1: string
  body: string
  file: IFile[]
  activities: IActivityShort[]
  resolutions: IResolution[]
  userVisas: UserVisa[]
  documentHistories: IDocumentHistory[]
  transitions: {
    fieldSettings: {}
    buttonSettings: {
      btn_save: ButtonSettings
      btn_sign: ButtonSettings
      btn_undo: ButtonSettings
      btn_delete: ButtonSettings
    }
    buttonInfo: {}
  }
  createdAt: string
  updatedAt: string
}

type ButtonSettings = {
  readOnly: boolean
  hide: boolean
}

export interface IOperationInfoForUpdate {
  id: number
  currentState: number
  timestamp: string
}

export interface ISendToResolution {
  id: number
  approveBy: number
  comment: string
  currentState: number
  timestamp: string
}

export interface IPassResolution {
  id: number
  currentState: number
  items: IResolutionItem[]
  timestamp: string
}

export interface IExecuteResolution extends IPassResolution {
  resolutionId: number
}

export interface IResolutionItem {
  id: number
  to: IValueId
  text: IValueId
  type: IValueId
  executeUntil: string
  comment: string
}

export const lettersApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchIncomingLetters: builder.query<
      ListResponse<IncomingLettersDTO>,
      Nullable<IIncomingRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/Incoming/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),
    fetchLettersById: builder.query<IncomingLettersMainDTO, number>({
      query: (id) => ({ url: `/api/Incoming/get/${id}` }),
      providesTags: ['Incoming'],
    }),
    saveIncoming: builder.mutation<
      IncomingLettersMainDTO,
      Pick<
        Nullable<IncomingLettersMainDTO>,
        | 'incomeNumber'
        | 'outcomeNumber'
        | 'receivedDate'
        | 'senderType'
        | 'contragent'
        | 'contact'
        | 'executor'
        | 'term'
        | 'content1'
        | 'body'
      >
    >({
      query: (data) => ({
        url: '/api/Incoming/create',
        method: 'POST',
        data,
      }),
    }),
    updateIncoming: builder.mutation<
      IncomingLettersMainDTO,
      Pick<
        Nullable<IncomingLettersMainDTO>,
        | 'incomeNumber'
        | 'outcomeNumber'
        | 'receivedDate'
        | 'senderType'
        | 'contragent'
        | 'contact'
        | 'executor'
        | 'term'
        | 'content1'
        | 'body'
      >
    >({
      query: (data) => ({
        url: '/api/Incoming/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),

    sendToResolution: builder.mutation<
      IncomingLettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: '/api/Incoming/SendToResolution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),

    passResolution: builder.mutation<IncomingLettersMainDTO, IPassResolution>({
      query: (data) => ({
        url: '/api/Incoming/PassResolution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),

    executeResolution: builder.mutation<
      IncomingLettersMainDTO,
      IExecuteResolution
    >({
      query: (data) => ({
        url: '/api/Incoming/ExecuteResolution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),
    closeIncoming: builder.mutation<
      IncomingLettersMainDTO,
      IOperationInfoForUpdate
    >({
      query: (data) => ({
        url: '/api/Incoming/close',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),

    rejectIncoming: builder.mutation<
      IncomingLettersMainDTO,
      IOperationInfoForUpdate
    >({
      query: (data) => ({
        url: '/api/Incoming/undo',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),
  }),
})

// export function exportToPDF(
//   data: Nullable<IAccountantResponsibilitiesRequestBody> | void,
// ) {
//   return axios.post('/api/AccountantResponsibility/SearchPrintPdf', data, {
//     responseType: 'blob',
//   })
// }

export const {
  useFetchIncomingLettersQuery,
  useLazyFetchIncomingLettersQuery,
  useFetchLettersByIdQuery,
  useSaveIncomingMutation,
  useUpdateIncomingMutation,
  useSendToResolutionMutation,
  usePassResolutionMutation,
  useExecuteResolutionMutation,
  useCloseIncomingMutation,
  useRejectIncomingMutation,
} = lettersApi
