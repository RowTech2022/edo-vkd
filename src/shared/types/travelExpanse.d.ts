declare namespace TravelExpenses {
  interface TravelExpenseShort {
    id: number
    docNo: string
    date: string
    organisation: string
    employee: string
    state: number
    createdDate: string
  }

  interface ITravelFile {
    id: number
    loading?: boolean
    name: string | null
    url: string
    description: string | null
    typeDocument?: {
      id: string | null | undefined
      value: string | null | undefined
    } | null
    createDate?: string | null
    createBy: string
  }

  interface TravelExpense {
    id: number
    state: number
    docNo: string
    date: string
    term: number
    fio: string
    position: {
      id: string
      value: string
    }
    passSeries: string
    passIssued: string
    passIssuedBy: string
    organisation: {
      id: string
      value: string
    }
    destination: string
    purpose: string
    files: ITravelFile[] | null
    transitions: {
      fieldSettings: {}
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign: ButtonSettings
        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
      buttonInfo: {}
    }
    userVisas: UserVisa[]
    documentHistories: IDocumentHistory[]
    createdDate: string
    updateDate: string
    timestamp: string
  }
}
