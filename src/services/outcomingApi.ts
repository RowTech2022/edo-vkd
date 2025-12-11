import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from './api'

export interface IOutcomingRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: {
    outcomeNumber?: number
    senderDate?: string
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
  loading?: boolean
  outcomingId?: number
  name: string
  description: string
  url: string
  createAt?: string
  createBy?: string
}

export interface ISearchResponse {
  id: number
  outcomeNumber: string
  senderDate: string
  contragent: string
  executor: string
  state: number
  createdDate: string
}

export interface OutcomingLettersMainDTO {
  id: number
  state: 1
  outcomeNumber: string
  senderDate: string
  receiverType: IValueId
  contragent: IValueId
  executor: IValueId
  contact: string
  content1: string
  body: string
  files: IFile[]
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
  timestamp: string
}

type ButtonSettings = {
  readOnly: boolean
  hide: boolean
}

export interface IOutcomingSign {
  id: number
  currentState: number
  timestamp: string
}

export interface IOutcomingUndo {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export const lettersApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchOutcomingLetters: builder.query<
      ListResponse<ISearchResponse>,
      Nullable<IOutcomingRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/Outcoming/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),
    fetchOutcomingById: builder.query<OutcomingLettersMainDTO, number>({
      query: (id) => ({ url: `/api/Outcoming/get/${id}` }),
      providesTags: ['Outcoming'],
    }),
    saveOutcoming: builder.mutation<
      OutcomingLettersMainDTO,
      Pick<
        Nullable<OutcomingLettersMainDTO>,
        | 'outcomeNumber'
        | 'senderDate'
        | 'receiverType'
        | 'contragent'
        | 'executor'
        | 'contact'
        | 'content1'
        | 'body'
        | 'files'
      >
    >({
      query: (data) => ({
        //url: 'https://localhost:44383/api/Outcoming/create',
        url: '/api/Outcoming/create',
        method: 'POST',
        data,
      }),
    }),
    updateOutcoming: builder.mutation<
      OutcomingLettersMainDTO,
      Pick<
        Nullable<OutcomingLettersMainDTO>,
        | 'id'
        | 'outcomeNumber'
        | 'senderDate'
        | 'receiverType'
        | 'contragent'
        | 'executor'
        | 'contact'
        | 'content1'
        | 'body'
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/Outcoming/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Outcoming'],
    }),

    signOutcoming: builder.mutation<OutcomingLettersMainDTO, IOutcomingSign>({
      query: (data) => ({
        url: '/api/Outcoming/sign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Outcoming'],
    }),

    rejectOutcoming: builder.mutation<OutcomingLettersMainDTO, IOutcomingUndo>({
      query: (data) => ({
        url: '/api/Outcoming/undo',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Outcoming'],
    }),
  }),
})

export const {
  useFetchOutcomingLettersQuery,
  useLazyFetchOutcomingLettersQuery,
  useFetchOutcomingByIdQuery,
  useSaveOutcomingMutation,
  useUpdateOutcomingMutation,
  useSignOutcomingMutation,
  useRejectOutcomingMutation,
} = lettersApi
