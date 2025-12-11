import { ChangeEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  LinearProgress,
  Pagination,
  TextField,
  Toolbar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  GridSelectionModel,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Card, ListIcon , FileAddIcon, Loading } from "@ui";
import { useLocation, useNavigate } from "react-router";
import { getStatusName, ACTIVITY_STATUSES , newDateFormat } from "@utils";

import {
  useLazyFetchActivitySearchQuery,
  IActivitySearchRequestBody,
  IActivitySearchResult,
} from "@services/activityApi";
import { Link } from "react-router-dom";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Заголовок",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "responsible",
    headerName: "Ответственный",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "startDate",
    headerName: "Начало",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "endDate",
    headerName: "Завершение",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (row: any) => getStatusName(row.value, "activity"),
  },
];

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
};

const Registry = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<Nullable<IActivitySearchRequestBody>>({
    filtres: {
      state: null,
    },
  });

  const [items, setItems] = useState<IActivitySearchResult[]>();
  const [totalItems, setTotalitems] = useState(0);

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchActivitySearchQuery();

  const fetchData = async (
    args: Nullable<IActivitySearchRequestBody> | void
  ) => {
    const { data } = await fetchIncomingLetters(args);
    setItems(data?.items);
    setTotalitems(data?.total || 0);
  };

  const search = () => {
    setPage(1);
    fetchData({ pageInfo: { pageNumber: 1 }, ...filters });
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page }, ...filters });
  }, [page]);

  const handleFilters = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      filtres: { [event?.target?.name]: event?.target?.value },
    });
  };

  return (
    <Card title="Реестр активностей">
      <div className="tw-py-4">
        <Toolbar className="tw-bg-white tw-rounded-lg tw-border tw-py-4 tw-mb-4">
          <div className="tw-w-full tw-grid tw-grid-flow-col tw-auto-cols-fr tw-gap-4">
            <Link to={`${pathname}/create`}>
              <Button
                startIcon={
                  <FileAddIcon
                    width="18px"
                    height="18px"
                    fill="currentColor"
                    stroke="none"
                  />
                }
              >
                Добавить
              </Button>
            </Link>
            <TextField
              label="Ответственный"
              size="small"
              name="incomeNumber"
              value={filters?.filtres?.responsible}
            />

            <DatePicker
              label="Начало"
              inputFormat={newDateFormat}
              value={filters?.filtres?.startDate}
              onChange={(docDate) => {
                setFilters({
                  filtres: { ...filters.filtres, startDate: docDate },
                });
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />

            <DatePicker
              label="Завершение"
              inputFormat={newDateFormat}
              value={filters?.filtres?.endDate}
              onChange={(docDate) => {
                setFilters({
                  filtres: { ...filters.filtres, endDate: docDate },
                });
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />

            <Autocomplete
              disablePortal
              options={ACTIVITY_STATUSES}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                setFilters({
                  filtres: { ...filters.filtres, state: value?.id },
                });
              }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} name="state" label="Статус" />
              )}
            />
            <Button
              startIcon={
                isFetching ? (
                  <Loading />
                ) : (
                  <ListIcon
                    width="18px"
                    height="18px"
                    fill="currentColor"
                    stroke="none"
                  />
                )
              }
              disabled={isFetching}
              onClick={search}
            >
              Список
            </Button>
          </div>
        </Toolbar>
        <DataGrid
          classes={{
            root: "tw-bg-white !tw-rounded-lg",
            row: "tw-cursor-pointer",
          }}
          checkboxSelection
          columns={columns}
          rows={items || []}
          selectionModel={selectedRows}
          loading={isFetching}
          autoHeight
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          hideFooterSelectedRowCount
          initialState={{
            pagination: {
              page: 1,
              pageSize: 10,
            },
          }}
          pagination
          paginationMode="server"
          rowCount={totalItems}
          rowsPerPageOptions={[10]}
          components={{
            LoadingOverlay: LinearProgress,
            Pagination: CustomPagination,
          }}
          onPageChange={(page) => {
            setPage(page);
          }}
          onRowClick={(params) => {
            navigate(`/modules/latters/activity/show/${params.id}`);
          }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectedRows(newSelectionModel);
          }}
        />
      </div>
    </Card>
  );
};

export default Registry;
