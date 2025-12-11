import { ISendTreeExecutor } from "@root/shared/types/Tree";
import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
} from "./api";
import { UploadFileLetters } from "./internal/incomingApi";
import { IncomingNewLettersMainDTO } from "./lettersNewApi";
import { IFolder } from "./generalApi";
import { IOperationInfoForUndo } from "./lettersApi";
import { IFile } from "./activityApi";

export interface CreateFolderProps {
  name: string;
}

export interface IIncomingNewRequestSearch {
  incomeNumber?: string;
  receivedDate?: string;
  sendDate?: string;
  contragent?: IValueId;
  state?: number;
  isIncoming?: boolean;
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

interface IEditExecutorsLetterV4 {
  incomingId: number;
  userIds: number[];
  tabName: string | null;
}

interface IEditVisaTYpesLetterV4 {
  incomingId: number;
  visaTypeIds: number[];
}

export interface IncomingItem {
  contragent: IValueId;
  date: string;
  id: number;
  new: boolean;
  subject: string;
}

export interface ILettersV4FilesRequest {
  url: string;
  name: string;
  date?: string;
}

export interface ILettersV4Files {
  loading?: boolean;
  id: number;
  incomingId?: number;
  url: string;
  name: string;
  description?: string;
  createAt?: string;
  createDate?: string;
  createBy?: string;
}

export interface ILettersV4CreateRequest {
  files: ILettersV4Files[];
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

export interface IncomingLettersV4MainDTO {
  id: number;
  state: number;
  incomeNumber: string;
  outcomeNumber: string;
  receivedDate: string;
  senderType: IValueId;
  contragent: IValueId;
  contact: string;
  executor: IValueId;
  executors: IValueId[];
  canAdd: boolean;
  prepareByMainExecutor: boolean;

  discutionId?: number;
  canOpenChat: boolean;

  haveMainResult: boolean;
  canSaveMainResolution: boolean;
  canSaveMainResult: boolean;
  canApproveMainResult: boolean;
  canApproveMainResolution: boolean;
  resultMain: IMainResultNew;
  term: string;
  content1: string;
  body: string;
  folderId: string;
  files: UploadFileLetters[];
  folders: ValueId;
  readyFiles: ILettersV4FilesRequest[];
  userVisas: UserVisa[];
  documentHistories: IDocumentHistory[];
  transitions: {
    fieldSettings: {};
    buttonSettings: {
      btn_save: ButtonSettings;
      btn_savechild: ButtonSettings;
      btn_approvechild: ButtonSettings;
      btn_sendtoresolution: ButtonSettings;
      btn_passresolution: ButtonSettings;
      btn_saveresolution: ButtonSettings;
      btn_executeresolution: ButtonSettings;
      btn_setterm: ButtonSettings;
      btn_undo: ButtonSettings;
      btn_delete: ButtonSettings;
      btn_close: ButtonSettings;
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

export interface IIncomingNewRequest {
  IncomingId?: number;
  files?: ILettersV4FilesRequest[];
}

export interface IIncomingNewResponse {
  IncomingId: number;
  files: ILettersV4FilesRequest[];
}

export interface IExecuteResolution extends Nullable<IFirstExecuteResolution> {
  id: number | null;
  parentId: number | null;
  type?: number;
  data?: ISendTreeExecutor | any;
  incomingId?: number;
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

export interface IResoutionTermReq {
  id: number;
  date: string;
  timestamp?: string;
}

export interface IncomingLettersV4MainDTO extends IncomingNewLettersMainDTO {
  mainExecutor?: {
    id: string;
    value: string;
  };
  mainSign?: {
    userId: number;
    sign: string;
  };
  secretary?: null | ValueId;
  showSecretary?: boolean;
  canSaveSecretary: boolean;
  canSaveAnswer?: boolean;
  canApproveAnswer?: boolean;
  mainAnswerText?: string;
  mainAnswerState?: number;
}

export interface IAnswerByOwnRequest {
  executorId: number;
  incomingId: number;
  text: string;
  type: number;
  secretary?: boolean;
}

export type IExecuteResolutionV4 = Omit<IExecuteResolution, "id"> & {
  executorId: number | null;
};

export type IAcquaintedRequest = Omit<IAnswerByOwnRequest, "type">;

export interface IChooseSecretarReq {
  executorId: number;
  incomingId: number;
  secretary: ValueId;
  mainSecretarChoose: boolean;
}

export interface IFolderItem {
  id: number | string;
  name: string;
  totalCount: number;
  readCount: number;
  unreadCount: number;
  active?: boolean;
  state?: number;
}

export interface IOutcomingSearchItemLettersV4 {
  id: number;
  incomeNumber: string;
  outNumber: string;
  receivedDate: string;
  sendDate: string;
  contragent: IValueId;
  header: string;
  inComingId: number;
  state: number;
  createdDate: string;
}

export interface Contragent {
  id: string;
  value: string;
}

export interface IOutcomingLettersV4 {
  id: number;
  state: number;
  incomeNumber: string;
  outcomeNumber: string;
  inComingId: number;
  receivedDate: string;
  senderType: IValueId;
  contragent: IValueId;
  contact: string;
  content1: string;
  body: string;
  files: IFile[];
  readyFiles: ReadyFile[];
  createAt: string;
  updateAt: string;
  timestamp: string;
}

export interface File {
  url: string;
}

export interface ReadyFile {
  url: string;
  name: string;
  date: string;
}

export interface OrgBlanksResponse {
  items: [
    {
      id: string;
      value: string;
    }
  ];
}

export const lettersApiV4 = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchIncomingLettersNewV4: builder.query<
      ListResponse<IncomingNewLettersDTO>,
      Nullable<IIncomingNewRequestBody> | void
    >({
      query: (filters) => {
        return {
          url: "/api/IncomingV4/search",
          method: "POST",
          data: { ...filters },
        };
      },
    }),
    fetchOutcomingLettersV4: builder.query<
      ListResponse<IOutcomingSearchItemLettersV4>,
      Nullable<IIncomingNewRequestBody> | void
    >({
      query: (filters) => {
        return {
          url: "/api/OutComingV4/search",
          method: "POST",
          data: { ...filters },
        };
      },
    }),
    fetchLettersV4ById: builder.query<IncomingLettersV4MainDTO, number>({
      query: (id) => ({ url: `/api/IncomingV4/get/${id}` }),
      // providesTags: ['IncomingNew'],
    }),
    fetchOutcomingLettersV4ById: builder.query<IOutcomingLettersV4, number>({
      query: (id) => ({ url: `/api/OutComingV4/get/${id}` }),
      // providesTags: ['IncomingNew'],
    }),
    fetchLettersV4ById2: builder.query<IncomingLettersV4MainDTO, number>({
      query: (id) => ({ url: `/api/IncomingV4/get/${id}` }),
      // providesTags: ['IncomingNew'],
    }),
    saveIncomingLettersV4: builder.mutation<
      IncomingLettersV4MainDTO,
      Pick<
        Nullable<IncomingLettersV4MainDTO>,
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
        | "chatFolder"
        | "files"
      >
    >({
      query: (data) => ({
        url: "/api/IncomingV4/create",
        method: "POST",
        data,
      }),
    }),
    saveOutcomingLettersV4: builder.mutation<IOutcomingLettersV4, any>({
      query: (data) => ({
        url: "/api/OutComingV4/create",
        method: "POST",
        data,
      }),
    }),
    updateOutcomingLettersV4: builder.mutation<IOutcomingLettersV4, any>({
      query: (data) => ({
        url: "/api/OutComingV4/update",
        method: "POST",
        data,
      }),
    }),
    updateIncomingV4: builder.mutation<
      IncomingLettersV4MainDTO,
      Pick<
        Nullable<IncomingLettersV4MainDTO>,
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
        | "chatFolder"
        | "files"
        | "timestamp"
      >
    >({
      query: (data) => ({
        url: "/api/IncomingV4/update",
        method: "POST",
        data,
      }),
    }),
    updateIncomingNew: builder.mutation<
      IncomingLettersV4MainDTO,
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
      // invalidatesTags: ['IncomingNew'],
    }),

    sendToResolutionV4: builder.mutation<
      IncomingNewLettersMainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: "/api/IncomingV4/sendToResolution",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    answerByOwnLettersV4: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: "/api/IncomingV4/answerByOwn",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    answerByOwnMainLettersV4: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: "/api/IncomingV4/answerByOwnMain",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    rejectAnswerIncomingV4: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: "/api/incomingV4/answer/reject",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    rejectAnswerOutcomingV4: builder.mutation<
      IncomingNewLettersMainDTO,
      IAnswerByOwnRequest
    >({
      query: (data) => ({
        url: "/api/outComingV4/answer/reject",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    acquaintedLettersV4: builder.mutation<
      IncomingNewLettersMainDTO,
      IAcquaintedRequest
    >({
      query: (data) => ({
        url: "/api/IncomingV4/acquainted",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    closeIncomingV4: builder.mutation<
      IncomingLettersV4MainDTO,
      ISendToResolution
    >({
      query: (data) => ({
        url: "/api/IncomingV4/close",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),

    executeFirstResolutionV4: builder.mutation<
      IncomingLettersV4MainDTO,
      IFirstExecuteResolution
    >({
      query: (data) => ({
        url: "/api/IncomingV4/ExecuteFirstResolution",
        method: "POST",
        ...data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    chooseSecretary: builder.mutation<
      IncomingLettersV4MainDTO,
      IChooseSecretarReq
    >({
      query: (data) => ({
        url: "/api/IncomingV4/chooseSecretar",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    uploadReadyDocument: builder.mutation<
      IIncomingNewRequest,
      IIncomingNewResponse
    >({
      query: (data) => ({
        url: "/api/IncomingV4/UploadReadyDocument",
        method: "POST",
        data,
      }),
      // invalidatesTags: ['IncomingNew'],
    }),
    moveToFolderLettersV4: builder.mutation({
      query: (data) => ({
        url: `/api/IncomingV4/movetofolder`,
        method: "POST",
        data,
      }),
    }),
    createFolderV4: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/IncomingV4/createfolder`,
        method: "POST",
        data,
      }),
    }),
    updateFolderV4: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/IncomingV4/updateFolder`,
        method: "POST",
        data,
      }),
    }),
    deleteFolder: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/IncomingV4/deletefolder`,
        method: "POST",
        data: { id },
      }),
    }),
    setTerm: builder.mutation<void, IResoutionTermReq>({
      query: (data) => ({
        url: `/api/IncomingV4/setTerm`,
        method: "POST",
        data,
      }),
    }),
    changeReadFlag: builder.mutation({
      query: (data) => ({
        url: `/api/IncomingV4/changereadflag`,
        method: "POST",
        data,
      }),
    }),
    fetchLetterApproveListV4: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/IncomingV4/getResolutionUsers",
      }),
    }),

    fetchOrganisationsStruct: builder.query<any, void>({
      query: () => ({
        url: `api/Organisation/struct`,
      }),
    }),

    fetchVisaTypes: builder.query<any, void>({
      query: () => ({
        url: "api/IncomingV4/visaType/get",
      }),
    }),

    fetchVisaTypesCreate: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: "api/IncomingV4/visaType/create",
        method: "POST",
        data,
      }),
    }),

    fetchMakeVisa: builder.mutation<any, void>({
      query: (data) => ({
        url: "api/IncomingV4/ExecuteFirstResolution",
        method: "POST",
        data,
      }),
    }),

    fetchMakeSubVisa: builder.mutation<any, void>({
      query: (data) => ({
        url: "api/IncomingV4/executeSecondResolution",
        method: "POST",
        data,
      }),
    }),

    fetchMakeThirdVisa: builder.mutation<any, void>({
      query: (data) => ({
        url: "api/IncomingV4/executeThirdResolution",
        method: "POST",
        data,
      }),
    }),

    getExecutors: builder.query<any, any>({
      query: (id) => ({
        url: "api/IncomingV4/getExecutors/" + id,
      }),
    }),

    createConclusion: builder.mutation<
      any,
      { title: string; executorId: number; incomingId: number }
    >({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/create",
        method: "POST",
        data,
      }),
    }),
    getConclusionById: builder.mutation<any, number>({
      query: (id) => ({
        url: "api/IncomingV4/conclusion/" + id,
      }),
    }),
    updateConclusion: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/update",
        method: "POST",
        data,
      }),
    }),
    signIncomingV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/sign",
        method: "POST",
        data,
      }),
    }),
    signChildIncomingV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/SignChild",
        method: "POST",
        data,
      }),
    }),
    signConclusion: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/sign",
        method: "POST",
        data,
      }),
    }),

    completeConclusion: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/complete",
        method: "POST",
        data,
      }),
    }),

    addNewVersionConclusion: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/addNewVersion",
        method: "POST",
        data,
      }),
    }),

    // Chat

    fetchDiscution: builder.query<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/discution",
        method: "POST",
        data,
      }),
    }),

    sendMessageV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/sendmessage",
        method: "POST",
        data,
      }),
    }),

    editMessageV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/editmessage",
        method: "POST",
        data,
      }),
    }),

    sendMessageToParent: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/sendToParent",
        method: "POST",
        data,
      }),
    }),

    addMembersToChat: builder.mutation<
      any,
      { discutionId: number; userIds: number[] }
    >({
      query: (data) => ({
        url: "api/IncomingV4/addMember",
        method: "POST",
        data,
      }),
    }),

    addMembersToConclusion: builder.mutation<
      any,
      { conclusionId: number; userIds: number[] }
    >({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/addMember",
        method: "POST",
        data,
      }),
    }),

    fetchFolderListLetterV4: builder.query<ListResponse<IFolder>, void>({
      query: () => ({
        url: "/api/IncomingV4/folder/list",
        method: "POST",
        data: {},
      }),
    }),

    changeExecutors: builder.mutation<any, IEditExecutorsLetterV4>({
      query: (data) => ({
        url: "api/IncomingV4/changeExecutors",
        method: "POST",
        data,
      }),
    }),

    changeVisaTypes: builder.mutation<any, IEditVisaTYpesLetterV4>({
      query: (data) => ({
        url: "api/IncomingV4/updateVisaTypes",
        method: "POST",
        data,
      }),
    }),

    fetchFolders: builder.query<IFolderItem[], string>({
      query: (type: "incoming" | "outgoing") => ({
        url: type === "outgoing" ? "" : "/api/IncomingV4/getFolders",
        method: "GET",
        data: {},
      }),
    }),
    fetchFoldersList: builder.query<IFolderItem[], string>({
      query: (type: "incoming" | "outgoing") => ({
        url: type === "outgoing" ? "" : "api/IncomingV4/folder/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchFolderById: builder.query<any, number>({
      query: (id) => ({
        url: `/api/IncomingV4/getFolder/${id}`,
        method: "GET",
        data: {},
      }),
    }),
    fetchFolderByIdOutcomingV4: builder.query<any, number>({
      query: (id) => ({
        url: `/api/OutComingV4/getFolder/${id}`,
        method: "GET",
        data: {},
      }),
    }),

    pinLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/pinned",
        method: "POST",
        data,
      }),
    }),

    unpinLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/unPinned",
        method: "POST",
        data,
      }),
    }),

    addToArchiveLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/addToArchive",
        method: "POST",
        data,
      }),
    }),

    removeArchiveLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/removeFromArchive",
        method: "POST",
        data,
      }),
    }),

    addToCartLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/addToCart",
        method: "POST",
        data,
      }),
    }),

    removeFromCartLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/removeFromCart",
        method: "POST",
        data,
      }),
    }),

    deleteLetterV4Incomming: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/delete",
        method: "POST",
        data,
      }),
    }),
    deleteLetterV4Folder: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/deletefolder",
        method: "POST",
        data,
      }),
    }),
    updateLetterV4Folder: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/updateFolder",
        method: "POST",
        data,
      }),
    }),
    deleteConclusionFile: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/deleteFile",
        method: "POST",
        data,
      }),
    }),
    deleteConclusion: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "api/IncomingV4/conclusion/delete",
        method: "POST",
        data,
      }),
    }),
    rejectIncomingV4: builder.mutation<any, IOperationInfoForUndo>({
      query: (data) => ({
        url: "/api/IncomingV4/undo",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    createOutcomingFolderLettersV4: builder.mutation<
      any,
      IOperationInfoForUndo
    >({
      query: (data) => ({
        url: "/api/OutComingV4/folder/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    deleteOutcomingFolderLettersV4: builder.mutation<
      any,
      IOperationInfoForUndo
    >({
      query: (data) => ({
        url: "/api/OutComingV4/folder/delete",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    moveToFolderOutcomingLettersV4: builder.mutation<
      any,
      IOperationInfoForUndo
    >({
      query: (data) => ({
        url: "/api/OutComingV4/folder/move",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    closeOutcomingLettersV4: builder.mutation<any, IOperationInfoForUndo>({
      query: (data) => ({
        url: "/api/OutComingV4/close",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    exitFolderIncomingLettersV4: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "/api/IncomingV4/exitFolder",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Incoming"],
    }),
    fetchFoldersOutcomingLettersV4: builder.query<any, any>({
      query: (data) => ({
        url: "/api/OutComingV4/folder/getFolders",
        method: "GET",
      }),
    }),
    fetchFoldersListOutcomingLettersV4: builder.query<any, any>({
      query: (data) => ({
        url: "/api/OutComingV4/folder/list",
        method: "POST",
      }),
    }),
    createAnswerLetterV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/incomingV4/answer/create",
        method: "POST",
        data,
      }),
    }),
    updateAnswerLetterV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/incomingV4/answer/update",
        method: "POST",
        data,
      }),
    }),
    getAnswerById: builder.query<any, number>({
      query: (id) => ({
        url: `api/incomingV4/answer/${id}`,
        method: "GET",
        data: {},
      }),
    }),

    signAnswerLetterV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/incomingV4/answer/sign",
        method: "POST",
        data,
      }),
    }),

    createAnswerLetterV4Outcoming: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/outComingV4/answer/create",
        method: "POST",
        data,
      }),
    }),
    getAnswerByIdOutcoming: builder.query<any, number>({
      query: (id) => ({
        url: `api/outComingV4/answer/${id}`,
      }),
    }),

    signAnswerLetterV4Outcoming: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/outComingV4/answer/sign",
        method: "POST",
        data,
      }),
    }),

    deleteFileIncomingV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/deleteFile",
        method: "POST",
        data,
      }),
    }),

    deleteAnswerMemberIncomingV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/answer/member/delete",
        method: "POST",
        data,
      }),
    }),

    sendToApproveLetterV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/answer/sendToApprove",
        method: "POST",
        data,
      }),
    }),

    doneLetterV4: builder.mutation<any, any>({
      query: (data) => ({
        url: "api/IncomingV4/answer/doneLetter",
        method: "POST",
        data,
      }),
    }),
    organisationMyBlanks: builder.mutation<OrgBlanksResponse, {}>({
      query: () => ({
        url: "api/crm/organisation/myBlanks",
        method: "POST",
      }),
    }),

    answerMyBlanks: builder.mutation<any, any>({
      query: () => ({
        url: "api/outComingV4/answer/myBlanks",
        method: "POST",
      }),
    }),

    answerMyBlanksIncoming: builder.mutation<any, any>({
      query: () => ({
        url: "api/incomingV4/answer/myBlanks",
        method: "POST",
      }),
    }),

    getAnswerDataForSign: builder.query<any, number>({
      query: (id) => ({
        url: `api/outComingV4/answer/getDataForSign/${id}`,
      }),
    }),

    getAnswerDataForSignIncoming: builder.query<any, number>({
      query: (id) => ({
        url: `api/incomingV4/answer/addSignToDoc/${id}`,
      }),
    }),

    answerOutcomingSetNumber: builder.mutation<any, number>({
      query: (outComingId) => ({
        url: `api/outComingV4/answer/setNumber?id=${outComingId}`,
        method: "POST",
      }),
    }),

    answerIncomingCheckFinalPdf: builder.mutation<any, number>({
      query: (incomingId) => ({
        url: `api/incomingV4/answer/checkFinalPdf?incomingId=${incomingId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useFetchIncomingLettersNewV4Query,
  useLazyFetchIncomingLettersNewV4Query,
  useFetchLettersV4ByIdQuery,
  useLazyFetchLettersV4ByIdQuery,
  useLazyFetchLettersV4ById2Query,
  useSaveIncomingLettersV4Mutation,
  useUpdateIncomingV4Mutation,
  useUpdateIncomingNewMutation,
  useSendToResolutionV4Mutation,
  useExecuteFirstResolutionV4Mutation,
  useAnswerByOwnLettersV4Mutation,
  useAnswerByOwnMainLettersV4Mutation,
  useAcquaintedLettersV4Mutation,
  useCloseIncomingV4Mutation,
  useChooseSecretaryMutation,
  useUploadReadyDocumentMutation,
  useCreateFolderV4Mutation,
  useDeleteFolderMutation,
  useMoveToFolderLettersV4Mutation,
  useSetTermMutation,
  useChangeReadFlagMutation,
  useFetchLetterApproveListV4Query,
  useFetchOrganisationsStructQuery,
  useFetchVisaTypesQuery,
  useFetchMakeVisaMutation,
  useGetExecutorsQuery,
  useLazyFetchOrganisationsStructQuery,
  useLazyGetExecutorsQuery,
  useFetchMakeSubVisaMutation,
  useFetchMakeThirdVisaMutation,
  useCreateConclusionMutation,
  useGetConclusionByIdMutation,
  useUpdateConclusionMutation,
  useSignConclusionMutation,
  useCompleteConclusionMutation,
  useFetchDiscutionQuery,
  useLazyFetchDiscutionQuery,
  useSendMessageV4Mutation,
  useEditMessageV4Mutation,
  useAddNewVersionConclusionMutation,
  useSendMessageToParentMutation,
  useFetchVisaTypesCreateMutation,
  useSignChildIncomingV4Mutation,
  useSignIncomingV4Mutation,
  useAddMembersToChatMutation,
  useChangeExecutorsMutation,
  useAddMembersToConclusionMutation,
  useFetchFolderListLetterV4Query,
  useFetchFoldersQuery,
  usePinLetterV4IncommingMutation,
  useUnpinLetterV4IncommingMutation,
  useAddToArchiveLetterV4IncommingMutation,
  useRemoveArchiveLetterV4IncommingMutation,
  useDeleteLetterV4IncommingMutation,
  useAddToCartLetterV4IncommingMutation,
  useRemoveFromCartLetterV4IncommingMutation,
  useUpdateLetterV4FolderMutation,
  useDeleteLetterV4FolderMutation,
  useDeleteConclusionFileMutation,
  useLazyFetchFolderByIdQuery,
  useUpdateFolderV4Mutation,
  useRejectIncomingV4Mutation,
  useLazyFetchOutcomingLettersV4Query,
  useLazyFetchOutcomingLettersV4ByIdQuery,
  useSaveOutcomingLettersV4Mutation,
  useUpdateOutcomingLettersV4Mutation,
  useCreateOutcomingFolderLettersV4Mutation,
  useDeleteOutcomingFolderLettersV4Mutation,
  useMoveToFolderOutcomingLettersV4Mutation,
  useFetchFoldersOutcomingLettersV4Query,
  useCreateAnswerLetterV4Mutation,
  useGetAnswerByIdQuery,
  useLazyGetAnswerByIdQuery,
  useSignAnswerLetterV4Mutation,
  useCloseOutcomingLettersV4Mutation,
  useCreateAnswerLetterV4OutcomingMutation,
  useGetAnswerByIdOutcomingQuery,
  useLazyGetAnswerByIdOutcomingQuery,
  useSignAnswerLetterV4OutcomingMutation,
  useFetchFoldersListOutcomingLettersV4Query,
  useLazyFetchFolderByIdOutcomingV4Query,
  useFetchFoldersListQuery,
  useRejectAnswerIncomingV4Mutation,
  useRejectAnswerOutcomingV4Mutation,
  useDeleteFileIncomingV4Mutation,
  useDeleteAnswerMemberIncomingV4Mutation,
  useDeleteConclusionMutation,
  useSendToApproveLetterV4Mutation,
  useDoneLetterV4Mutation,
  useOrganisationMyBlanksMutation,
  useAnswerMyBlanksMutation,
  useLazyGetAnswerDataForSignQuery,
  useChangeVisaTypesMutation,
  useAnswerMyBlanksIncomingMutation,
  useLazyGetAnswerDataForSignIncomingQuery,
  useAnswerOutcomingSetNumberMutation,
  useAnswerIncomingCheckFinalPdfMutation,
  useUpdateAnswerLetterV4Mutation,
  useExitFolderIncomingLettersV4Mutation,
} = lettersApiV4;
