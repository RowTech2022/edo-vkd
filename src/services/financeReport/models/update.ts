import {
  IFinanceReportsCreateRequest,
} from './create'

export interface IFinanceReportsUpdateRequest
  extends IFinanceReportsCreateRequest {
  id: number
  timestamp: string
}
