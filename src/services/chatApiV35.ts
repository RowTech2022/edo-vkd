import { api, IUserWithAvatar } from './api'

export interface IChatMessage {
  id?: number
  user: IUserWithAvatar
  sign64?: string
  text: string
  parentId?: number
  parentName?: string
  parentShortMessage?: string
  createAt?: string
  files?: string[]
  showAcceptButton?: boolean
}

export interface IChatMessage2 {
  id?: number
  userId?: number
  sign64?: string
  text: string
  parentId?: number
  parentName?: string
  parentShortMessage?: string
  createAt: string
  files?: string[]
  showAcceptButton?: boolean
}

export interface IChatMessages2 {
  date: string
  messages: any[]
}

export interface IChatUserInfo extends IUserWithAvatar {
  organistionName?: string
  positionName?: string
}

export interface IChatOpenDiscutionReqest {
  executorId: number
  incomingId: number
  letter_Type?: boolean
}

export interface IChatCloseDiscutionRequest extends IChatOpenDiscutionReqest {
  discutionId: number
}

export interface IChatDiscutionResponse {
  discutionId: number
  state: number
  files: string[]
  messages: IChatMessage[]
}

export interface IChatDiscution2Response {
  discutionId: number
  state: number
  files: string[]
  messages: IChatMessages2[]
  users: IChatUserInfo[]
}

export interface IChatDiscutionRequest {
  discutionId: number
  letterId: number
}

export interface IChatSendRequest {
  discutionId: number
  lastId?: number
  parentId?: number
  text?: string
  files?: string[]
}

export interface IChatEditRequest {
  discutionId: number
  id?: number
  text: string
  files: string[]
}

export interface IChatSendResponse {
  messageId: number
  sended: boolean
  message: string
}

export interface IChatSignRequest {
  id: number
  discutionId: number
}

export interface IChatSignResponse {
  sign64?: string
}

// Chat >>>

export const chatApiV35 = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // chat
    openDiscution: builder.mutation<
      IChatDiscutionResponse,
      IChatOpenDiscutionReqest
    >({
      query: (data) => ({
        url: '/api/Internal_emailV3/opendiscution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),

    openDiscutionInIncome: builder.mutation<
      IChatDiscutionResponse,
      IChatOpenDiscutionReqest
    >({
      query: (data) => ({
        url: '/api/incomingV3/opendiscution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    closeDiscution: builder.mutation<
      IChatDiscutionResponse,
      IChatCloseDiscutionRequest
    >({
      query: (data) => ({
        url: '/api/Internal_emailV3/closediscution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),

    closeDiscutionInIncome: builder.mutation<
      IChatDiscutionResponse,
      IChatCloseDiscutionRequest
    >({
      query: (data) => ({
        url: '/api/incomingV3/closediscution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    discution: builder.mutation<IChatDiscution2Response, IChatDiscutionRequest>(
      {
        query: (data) => ({
          url: '/api/Internal_emailV3/discution2',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['IncomingV3Chat'],
      }
    ),

    discutionInIncome: builder.mutation<IChatDiscution2Response, IChatDiscutionRequest>(
      {
        query: (data) => ({
          url: '/api/incomingV3/discution2',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['IncomingV3Chat'],
      }
    ),
    sendMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/Internal_emailV3/sendmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),

    sendMessageInIncome: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/incomingV3/sendmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    editMessage: builder.mutation<IChatSendResponse, IChatEditRequest>({
      query: (data) => ({
        url: '/api/Internal_emailV3/editmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),

    editMessageInIncome: builder.mutation<IChatSendResponse, IChatEditRequest>({
      query: (data) => ({
        url: '/api/incomingV3/editmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    newMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/Internal_emailV3/newmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),

    newMessageInIncome: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/incomingV3/newmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    signMessage: builder.mutation<IChatSignResponse, IChatSignRequest>({
      query: (data) => ({
        url: '/api/incomingV3/messageSign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    messageSignInternalChat: builder.mutation<IChatSignResponse, IChatSignRequest>({
      query: (data) => ({
        url: '/api/Internal_emailV3/messageSign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    fetchExternalIncomingV3ChatMembers: builder.mutation<any, { incommingId: number }>({
      query: (data) => ({
        url: '/api/IncomingV3/external/chat/members',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
    fetchInternalEmailV3ChatMembers: builder.mutation<any, { incommingId: number }>({
      query: (data) => ({
        url: '/api/Internal_emailV3/internal/chat/members',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
  }),
})

export const {
  // Chat
  useOpenDiscutionMutation,
  useOpenDiscutionInIncomeMutation,
  useCloseDiscutionMutation,
  useCloseDiscutionInIncomeMutation,
  useDiscutionMutation,
  useDiscutionInIncomeMutation,
  useSendMessageMutation,
  useSendMessageInIncomeMutation,
  useEditMessageMutation,
  useEditMessageInIncomeMutation,
  useNewMessageMutation,
  useNewMessageInIncomeMutation,
  useSignMessageMutation,
  useMessageSignInternalChatMutation,
  useFetchExternalIncomingV3ChatMembersMutation,
  useFetchInternalEmailV3ChatMembersMutation,
} = chatApiV35
