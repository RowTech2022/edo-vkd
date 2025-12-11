import {
  IRequestOrderBy,
  IRequestPagination,
  ListResponse,
  ValueId,
  api,
} from "../api";

export interface RoleSearchRequestBody
  extends IRequestPagination,
    IRequestOrderBy {
  filtres?: {
    role?: ValueId;
  };
}

export interface Role {
  id: number;
  organisationType: ValueId;
  userType: ValueId;
  roleName: string;
  template: ValueId;
  createdDate: string;
}

export interface RoleList {
  id: number;
  roleName: string;
  access: AccessItem[];
}

export interface AccessItem {
  id?: number;
  interfaceId: number;
  role_Id: number;
  pageName: string;
  displayName: string;
  a1?: boolean;
  a1_Title?: string;
  a2?: boolean;
  a2_Title?: string;
  a3?: boolean;
  a3_Title?: string;
  a4?: boolean;
  a4_Title?: string;
  a5?: boolean;
  a5_Title?: string;
  a6?: boolean;
  a6_Title?: string;
  a7?: boolean;
  a7_Title?: string;
  a8?: boolean;
  a8_Title?: string;
  a9?: boolean;
  a9_Title?: string;
  a10?: boolean;
  a10_Title?: string;
  a11?: boolean;
  a11_Title?: string;
  a12?: boolean;
  a12_Title?: string;
}

export interface IUpdateRoleAccessModule {
  id?: number;
  modulAccess: {
    items: Array<{
      subModulId: number;
      name: string;
      enable: boolean;
      id?: string;
    }>;
  };
}

export interface IUserTaskList {
  date: string;
}
export interface ICreateTask {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: any;
  members: [];
}
export interface IUpdateProfile {
  id: number;
  email: string;
  phone: string;
}

export interface RoleByIDResponseBody extends Role {
  access: AccessItem[];
  modulAccess: IUpdateRoleAccessModule["modulAccess"]["items"];
}

export interface CreateRoleRequestBody {
  organisationType: ValueId;
  userType: ValueId;
  roleName: string;
  template: ValueId;
}

export interface UpdateRoleRequestBody extends CreateRoleRequestBody {
  id: number;
}

export interface UpdateRoleAccessRequestBody {
  id: number;
  access: AccessItem[];
}

export interface AcceptRoleRequestBody {
  role: ValueId;
  type: ValueId;
  key: ValueId;
}

export interface UserByRoleIdResponse {
  id: number;
  userName: string;
  phone: string;
}

const rolesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchRoleList: builder.query<
      ListResponse<ValueId>,
      Nullable<{ filter: string }> | void
    >({
      query: () => ({
        url: "/api/FRole/list",
        method: "POST",
        data: {},
      }),
    }),
    fetchRoleByID: builder.query<RoleByIDResponseBody, string | number>({
      query: (id) => ({
        url: `/api/FRole/get/${id}`,
      }),
    }),
    getRoleByID: builder.mutation<RoleByIDResponseBody, string | number>({
      query: (id) => ({
        url: `/api/FRole/get/${id}`,
      }),
    }),
    fetchRoles: builder.query<
      ListResponse<Role>,
      Nullable<RoleSearchRequestBody> | void
    >({
      query: (filters) => ({
        url: "/api/FRole/search",
        method: "POST",
        data: filters,
      }),
    }),
    createRole: builder.mutation<{}, CreateRoleRequestBody>({
      query: (data) => ({
        url: "/api/FRole/create",
        method: "POST",
        data,
      }),
    }),
    updateRole: builder.mutation<{}, UpdateRoleRequestBody>({
      query: (data) => ({
        url: "/api/FRole/update",
        method: "POST",
        data,
      }),
    }),
    deleteRoleByID: builder.mutation<boolean, number>({
      query: (id) => ({
        url: "/api/FRole/delete",
        method: "POST",
        data: { id },
      }),
    }),
    updateRoleAccess: builder.mutation<{}, UpdateRoleAccessRequestBody>({
      query: (data) => ({
        url: "/api/FRole/updaterole",
        method: "POST",
        data,
      }),
    }),
    updateRoleAccessModule: builder.mutation<any, IUpdateRoleAccessModule>({
      query: (data) => ({
        url: "/api/FRole/updaterole/Access_Modul",
        method: "POST",
        data,
      }),
    }),
    acceptRole: builder.mutation<{}, AcceptRoleRequestBody>({
      query: (data) => ({
        url: "/api/FRole/acceptrole",
        method: "POST",
        data,
      }),
    }),
    fetchRoleListForSelect: builder.query<
      ListResponse<RoleList>,
      Nullable<{ filter: string }> | void
    >({
      query: () => ({
        url: "/api/FRole/list2",
        method: "POST",
        data: {},
      }),
    }),
    fetchUsersByRoleId: builder.mutation<UserByRoleIdResponse[], { id: number }>({
      query: (data) => ({
        url: "/api/FRole/getUsersByRole",
        method: "POST",
        data,
      }),
    }),
    fetchModulesForAccess: builder.query<
      IUpdateRoleAccessModule["modulAccess"],
      void
    >({
      query: () => ({
        url: "/api/userprofile/moduls/getForAccess",
        method: "GET",
        data: {},
      }),
    }),

    userTaskList: builder.mutation<any, IUserTaskList>({
      query: (data) => ({
        url: "/api/userprofile/userTask/list",
        method: "POST",
        data,
      }),
    }),
    createTask: builder.mutation<any, ICreateTask>({
      query: (data) => ({
        url: "/api/userprofile/userTask/create",
        method: "POST",
        data,
      }),
    }),
    updateTask: builder.mutation<any, ICreateTask>({
      query: (data) => ({
        url: "/api/userprofile/userTask/update",
        method: "POST",
        data,
      }),
    }),
    deleteTask: builder.mutation<any, { id: number }>({
      query: (data) => ({
        url: "/api/userprofile/userTask/delete",
        method: "POST",
        data,
      }),
    }),
    updateProfile: builder.mutation<any, IUpdateProfile>({
      query: (data) => ({
        url: "/api/userprofile/updateProfile",
        method: "POST",
        data,
      }),
    }),
    deleteUserSign: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/userprofile/deleteUserSign",
        method: "POST",
        data,
      }),
    }),
    getTaskById: builder.mutation<any, any>({
      query: (id) => ({
        url: `/api/userprofile/userTask/get/${id}`,
      }),
    }),
    changePassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/user/changePassword",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useFetchRoleListQuery,
  useFetchRoleByIDQuery,
  useLazyFetchRoleByIDQuery,
  useFetchRolesQuery,
  useLazyFetchRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleByIDMutation,
  useUpdateRoleAccessMutation,
  useAcceptRoleMutation,
  useFetchRoleListForSelectQuery,
  useFetchUsersByRoleIdMutation,
  useUpdateRoleAccessModuleMutation,
  useFetchModulesForAccessQuery,
  useGetRoleByIDMutation,
  useUserTaskListMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateProfileMutation,
  useDeleteUserSignMutation,
  useGetTaskByIdMutation,
  useChangePasswordMutation,
} = rolesApi;
