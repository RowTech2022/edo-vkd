import {
  api,
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
} from "./api";
import { CreateFolderProps } from "./lettersApiV3";

export interface IOutcomingV3RequestSearch {
  folderId?: number;
  outcomeNumber?: string;
  receivedDate?: string;
  contragent?: IValueId;
  state?: number;
  viewType?: number;
}

export interface IOutcomingV3RequestBody
  extends IRequestOrderBy,
    IRequestPagination {
  ids?: number[];
  filters?: IOutcomingV3RequestSearch;
}

interface IValueId {
  id: string;
  value: string;
}

interface IFile {
  id: number;
  loading?: boolean;
  outcomingId?: number;
  name: string;
  description: string;
  url: string;
  createAt?: string;
  createBy?: string;
}

interface IReadyFiles {
  url: string;
  name: string;
  date: string;
}

export interface IOutcomingV3SearchResponse {
  id: number;
  outcomeNumber: string;
  receivedDate: string;
  contragent: IValueId;
  executor: string;
  state: number;
  createdDate: string;
}

export interface OutcomingLettersMainDTO {
  id: number;
  state?: number;
  outcomeNumber: string;
  inComingId?: number;
  receivedDate: string;
  senderType: IValueId;
  contragent: IValueId;
  executor?: IValueId;
  contact: string;
  content1: string;
  body: string;
  files: IFile[];
  readyFiles?: IReadyFiles[];
  userVisas?: UserVisa[];
  documentHistories?: IDocumentHistory[];
  transitions?: {
    fieldSettings: {
      additionalProp1: ButtonSettings;
      additionalProp2: ButtonSettings;
      additionalProp3: ButtonSettings;
    };
    buttonSettings: {
      additionalProp1: ButtonSettings;
      additionalProp2: ButtonSettings;
      additionalProp3: ButtonSettings;
    };
    buttonInfo: {
      additionalProp1: string[];
      additionalProp2: string[];
      additionalProp3: string[];
    };
  };
  createdAt?: string;
  updatedAt?: string;
  timestamp: string;
}

type ButtonSettings = {
  readOnly: boolean;
  hide: boolean;
};

export interface IOutcomingSign {
  id: number;
  currentState: number;
  timestamp: string;
  approveBy?: number;
  comment?: string;
}

export interface IOutcomingUndo {
  id: number;
  reason: number;
  comment: string;
  timestamp: string;
}

export interface IOutcomingV3Create {
  outcomeNumber: string;
  incomeNumber: string;
  receivedDate: string;
  senderType: ValueId;
  contragent: ValueId;
  contact: string;
  content1: string;
  body: string;
  files: Array<{
    url: string;
  }>;
}

export interface IOutcomingV3Update extends IOutcomingV3Create {
  id: number;
  timestamp?: string;
}

export const lettersApiV3 = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchOutcomingV3Letters: builder.query<
      ListResponse<IOutcomingV3SearchResponse>,
      Nullable<IOutcomingV3RequestBody> | void
    >({
      query: (filters) => ({
        url: "/api/OutComingV3/search",
        method: "POST",
        data: { ...filters },
      }),
    }),
    fetchOutcomingV3ById: builder.query<OutcomingLettersMainDTO, number>({
      query: (id) => ({ url: `/api/OutComingV3/get/${id}` }),
      providesTags: ["Outcoming"],
    }),
    saveOutcomingV3: builder.mutation<
      OutcomingLettersMainDTO,
      IOutcomingV3Create
    >({
      query: (data) => ({
        //url: 'https://localhost:44383/api/Outcoming/create',
        url: "/api/OutComingV3/create",
        method: "POST",
        data,
      }),
    }),
    updateOutcomingV3: builder.mutation<
      OutcomingLettersMainDTO,
      IOutcomingV3Update
    >({
      query: (data) => ({
        url: "/api/OutComingV3/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Outcoming"],
    }),
    // signOutcoming: builder.mutation<OutcomingLettersMainDTO, IOutcomingSign>({
    //   query: (data) => ({
    //     url: '/api/Outcoming/sign',
    //     method: 'POST',
    //     data,
    //   }),
    //   invalidatesTags: ['Outcoming'],
    // }),

    // rejectOutcoming: builder.mutation<OutcomingLettersMainDTO, IOutcomingUndo>({
    //   query: (data) => ({
    //     url: '/api/Outcoming/undo',
    //     method: 'POST',
    //     data,
    //   }),
    //   invalidatesTags: ['Outcoming'],
    // }),
    closeOutcomingV3: builder.mutation<OutcomingLettersMainDTO, IOutcomingSign>(
      {
        query: (data) => ({
          url: "/api/OutComingV3/close",
          method: "POST",
          data,
        }),
        invalidatesTags: ["Outcoming"],
      }
    ),
    moveToFolderOutcomingV3: builder.mutation({
      query: (data) => ({
        url: `/api/OutComingV3/movetofolder`,
        method: "POST",
        data,
      }),
    }),
    createFolderOutcomingV3: builder.mutation<boolean, CreateFolderProps>({
      query: (data) => ({
        url: `/api/OutComingV3/createfolder`,
        method: "POST",
        data,
      }),
    }),
    deleteFolderOutcomingV3: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/OutComingV3/deletefolder`,
        method: "POST",
        data: { id },
      }),
    }),
  }),
});

export const {
  useFetchOutcomingV3LettersQuery,
  useLazyFetchOutcomingV3LettersQuery,
  useFetchOutcomingV3ByIdQuery,
  useLazyFetchOutcomingV3ByIdQuery,
  useSaveOutcomingV3Mutation,
  useUpdateOutcomingV3Mutation,
  // useSignOutcomingV3Mutation,
  // useRejectOutcomingV3Mutation,
  useCloseOutcomingV3Mutation,
  useCreateFolderOutcomingV3Mutation,
  useDeleteFolderOutcomingV3Mutation,
  useMoveToFolderOutcomingV3Mutation,
} = lettersApiV3;
