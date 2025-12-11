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
  users: IUserWithAvatar[]
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

export interface IChatMembersResponse {
  id: string
  value: string
}

export interface IChatSignRequest {
  id: number
  chatId: number
}


export interface IChatSignResponse {
  sign64?: string
}

export interface IChatEgovFullSignRequest {
  id: number
  chatId: number
}

export interface IChatEgovFullSignResponse {
  sign?: string
}

// Chat >>>

export const chatApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // chat
    openDiscution: builder.mutation<
      IChatDiscutionResponse,
      IChatOpenDiscutionReqest
    >({
      query: (data) => ({
        url: '/api/IncomingV3/opendiscution',
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
        url: '/api/IncomingV3/closediscution',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    discution: builder.mutation<IChatDiscution2Response, IChatDiscutionRequest>(
      {
        query: (data) => ({
          url: '/api/IncomingV3/discution2',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['IncomingV3Chat'],
      }
    ),
    sendMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/IncomingV3/sendmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    editMessage: builder.mutation<IChatSendResponse, IChatEditRequest>({
      query: (data) => ({
        url: '/api/IncomingV3/editmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    newMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/IncomingV3/newmessage',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    messageSign: builder.mutation<IChatSignResponse, IChatSignRequest>({
      query: (data) => ({
        url: '/api/Chat/messageSign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    messageEgovFullSign: builder.mutation<
      IChatEgovFullSignResponse,
      IChatEgovFullSignRequest
    >({
      query: (data) => ({
        url: '/api/IncomingV3/messageSign',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['IncomingV3Chat'],
    }),
    fetchChatMembers: builder.mutation<any, { incommingId: number }>({
      query: (data) => ({
        url: '/api/IncomingV3/chat/members',
        method: 'POST',
        data,
      }),
      // providesTags: ['IncomingNew'],
    }),
  }),
})

export const {
  // Chat
  useOpenDiscutionMutation,
  useCloseDiscutionMutation,
  useDiscutionMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useNewMessageMutation,
  useMessageSignMutation,
  useMessageEgovFullSignMutation,
  useFetchChatMembersMutation,
} = chatApi
