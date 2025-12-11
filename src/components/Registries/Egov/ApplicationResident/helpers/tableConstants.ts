import { GridColDef } from '@mui/x-data-grid'
import { EgovApplicationStatus, statusLabel } from './constants'
import { formatDate } from "@utils"

export const headerTitles: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: 'nameOfTaxpayer',
    headerName: 'Налогоплательщик',
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: 'signAt',
    headerName: 'Дата подачи',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'acceptedAt',
    headerName: 'Дата принятия',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'goverment',
    headerName: 'Государство',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return params.value?.value
    },
  },
  {
    field: 'state',
    headerName: 'Статус',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      if (!params.value) return ''
      return statusLabel[params.value as EgovApplicationStatus]
    },
  },
]
