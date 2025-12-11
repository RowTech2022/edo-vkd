import { api } from '../../api'
import {
  IEgovApplicationCreateRequest,
  IEgovApplicationCreateResponse,
} from './models/create'
import { IEgovApplicationUpdateRequest } from './models/update'
import { IEgovResolutionRequest } from './models/resolution'
import {
  IEgovApplicationSearchRequest,
  IEgovSearchResponse,
} from './models/search'
import {
  IEgovAcceptRequest,
  IEgovCheckPaymentsRequest,
  IEgovCheckPaymentsResponse,
  IEgovSignDocRequest,
  IEgovUndoDocRequest,
} from './models/actions'
import {
  IEgovOpenDiscutionRequest,
  IEgovOpenDiscutionResponse,
  IEgovSendMessageRequest,
  IEgovSendMessageResponse,
} from './models/chat'
import { apiRoutes } from '@configs'
import { IChatSendRequest, IChatSendResponse } from 'src/services/chatEgovApi'

const egovApplicationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Finance reports create
    createEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovApplicationCreateRequest
    >({
      query: (data) => ({
        url: apiRoutes.createEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports update
    updateEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovApplicationUpdateRequest
    >({
      query: (data) => ({
        url: apiRoutes.updateEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    // Finance reports update
    sendToResolutionEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovResolutionRequest
    >({
      query: (data) => ({
        url: apiRoutes.sendToResolutionEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    // fetch list
    searchEgovApplication: builder.query<
      IEgovSearchResponse,
      Nullable<IEgovApplicationSearchRequest>
    >({
      query: (data) => ({
        url: apiRoutes.searchEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    acceptEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovAcceptRequest
    >({
      query: (data) => ({
        url: apiRoutes.acceptEgovApplication,
        data,
        method: 'POST',
      }),
    }),

    undoDocEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovUndoDocRequest
    >({
      query: (data) => ({
        url: apiRoutes.undoDocEgovApplication,
        data,
        method: 'POST',
      }),
    }),

    signDocEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      IEgovSignDocRequest
    >({
      query: (data) => ({
        url: apiRoutes.signEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    openDiscutionEgovApplication: builder.mutation<
      IEgovOpenDiscutionResponse,
      IEgovOpenDiscutionRequest
    >({
      query: (data) => ({
        url: apiRoutes.openDiscutionEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    sendMessagenEgovApplication: builder.mutation<
      IEgovSendMessageResponse,
      IEgovSendMessageRequest
    >({
      query: (data) => ({
        url: apiRoutes.sendMessageEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    editMessagenEgovApplication: builder.mutation<
      IEgovSendMessageResponse,
      IEgovSendMessageRequest
    >({
      query: (data) => ({
        url: apiRoutes.editMessageEgovApplicationResident,
        data,
        method: 'POST',
      }),
    }),

    checkPaymentsEgovApplication: builder.mutation<
      IEgovCheckPaymentsResponse,
      IEgovCheckPaymentsRequest
    >({
      query: (data) => ({
        url: apiRoutes.checkPaymentsApplication,
        data,
        method: 'POST',
      }),
    }),

    // Search finance reports
    getByIdEgovApplication: builder.mutation<
      IEgovApplicationCreateResponse,
      number
    >({
      query: (id) => ({
        url: apiRoutes.getByIdEgovApplicationResident + id,
        method: 'GET',
      }),
    }),

    getTextOfApplicationEgov: builder.query<string, void>({
      query: () => ({
        url: apiRoutes.getTextOfApplicationEgov,
        data: {},
        method: 'POST',
      }),
    }),

    newEgovMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: apiRoutes.newMessage,
        method: 'POST',
        data,
      }),
      invalidatesTags: [],
    }),
  }),
})

export const {
  useCreateEgovApplicationMutation,
  useUpdateEgovApplicationMutation,
  useGetByIdEgovApplicationMutation,
  useSearchEgovApplicationQuery,
  useAcceptEgovApplicationMutation,
  useCheckPaymentsEgovApplicationMutation,
  useOpenDiscutionEgovApplicationMutation,
  useSendMessagenEgovApplicationMutation,
  useSendToResolutionEgovApplicationMutation,
  useEditMessagenEgovApplicationMutation,
  useSignDocEgovApplicationMutation,
  useUndoDocEgovApplicationMutation,
  useGetTextOfApplicationEgovQuery,
  useNewEgovMessageMutation,
} = egovApplicationApi
