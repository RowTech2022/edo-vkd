import { api, IRequestOrderBy, IRequestPagination, ListResponse } from "./api";

export interface IOrganizationSearchRequest
  extends IRequestOrderBy,
    IRequestPagination {
  ids?: number[];
  filters?: {
    terCode: number;
    inn: string;
    orgId: string;
    orgType: { id: string; value: string };
  };
}

export interface ImageBodyRequest {
  organisationId: number;
  url: string;
}

export interface IOrganizationSearchResponse {
  id: number;
  orgName: string;
  orgInn: string;
  status: number;
}

export interface IOrganizationFile {
  id: number;
  orgId: number;
  url: string;
  name: string;
  type?: number | null;
  description: string;
  createAt: string;
  createBy: string;
  loading?: boolean;
}
export interface IBlankFile {
  id: number;
  organizationId: number;
  url: string;
  name: string;
  language: number | null;
  docType: number | null;
  createAt: string;
  createBy: string;
  loading?: boolean;
}

export interface IOrganizationCreate {
  id?: number;
  name: string;
  inn: string;
  orgId: string;
  custId?: number;
  address: string;
  contractNo: string;
  contractDate: string;
  grbsResponsible?: { id: string; value: string; positionName?: string } | null;
  grbs: { id: string; value: string } | null;
  pbs?: { id: string; value: string } | null;
  seqnums:
    | [
        {
          id: string;
          value: string;
        }
      ]
    | [];
  files: IBlankFile[];
  requisites: string[];
  orgType?: { id: string; value: string } | null;
  terCode?: { id: string; value: string } | null;
  treasureCode?: { id: string; value: string } | null;
  parrenOrg?: { id: string; value: string } | null;
}

export interface IOrganization {
  id: number;
  name: string;
  inn: string;
  orgId: string;
  custId?: number;
  address: string;
  contractNo: string;
  contractDate: string;
  grbsResponsible?: { id: string; value: string } | null;
  grbs: { id: string; value: string } | null;
  pbs: { id: string; value: string } | null;
  //pbs: string
  seqnums:
    | [
        {
          id: string;
          value: string;
        }
      ]
    | [];
  files: IBlankFile[];
  orgFiles: IBlankFile[];
  requisites: string[];
  orgType: { id: string; value: string } | null;
  terCode: { id: string; value: string } | null;
  treasureCode: { id: string; value: string } | null;

  headInfo?: IOrgUserInfo;
  headFio: string;
  headPhone: string;
  headEmail: string;

  accountantInfo?: IOrgUserInfo[];
  accountantFio?: string;
  accountantPhone: string;
  accountantEmail: string;

  status: 1;
  createAt?: Date;
  updateAt?: Date;
}

interface IOrgUserInfo {
  fio: string;
  phone: string;
  email: string;
}

export interface IHistoryRequest {
  ids: string[];
  filtres: {
    dateFrom: string;
    dateTo: string;
    docType: number;
  };
  orderBy: {
    column: number;
    order: number;
  };
  pageInfo: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface IHistoryResponse {
  items: Array<{
    id: number;
    organization: {
      id: string;
      value: string;
    };
    inn: string;
    status: string;
    docDate: Date;
    year: 0;
  }>;
  total: 0;
}

export const organizationsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchOrganizations: builder.query<IOrganizations, number>({
      query: (id) => ({ url: "/api/crm/get/" + id, method: "GET" }),
    }),

    fetchOrganisationSearch: builder.query<
      ListResponse<IOrganizationSearchResponse>,
      Nullable<IOrganizationSearchRequest> | void
    >({
      query: (filters) => ({
        url: "/api/crm/search",
        method: "POST",
        data: { ...filters },
      }),
    }),
    fetchCreateOrganisation: builder.mutation<
      IOrganization,
      IOrganizationCreate
    >({
      query: (params) => ({
        url: "/api/crm/organization/create",
        method: "POST",
        data: params,
      }),
    }),
    fetchUpdateOrganisation: builder.mutation<
      IOrganization,
      IOrganizationCreate
    >({
      query: (params) => ({
        url: "/api/crm/organization/update",
        method: "POST",
        data: params,
      }),
    }),

    fetchOrganizationById: builder.query<IOrganization, {}>({
      query: (id) => ({
        url: "/api/crm/organization/get/" + id,
        method: "GET",
      }),
    }),
    saveImage: builder.mutation<{}, ImageBodyRequest>({
      query: (data) => ({
        url: "/api/Organisation/saveimage",
        method: "POST",
        data,
      }),
    }),
    fetchHistoryData: builder.query<IHistoryResponse, IHistoryRequest>({
      query: (params) => ({
        url: "/api/crm/istory/search",
        method: "POST",
        data: params,
      }),
    }),
  }),
});

export const {
  useFetchOrganizationsQuery,
  useFetchOrganizationByIdQuery,
  useLazyFetchOrganizationByIdQuery,
  useSaveImageMutation,
  useFetchHistoryDataQuery,
  useFetchCreateOrganisationMutation,
  useFetchUpdateOrganisationMutation,
  useLazyFetchOrganisationSearchQuery,
} = organizationsApi;
