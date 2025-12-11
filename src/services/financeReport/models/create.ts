import { ValueId } from '../../api'

interface IButtonSetting {
  hide: boolean
  readOnly: boolean
}

export interface IFinanceReportTransitions {
  fieldSettings: any
  buttonSettings: {
    btn_accept: IButtonSetting
    btn_back: IButtonSetting
    btn_save: IButtonSetting
    btn_sign: IButtonSetting
    btn_undo: IButtonSetting
    btn_reject: IButtonSetting
  }
  buttonInfo: any
}

export interface IFinanceReportsFile {
  id: number
  reportId: number
  url: string
  name: string
  type: number | null
  description: string
  createAt: string
  createBy: string
  loading?: boolean
}

export interface IFinanceReportDetailItem {
  id?: number
  metaDataId: number
  startSum: number
  endSum: number
}

export interface IFinanceReportsCreateRequest {
  id?: number
  timestamp?: string
  company: ValueId | null
  industry: ValueId | null
  government: ValueId | null
  ownershipType: ValueId | null
  inn: string
  accountant: string
  phone: string
  address: string
  date: string
  term: string
  measure: ValueId | null
  reportType: ValueId | null
  state?: number
  reportDetails?: {
    items: IFinanceReportDetailItem[]
  }
  files: IFinanceReportsFile[]
  transitions?: IFinanceReportTransitions
}

export interface IFinanceReporsUserVisa {
  signedBy: string
  status: number
  state: string
  setBy: string
  date: string
  reason: string
  comment: string
  sign64: string
}

export interface IFinanceReportsDocumentHistory {
  state: string
  startDate: string
  endDate: string
  comment: string
}

export interface IFinanceReportsDetailItemResponse {
  metaDataId: number
  title: string
  code: string
  startSum: number
  endSum: number
  startDependCodes: string[]
  endDependCodes: string[]
  dependCodes: string[]
  isReadOnly: boolean
  priority: number
}

export interface IFinanceReportsMetadata {
  metaDataId: number
  reportType: number
  title: string
  code: string
  startDependCodes: string[]
  endDependCodes: string[]
  dependCodes: string[]
  isReadOnly: boolean
  priority: number
}

export interface IFinanceReportsCreateResponse {
  id: number
  company: ValueId
  industry: ValueId
  government: ValueId
  ownershipType: ValueId
  inn: string
  accountant: string
  phone: string
  address: string
  date: string
  term: string
  measure: ValueId
  reportType: ValueId
  files: IFinanceReportsFile[]
  state: number
  userVisas: IFinanceReporsUserVisa[]
  documentHistories: IFinanceReportsDocumentHistory[]
  signAccountant: string
  signHead: string
  transitions: IFinanceReportTransitions
  timestamp: string
  createAt: string
  updateAt: string
  reportDetails?: {
    items: IFinanceReportsDetailItemResponse[]
  }
  reportMetaData?: IFinanceReportsMetadata[]
}
