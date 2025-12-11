import { GridColDef } from '@mui/x-data-grid'

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
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: 'createAt',
    headerName: 'Дата создания',
    flex: 2,
    sortable: false,
    filterable: false,
  },
]
