declare namespace Waybills {
  interface WaybillShort {
    id: number
    docNo: string
    docDate: string
    supplier: string
    receiver: string
    contract: string
    state: number
    createdAt: string
  }
  interface Waybill {
    id: number
    state: number
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
    proxies: {
      id: number
      name: string
    }
    through: string
    letBy: string
    letDate: string
    acceptedBy: string
    acceptedDate: string
    products: {
      id: number
      productId: number
      name: string
      measure: string
      count: number
      price: number
      taxPercent: number
      taxSumma: number
      total: number
    }[]
    summa: number
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
}
