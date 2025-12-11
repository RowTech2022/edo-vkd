export interface IFinanceReportsSignRequest {
  id: number
  timestamp: string
}

export interface IFinanceReportsUndoDocumentRequest {
  id: number
  reason: number
  comment: string
  operation: number
  timestamp: string
}

export interface IFinanceReportsAcceptRequest {
  id: number
  timestamp: string
}
