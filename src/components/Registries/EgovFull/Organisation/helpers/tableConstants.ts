import { GridColDef } from '@mui/x-data-grid'
import { getStatusName , formatDate } from "@utils"

export const headerTitles: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: 'name',
    headerName: 'Наименования',
    flex: 4,
    sortable: false,
    filterable: false,
  },
  {
    field: 'createAt',
    headerName: 'Дата создания',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return formatDate(params.value)
    },
  },
  {
    field: 'state',
    headerName: 'Состояние',
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (row: any) => getStatusName(row.value, 'egov_full_services'),
  },
]
