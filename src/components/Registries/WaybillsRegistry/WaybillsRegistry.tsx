import {
  Card,
  DataTable,
  ListIcon,
  Loading,
  FileAddIcon,
  CustomTextField,
} from "@ui";
import {
  getStatusName,
  WAY_BILL_STATUSES,
  formatDate,
  newDateFormat,
} from "@utils";

import { GridColDef } from "@mui/x-data-grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  IWaybillsRequestBody,
  IWaybillsRequestSearch,
  useLazyFetchWaybillsQuery,
} from "../../../services/waybillsApi";
import { useFetchRecieversQuery } from "../../../services/userprofileApi";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "docNo",
    headerName: "№",
    flex: 3,
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
    field: "receiver",
    headerName: "Получатель",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "supplier",
    headerName: "Поставщик",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "contract",
    headerName: "Договор",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "summa",
    headerName: "Сумма",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    valueFormatter: (params) => {
      return getStatusName(params.value, "way_bill");
    },
    flex: 3,
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
  const [items, setItems] = useState<Waybills.WaybillShort[]>();
  const [filters, setFilters] = useState<Nullable<IWaybillsRequestSearch>>({
    docNo: "",
    docDate: null,
    receiver: null,
    state: null,
  });

  const receiversQuery = useFetchRecieversQuery();
  const [fetchWaybills, { isFetching }] = useLazyFetchWaybillsQuery();

  const fetchData = async (args: Nullable<IWaybillsRequestBody>) => {
    const { data } = await fetchWaybills({
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
    <Card title="Реестр накладных">
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
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
              options={
                receiversQuery.isSuccess ? receiversQuery.data.items : []
              }
              getOptionLabel={(option) => option.info.value as string}
              onChange={(event, value) => {
                setFilters({
                  ...filters,
                  receiver: value as any,
                });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Получатель" />
              )}
            />
            <Autocomplete
              disablePortal
              options={WAY_BILL_STATUSES}
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
          pushUri="/modules/source-documents/waybills/show"
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
