import { ValueId } from '@services/api'
import { IEgovServicesSearch } from './types'
import { IEgovServicesSearchRequest } from '@services/egovServices'

export enum EgovApplicationStatus {
  New = 1,
  Concelyar1 = 2,
  Resolution = 3,
  Execution = 4,
  Collect = 5,
  Concelyar2 = 6,
  Done = 7,
}

export const statusOptions: ValueId[] = [
  {
    value: 'Новая',
    id: EgovApplicationStatus.New,
  },
  {
    value: 'Канцелярия',
    id: EgovApplicationStatus.Concelyar1,
  },
  {
    value: 'Резолюция',
    id: EgovApplicationStatus.Resolution,
  },
  {
    value: 'Исполнение',
    id: EgovApplicationStatus.Execution,
  },
  {
    value: 'Подготовка документов',
    id: EgovApplicationStatus.Collect,
  },
  {
    value: 'Канцелярия',
    id: EgovApplicationStatus.Concelyar2,
  },
  {
    value: 'Завершено',
    id: EgovApplicationStatus.Done,
  },
]

export const statusLabel = {
  [EgovApplicationStatus.New]: 'Новая',
  [EgovApplicationStatus.Concelyar1]: 'Канцелярия',
  [EgovApplicationStatus.Resolution]: 'Резолюция',
  [EgovApplicationStatus.Execution]: 'Исполнение',
  [EgovApplicationStatus.Collect]: 'Подготовка документов',
  [EgovApplicationStatus.Concelyar2]: 'Канцелярия',
  [EgovApplicationStatus.Done]: 'Завершено',
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
  name: ''
}
