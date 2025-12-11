import { ValueId } from '../../../api'
import {
  IEgovDocHistory,
  IEgovFile,
  IEgovTransitions,
  IEgovUserVisa,
} from './common'

export interface IEgovApplicationCreateRequest {
  year: number
  inn: string
  nameOfTaxpayer: string
  address: string
  city: ValueId | null
  phone: string
  email: string
  acc: string
  bankName: string
  contentApp: string
  goverment: ValueId | null
  count: number
  // regUser: number
  // assignUser: number
  fio: string
  // assignerCertId: string
  // assignerApproveDate: Date | string
  // assignerCertExpirity: Date | string
  // certStartDate: Date | string
  files: IEgovFile[]
}

export interface IEgovApplicationCreateResponse {
  id: number
  year: number
  inn: string
  nameOfTaxpayer: string
  address: string
  city: ValueId
  phone: string
  email: string
  acc: string
  bankName: string
  contentApp: string
  goverment: ValueId
  count: number
  fio: string
  mainSign: {
    userId: number
    sign: string
  }
  files: IEgovFile[]
  readyFile: {
    id: number
    docId: number
    outDocNo: string
    inDocNo: string
    url: string
    name: string
    acceptedAt: Date | string
    acceptedBy: string
  }
  state: number
  transitions?: IEgovTransitions
  userVisas: IEgovUserVisa[]
  documentHistories: IEgovDocHistory[]
  createAt: Date | string
  updateAt: Date | string
  timestamp: string
}
