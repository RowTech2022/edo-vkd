import { api, ListResponse, ValueId } from './api'
import { IExecutor } from './lettersNewApi'

export interface IUser extends ValueId {
  login?: string
}

export interface IModuleDetails {
  id: number
  docId: number
  state: number
  displayName: string
  type: number
  modulRoute: string
}

export interface IModuleResponse {
  id: number
  inn: string
  name: string
  displayName: string
  address: string
}

export interface IModuleBellSubItem {
  modulId: number
  subModulId: number
  subModulName: string
  count: number
  itemDetails: IModuleDetails[]
}

export interface IModuleBellItem {
  modulName: string
  modulId: number
  count: number
  subModulDetails: IModuleBellSubItem[]
}

export interface IModuleBellResponse {
  total: number
  modulDetails: IModuleBellItem[]
}

const userprofileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchSuppliers: builder.query<
      ListResponse<{ info: { id: string; value: string }; requisites: string }>,
      void
    >({
      query: () => ({
        url: '/api/userprofile/GetSupplier',
        method: 'POST',
        data: {},
      }),
    }),
    fetchRecievers: builder.query<
      ListResponse<{ info: { id: string; value: string }; requisites: string }>,
      void
    >({
      query: () => ({
        url: '/api/userprofile/GetReceiver',
        method: 'POST',
        data: {},
      }),
    }),
    fetchOrganisations: builder.query<
      ListResponse<IModuleResponse>,
      void
    >({
      query: () => ({
        url: '/api/userprofile/Organisation',
        method: 'POST',
        data: {},
      }),
    }),
    fetchMyOrganisations: builder.query<
      ListResponse<IModuleResponse>,
      void
    >({
      query: () => ({
        url: '/api/userprofile/myOrganisation',
        method: 'POST',
        data: {},
      }),
    }),
    fetchUsers: builder.query<{ items: Array<IExecutor> }, void>({
      query: () => ({
        url: '/api/userprofile/getUserLevel',
        method: 'POST',
        data: {},
      }),
    }),
    getAvailableUser: builder.mutation<{ items: IUser[] }, string>({
      query: (param: string) => ({
        url: '/api/userprofile/getAvailableUser',
        method: 'POST',
        data: {
          smart: param,
        },
      }),
    }),
    getModuleBell: builder.query<IModuleBellResponse, void>({
      query: () => ({
        url: '/api/userprofile/getModulBell',
        method: 'POST',
        data: {},
      }),
    }),

    getAvailableUserLetterV4: builder.mutation<{ items: IUser[] }, string>({
      query: (param: string) => ({
        url: '/api/userprofile/getAvailableUserForLettersV4',
        method: 'POST',
        data: {
          smart: param,
        },
      }),
    }),
  }),
})

export const {
  useFetchSuppliersQuery,
  useFetchRecieversQuery,
  useLazyFetchSuppliersQuery,
  useLazyFetchRecieversQuery,
  useFetchOrganisationsQuery,
  useFetchMyOrganisationsQuery,
  useLazyFetchMyOrganisationsQuery,
  useFetchUsersQuery,
  useGetAvailableUserMutation,
  useGetModuleBellQuery, useGetAvailableUserLetterV4Mutation
} = userprofileApi
