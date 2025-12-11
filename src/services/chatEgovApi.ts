import { api, IUserWithAvatar } from './api'

export interface IChatMessage {
  id: number
  parentId?: number
  parentShortMessage?: string
  text: string
  date: string
  showAcceptButton?: boolean
  canEdit: boolean
  sign64?: string
  userId?: number
  parentName?: string
  files?: string[]
  createAt: string
  updateAt: string
}

export interface IChatMessages {
  date: string
  messages: IChatMessage[]
}

export interface IChatOpenRequest {
  id: number
  docType: number
  clientChat?: boolean
  timestamp: string
}

export interface IChatResponse {
  id: number
  state: number
  canSendMessage: boolean
  files: string[]
  messages: IChatMessages[]
  users: IUserWithAvatar[]
}

export interface IChatCloseRequest {
  docId: number
  chatId: number
  messageId: number
}

export interface IChatSendRequest {
  chatId?: number
  parentId?: number
  lastId?: number
  discutionId?: any;
  text?: string
  files?: string[]
}

export interface IChatNewMessageRequest {
  chatId: number
  lastId?: number
}

export interface IChatNewMessageResponse {
  chatId: number
  lastId: number
}

export interface IChatSendResponse {
  messageId: number
  sended: boolean
  message: string
}

export interface IChatEditRequest {
  chatId: number
  id?: number
  text: string
  files: string[]
}

export interface IChatSignRequest {
  id: number
  chatId: number
}

export interface IChatSignResponse {
  sign64?: string
}

// Chat >>>

export const chatEgovApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // chat
    openChat: builder.mutation<IChatResponse, IChatOpenRequest>({
      query: (data) => ({
        url: '/api/Chat/create',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
    closeChat: builder.mutation<IChatResponse, IChatCloseRequest>({
      query: (data) => ({
        url: '/api/Chat/close',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
    getChatById: builder.mutation<IChatResponse, number>({
      query: (id) => ({
        url: `/api/Chat/get/` + id,
        method: 'GET',
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
    sendMessage: builder.mutation<IChatSendResponse, IChatSendRequest>({
      query: (data) => ({
        url: '/api/Chat/sendmessage',
        method: 'POST',
        data,
      }),
      // invalidatesTags: ['IncomingV3Chat'],
    }),
    editMessage: builder.mutation<IChatSendResponse, IChatEditRequest>({
      query: (data) => ({
        url: '/api/IncomingV3/editmessage',
        method: 'POST',
        data,
      }),
      //invalidatesTags: ['IncomingV3Chat'],
    }),
    editMessage2: builder.mutation<IChatSendResponse, IChatEditRequest>({
      query: (data) => ({
        url: '/api/chat/editmessage',
        method: 'POST',
        data,
      }),
      //invalidatesTags: ['IncomingV3Chat'],
    }),
    newMessage: builder.mutation<IChatSendResponse, IChatNewMessageRequest>({
      query: (data) => ({
        url: '/api/Chat/newmessage',
        method: 'POST',
        data,
      }),
      //invalidatesTags: ['IncomingV3Chat'],
    }),
    messageSign: builder.mutation<IChatSignResponse, IChatSignRequest>({
      query: (data) => ({
        url: '/api/Chat/messageSign',
        method: 'POST',
        data,
      }),
      //invalidatesTags: ['IncomingV3Chat'],
    }),
  }),
})

export const {
  // Chat
  useOpenChatMutation,
  useCloseChatMutation,
  useGetChatByIdMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useEditMessage2Mutation,
  useNewMessageMutation,
  useMessageSignMutation,
} = chatEgovApi
