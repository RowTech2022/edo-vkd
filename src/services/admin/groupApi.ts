import { IRequestOrderBy, IRequestPagination, ListResponse, ValueId, api } from '../api'
import { AccessItem, UpdateRoleAccessRequestBody } from './rolesApi'

export interface GroupSearchRequest {
  groupType?: ValueId
  groupName?: string
  template?: ValueId
}

export interface UpdateGroupRequestBody extends Required<GroupSearchRequest> {
  id: number
}

export interface GroupSearchRequestBody extends IRequestOrderBy, IRequestPagination {
  ids?: number[]
  filtres?: GroupSearchRequest
}

interface GroupSearchResponseBody {
  createdDate: string
  groupName: string
  groupType: ValueId
  id: number
  template: ValueId
}

export interface GroupByIDResponseBody extends UpdateGroupRequestBody {
  access: AccessItem[]
}

const groupApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchGroupByID: builder.query<GroupByIDResponseBody, string | number>({
      query: (id) => ({
        url: `/api/Group/get/${id}`,
      }),
    }),
    fetchGroups: builder.query<ListResponse<GroupSearchResponseBody>, Nullable<GroupSearchRequestBody> | void>({
      query: (filters) => ({
        url: '/api/Group/search',
        method: 'POST',
        data: { ...filters },
      }),
    }),
    createGroup: builder.mutation<{}, Required<GroupSearchRequest>>({
      query: (data) => ({
        url: '/api/Group/create',
        method: 'POST',
        data,
      }),
    }),
    updateGroup: builder.mutation<{}, UpdateGroupRequestBody>({
      query: (data) => ({
        url: '/api/Group/update',
        method: 'POST',
        data,
      }),
    }),
    deleteGroupByID: builder.mutation<boolean, number>({
      query: (id) => ({
        url: '/api/Group/delete',
        method: 'POST',
        data: { id },
      }),
    }),
    updateGroupAccess: builder.mutation<{}, UpdateRoleAccessRequestBody>({
      query: (data) => ({
        url: '/api/Group/updaterole',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {
  useFetchGroupByIDQuery,
  useFetchGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupByIDMutation,
  useUpdateGroupAccessMutation,
} = groupApi
