import { GridColDef } from '@mui/x-data-grid'

export const organizationColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: 'orgId',
    headerName: 'Идентификатор',
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: 'orgName',
    headerName: 'Название',
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: 'orgInn',
    headerName: 'ИНН организаций',
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: 'status',
    headerName: 'Статус',
    flex: 4,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return params.value ? 'Активный' : 'Неактивный'
    },
  },
]
