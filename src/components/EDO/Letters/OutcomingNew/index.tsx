import { useEffect, useState } from "react";
import { Button, LinearProgress, Pagination, Toolbar } from "@mui/material";
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
import { Card, ListIcon, FileAddIcon, Loading } from "@ui";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { formatDate } from "@utils";

import {
  IInternalIncomingSearchResponseBody,
  IInternalIncomingSearchRequest,
  IInternalIncomingRequestBody,
  useLazyFetchInternalIncomingLettersQuery,
} from "@services/internal/incomingApi";
import { AppRoutes } from "@configs";

const columns: GridColDef[] = [
  {
    field: "contragent",
    headerName: "Кому",
    flex: 10,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return params.value.value;
    },
  },
  {
    field: "subject",
    headerName: "Тема",
    flex: 10,
    sortable: false,
    filterable: false,
  },
  {
    field: "date",
    headerName: "Дата получения",
    flex: 8,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
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

  const [filters, setFilters] = useState<
    Nullable<IInternalIncomingSearchRequest>
  >({
    type: 1,
    smartFilter: "",
  });

  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<IInternalIncomingSearchResponseBody[]>();

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchInternalIncomingLettersQuery();

  const fetchData = async (args: Nullable<IInternalIncomingRequestBody>) => {
    const { data } = await fetchIncomingLetters({
      pageInfo: { pageNumber: page },
      ...args,
    });
    setItems(data?.items as any);
    setTotalItems(data?.total || 0);
  };

  const search = async () => {
    fetchData({ filters: filters });
  };
  const resetState = () => {
    setFilters({
      type: 1,
      smartFilter: "",
    });
    setItems([]);
    setTotalItems(0);
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page + 1 }, filters: filters });
    return resetState;
  }, [page]);

  return (
    <Card title="Реестр исходящих писем">
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
                Написать письмо
              </Button>
            </Link>
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
            navigate(
              AppRoutes.LETTERS_NEW_OUTCOMING_SHOW.replace(
                ":id",
                params.id as any
              )
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
