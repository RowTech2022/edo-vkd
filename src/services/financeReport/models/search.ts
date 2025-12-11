import { ListResponse, ValueId } from '../../api'

// FINANCE REPORT SEARCH
export interface IFinanceReportsSearchRequest {
  ids?: number[] | null
  filters: Nullable<{
    term: string
    company: ValueId
    industry: ValueId
    state: number
  }>
  orderBy: {
    column: number
    order: number
  }
  pageInfo: {
    pageNumber: number
    pageSize: number
  }
}

export interface IFinanceReportsSearchResponseItem {
  id: number
  date: string
  term: string
  company: ValueId
  industry: ValueId
  government: ValueId
  ownershipType: ValueId
  reportType: ValueId
  state: number
  createdDate: string
}

export type IFinanceReportsSearchResponse =
  ListResponse<IFinanceReportsSearchResponseItem>
