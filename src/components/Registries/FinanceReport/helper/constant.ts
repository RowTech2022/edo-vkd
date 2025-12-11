import { GridColDef } from '@mui/x-data-grid'
import { getStatusName, formatDate } from '@utils'

export const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: 'company',
    headerName: 'Предприятие',
    valueFormatter: (params) => params.value.value,
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: 'date',
    headerName: 'Дата представления',
    flex: 3,
    valueFormatter: (params) => {
      return formatDate(params.value)
    },
    sortable: false,
    filterable: false,
  },
  {
    field: 'term',
    headerName: 'Срок',
    flex: 3,
    valueFormatter: (params) => {
      return formatDate(params.value)
    },
    sortable: false,
    filterable: false,
  },
  {
    field: 'industry',
    headerName: 'Отрасль',
    flex: 3,
    valueFormatter: (params) => params.value.value,
    sortable: false,
    filterable: false,
  },
  {
    field: 'ownershipType',
    headerName: 'Форма собственности',
    valueFormatter: (params) => {
      return params.value.value
    },
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: 'reportType',
    headerName: 'Вид отчета',
    valueFormatter: (params) => {
      return params.value.value
    },
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: 'state',
    headerName: 'Статус',
    valueFormatter: (params) => {
      return getStatusName(params.value, 'fin_report')
    },
    flex: 3,
    sortable: false,
    filterable: false,
  },
]

export const financeReportStatuses = [
  {
    value: 1,
    label: 'Подготовка',
  },
  {
    value: 2,
    label: 'Утверждение',
  },
  {
    value: 3,
    label: 'На расмотрении',
  },
  {
    value: 4,
    label: 'Отвергнуто',
  },
  {
    value: 200,
    label: 'Принято',
  },
]
