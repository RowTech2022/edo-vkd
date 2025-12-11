import { ValueId } from '@services/api'
import { IEgovServicesSearch } from './types'
import { IEgovServicesSearchRequest } from '@services/egovServices'

export enum EgovServiceApplicationStatus {
  New = 1,
  Approved = 2,
}

export const statusOptions: ValueId[] = [
  {
    value: 'Новая',
    id: EgovServiceApplicationStatus.New,
  },
  {
    value: 'Утвержденная',
    id: EgovServiceApplicationStatus.Approved,
  },
]

export const statusLabel = {
  [EgovServiceApplicationStatus.New]: 'Новая',
  [EgovServiceApplicationStatus.Approved]: 'Утвержденная',
}

export const initialRequest: Nullable<IEgovServicesSearchRequest> = {
  ids: null,
  filters: {
    organisationId: 0,
    name: null,
  },
  orderBy: {
    column: 1,
    order: 1,
  },
  pageInfo: {
    pageNumber: 1,
    pageSize: 15,
  },
}

export const initialFilters: IEgovServicesSearch = {
  organisationId: 0,
  name: '',
}
