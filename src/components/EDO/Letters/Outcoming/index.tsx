import { ChangeEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  LinearProgress,
  Pagination,
  TextField,
  Toolbar,
} from "@mui/material";
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
import { Card, ListIcon, Loading } from "@ui";
import { useNavigate } from "react-router";
import {
  getStatusName,
  OUTCOME_STATUSES,
  formatDate,
  newDateFormat,
} from "@utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  useLazyFetchOutcomingLettersQuery,
  IOutcomingRequestBody,
  ISearchResponse,
} from "@services/outcomingApi";
import { AppRoutes } from "@configs";

const columns: GridColDef[] = [
  {
    field: "outcomeNumber",
    headerName: "№",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "senderDate",
    headerName: "Дата отправления",
    flex: 1,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
  },
  {
    field: "contragent",
    headerName: "Контрагент",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "executor",
    headerName: "Подготовил",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 1,
    sortable: false,
    filterable: false,
    valueFormatter: (row: any) => getStatusName(row.value, "outcome"),
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

  const [page, setPage] = useState(1);

  const [currentFilters, setFilters] = useState<
    Nullable<IOutcomingRequestBody>
  >({
    filters: {},
  });

  const [items, setItems] = useState<ISearchResponse[]>();
  const [totalItems, setTotalitems] = useState(0);

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchOutcomingLetters, { isFetching }] =
    useLazyFetchOutcomingLettersQuery();

  const fetchData = async (args: Nullable<IOutcomingRequestBody> | void) => {
    const { data } = await fetchOutcomingLetters(args);
    setItems(data?.items);
    setTotalitems(data?.total || 0);
  };

  const search = () => {
    setPage(1);
    fetchData({ pageInfo: { pageNumber: 1 }, ...currentFilters });
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page }, ...currentFilters });
  }, [page]);

  const handleFilters = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...currentFilters,
      filters: {
        [event?.target?.name]: event?.target?.value,
      },
    });
  };

  return (
    <Card title="Реестр исходящих писем">
      <div className="tw-py-4">
        <Toolbar className="tw-bg-white tw-rounded-lg tw-border tw-py-4 tw-mb-4">
          <div className="tw-w-full tw-grid tw-grid-flow-col tw-auto-cols-fr tw-gap-4">
            <TextField
              label="№"
              size="small"
              name="outcomeNumber"
              onChange={handleFilters}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата отправления"
                inputFormat={newDateFormat}
                value={currentFilters.filters?.senderDate}
                onChange={(newValue) => {
                  setFilters({
                    ...currentFilters,
                    filters: {
                      outcomeNumber: currentFilters.filters?.outcomeNumber,
                      contragent: currentFilters.filters?.contragent,
                      state: currentFilters.filters?.state,
                      senderDate: newValue,
                    },
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              disablePortal
              options={[]}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Контрагент" />
              )}
            />
            <Autocomplete
              disablePortal
              options={OUTCOME_STATUSES}
              getOptionLabel={(option) => option.name}
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
            root: "!tw-rounded-lg, tw-bg-white",
            row: "tw-cursor-pointer",
          }}
          getRowClassName={(params) => "even"}
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
            navigate(
              AppRoutes.LETTERS_OUTCOMING_SHOW.replace(":id", params?.id as any)
            );
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
