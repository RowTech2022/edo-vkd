declare namespace Contracts {
  interface Details {
    docNo: string
    docDate: string
    isTender: boolean
    tender: {
      id: string
      value: string
    }
    city: {
      id: string
      value: string
    }
    term: string
    docType: {
      id: string
      value: string
    }
  }

  interface MainInformation extends ContractContragentInfo {
    summa: number
  }

  interface ContractList extends ContractContragentInfo {
    id: number
    docNo: string
    docDate: date
    summa: number
  }

  interface ContractContragentInfo {
    supplier: {
      info: {
        id: string
        value: string
      }
      requisites: string
    }
    receiver: {
      info: {
        id: string
        value: string
      }
      requisites: string
    }
  }

  interface ContractShort {
    id: number
    docNo: string
    docDate: string
    supplier: string
    receiver: string
    term: string
    summa: number
    state: number
    createdDate: string
  }

  interface ContactFile {
    id: number
    loading?: boolean
    contractId?: number
    url: string
    name: string | null
    desc?: string | null
    createAt?: string | null
    createBy?: string | null

  }

  interface Contract {
    id: number
    state: number
    details: Details
    mainInformation: MainInformation
    notes: string
    products:
      | {
          id: number
          productId: number
          name: string
          measure: string
          count: number
          price: number
          total: number
        }[]
      | null
    files: ContactFile[]
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
