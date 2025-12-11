declare interface MfAccessForm {
  id: number
  userType: UserType
  treasureCode: TreasureCode
  inn: string
  state: number
  createdDate: string
  year: number
}

declare interface MfAccessFormFull {
  id: number
  type: number
  state: number
  userInfo: UserInfo
  access: Access
  userVisas: UserVisa[]
  documentHistories: IDocumentHistory[]
  transitions: Transitions
  createAt: string
  updateAt: string
  timestamp: string
}

declare interface MfAccess {
  pbs: PBS
  budgetVarian: PBS[]
  program: PBS[]
  seqnum: PBS[]
  dzSeqnum: PBS[]
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
