import { IEgovApplicationCreateRequest } from './create'

export interface IEgovApplicationUpdateRequest
  extends IEgovApplicationCreateRequest {
  id: number
  timestamp?: string
}
