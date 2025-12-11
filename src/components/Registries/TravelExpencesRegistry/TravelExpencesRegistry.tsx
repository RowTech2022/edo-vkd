import {
  Card,
  DataTable,
  ListIcon,
  Loading,
  FileAddIcon,
  CustomTextField,
} from "@ui";
import { GridColDef } from "@mui/x-data-grid";
import {
  getStatusName,
  TRAVEL_STATUSES,
  formatDate,
  newDateFormat,
} from "@utils";
import { Autocomplete, Button, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router";
import { useFetchOrganisationsQuery } from "@services/userprofileApi";

import {
  ITravelExpensesRequestBody,
  ITravelExpensesRequestSearch,
  useLazyFetchTravelExpensesQuery,
} from "../../../services/travelExpensesApi";
import { useFetchYearsQuery } from "@services/generalApi";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "№",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "date",
    headerName: "Дата",
    flex: 3,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
    sortable: false,
    filterable: false,
  },
  {
    field: "organisation",
    headerName: "Организация",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "employee",
    headerName: "Сотрудник",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    valueFormatter: (params) => {
      return getStatusName(params.value, "travel");
    },
    flex: 2,
    sortable: false,
    filterable: false,
  },
];

const Registry = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<TravelExpenses.TravelExpenseShort[]>();
  const yearsQuery = useFetchYearsQuery();

  const orgList = useFetchOrganisationsQuery().data?.items.map((el) => {
    return {
      id: el.id.toString(),
      value: el.displayName,
    };
  });

  const [filters, setFilters] = useState<
    Nullable<ITravelExpensesRequestSearch>
  >({
    docNo: "",
    docDate: null,
    organisation: null,
    state: null,
  });

  const [fetchTravelExpenses, { isFetching }] =
    useLazyFetchTravelExpensesQuery();

  const fetchData = async (args: Nullable<ITravelExpensesRequestBody>) => {
    const { data } = await fetchTravelExpenses({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = async () => {
    fetchData({ filtres: filters });
  };
  const resetState = () => {
    setFilters({});
    setItems([]);
    setTotalItems(0);
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filtres: filters,
    });
    return resetState;
  }, [page, pageSize]);

  return (
    <Card title="Реестр командировочных расходов">
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-cols-[120px] tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
            <Autocomplete
              disablePortal
              options={yearsQuery.isSuccess ? yearsQuery.data : []}
              getOptionLabel={(option) => option.toString()}
              value={filters.year}
              onChange={(event, value) => {
                setFilters({ ...filters, year: value });
              }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Год" />}
            />
            <TextField
              label="№"
              size="small"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...filters,
                  docNo: event.target.value,
                });
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата"
                inputFormat={newDateFormat}
                value={filters.docDate || null}
                onChange={(newValue) => {
                  setFilters({
                    ...filters,
                    docDate: newValue,
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              options={orgList || []}
              getOptionLabel={(option) => option.value as string}
              value={filters.organisation}
              onChange={(event, value) => {
                setFilters({
                  ...filters,
                  organisation: value,
                });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Организация" />
              )}
            />
            <Autocomplete
              disablePortal
              options={TRAVEL_STATUSES}
              getOptionLabel={(option) => option.name.toString()}
              onChange={(event, value) => {
                setFilters({
                  ...filters,
                  state: value?.id,
                });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Статус" />
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
          <Link to={`${pathname}/create`}>
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
          pushUri="/modules/source-documents/travel-expenses/show"
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
