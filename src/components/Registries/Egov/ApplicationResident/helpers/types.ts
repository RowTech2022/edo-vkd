import { ValueId } from '@services/api'

export type IEgovFilters = {
  year: ValueId | null
  inn: string
  goverment: ValueId | null
  state: ValueId | null
}

export type EgovFiltersKey = keyof IEgovFilters
