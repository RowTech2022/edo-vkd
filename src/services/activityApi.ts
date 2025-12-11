import { api, IRequestOrderBy, IRequestPagination, ListResponse } from "./api";

export interface IActivitySearchRequestBody
  extends IRequestOrderBy,
    IRequestPagination {
  ids?: number[];
  filtres?: IActivFilters;
}

export interface IActivFilters {
  responsible?: IValueId | null;
  startDate?: string;
  endDate?: string;
  state?: number;
}

export interface IValueId {
  id: string;
  value: string;
}

export interface IFile {
  id: number;
  activityId: number;
  name: string;
  description: string;
  url: string;
  createAt: string;
  createBy: string;
}

export interface IActivityMainDTO {
  id: number;
  state: number;
  title: string;
  priority: IValueId;
  author: IValueId;
  startDate: string;
  endtDate: string;

  category: IValueId;
  responsibility: IValueId;
  type: IValueId;

  result: IValueId;
  detailsResult: string;

  incomeLatter: string;
  resolution: string;
  outCommingLatter: string;

  notes: string;

  file: IFile[];
  files?: IFile[];

  userVisas: UserVisa[];
  documentHistories: IDocumentHistory[];
  transitions: {
    fieldSettings: {};
    buttonSettings: {
      btn_save: ButtonSettings;
      btn_onprocess: ButtonSettings;
      btn_toapprove: ButtonSettings;
      btn_approve: ButtonSettings;
      btn_finish: ButtonSettings;
      btn_undo: ButtonSettings;
      btn_delete: ButtonSettings;
    };
    buttonInfo: {};
  };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

type ButtonSettings = {
  readOnly: boolean;
  hide: boolean;
};

export interface IActivitySearchResult {
  id: number;
  state: number;
  title: string;
  responsible: string;
  startDate: string;
  endDate: string;
  createdDate: string;
}

export interface IActivutyUpdateStatus {
  id: number;
  status: number;
  timestamp: string;
}

export interface IActivityUndoRequest {
  id: number;
  reason: number;
  comment: string;
  timestamp: string;
}

export interface IActivityToApproveRequest {
  id: number;
  result: IValueId | null;
  detailsResult: string;
  timestamp: string;
}

export const activityApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchActivitySearch: builder.query<
      ListResponse<IActivitySearchResult>,
      Nullable<IActivitySearchRequestBody> | void
    >({
      query: (filters) => ({
        url: "/api/Activity/search",
        method: "POST",
        data: { ...filters },
      }),
    }),
    fetchActivityById: builder.query<IActivityMainDTO, number>({
      query: (id) => ({ url: `/api/Activity/get/${id}` }),
      providesTags: ["Activity"],
    }),
    saveActivity: builder.mutation<
      IActivityMainDTO,
      Pick<Nullable<IActivityMainDTO>, "result" | "detailsResult" | "notes">
    >({
      query: (data) => ({
        url: "/api/Activity/create",
        method: "POST",
        data,
      }),
    }),

    updateActivity: builder.mutation<
      IActivityMainDTO,
      Pick<
        Nullable<IActivityMainDTO>,
        "id" | "result" | "detailsResult" | "notes" | "timestamp"
      >
    >({
      query: (data) => ({
        url: "/api/Activity/update",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Activity"],
    }),

    updateStatusActivity: builder.mutation<
      IActivityMainDTO,
      IActivutyUpdateStatus
    >({
      query: (data) => ({
        url: "/api/Activity/updateStatus",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Activity"],
    }),

    cancelActivity: builder.mutation<IActivityMainDTO, IActivityUndoRequest>({
      query: (data) => ({
        url: "/api/Activity/Cancel",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Activity"],
    }),

    undoActivity: builder.mutation<IActivityMainDTO, IActivityUndoRequest>({
      query: (data) => ({
        url: "/api/Activity/Undo",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Activity"],
    }),

    toApproveActivity: builder.mutation<
      IActivityMainDTO,
      IActivityToApproveRequest
    >({
      query: (data) => ({
        url: "/api/Activity/ToApprove",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useFetchActivitySearchQuery,
  useLazyFetchActivitySearchQuery,
  useFetchActivityByIdQuery,
  useSaveActivityMutation,
  useUpdateActivityMutation,
  useUpdateStatusActivityMutation,
  useCancelActivityMutation,
  useUndoActivityMutation,
  useToApproveActivityMutation,
} = activityApi;
