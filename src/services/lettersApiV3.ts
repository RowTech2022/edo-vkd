import { ISendTreeExecutor } from '@root/shared/types/Tree'
import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
} from './api'
import { UploadFileLetters } from './internal/incomingApi'
import { IncomingNewLettersMainDTO } from './lettersNewApi'

export interface CreateFolderProps {
  name: string
}

export interface IIncomingNewRequestSearch {
  incomeNumber?: string
  receivedDate?: string
  contragent?: IValueId
  state?: number
  isIncoming?: boolean
}

export interface IIncomingNewRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: IIncomingNewRequestSearch
}

export interface IFileResponce {
  url: string
}

export interface IncomingNewItem {
  loading?: boolean
  url: string
}

interface IValueId {
  id: string
  value: string
}

export interface IncomingItem {
  contragent: IValueId
  date: string
  id: number
  new: boolean
  subject: string
}

export interface ILettersV3FilesRequest {
  url: string
  name: string
  date?: string
}

export interface ILettersV3Files {
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

export interface ILettersV3CreateRequest {
  files: ILettersV3Files[]
}

export interface IncomingNewLettersDTO {
  id: number
  state: number
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
  createdAt: string
  updatedAt: string
}

export interface IncomingLettersV3MainDTO {
  id: number
  state: number
  incomeNumber: string
  outcomeNumber: string
  receivedDate: string
  senderType: IValueId
  contragent: IValueId
  contact: string
  executor: IValueId
  executors: IValueId[]
  canAdd: boolean
  prepareByMainExecutor: boolean

  discutionId?: number
  canOpenChat: boolean

  haveMainResult: boolean
  canSaveMainResolution: boolean
  canSaveMainResult: boolean
  canApproveMainResult: boolean
  canApproveMainResolution: boolean
  resultMain: IMainResultNew
  term: string
  content1: string
  body: string
  folderId: string
  files: UploadFileLetters[]
  folders: ValueId
  readyFiles: ILettersV3FilesRequest[]
  userVisas: UserVisa[]
  documentHistories: IDocumentHistory[]
  transitions: {
    fieldSettings: {}
    buttonSettings: {
      btn_save: ButtonSettings
      btn_savechild: ButtonSettings
      btn_approvechild: ButtonSettings
      btn_sendtoresolution: ButtonSettings
      btn_passresolution: ButtonSettings
      btn_saveresolution: ButtonSettings
      btn_executeresolution: ButtonSettings
      btn_setterm: ButtonSettings
      btn_undo: ButtonSettings
      btn_delete: ButtonSettings
      btn_close: ButtonSettings
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

export interface IIncomingNewRequest {
  IncomingId?: number
  files?: ILettersV3FilesRequest[]
}

export interface IIncomingNewResponse {
  IncomingId: number
  files: ILettersV3FilesRequest[]
}

export interface IExecuteResolution extends Nullable<IFirstExecuteResolution> {
  id: number | null
  parentId: number | null
  type?: number
  data?: ISendTreeExecutor | any
  incomingId?: number
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

export interface IResoutionTermReq {
  id: number
  date: string
  timestamp?: string
}

export interface IncomingLettersV3MainDTO extends IncomingNewLettersMainDTO {
  mainExecutor?: {
    id: string
    value: string
  }
  mainSign?: {
    userId: number
    sign: string
  }
  secretary?: null | ValueId
  showSecretary?: boolean
  canSaveSecretary: boolean
  canSaveAnswer?: boolean
  canApproveAnswer?: boolean
  mainAnswerText?: string
  mainAnswerState?: number
}

export interface IAnswerByOwnRequest {
  executorId: number
  incomingId: number
  text: string
  type: number
  secretary?: boolean
}

export type IExecuteResolutionV3 = Omit<IExecuteResolution, 'id'> & {
  executorId: number | null
}

export type IAcquaintedRequest = Omit<IAnswerByOwnRequest, 'type'>

export interface IChooseSecretarReq {
  executorId: number
  incomingId: number
  secretary: ValueId
  mainSecretarChoose: boolean
}

export const lettersApiV3 = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchIncomingLettersNew: builder.query<
    ListResponse<IncomingNewLettersDTO>,
    Nullable<IIncomingNewRequestBody> | void
  >({
      query: (filters) => {
        return {
          url: '/api/IncomingV3/search',
          method: 'POST',
          data: { ...filters },
        }
      },
    }),
    fetchLettersV3ById: builder.query<IncomingLettersV3MainDTO, number>({
      query: (id) => ({ url: `/api/IncomingV3/get/${id}` }),
      // providesTags: ['IncomingNew'],
    }),
    saveIncomingLettersV3: builder.mutation<
      IncomingLettersV3MainDTO,
      Pick<
        Nullable<IncomingLettersV3MainDTO>,
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
        | 'chatFolder'
        | 'files'
      >
    >({
      query: (data) => ({
        url: '/api/IncomingV3/create',
        method: 'POST',
        data,
      }),
    }),
    updateIncomingV3: builder.mutation<
      IncomingLettersV3MainDTO,
      Pick<
        Nullable<IncomingLettersV3MainDTO>,
        | 'id'
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
        | 'chatFolder'
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/IncomingV3/update',
        method: 'POST',
        data,
      }),
    }),
    updateIncomingNew: builder.mutation<
      IncomingLettersV3MainDTO,
      Pick<
        Nullable<IncomingNewLettersMainDTO>,
        | 'id'
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
        | 'files'
        | 'timestamp'
      >
    >({
      query: (data) => ({
        url: '/api/IncomingNew/update',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    sendToResolutionV3: builder.mutation<
      IncomingNewLettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: '/api/IncomingV3/SendToResolution',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    answerByOwnLettersV3: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: '/api/IncomingV3/answerByOwn',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    answerByOwnMainLettersV3: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: '/api/IncomingV3/answerByOwnMain',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    acquaintedLettersV3: builder.mutation<
      IncomingNewLettersMainDTO,
      IAcquaintedRequest
    >({
      query: (data) => ({
        url: '/api/IncomingV3/acquainted',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    closeIncomingV3: builder.mutation<
      IncomingLettersV3MainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: '/api/IncomingV3/close',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    executeFirstResolutionV3: builder.mutation<
      IncomingLettersV3MainDTO,
      IFirstExecuteResolution
    >({
      query: (data) => ({
        url: '/api/IncomingV3/ExecuteFirstResolution',
        method: 'POST',
        ...data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    executeResolutionV3: builder.mutation<
      IncomingLettersV3MainDTO,
      IExecuteResolutionV3
    >({
      query: (data) => ({
        url: '/api/IncomingV3/ExecuteResolution',
        method: 'POST',
        ...data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    chooseSecretary: builder.mutation<
      IncomingLettersV3MainDTO,
      IChooseSecretarReq
    >({
      query: (data) => ({
        url: '/api/IncomingV3/chooseSecretar',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    uploadReadyDocument: builder.mutation<
      IIncomingNewRequest,
      IIncomingNewResponse
    >({
      query: (data) => ({
        url: '/api/IncomingV3/UploadReadyDocument',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    moveToFolder: builder.mutation({
      query: (data) => ({
        url: `/api/IncomingV3/movetofolder`,
        method: 'POST',
        data,
      }),
    }),

   setTermV35: builder.mutation<void, IResoutionTermReq>({
     query: (data) => ({
      url: `/api/IncomingV3/setTerm`,
      method: "POST",
      data,
     }),
   }),
    createFolder: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/IncomingV3/createfolder`,
        method: 'POST',
        data,
      }),
    }),
    deleteFolder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/IncomingV3/deletefolder`,
        method: 'POST',
        data: { id },
      }),
    }),
    fetchInternalEmailV3: builder.query<
      ListResponse<IncomingNewLettersDTO>,
      Nullable<IIncomingNewRequestBody> | void
    >({
      query: (filters) => {
        return {
          url: '/api/Internal_emailV3/search',
          method: 'POST',
          data: { ...filters },
        }
      },
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
    changeReadFlag: builder.mutation({
      query: (data) => ({
        url: `/api/IncomingV3/changereadflag`,
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useFetchIncomingLettersNewQuery, useLazyFetchIncomingLettersNewQuery,
  useFetchLettersV3ByIdQuery,
  useLazyFetchLettersV3ByIdQuery,
  useSaveIncomingLettersV3Mutation,
  useUpdateIncomingV3Mutation,
  useUpdateIncomingNewMutation,
  useSendToResolutionV3Mutation,
  useExecuteFirstResolutionV3Mutation,
  useExecuteResolutionV3Mutation,
  useAnswerByOwnLettersV3Mutation,
  useAnswerByOwnMainLettersV3Mutation,
  useAcquaintedLettersV3Mutation,
  useCloseIncomingV3Mutation,
  useChooseSecretaryMutation,
  useUploadReadyDocumentMutation,
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useMoveToFolderMutation,
  useSetTermV35Mutation,
  useFetchInternalEmailV3Query,
  useLazyFetchInternalEmailV3Query,
  useCreateEmailFolderMutation,
  useEmailMoveToFolderMutation,
  useDeleteEmailFolderMutation,
  useChangeReadFlagMutation,
} = lettersApiV3
