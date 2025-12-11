import { IServiceItem } from '@services/applicationsApi'

interface IOption {
  id: string
  value: string
}

export interface IService {
  service: IServiceItem | null
  code: string
  price: number | null
  count: number | null
  measure: string | null
  ndcSumma: number | null
  total?: number | null
}

export const initialAddServiceValues: IService = {
  service: null,
  code: '',
  price: null,
  count: null,
  measure: null,
  ndcSumma: null,
}
