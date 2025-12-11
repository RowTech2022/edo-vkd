import { useEffect, useState } from "react";
import { Autocomplete, Button, TextField, Toolbar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import { Card, DataTable, ListIcon, FileAddIcon, Loading } from "@ui";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import {
  getStatusName,
  INCOMMING_STATUSES,
  formatDate,
  newDateFormat,
  sliceEnd,
} from "@utils";

import {
  IncomingNewLettersDTO,
  IIncomingNewRequestBody,
  IIncomingNewRequestSearch,
  useLazyFetchIncomingNewLettersQuery,
} from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import { AppRoutes } from "@configs";

const columns: GridColDef[] = [
  {
    field: "incomeNumber",
    headerName: "№",
    flex: 0.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "contragent",
    headerName: "Отправитель",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "header",
    headerName: "Заголовок",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "receivedDate",
    headerName: "Дата получения",
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
  },
  {
    field: "outComingId",
    headerName: "Исх.Номер",
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
    valueFormatter: (row: any) => getStatusName(row.value, "income"),
  },
];

type Props = {
  isIncoming?: boolean;
};

const Registry = (props: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<IncomingNewLettersDTO[]>();

  const [filters, setFilters] = useState<Nullable<IIncomingNewRequestSearch>>({
    incomeNumber: null,
    state: null,
    isIncoming: props.isIncoming,
    receivedDate: null,
    contragent: null,
  });

  const contragents = useFetchContragentQuery({});

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchIncomingNewLettersQuery();

  const fetchData = async (args: Nullable<IIncomingNewRequestBody>) => {
    const { data } = await fetchIncomingLetters({
      pageInfo: { pageNumber: page },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = async () => {
    fetchData({ filters: filters });
  };
  const resetState = () => {
    setFilters({});
    setItems([]);
    setTotalItems(0);
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page + 1 }, filters: filters });
    return resetState;
  }, [page]);

  return (
    <Card
      title={props.isIncoming ? "Реестр входящих писем" : "Реестр испольнении"}
    >
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
              label="№"
              size="small"
              name="incomeNumber"
              onChange={(event) => {
                setFilters({
                  ...filters,
                  incomeNumber: event.target.value,
                });
              }}
            />

            <DatePicker
              label="Дата получения"
              inputFormat={newDateFormat}
              value={filters.receivedDate}
              onChange={(docDate) => {
                setFilters({
                  ...filters,
                  receivedDate: docDate,
                });
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <Autocomplete
              disablePortal
              options={contragents.isSuccess ? contragents.data.items : []}
              size="small"
              getOptionLabel={(option) => option.value as string}
              renderInput={(params) => (
                <TextField {...params} label="Контрагент" />
              )}
              onChange={(_, value) => {
                setFilters({
                  ...filters,
                  contragent: {
                    id: value?.id?.toString() || "",
                    value: value?.value || "",
                  },
                });
              }}
            />

            <Autocomplete
              disablePortal
              options={INCOMMING_STATUSES}
              getOptionLabel={(option) => option.name}
              size="small"
              renderInput={(params) => (
                <TextField {...params} name="state" label="Статус" />
              )}
              onChange={(_, value) => {
                setFilters({
                  ...filters,
                  state: value?.id,
                });
              }}
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
        <DataTable
          pushUri={sliceEnd(
            props.isIncoming
              ? AppRoutes.LETTERS_COR_INCOMING_SHOW
              : AppRoutes.LETTERS_COR_EXECUTION_SHOW,
            4
          )}
          columns={columns}
          items={items}
          isLoading={isFetching}
          page={page}
          setPage={setPage}
          totalItems={totalItems}
        />
      </div>
    </Card>
  );
};

export default Registry;
