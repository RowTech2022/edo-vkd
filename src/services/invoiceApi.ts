import {
  api,
  ListResponse,
  IRequestOrderBy,
  IRequestPagination,
} from './api'

export interface IInvoicesRequestSearch {
  supplier?: string
  receiver?: string
  summa?: number
  state?: number
}

export interface IInvoicesRequestTaxSearch {
  requestType?: number
  inn?: string
  date_start?: string
  date_end?: string
  direction?: number
}

export interface IInvoicesRequestBody
  extends IRequestOrderBy,
  IRequestPagination {
  ids?: number[]
  filtres?: IInvoicesRequestSearch
}

export interface IInvoicesRequestTaxBody {
  filtres?: IInvoicesRequestTaxSearch
}

export interface IInvoiceSignRequestBody {
  id: number
  currentState: number
  timestamp: string
}

export interface IInvoiceRejectRequestBody {
  id: number
  reason: number
  comment: string
  timestamp: string
}

export interface InvoiceProductDTO {
  id: number
  productId: number
  name: string
  measure: string
  count: number
  price: number
  taxPercent: number
  taxSumma: number
  total: number
}

export interface IInvoiceList {
  contractIds?: number[]
}

const invoiceApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchInvoices: builder.query<
      ListResponse<Invoices.InvoiceShort>,
      Nullable<IInvoicesRequestBody> | void
    >({
      query: (data) => ({
        url: '/api/Invoice/search',
        method: 'POST',
        data: {
          pageInfo: {
            pageNumber: 1,
            pageSize: 10,
          },
          ...data,
        },
      }),
    }),
    fetchInvoicesTax: builder.query<
      ListResponse<Invoices.InvoiceTaxes>,
      Nullable<IInvoicesRequestTaxBody> | void
    >({
      query: (data) => ({
        url: '/api/General/getInvioce',
        //url: 'https://localhost:44383/api/General/getInvioce',
        method: 'POST',
        data: {
          ...data,
        }
      }),
    }),
    fetchInvoiceById: builder.query<Invoices.Invoice, number>({
      query: (id) => ({ url: `/api/Invoice/get/${id}` }),
      providesTags: ['Invoices'],
    }),

    fetchInvoiceList: builder.query<
      ListResponse<Invoices.InvoiceListItem>,
      Nullable<IInvoiceList> | void
    >({
      query: (data) => ({
        url: `/api/Invoice/list`,
        method: 'POST',
        data,
      }),
      providesTags: ['Invoices'],
    }),
    saveInvoice: builder.mutation<
      Invoices.Invoice,
      Pick<
        Nullable<Invoices.Invoice>,
        'serial' | 'docNo' | 'date' | 'contract' | 'products' | 'invoiceTaxes'
      > & { notes: string | null; summa: number | null }
    >({
      query: (data) => ({ url: '/api/Invoice/create', method: 'POST', data }),
      invalidatesTags: ['Invoices'],
    }),
    updateInvoice: builder.mutation<
      Invoices.Invoice,
      Pick<
        Nullable<Invoices.Invoice>,
        | 'id'
        | 'serial'
        | 'docNo'
        | 'date'
        | 'contract'
        | 'products'
        | 'invoiceTaxes'
        | 'timestamp'
      > & { notes: string | null; summa: number | null }
    >({
      query: (data) => ({ url: '/api/Invoice/update', method: 'POST', data }),
      invalidatesTags: ['Invoices'],
    }),
    signInvoice: builder.mutation<Invoices.Invoice, IInvoiceSignRequestBody>({
      query: (data) => ({ url: '/api/Invoice/sign', method: 'POST', data }),
      invalidatesTags: ['Invoices'],
    }),
    rejectInvoice: builder.mutation<
      Invoices.Invoice,
      IInvoiceRejectRequestBody
    >({
      query: (data) => ({
        url: '/api/Invoice/undoDocument',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Invoices'],
    }),
  }),
})

export const {
  //useFetchInvoicesQuery,
  useLazyFetchInvoicesQuery,
  useFetchInvoicesTaxQuery,
  useLazyFetchInvoicesTaxQuery,
  useFetchInvoiceByIdQuery,
  useLazyFetchInvoiceListQuery,
  useSaveInvoiceMutation,
  useUpdateInvoiceMutation,
  useSignInvoiceMutation,
  useRejectInvoiceMutation,
} = invoiceApi
