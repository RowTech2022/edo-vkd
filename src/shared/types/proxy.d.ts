declare namespace Proxies {
  interface ProxyShort {
    id: number
    docNo: string
    docDate: string
    supplier: string
    receiver: string
    contract: string
    state: number
    createdDate: string
  }
  interface Proxy {
    id: number
    state: number
    docNo: string
    date: string
    validUntil: string
    passSeries: string
    passIssued: string
    passIssuedBy: string
    fio: string
    position: UserPosition
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
    invoice: {
      id: string
      name: string
    }
    products: {
      id: number
      productId: number
      name: string
      measure: string
      count: number
      countText: string
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

  interface ProxyListItem {
    id: number
    name: string
  }
}
