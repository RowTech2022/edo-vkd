declare namespace Letters {
  declare interface IncomeLetter {
    id: number
    incomeNumber: number
    outcomeNumber: number
    receivedDate: string
    state: number
  }

  interface IncomeLetterFile {
    id: number
    loading?: boolean
    incomingId?: number
    url: string
    name: string | null
    description?: string | null
    createAt?: string | null
    createDate?: string | null
    createBy?: string | null
  }

  interface Latter {
    id: number
    incomeNumber: number
    outcomeNumber: number
    receivedDate: string

    senderType: {
      id: string
      value: string
    }
    contragent: {
      id: string
      value: string
    }

    contact: string

    executor: {
      id: string
      value: string
    }
    term: string
    content1: string
    body: string

    files: IncomeLetterFile[]

    userVisas: UserVisa[]
    documentHistories: IDocumentHistory[]
    transitions: {
      fieldSettings: {}
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign: ButtonSettings
        btn_sendtosign: ButtonSettings
        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
      buttonInfo: {}
    }
    createdAt: string
    updateAt: string
    timestamp: string
  }


  /// here starts OutcomingLetter

  declare interface OutcomingLetter {
    id: number
    outcomeNumber: number
    senderDate: string
    state: number
  }

  interface OutcomeLetterFile {
    id: number
    loading?: boolean
    outcomingId?: number
    url: string
    name: string | null
    description: string | null
    createAt?: string | null
    createBy?: string | null
  }

  interface Latter {
    id: number
    incomeNumber: number
    outcomeNumber: number
    receivedDate: string

    receivedType: {
      id: string
      value: string
    }
    contragent: {
      id: string
      value: string
    }

    contact: string

    executor: {
      id: string
      value: string
    }
    term: string
    content1: string
    body: string

    files: OutcomeLetterFile[]

    userVisas: UserVisa[]
    documentHistories: IDocumentHistory[]
    transitions: {
      fieldSettings: {}
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign: ButtonSettings
        btn_sendtosign: ButtonSettings
        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
      buttonInfo: {}
    }
    createdAt: string
    updateAt: string
    timestamp: string
  }
}
