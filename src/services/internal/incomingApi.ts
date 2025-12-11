import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
} from '../api'
import { CreateFolderProps } from '../lettersApiV3'

export interface IInternalIncomingSearchRequest {
  type: number
  folderId?: number
  smartFilter?: string
}

export interface IInternalIncomingRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filters?: IInternalIncomingSearchRequest
}

interface IValueId {
  id: string | undefined
  value: string | undefined
}

export interface FolderInfo {
  id: number
  name: string
}

export interface IncomingFolder {
  active: boolean
  count: number
  folderInfo: FolderInfo
}

export interface IncomingItem {
  contragent: IValueId
  date: string
  id: number
  new: boolean
  subject: string
}

export interface UploadFileLetters {
  loading?: boolean
  url: string
  fullUrl?: string
  id?: string
}

export interface IInternalIncomingSearchResponseBody
  extends ListResponse<IncomingItem> {
  folderInfo?: IncomingFolder[]
  //files?: IncomingItem1[]
}

export interface IInternalIncomingLettersMainDTO {
  id: number
  files: UploadFileLetters[]
  from: IValueId
  to: IValueId
  type: number
  subject: string
  body: string
  ansBody: string
  contragent?: IValueId
  contact?: string
  canSign: boolean
}

export interface ILetterSignRequestBody {
  id: number
}

export const internalIncomingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchInternalIncomingLetters: builder.query<
      IInternalIncomingSearchResponseBody,
      Nullable<IInternalIncomingRequestBody> | void
    >({
      query: (filters) => ({
        url: '/api/Internal/searchincoming',
        method: 'POST',
        data: filters,
      }),
    }),

    sendInternalLetter: builder.mutation<
      number,
      Pick<
        Nullable<IInternalIncomingLettersMainDTO>,
        | 'from'
        | 'to'
        | 'type'
        | 'subject'
        | 'body'
        | 'contragent'
        | 'contact'
        | 'files'
      >
    >({
      query: (data) => ({
        url: '/api/Internal/send',
        method: 'POST',
        data,
      }),
    }),

    sendInternalLetter1: builder.mutation<
      number,
      Pick<
        Nullable<IInternalIncomingLettersMainDTO>,
        'from' | 'to' | 'type' | 'subject' | 'body' | 'contragent' | 'contact'
      >
    >({
      query: (data) => ({
        url: '/api/Internal/send',
        method: 'POST',
        data,
      }),
    }),

    signInternalLetter: builder.mutation<
      IInternalIncomingLettersMainDTO,
      ILetterSignRequestBody
    >({
      query: (data) => ({
        url: '/api/Internal/sign',
        method: 'POST',
        data,
      }),
    }),
    fetchInternalIncomingLettersInById: builder.query<
      IInternalIncomingLettersMainDTO,
      number
    >({
      query: (id) => ({ url: `/api/Internal/get/${id}/2` }),
    }),
    fetchInternalIncomingLettersOutById: builder.query<
      IInternalIncomingLettersMainDTO,
      number
    >({
      query: (id) => ({ url: `/api/Internal/get/${id}/1` }),
    }),
    changeReadFlag: builder.mutation<boolean, { id: number; read: boolean }>({
      query: (data) => ({
        url: `/api/Internal/changereadflag`,
        method: 'POST',
        data,
      }),
    }),
    moveToFolder: builder.mutation({
      query: (data) => ({
        url: `/api/Internal/movetofolder`,
        method: 'POST',
        data,
      }),
    }),
    createFolder: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/Internal/createfolder`,
        method: 'POST',
        data,
      }),
    }),
    deleteFolder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/Internal/deletefolder`,
        method: 'POST',
        data: { id },
      }),
    }),
  }),
})

export const {
  useFetchInternalIncomingLettersQuery,
  useLazyFetchInternalIncomingLettersQuery,
  useFetchInternalIncomingLettersInByIdQuery,
  useFetchInternalIncomingLettersOutByIdQuery,
  useSendInternalLetterMutation,
  useSignInternalLetterMutation,
  useMoveToFolderMutation,
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useChangeReadFlagMutation,
} = internalIncomingApi
