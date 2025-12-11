export interface IEgovAcceptRequest {
  id: number
  readyFile: {
    id: number
    docId: number
    outDocNo: string
    inDocNo: string
    url: string
    name: string
    acceptedAt: Date | string
    acceptedBy: string
    loading?: boolean
  }
  timestamp?: string
}

interface IEgovActionRequest {
  id: number
}

export interface IEgovSignDocRequest extends IEgovActionRequest {
  currentState: number
}

export interface IEgovUndoDocRequest extends IEgovActionRequest {
  reason: number
  comment: string
}

export interface IEgovCheckPaymentsRequest {
  doc_No: string
  doc_Date: Date | string
  doc_Summ: number
  inn: string
}

export interface IEgovCheckPaymentsResponse {
  payment_state: boolean
  message: string
}
