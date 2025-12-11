import { api, IRequestOrderBy, IRequestPagination, ListResponse } from "../api";

interface ValueId {
  id: string;
  value: string;
}

export interface UserSearchRequest {
  login?: string;
  name?: string;
  surName?: string;
  inn?: string;
  phone?: string;
  region?: ValueId;
  userType?: ValueId;
  status?: number;
  certification?: string;
}

export interface UserGeneral {
  name?: string;
  surName?: string;
  userName: string;
  userNameRU: string;
  patronicName?: string;
  nameEN?: string;
  surNameEN?: string;
  patronicNameEN?: string;
  login?: string;
  passWord?: string;
  imageName?: string;
  shortImage?: string;
  email?: string;
  phone?: string;
  inn?: any;
  passportNumber?: string;
}

interface UserAccess {
  role_Id?: number;
  interfaceId?: number;
  pageName?: string;
  displayName?: string;
  a1?: boolean;
  a2?: boolean;
  a3?: boolean;
}

export interface UserRole {
  id?: number;
  roleName?: string;
}

export interface RoleDetails {
  role?: UserRole;
  access?: UserAccess[];
}

export interface UserAdditional {
  createAt?: string;
  treasureCode: ValueId;
  loginTfmis?: string;
  loginAd?: string;
  userLogin?: string;
  organisation?: ValueId;
  otdel?: ValueId;
  position?: ValueId;
  status?: ValueId;
  certification?: string;
  certExpireDate?: string;
  certIssueDate?: string;
  userType?: ValueId;
  autorization?: ValueId;
  roleDetails?: RoleDetails[];
  roles?: UserRole[];
  parentUserId: any;
  parentUser: any;
}

export interface UserResponseBody {
  general?: UserGeneral;
  additional?: UserAdditional;
  id?: number;
  files?: any;
  histories?: any;
  modulAccess: {
    items: Array<{
      id?: string;
      subModulId: number;
      name: string;
      enable: boolean;
    }>;
  };
}

export interface UserCreateRequest {
  id?: number;
  general?: UserGeneral;
  additional?: UserAdditional;
  roles?: UserRole[];
  modulAccess: {
    items: Array<{
      subModulId: number;
      name: string;
      enable: boolean;
    }>;
  };
}

export interface UserUpdateRequest {}

export interface UpdateUserRequestBody extends Required<UserSearchRequest> {
  id: number;
}

export interface UserSearchRequestBody
  extends IRequestOrderBy,
    IRequestPagination {
  ids?: number[];
  filtres?: UserSearchRequest;
}

export interface UserSearchResponseBody {
  id: number;
  fio: string;
  organisation: ValueId;
  state: number;
  createdDate: string;
}

export interface AvatarBody {
  type: number;
  userId: number;
  avatar?: string;
}

export interface AvatarBody2 {
  url: string;
}

export interface NewAvatarBody2 extends AvatarBody2 {
  isSmall: boolean;
  pointX?: number;
  pointY?: number;
  radius?: number;
}

export interface AdminAvatarBody extends NewAvatarBody2 {
  userId: number;
}

export interface IAdminAvatarResponse {
  shortImage: string;
  image: string;
}

const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchUsers: builder.query<
      ListResponse<UserSearchResponseBody>,
      Nullable<UserSearchRequestBody> | void
    >({
      query: (filters) => ({
        url: "/api/user/search",
        method: "POST",
        data: { ...filters },
      }),
    }),

    fetchUserById: builder.query<UserResponseBody, number>({
      query: (id: number) => ({ url: `api/user/get/${id}` }),
    }),

    createUser: builder.mutation<{}, UserCreateRequest>({
      query: (data) => ({
        url: "/api/user/create",
        method: "POST",
        data,
      }),
    }),
    updateUser: builder.mutation<{}, UserCreateRequest>({
      query: (data) => ({
        url: "/api/user/update",
        method: "POST",
        data,
      }),
    }),
    getAvatar: builder.query<AvatarBody, {}>({
      query: (data) => ({
        url: "/api/user/getavatar",
        method: "POST",
        data,
      }),
    }),
    saveAvatar: builder.mutation<{}, AvatarBody>({
      query: (data) => ({
        url: "/api/user/saveavatar",
        method: "POST",
        data,
      }),
    }),
    saveAvatar2: builder.mutation<{}, NewAvatarBody2>({
      query: (data) => ({
        url: "/api/user/saveavatar2",
        method: "POST",
        data,
      }),
    }),
    saveAvatarAdmin: builder.mutation<IAdminAvatarResponse, AdminAvatarBody>({
      query: (data) => ({
        url: "/api/user/saveavatarAdmin",
        method: "POST",
        data,
      }),
    }),
    deleteAvatar: builder.mutation<{}, AvatarBody>({
      query: (data) => ({
        url: "/api/user/deleteAvatar",
        method: "POST",
        data,
      }),
    }),
    availableUser: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/userprofile/getAvailableUser",
        method: "POST",
        data,
      }),
    }),
    resetPasswordAdmin: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/user/resetPasswordFromAdmin",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useLazyFetchUsersQuery,
  useLazyFetchUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetAvatarQuery,
  useSaveAvatarMutation,
  useSaveAvatar2Mutation,
  useSaveAvatarAdminMutation,
  useDeleteAvatarMutation,
  useAvailableUserMutation,
  useResetPasswordAdminMutation
} = userApi;
