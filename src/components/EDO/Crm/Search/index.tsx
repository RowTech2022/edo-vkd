import { useEffect, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import { Card, DataTable, ListIcon, FileAddIcon, Loading } from "@ui";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
  getStatusName,
  ACTIVITY_STATUSES,
  formatDate,
  newDateFormat,
} from "@utils";

import {
  useLazyFetchActivitySearchQuery,
  IActivitySearchRequestBody,
  IActivitySearchResult,
} from "@services/activityApi";
import { usePagination } from "@hooks";

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
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
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

const Registry = () => {
  const navigate = useNavigate();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [filters, setFilters] = useState<Nullable<IActivitySearchRequestBody>>({
    filtres: {
      state: null,
    },
  });

  const [items, setItems] = useState<IActivitySearchResult[]>();
  const [totalItems, setTotalitems] = useState(0);

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
    fetchData({ pageInfo: { pageNumber: page + 1, pageSize }, ...filters });
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page + 1, pageSize }, ...filters });
  }, [page]);

  return (
    <Card title="Реестр активностей">
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
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
          <Link to={""}>
            <Button
              className="tw-float-right"
              variant="contained"
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
        </div>
        <DataTable
          pushUri={"/modules/latters/activity/show/"}
          columns={columns}
          items={items}
          isLoading={isFetching}
          totalItems={totalItems}
          {...pagination}
        />
      </div>
    </Card>
  );
};

export default Registry;
