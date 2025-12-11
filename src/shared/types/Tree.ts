import { ExecutorColor } from '@root/components/EDO/LettersV3.5/ExternalCorrespondence/Incoming'
import { ValueId } from '@services/api'

export interface ITree {
  data: Array<Iparent>
  addRow?: any
}

export interface Iparent {
  id?: number
  title: string
  children?: Iparent[] | undefined
  addRow?: any
}

export interface IExecutorList {
  id?: number | string
  value?: string
}

export interface ITreeQueryList {
  id?: number | string
  value?: string
}

export interface IResultSend {
  id?: number | null
  executorId?: number | null
  text?: string | null
  data?: any
}

export interface IMainResultSend {
  id?: number | null
  incomingId?: number | null | undefined
  text?: string | null
}

export interface IResultApprove {
  id: number
  timestamp: string
  data?: any
}

export interface IParentApi {
  id?: number | null
  parentId?: number
  avatar?: string | null
  responsible?: {
    id: number
    value: string
  }
  type?: {
    id: number
    value: string
  } | null
  priority?: {
    id: number
    value: string
  } | null
  sign: {
    userId: number
    sign: string
  } | null
  answerComment?: string | null
  answerState?: number | null
  answerText?: string | null
  answerType?: number | null
  canSaveAnswer?: boolean
  canAnswerMain?: boolean
  canOpenDiscution?: boolean
  canApproveAnswer?: boolean
  canSaveChild?: boolean
  canApproveChild?: boolean
  canAcquainted?: boolean
  showSecretary?: boolean
  canSaveSecretary?: boolean
  canChangeSecretary?: boolean
  secretary?: ValueId
  term?: string | null
  comment?: string | null
  canAdd?: boolean
  сanAddResult?: boolean
  canEdit?: boolean
  state?: number
  execType: number
  mainParentId?: number
  color: ExecutorColor

  result: IChilsResult | null

  haveMainResult?: boolean
  canApproveMainResult?: boolean
  canSaveMainResult?: boolean
  resultMain?: IResultMainDto
  discutionId?: number | null

  childs: any[]
}

export interface IResultMainDto {
  id: number
  incomingId: number
  text: string
  state: number | null
  timestamp: string
}

export interface IChilsResult {
  canApprove: boolean
  canSave: boolean
  executorId: number | null
  id: number | null
  incomingId: number | null
  result: {
    id: number
    value: string
  } | null
  state: number
  text: string | null
  timestamp: string
}

export interface ISendTreeExecutor {
  id?: number | null
  incomingId?: number | string
  parentId?: number | string | null
  type?: number | string
  items?: Array<IParentApi>
  timestamp?: string
  operation?: number
  data?: any
}

export type ISendTreeExecutorV3 = Omit<ISendTreeExecutor, 'id'> & {
  executorId: number | null
}
