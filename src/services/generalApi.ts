import { ListResponse, ValueId, ValueIdWithPosition, api } from "./api";

const basePath = "/api/general";

const url = (...args: string[]) => [basePath, ...args].join("/");

export interface IFilterString {
  filter: string;
}

export interface IFolder {
  id: number;
  name: string;
  prefix?: string;
}

export interface NotificationsItemDetail {
  id: number;
  displayName: string;
  type: DocumentType;
}
export interface INotificationsResponse {
  total: number;
  itemDetails: Array<NotificationsItemDetail>;
}

export interface INewOptionCreateRequest {
  name: string;
  nameRU: string;
  nameEN: string;
}

export const generalApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchYears: builder.query<number[], void>({
      query: () => ({ url: "/api/general/year/get" }),
    }),
    fetchTreasureCodes: builder.query<{ items: ValueId[] }, void>({
      query: () => ({
        url: "/api/general/treasurecode/list",
        method: "POST",
        data: {},
      }),
    }),
    createUserPositions: builder.mutation<{}, INewOptionCreateRequest>({
      query: (data) => ({
        url: "/api/general/userposition/create",
        method: "POST",
        data,
      }),
    }),
    fetchUserPositions: builder.query<
      { items: ValueId[] },
      Nullable<{
        ids?: number[];
      }> | void
    >({
      query: () => ({
        url: "/api/general/userposition/list",
        method: "POST",
        data: {},
      }),
    }),

    FetchListTfmisLOgin: builder.query<{ items: [] }, Nullable<{}> | void>({
      query: () => ({
        url: "/api/general/getTfmisLogin",
        method: "POST",
        data: {},
      }),
    }),

    // fetchMfAccessDefaultPage: builder.query<MF.PageAccessInfo[], void>({
    //   query: (id) => ({ url: '/api/general/defaulTfmistPage', method: 'GET' })
    // }),

    // fetchUserSignatures: builder.query<
    //    { info: { id: string; value: string }[] },
    //    Nullable<{
    //      ids?: number[]
    //    }> | void
    //  >({
    //    query: () => ({
    //      url: '/api/general/usersignatures/list',
    //      method: 'POST',
    //      data: {},
    //    }),
    //  }),

    fetchMfAccessDefaultPage: builder.query<MF.PageAccessInfo[], void>({
      query: (id) => ({ url: url("defaulTfmistPage") }),
      providesTags: ["MFAccessForm"],
    }),

    fetchUserSignatures: builder.query<
      //{ items: { id: string; value: string }; OrgName: string; Adress: string; Inn: string; },
      ListResponse<{
        info: ValueId;
        organizationName: string;
        address: string;
        inn: string;
        bo_Fio: string;
        bo_Phone: Number;
      }>,
      //ListResponse<Accountant.JobResponsibilities.infoBlockAccountants>,
      void
    >({
      query: () => ({
        url: "/api/general/usersignatures/list",
        method: "POST",
        data: {},
      }),
    }),

    fetchSeqnums: builder.query<
      { items: ValueId[] },
      Nullable<{
        seqnums?: number[];
        orgs?: ValueId[];
      }> | void
    >({
      query: (filters) => ({
        url: "/api/general/seqnum/get",
        method: "POST",
        data: { ids: null, ...filters },
      }),
    }),
    fetchBudgetVariants: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/budgetvariant/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchDzseqnums: builder.query<
      ListResponse<ValueId>,
      Nullable<{
        seqnums?: number[];
        orgs?: ValueId[];
      }> | void
    >({
      query: (data) => ({
        url: "/api/general/dzseqnum/get",
        method: "POST",
        data,
      }),
    }),
    fetchPrograms: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/program/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchUserTypes: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/usertype/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchRejectReasons: builder.query<
      ListResponse<ValueId>,
      Nullable<{
        type?: number;
      }> | void
    >({
      query: (data) => ({
        url: "/api/general/undoReason/list",
        method: "POST",
        data,
      }),
    }),
    fetchEgovRejectReasons: builder.query<
      ListResponse<ValueId>,
      Nullable<{
        type?: number;
      }> | void
    >({
      query: (data) => ({
        url: "/api/general/egovUndoReason/list",
        method: "POST",
        data,
      }),
    }),
    fetchFBK: builder.query<ListResponse<ValueId>, void>({
      query: () => ({ url: "/api/general/fbk/list", method: "POST", data: {} }),
    }),
    fetchAccount: builder.query<string[], void>({
      query: () => ({
        url: "/api/general/account/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchCities: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/city/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchDoctypes: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/doctype/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchTravelDocType: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/traveldoctype/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchSenderType: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/sendertype/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchPriorityType: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ActivityPriority/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchContragent: builder.query<ListResponse<ValueId>, { text?: string }>({
      query: (data) => ({
        url: "/api/general/contragent/list",
        method: "POST",
        data,
      }),
    }),
    fetchLetterApproveList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ResolutionApprove/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchResolutionTextList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ResolutionText/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchPayStateList: builder.query<ValueId[], void>({
      query: () => ({
        url: "api/Egov_Service_Requests/list/state",
        method: "POST",
        data: {},
      }),
    }),
    fetchResolutionCategoryList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ResolutionCategory/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchEgovBankList: builder.query<ValueId[], void>({
      query: () => ({
        url: "api/Egov_Service_Requests/list/egovBank",
        method: "POST",
        data: {},
      }),
    }),
    fetchResolutionPersonList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ResolutionPerson/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchActivityReasonList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ResolutionPerson/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchActivityResultTypeList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ActivityType/list",
        method: "POST",
        data: {},
      }),
    }),
    getFile: builder.query<File, void>({
      query: () => ({
        url: "/api/general/printFile",
        method: "POST",
        data: {},
      }),
    }),
    fetchFile: builder.query<{ file64: Blob; fileName: string }, void>({
      query: () => ({
        url: "/api/general/printFile3",
        method: "POST",
        data: {},
      }),
    }),
    fetchOrganisationTypeList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/getOrganisationType",
        method: "POST",
      }),
    }),
    fetchOrganisationList: builder.query<
      ListResponse<ValueId>,
      { text?: string }
    >({
      query: (data) => ({
        url: "/api/general/getOrganisation",
        method: "POST",
        data,
      }),
    }),
    fetchOrganisationTree: builder.mutation<
      any,
      { text?: string; parrentId?: number }
    >({
      query: (data) => ({
        url: "/api/general/getOrganisationTree",
        method: "POST",
        data,
      }),
    }),
    fetchInterfaceList: builder.query<
      {
        items: {
          id: number;
          pageName: string;
          displayName: string;
          a1_Title?: string;
          a2_Title?: string;
          a3_Title?: string;
          a4_Title?: string;
          a5_Title?: string;
          a6_Title?: string;
          a7_Title?: string;
          a8_Title?: string;
          a9_Title?: string;
          a10_Title?: string;
          a11_Title?: string;
          a12_Title?: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: "/api/general/getInterface",
        method: "POST",
      }),
    }),
    fetchDepartmentList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/getdepartments",
        method: "POST",
        data: {},
      }),
    }),
    fetchNotifications: builder.mutation<INotificationsResponse, void>({
      query: () => ({
        url: "/api/general/getBell",
        method: "POST",
        data: {},
      }),
    }),
    fetchGovernments: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/government",
        method: "POST",
        data: {},
      }),
    }),
    fetchEgovGovernments: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/eGov_goverment/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchEgovInnList: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/User_Inn_Informtion/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchEgovDocTypes: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/eGov_Directory_type/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchEgovCountList: builder.query<number[], void>({
      query: () => ({
        url: "/api/general/count/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchFolderList: builder.query<ListResponse<IFolder>, void>({
      query: () => ({
        url: "/api/general/folder/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchIndustries: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/industry",
        method: "POST",
        data: {},
      }),
    }),
    fetchReportTypes: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/reporttype",
        method: "POST",
        data: {},
      }),
    }),
    fetchCurrencies: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/mcurrency",
        method: "POST",
        data: {},
      }),
    }),
    fetchOwnershipTypes: builder.query<ListResponse<ValueId>, void>({
      query: () => ({
        url: "/api/general/ownershiptype",
        method: "POST",
        data: {},
      }),
    }),
    fetchUserSearch: builder.mutation<
      ListResponse<ValueIdWithPosition>,
      IFilterString
    >({
      query: (filters: IFilterString = { filter: "" }) => ({
        url: "/api/general/user/list",
        method: "POST",
        data: filters,
      }),
    }),
    createDepartment: builder.mutation<{}, INewOptionCreateRequest>({
      query: (data) => ({
        url: "/api/general/getdepartments/create",
        method: "POST",
        data,
      }),
    }),
    fetchUserDepartments: builder.query<
      { items: ValueId[] },
      Nullable<{
        ids?: number[];
      }> | void
    >({
      query: () => ({
        url: "/api/general/getdepartments",
        method: "POST",
        data: {},
      }),
    }),
  }),
});

export const {
  useFetchTreasureCodesQuery,
  useCreateUserPositionsMutation,
  useFetchUserPositionsQuery,
  useFetchListTfmisLOginQuery,
  useFetchUserSignaturesQuery,
  useFetchYearsQuery,
  useFetchSeqnumsQuery,
  useLazyFetchSeqnumsQuery,
  useFetchDzseqnumsQuery,
  useLazyFetchDzseqnumsQuery,
  useFetchBudgetVariantsQuery,
  useFetchProgramsQuery,
  useFetchUserTypesQuery,
  useFetchRejectReasonsQuery,
  useFetchEgovRejectReasonsQuery,
  useFetchFBKQuery,
  useFetchAccountQuery,
  useFetchCitiesQuery,
  useFetchDoctypesQuery,
  useFetchSenderTypeQuery,
  useFetchPriorityTypeQuery,
  useFetchContragentQuery,
  useFetchLetterApproveListQuery,
  useFetchResolutionTextListQuery,
  useFetchResolutionCategoryListQuery,
  useFetchResolutionPersonListQuery,
  useLazyFetchResolutionPersonListQuery,
  useFetchActivityResultTypeListQuery,
  useFetchTravelDocTypeQuery,
  useLazyGetFileQuery,
  useFetchCurrenciesQuery,
  useFetchIndustriesQuery,
  useFetchOwnershipTypesQuery,
  useFetchReportTypesQuery,

  useFetchPayStateListQuery,
  useFetchEgovBankListQuery,

  //useFetchFileQuery,
  useFetchOrganisationTypeListQuery,
  useFetchOrganisationListQuery,
  useLazyFetchOrganisationListQuery,
  useFetchInterfaceListQuery,
  useFetchDepartmentListQuery,

  useFetchMfAccessDefaultPageQuery,
  useLazyFetchMfAccessDefaultPageQuery,
  useFetchNotificationsMutation,
  useFetchGovernmentsQuery,
  useFetchEgovGovernmentsQuery,
  useFetchEgovInnListQuery,
  useFetchEgovDocTypesQuery,
  useFetchEgovCountListQuery,
  useFetchFolderListQuery,

  useFetchUserSearchMutation,

  useCreateDepartmentMutation,
  useFetchUserDepartmentsQuery,
  useFetchOrganisationTreeMutation,
} = generalApi;
