import { ValueId } from '@services/api'
import { IEgovFilters } from './types'
import { IEgovApplicationSearchRequest } from '@services/egov/application-resident/models/search'

const LAST_N_YEARS = 5

export const getYearOptions = () => {
  const currYear = new Date(Date.now()).getFullYear()

  return Array.from({ length: LAST_N_YEARS }, (v, i) => currYear - i).map(
    (item) => ({
      value: item.toString(),
      id: item,
    })
  )
}

export enum EgovApplicationStatus {
  paperwork = 1,
  registration = 2,
  resolution = 3,
  undo = 6,
  execution = 4,
  cancery = 5,
  accepted = 200,
  deleted = 100,
}

export const statusOptions: ValueId[] = [
  {
    value: 'Оформление',
    id: EgovApplicationStatus.paperwork,
  },
  {
    value: 'Регистрация',
    id: EgovApplicationStatus.registration,
  },
  {
    value: 'На резолюции',
    id: EgovApplicationStatus.resolution,
  },
  {
    value: 'На исполнении',
    id: EgovApplicationStatus.execution,
  },
  {
    value: 'Канцелярия',
    id: EgovApplicationStatus.undo,
  },
]

export const statusLabel = {
  [EgovApplicationStatus.paperwork]: 'Оформление',
  [EgovApplicationStatus.registration]: 'Регистрация',
  [EgovApplicationStatus.resolution]: 'На резолюции',
  [EgovApplicationStatus.undo]: 'Отвергнуть',
  [EgovApplicationStatus.accepted]: 'Принят',
  [EgovApplicationStatus.deleted]: 'Удалено',
  [EgovApplicationStatus.execution]: 'На испольнении',
  [EgovApplicationStatus.cancery]: 'Канцелярия',
}

export const initialRequest: Nullable<IEgovApplicationSearchRequest> = {
  ids: null,
  filters: {
    year: 0,
    inn: '',
    goverment: null,
    state: 0,
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

export const initialFilters: IEgovFilters = {
  year: null,
  inn: '',
  goverment: null,
  state: null,
}
