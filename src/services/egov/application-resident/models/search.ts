import { ListResponse, ValueId } from '../../../api'

export interface IEgovApplicationSearchRequest {
  ids: number[]
  filters: {
    year: number
    inn: string
    goverment: ValueId | null
    state: number | null
  }
  orderBy: {
    column: number
    order: number
  }
  pageInfo: {
    pageNumber: number
    pageSize: number
  }
}

export interface IEgovApplicationSearchItem {
  id: number
  year: number
  inn: string
  nameOfTaxpayer: string
  taxpayer: ValueId
  goverment: ValueId
  acceptedAt: Date | string
  signAt: Date | string
  state: number
}

export type IEgovSearchResponse = ListResponse<IEgovApplicationSearchItem>
