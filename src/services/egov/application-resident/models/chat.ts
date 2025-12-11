import { ValueId } from '../../../api'

export interface IEgovOpenDiscutionRequest {
  executorId?: number
  applicationResidentId: number
  discutionType: number
}

export interface IEgovSendMessageRequest {
  id?: number
  discutionId: number
  text: string
  files: string[]
}

interface IEgovMessage {
  id: number
  user: ValueId
  signInfo: {
    userId: number
    sign: string
  }
  text: string
  createAt: Date | string
  showAcceptButton: boolean
}

export interface IEgovOpenDiscutionResponse {
  discutionId: number
  state: number
  canSendMessage: boolean
  messages: IEgovMessage[]
}

export interface IEgovSendMessageResponse {
  messageId: number
  sended: boolean
  message: string
}
