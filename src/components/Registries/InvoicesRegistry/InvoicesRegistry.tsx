import {
  Card,
  ListIcon,
  DataTable,
  FileAddIcon,
  Loading,
  CustomTextField,
} from "@ui";
import { InvoiceStatus } from "../../EDO/Status/Status";
import { GridColDef } from "@mui/x-data-grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  IInvoicesRequestBody,
  IInvoicesRequestSearch,
  useLazyFetchInvoicesQuery,
} from "../../../services/invoiceApi";
import {
  useFetchRecieversQuery,
  useFetchSuppliersQuery,
} from "../../../services/userprofileApi";
import { newDateFormat, formatDate } from "@utils";
import { usePagination } from "@hooks";

const sts = InvoiceStatus();

const SetStatusName = (id: number) => {
  let toAdd = sts.find((b) => b.id === id);
  return { id: id, name: toAdd?.name || "" };
};

const columns: GridColDef[] = [
  {
    field: "docNo",
    headerName: "№",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "docDate",
    headerName: "Дата договора",
    flex: 3,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
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
    field: "receiver",
    headerName: "Получатель",
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
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    valueFormatter: (params) => {
      return SetStatusName(params.value).name;
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
  const [items, setItems] = useState<Invoices.InvoiceShort[]>();
  const receiversQuery = useFetchRecieversQuery();
  const suppliersQuery = useFetchSuppliersQuery();

  const [fetchInvoices, { isFetching }] = useLazyFetchInvoicesQuery();

  const [filters, setFilters] = useState<Nullable<IInvoicesRequestSearch>>({
    receiver: null,
    supplier: null,
    state: null,
    summa: null,
  });

  const fetchData = async (args: Nullable<IInvoicesRequestBody>) => {
    const { data } = await fetchInvoices({
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
    <Card title="Реестр счёт-фактур">
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата"
                inputFormat={newDateFormat}
                value={Date.now()}
                onChange={(newValue) => {}}
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
                  receiver: value?.info.id || "",
                });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Получатель" />
              )}
            />
            <Autocomplete
              disablePortal
              options={
                suppliersQuery.isSuccess ? suppliersQuery.data.items : []
              }
              getOptionLabel={(option) => option.info.value as string}
              onChange={(event, value) => {
                setFilters({
                  ...filters,
                  supplier: value?.info.id || "",
                });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Поставщик" />
              )}
            />
            <TextField
              label="Сумма"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              size="small"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...filters,
                  summa: Number(event.target.value),
                });
              }}
            />
            <Autocomplete
              disablePortal
              options={sts}
              getOptionLabel={(option) => option.name}
              value={SetStatusName(filters?.state || 0)}
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
          pushUri="/modules/source-documents/invoices/show"
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
