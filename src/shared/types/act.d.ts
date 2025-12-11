declare namespace Act {
  interface ActShort {
    id: number
    docNo: string
    docDate: string
    supplier: string
    receiver: string
    contract: string
    state: number
    createdDate: string
  }
  interface Act {
    id: number
    docNo: string
    date: string
    contract: {
      id: number
      docNo: string
      docDate: date
      summa: number
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
    summa: number
    passedBy:string
    acceptedBy:string
    notes:string
    state:number
    products: {
      id: number
      productId: number
      name: string
      measure: string
      count: number
      price: number
      total: number
    }[]
    userVisas: UserVisa[]
    documentHistories: IDocumentHistory[]
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
    createdAt: string
    updateAt: string
    timestamp: string
  }

  interface ActListItem {
    id: number
    name: string
  }
}
