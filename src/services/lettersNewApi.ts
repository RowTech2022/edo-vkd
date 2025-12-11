import {
  IResultSend,
  IResultApprove,
  ISendTreeExecutor,
} from "../shared/types/Tree";

import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
} from "./api";
import { UploadFileLetters } from "./internal/incomingApi";

export interface IIncomingNewRequestSearch {
  folderId?: number;
  incomeNumber?: string;
  receivedDate?: string;
  contragent?: IValueId;
  state?: number;
  isIncoming?: boolean;
  viewType?: number | null;
}

export interface IIncomingNewRequestBody
  extends IRequestOrderBy,
    IRequestPagination {
  ids?: number[];
  filters?: IIncomingNewRequestSearch;
}

export interface IFileResponce {
  url: string;
}

export interface IncomingNewItem {
  loading?: boolean;
  url: string;
}

interface IValueId {
  id: string;
  value: string;
}

interface ILetterFile {
  id: number;
  loading?: boolean;
  IncomingNewId?: number;
  name: string;
  description?: string;
  url: string;
  createAt?: string;
  createBy?: string;
}

export interface FolderInfo {
  id: number;
  name: string;
}

export interface IncomingFolder {
  active: boolean;
  count: number;
  folderInfo: FolderInfo;
}

export interface IncomingNewLettersDTO {
  id: number;
  state: number;
  incomeNumber: string;
  outcomeNumber: string;
  receivedDate: string;
  senderType: IValueId;
  contragent: IValueId;
  contact: IValueId;
  executor: IValueId;
  term: string;
  content1: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomingNewLettersMainDTO {
  id: number;
  state: number;
  incomeNumber: string;
  outcomeNumber: string;
  receivedDate: string;
  sendDate: string;
  senderType: IValueId;
  contragent: IValueId;
  folderInformation?: IValueId;
  contact: string;
  executor: IValueId;
  executors: IValueId[];
  canAdd: boolean;
  addDateToBlank: boolean;
  autoGenerateIncoming: boolean;
  haveMainResult: boolean;
  canSaveMainResult: boolean;
  canApproveMainResult: boolean;
  resultMain: IMainResultNew;
  term: string;
  content1: string;
  body: string;
  chatFolder?: ValueId;
  files: UploadFileLetters[];
  userVisas: UserVisa[];
  documentHistories: IDocumentHistory[];
  transitions: {
    fieldSettings: {};
    buttonSettings: {
      btn_save: ButtonSettings;
      btn_sendtoresolution: ButtonSettings;
      btn_passresolution: ButtonSettings;
      btn_saveresolution: ButtonSettings;
      btn_executeresolution: ButtonSettings;
      btn_undo: ButtonSettings;
      btn_delete: ButtonSettings;
      btn_close: ButtonSettings;
      btn_approvechild: ButtonSettings;
      btn_savechild: ButtonSettings;
    };
    buttonInfo: {};
  };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutcomingNewLettersMainDTO {
  id: number;
  state: number;
  incomeNumber: string;
  outcomeNumber: string;
  receivedDate: string;
  sendDate: string;
  senderType: IValueId;
  receiverOrg: IValueId;
  folderInformation?: IValueId;
  contact: string;
  executor: IValueId;
  executors: IValueId[];
  canAdd: boolean;
  addDateToBlank: boolean;
  autoGenerateIncoming: boolean;
  haveMainResult: boolean;
  canSaveMainResult: boolean;
  canApproveMainResult: boolean;
  resultMain: IMainResultNew;
  term: string;
  content1: string;
  body: string;
  chatFolder?: ValueId;
  files: UploadFileLetters[];
  userVisas: UserVisa[];
  documentHistories: IDocumentHistory[];
  transitions: {
    fieldSettings: {};
    buttonSettings: {
      btn_save: ButtonSettings;
      btn_sendtoresolution: ButtonSettings;
      btn_passresolution: ButtonSettings;
      btn_saveresolution: ButtonSettings;
      btn_executeresolution: ButtonSettings;
      btn_undo: ButtonSettings;
      btn_delete: ButtonSettings;
      btn_close: ButtonSettings;
      btn_approvechild: ButtonSettings;
      btn_savechild: ButtonSettings;
    };
    buttonInfo: {};
  };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMainResultNew {
  id: number | null;
  incomingId: number | null;
  state: number | null;
  text: string;
}

type ButtonSettings = {
  readOnly: boolean;
  hide: boolean;
};

export interface ISendToResolution {
  id: number;
  approveBy: number;
  comment: string;
  currentState: number;
  timestamp: string;
}

export interface IFirstExecuteResolution {
  IncomingNewId: number;
  operation: number;
  items: IExecutor[];
  timestamp: string;
}

export interface IExecuteResolution extends IFirstExecuteResolution {
  id: number | null;
  parentId: number | null;
  data?: ISendTreeExecutor | any;
}

export interface IExecutor {
  id: number | null;
  parentId: number | null;
  avatar: string | null;
  responsible: IValueId;
  type: IValueId;
  priority: IValueId;
  term: string;
  comment: string;

  canAdd: boolean;
  state: number;
  execType: number;

  childs: IExecutor[];
}

export const lettersNewApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchIncomingNewLetters: builder.query<
      ListResponse<IncomingNewLettersDTO>,
      Nullable<IIncomingNewRequestBody> | void
    >({
      query: (filters) => ({
        url: "/api/IncomingNew/search",
        method: "POST",
        data: { ...filters },
      }),
    }),
    fetchLettersNewById: builder.query<IncomingNewLettersMainDTO, number>({
      query: (id) => ({ url: `/api/IncomingNew/get/${id}` }),
      providesTags: ["IncomingNew"],
    }),
    saveIncomingNew: builder.mutation<
      IncomingNewLettersMainDTO,
      Pick<
        Nullable<IncomingNewLettersMainDTO>,
        | "incomeNumber"
        | "outcomeNumber"
        | "receivedDate"
        | "senderType"
        | "contragent"
        | "contact"
        | "executor"
        | "term"
        | "content1"
        | "body"
        | "files"
      >
    >({
      query: (data) => ({
        url: "/api/IncomingNew/create",
        //url: 'https://localhost:44383/api/IncomingNew/create',
        method: "POST",
        data,
      }),
    }),
    updateIncomingNew: builder.mutation<
      IncomingNewLettersMainDTO,
      Pick<
        Nullable<IncomingNewLettersMainDTO>,
        | "id"
        | "incomeNumber"
        | "outcomeNumber"
        | "receivedDate"
        | "senderType"
        | "contragent"
        | "contact"
        | "executor"
        | "term"
        | "content1"
        | "body"
        | "files"
        | "timestamp"
      >
    >({
      query: (data) => ({
        url: "/api/IncomingNew/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    sendToResolutionNew: builder.mutation<
      IncomingNewLettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: "/api/IncomingNew/SendToResolution",
        method: "POST",
        data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    closeIncomingNew: builder.mutation<
      IncomingNewLettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: "/api/IncomingNew/close",
        method: "POST",
        data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    executeFirstResolution: builder.mutation<
      IncomingNewLettersMainDTO,
      IFirstExecuteResolution
    >({
      query: (data) => ({
        url: "/api/IncomingNew/ExecuteFirstResolution",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    executeResolution: builder.mutation<
      IncomingNewLettersMainDTO,
      IExecuteResolution
    >({
      query: (data) => ({
        url: "/api/IncomingNew/ExecuteResolution",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    passResolutionNew: builder.mutation<
      IncomingNewLettersMainDTO,
      IExecuteResolution
    >({
      query: (data) => ({
        url: "/api/IncomingNew/PassResolution",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),

    saveChildResult: builder.mutation<IncomingNewLettersMainDTO, IResultSend>({
      query: (data) => ({
        url: "/api/IncomingNew/Result/Create",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    updateChildResult: builder.mutation<IncomingNewLettersMainDTO, IResultSend>(
      {
        query: (data) => ({
          url: "/api/IncomingNew/Result/Update",
          method: "POST",
          ...data,
        }),
        invalidatesTags: ["IncomingNew"],
      }
    ),

    approveChildResult: builder.mutation<
      IncomingNewLettersMainDTO,
      IResultApprove
    >({
      query: (data) => ({
        url: "/api/IncomingNew/Result/approve",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    saveMainResult: builder.mutation<IncomingNewLettersMainDTO, IResultSend>({
      query: (data) => ({
        url: "/api/IncomingNew/MainResult/Create",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    updateMainResult: builder.mutation<IncomingNewLettersMainDTO, IResultSend>({
      query: (data) => ({
        url: "/api/IncomingNew/MainResult/Update",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),

    approveMainResult: builder.mutation<
      IncomingNewLettersMainDTO,
      IResultApprove
    >({
      query: (data) => ({
        url: "/api/IncomingNew/MainResult/approve",
        method: "POST",
        ...data,
      }),
      invalidatesTags: ["IncomingNew"],
    }),
  }),
});

export const {
  useFetchIncomingNewLettersQuery,
  useLazyFetchIncomingNewLettersQuery,
  useFetchLettersNewByIdQuery,
  useSaveIncomingNewMutation,
  useUpdateIncomingNewMutation,
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
} = lettersNewApi;
