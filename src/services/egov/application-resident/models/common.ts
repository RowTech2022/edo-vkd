import { ValueId } from '../../../api'

export interface IEgovFile {
  id: number
  docId: number
  url: string
  name: string
  typeId: number
  createAt: Date
  createBy: string
  docType: ValueId
  loading?: boolean
}

export interface IEgovUserVisa {
  signedBy: string
  status: 0
  state: string
  setBy: string
  date: Date
  reason: string
  comment: string
  sign64: string
}

export interface IEgovDocHistory {
  state: string
  startDate: Date
  endDate: Date
  comment: string
}

export interface IEgovTransitions {
  fieldSettings: any
  buttonSettings: {
    btn_accept: IButtonSetting
    btn_back?: IButtonSetting
    btn_save?: IButtonSetting
    btn_sign?: IButtonSetting
    btn_undo?: IButtonSetting
    btn_ready_file?: IButtonSetting
    btn_file?: IButtonSetting
    btn_resolution?: IButtonSetting
    openChat?: IButtonSetting
    openDiscussion?: IButtonSetting
  }
  buttonInfo: any
}
