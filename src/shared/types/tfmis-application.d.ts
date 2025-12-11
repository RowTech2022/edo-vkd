declare interface TFMISApplication {
  id: number
  pbs: {
    id: string
    value: null
  }
  treasureCode: {
    id: number
    value?: unknown
  }
  inn: string
  state: number
  createdDate: string
  year: number
}

declare interface TFMISApplicationFull {
  id: number
  type: number
  state: number
  organisation: Organisation
  userInfo: UserInfo2
  certifyingDocuments: CertifyingDocument[]
  userVisas: UserVisa[]
  documentHistories: IDocumentHistory[]
  transitions: Transitions
  createAt: string
  updateAt: string
  timestamp: string
}

declare interface CertifyingDocument {
  id: number
  name: string
  type: string
  createTs: string
  createdBy: string
  approvedDate: string
  approvedBy: string
}

declare interface Organisation {
  regUserId: number
  year: number
  treasureCode: PBSCode
  inn: string
  orgName: string
  address: string
  pbsCode: PBS
  seqnums: PBS[]
}

declare interface Transitions {
  fieldSettings: Settings
  buttonSettings: Settings
}

declare interface Settings {
  additionalProp1: AdditionalProp
  additionalProp2: AdditionalProp
  additionalProp3: AdditionalProp
}

declare interface AdditionalProp {
  readOnly: boolean
  hide: boolean
}

declare interface UserInfo2 {
  first_Fio: string
  first_Position: number
  first_Inn: string
  first_Phone: string
  first_Email: string
  second_Fio: string
  second_Position: number
  second_Inn: string
  second_Phone: string
  second_Email: string
}
