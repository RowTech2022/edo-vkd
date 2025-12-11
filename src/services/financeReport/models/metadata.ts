export interface IMetaData {
  id: number
  reportType: number
  title: string
  code: string
  startDependCodes: string[]
  endDependCodes: string[]
  dependCodes: string[]
  isReadOnly: boolean
  startSum: number
  endSum: number
  uc?: number
  dc?: number
  rc?: number
  nlp?: number
  da?: number
  dm?: number
  total?: number
}

export interface IMetaInfo {
  reportInfo: Record<number, IMetaData[]>
}
