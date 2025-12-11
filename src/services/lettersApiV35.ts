
import {
  IResultSend,
  IResultApprove,
  ISendTreeExecutor,
} from '../shared/types/Tree'

import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from './api'
import { UploadFileLetters } from './internal/incomingApi'
import { CreateFolderProps, IResoutionTermReq } from './lettersApiV3'

export interface IEmailRequestSearch {
  folderId?: number
  incomeNumber?: string
  subject?: string
  creator?: string
  createAt?: string
  state?: number
}

export interface IEmailRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: IEmailRequestSearch
}

export interface IFileResponce {
  url: string
}

export interface IEmailLettersV35Files {
  loading?: boolean
  id: number
  incomingId?: number
  url: string
  name: string
  description?: string
  createAt?: string
  createDate?: string
  createBy?: string
}

export interface IEmailLettersV35CreateRequest {
  files: IEmailLettersV35Files[]
}

export interface EmailItem {
  loading?: boolean
  url: string
}

interface IValueId {
  id: string
  value: string
}

export interface ILetterFile {
  id: number
  loading?: boolean
  IncomingNewId?: number
  name: string
  description?: string
  url: string
  createAt?: string
  createBy?: string
}

export interface FolderInfo {
  id: number
  name: string
}

export interface EmailFolder {
  active: boolean
  count: number
  folderInfo: FolderInfo
}

export interface Emailv35LettersDTO {
  id: number
  state: number
  incomeNumber: string
  subject: string
  creator: string
  createdAt: string
  updatedAt: string
}

export interface EmailV35LettersMainDTO {
  id: number
  state: number
  incomeNumber: string
  creator: string
  subject: string
  files: UploadFileLetters[]
  userVisas: UserVisa[]
  documentHistories: IDocumentHistory[]
  transitions: {
    fieldSettings: {}
    buttonSettings: {
      btn_save: ButtonSettings
      btn_sendtoresolution: ButtonSettings
      btn_passresolution: ButtonSettings
      btn_saveresolution: ButtonSettings
      btn_executeresolution: ButtonSettings
      btn_undo: ButtonSettings
      btn_delete: ButtonSettings
      btn_close: ButtonSettings
      btn_approvechild: ButtonSettings
      btn_savechild: ButtonSettings
    }
    buttonInfo: {}
  }
  timestamp: string
  createdAt: string
  updatedAt: string
}

export interface IMainResultNew {
  id: number | null
  incomingId: number | null
  state: number | null
  text: string
}

type ButtonSettings = {
  readOnly: boolean
  hide: boolean
}

export interface ISendToResolution {
  id: number
  approveBy: number
  comment: string
  currentState: number
  timestamp: string
}

export interface IFirstExecuteResolution {
  IncomingNewId: number
  operation: number
  items: IExecutor[]
  timestamp: string
}

export interface IExecuteResolution extends IFirstExecuteResolution {
  id: number | null
  parentId: number | null
  data?: ISendTreeExecutor | any
}

export interface IExecutor {
  id: number | null
  parentId: number | null
  avatar: string | null
  responsible: IValueId
  type: IValueId
  priority: IValueId
  term: string
  comment: string

  canAdd: boolean
  state: number
  execType: number

  childs: IExecutor[]
}

export const lettersApiV35 = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchLettersEmail: builder.query<
      ListResponse<Emailv35LettersDTO>,
      Nullable<IEmailRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/Internal_emailV3/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),
    fetchLettersEmailById: builder.query<EmailV35LettersMainDTO, number>({
      query: (id) => ({ url: `/api/Internal_emailV3/get/${id}` }),
      providesTags: ['IncomingNew'],
    }),
    saveEmail: builder.mutation<
      EmailV35LettersMainDTO,
      Pick<
        Nullable<EmailV35LettersMainDTO>,
        | 'incomeNumber'
        | 'creator'
        | 'subject'
        | 'files'
      >
    >({
      query: (data) => ({
        url: '/api/Internal_emailV3/create',
        method: 'POST',
        data,
      }),
    }),
    updateEmail: builder.mutation<
      EmailV35LettersMainDTO,
      Pick<
        Nullable<EmailV35LettersMainDTO>,
        | 'id'
        | 'incomeNumber'
        | 'creator'
        | 'subject'
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/Internal_emailV3/update',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    sendToResolutionNew: builder.mutation<
      EmailV35LettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: '/api/IncomingNew/SendToResolution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    closeIncomingNew: builder.mutation<
      EmailV35LettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: '/api/IncomingNew/close',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    executeFirstResolution: builder.mutation<
      EmailV35LettersMainDTO,
      IFirstExecuteResolution
    >({
      query: (data) => ({
        url: '/api/IncomingNew/ExecuteFirstResolution',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    executeResolution: builder.mutation<
      EmailV35LettersMainDTO,
      IExecuteResolution
    >({
      query: (data) => ({
        url: '/api/IncomingNew/ExecuteResolution',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    passResolutionNew: builder.mutation<
      EmailV35LettersMainDTO,
      IExecuteResolution
    >({
      query: (data) => ({
        url: '/api/IncomingNew/PassResolution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Incoming'],
    }),

    saveChildResult: builder.mutation<EmailV35LettersMainDTO, IResultSend>({
      query: (data) => ({
        url: '/api/IncomingNew/Result/Create',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    updateChildResult: builder.mutation<EmailV35LettersMainDTO, IResultSend>(
      {
        query: (data) => ({
          url: '/api/IncomingNew/Result/Update',
          method: 'POST',
          ...data,
        }),
        invalidatesTags: ['IncomingNew'],
      }
    ),
    approveChildResult: builder.mutation<
      EmailV35LettersMainDTO,
      IResultApprove
    >({
      query: (data) => ({
        url: '/api/IncomingNew/Result/approve',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    saveMainResult: builder.mutation<EmailV35LettersMainDTO, IResultSend>({
      query: (data) => ({
        url: '/api/IncomingNew/MainResult/Create',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    updateMainResult: builder.mutation<EmailV35LettersMainDTO, IResultSend>({
      query: (data) => ({
        url: '/api/IncomingNew/MainResult/Update',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),

    approveMainResult: builder.mutation<
      EmailV35LettersMainDTO,
      IResultApprove
    >({
      query: (data) => ({
        url: '/api/IncomingNew/MainResult/approve',
        method: 'POST',
        ...data,
      }),
      invalidatesTags: ['IncomingNew'],
    }),
    createEmailFolder: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/Internal_emailV3/createfolder`,
        method: 'POST',
        data,
      }),
    }),
    emailMoveToFolder: builder.mutation({
      query: (data) => ({
        url: `/api/Internal_emailV3/movetofolder`,
        method: 'POST',
        data,
      }),
    }),
    deleteEmailFolder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/Internal_emailV3/deletefolder`,
        method: 'POST',
        data: { id },
      }),
    }),
  }),
})

export const {
  useFetchLettersEmailQuery,
  useLazyFetchLettersEmailQuery,
  useFetchLettersEmailByIdQuery,
  useLazyFetchLettersEmailByIdQuery,
  useSaveEmailMutation,
  useUpdateEmailMutation,
  useSendToResolutionNewMutation,
  useExecuteFirstResolutionMutation,
  useExecuteResolutionMutation,

  useSaveChildResultMutation,
  useUpdateChildResultMutation,
  useApproveChildResultMutation,
  usePassResolutionNewMutation,
  useSaveMainResultMutation,
  useUpdateMainResultMutation,
  useApproveMainResultMutation,

  useCloseIncomingNewMutation,

  useCreateEmailFolderMutation,
  useEmailMoveToFolderMutation,
  useDeleteEmailFolderMutation,
} = lettersApiV35
