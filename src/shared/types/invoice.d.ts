declare namespace Invoices {
  interface InvoiceShort {
    id: number
    docNo: string
    docDate: string
    supplier: string
    receiver: string
    contract: string
    summa: number
    state: number
    createdAt: string
  }

  interface InvoiceTaxResponse {
      errorCode:string
      errorMessage:string
      doc: {
        Invoices:InvoiceTax
      }
    } 

    interface InvoiceTaxes {
    numberSerial: string
    numberInvoice: number
    dateInvoice: string
    innSeler: number
    ennSeler: number
    fullNameSeler: string
    innBuyer: number
    ennBuyer: string
    fullNameBuyer: string
    detail :InvoiceTaxDetails
  }

  interface InvoiceTaxDetails{
    codeProduct: string
    nameProduct: string
    qty: string
    measureType: string
    freeAmount: string
    taxableAmount: string
    exciseTaxAmount: string
    vatAmount: number
    vatPercent: string
    totalAmount: string
  }

  interface InvoiceList {
    items: InvoiceListItem[]
  }

  interface InvoiceListItem {
    id: string
    name: string
  }

  interface Invoice {
    id: number
    state: number
    serial: string
    docNo: string
    date: string
    summa: number
    invoiceTaxes:InvoiceTaxes
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
    notes: string
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
