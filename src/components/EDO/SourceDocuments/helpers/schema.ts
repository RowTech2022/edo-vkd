// Actlist
export const actListInitialValues: Pick<
    Nullable<Act.Act>,
    | 'docNo'
    | 'date'
    | 'contract'
    | 'summa'
    | 'passedBy'
    | 'acceptedBy'
    | 'notes'
    | 'products'
> = {
    docNo: '',
    date: '',
    contract: null,
    summa: null,
    passedBy: '',
    acceptedBy: '',
    notes: '',
    products: null,
}

export type ActListInitialValuesType = typeof actListInitialValues;

// ContractList
export const contractListInitialValues: Pick<
    Nullable<Contracts.Contract>,
    'details' | 'mainInformation' | 'notes'
> = {
    details: {
        docNo: '',
        docDate: '',
        isTender: false,
        tender: null,
        city: null,
        term: '',
        docType: null,
    },
    mainInformation: {
        supplier: null,
        receiver: null,
        summa: 0,
    },
    notes: '',
}

export type ContractListInitialValuesType = typeof contractListInitialValues;

// InvoiceList
export const invoiceListInitialValues: Pick<
    Nullable<Invoices.Invoice>,
    'serial' | 'docNo' | 'date' | 'summa' | 'contract' | 'notes' | 'invoiceTaxes'
> = {
    serial: '',
    docNo: '',
    date: '',
    summa: 0,
    contract: null,
    notes: '',
    invoiceTaxes: null,
}

export type InvoiceListInitialValuesType = typeof invoiceListInitialValues

// ProxyList
export const proxyListInitialValues: Pick<
    Nullable<Proxies.Proxy>,
    | 'docNo'
    | 'date'
    | 'validUntil'
    | 'passIssued'
    | 'passSeries'
    | 'passIssuedBy'
    | 'fio'
    | 'position'
    | 'contract'
    | 'invoice'
> = {
    docNo: '',
    date: '',
    validUntil: '',
    passSeries: '',
    passIssued: '',
    passIssuedBy: '',
    fio: '',
    position: null,
    contract: null,
    invoice: null,
}

export type ProxyListInitialValuesType = typeof proxyListInitialValues

// TravelExpenses
export const travelExpensesInitialValues: Pick<
    Nullable<TravelExpenses.TravelExpense>,
    | 'docNo'
    | 'date'
    | 'term'
    | 'fio'
    | 'position'
    | 'passSeries'
    | 'passIssued'
    | 'passIssuedBy'
    | 'organisation'
    | 'destination'
    | 'purpose'
    | 'files'
> = {
    docNo: '',
    date: '',
    term: null,
    fio: '',
    position: null,
    passSeries: '',
    passIssued: '',
    passIssuedBy: '',
    organisation: null,
    destination: '',
    purpose: '',
    files: null,
}

export type TravelExpensesInitialValuesType = typeof travelExpensesInitialValues;

// Waybill
export const waybillInitialValues: Pick<
    Nullable<Waybills.Waybill>,
    | 'docNo'
    | 'date'
    | 'contract'
    | 'proxies'
    | 'through'
    | 'letBy'
    | 'letDate'
    | 'acceptedBy'
    | 'acceptedDate'
    | 'summa'
> = {
    docNo: '',
    date: '',
    contract: null,
    proxies: null,
    through: '',
    letBy: '',
    letDate: '',
    acceptedBy: '',
    acceptedDate: '',
    summa: 0,
}

export type WaybillInitialValuesType = typeof waybillInitialValues;