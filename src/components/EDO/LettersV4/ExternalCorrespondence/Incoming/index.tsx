import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import {
  Card,
  DataTable,
  ListIcon,
  FileAddIcon,
  Loading,
  CustomTextField,
} from "@ui";
import { Link, useLocation } from "react-router-dom";
import {
  formatDate,
  getStatusName,
  INCOMMING_STATUSES,
  newDateFormat,
} from "@utils";

import {
  IIncomingNewRequestBody,
  IIncomingNewRequestSearch,
  IncomingFolder,
  IncomingNewLettersDTO,
} from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import {
  useChangeReadFlagMutation,
  useLazyFetchIncomingLettersNewV4Query,
  useMoveToFolderLettersV4Mutation,
} from "@services/lettersApiV4";
import FoldersPanel from "./folders";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import { usePagination } from "@hooks";

type Props = {
  isIncoming?: boolean;
};

export enum ExecutorColor {
  White = 0,
  Green = 1,
  Yellow = 2,
  Red = 3,
}

const statusColor: {
  [key: number | string]: string;
} = {
  [ExecutorColor.Green]: "tw-bg-green-400",
  [ExecutorColor.Yellow]: "tw-bg-yellow-400",
  [ExecutorColor.Red]: "tw-bg-red-500",
};

const Registry = (props: Props) => {
  const { pathname, search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const param = queryParams.get("folderId");
  const folderId = param ? Number(param) : 0;
  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;
  const [params, setParams] = useState({
    filters: {
      type: 2,
      folderId,
      smartFilter: "",
    },
    pageInfo: {
      pageNumber: page + 1,
      pageSize,
    },
  });
  const [open, setOpen] = useState(false);
  const [totalItems, setTotalItems] = useState<number>(10);
  const [items, setItems] = useState<IncomingNewLettersDTO[]>();
  const [folderInfo, setFolderInfo] = useState<IncomingFolder[] | undefined>(
    []
  );

  const [filters, setFilters] = useState<Nullable<IIncomingNewRequestSearch>>({
    folderId: null,
    incomeNumber: null,
    state: null,
    isIncoming: props.isIncoming,
    receivedDate: null,
    contragent: null,
  });

  const [text, setText] = useState<string>();
  const contragents = useFetchContragentQuery({
    text,
  }).data?.items.map((el: any) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchIncomingLettersNewV4Query();

  const fetchData = async (args: Nullable<IIncomingNewRequestBody>) => {
    const { data } = await fetchIncomingLetters({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: {},
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder] = useMoveToFolderLettersV4Mutation();

  const searchData = async () => {
    setPage(0);
    fetchData({ pageInfo: { pageNumber: 1 }, filters: filters });
  };

  const onContragentInputChange = (e: any, value: string) => {
    setText(value);
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  }, [page, pageSize, filters]);

  const handleMoveToFolder = (data: any) => {
    moveToFolder(data).then(() => {});
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setFilters({
      ...filters,
      folderId: folderId > 0 ? folderId : null,
    });
    setParams((state) => ({
      ...state,
      filters: {
        ...state.filters,
        folderId,
      },
      pageInfo: {
        pageNumber: 1,
        pageSize,
      },
    }));
  }, [folderId]);

  const refetch = () => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const updateSearch = (filters: Nullable<IIncomingNewRequestSearch>) => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  const [changeReadFlag] = useChangeReadFlagMutation();

  const columns: GridColDef[] = [
    {
      field: "incomeNumber",
      headerName: "Входящий номер",
      flex: 1,
      sortable: false,
      filterable: false,
      cellClassName: "tw-relative tw-[120px]",
      renderCell: (params) => {
        const cls = params.row.isNew ? "flag" : "disabled-flag";
        return (
          <>
            <div
              className={cls}
              onClick={async (e) => {
                e.stopPropagation();
                await changeReadFlag({
                  id: params.id,
                  read: !params.row.isNew,
                });
                await refetch();
              }}
            ></div>
            <div className="tw-pl-[18px]">{params.row.incomeNumber}</div>
          </>
        );
      },
    },
    {
      field: "contragent",
      valueGetter: (params: any) => {
        return `${params.row?.contragent?.value || ""}`;
      },
      headerName: "Отправитель",
      flex: 2,
      sortable: false,
      filterable: false,
    },
    {
      field: "header",
      headerName: "Тема",
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
      field: "state",
      headerName: "Статус",
      flex: 2,
      sortable: false,
      filterable: false,
      valueFormatter: (row: any) => getStatusName(row.value, "income"),
    },
    {
      field: "term",
      headerName: "Срок",
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => {
        return params.value ? formatDate(params.value) : "";
      },
    },
  ];
  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        title={
          props.isIncoming ? "Реестр входящих писем" : "Реестр испольнении"
        }
      >
        <div className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-[1fr_130px] tw-w-full tw-gap-4 tw-mb-4">
            <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
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
                options={contragents || []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                renderInput={(params) => (
                  <CustomTextField params={params} label="Отправитель" />
                )}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.id === value.id
                }
                onChange={(_, value) => {
                  setFilters({
                    ...filters,
                    contragent: {
                      id: value?.id?.toString() || "",
                      value: value?.value || "",
                    },
                  });
                }}
                onInputChange={onContragentInputChange}
              />
              <Autocomplete
                disablePortal
                options={INCOMMING_STATUSES}
                getOptionLabel={(option) => option.name}
                size="small"
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    name="state"
                    label="Статус"
                  />
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
                onClick={searchData}
              >
                Список
              </Button>
            </div>
            <Link
              to={`${
                pathname.split("/").slice(-1)[0] === "ExternalCorrespondence"
                  ? pathname + "/corIncoming-v3.5/create"
                  : pathname + "/create"
              }`}
            >
              <Button
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
          <Stack className="tw-grid tw-grid-cols-[1fr_220px] tw-w-full tw-gap-4 tw-mb-4">
            {folderInfo && (
              <>
                <FoldersPanel
                  items={folderInfo}
                  selectedFolder={folderId}
                  moveToFolder={handleMoveToFolder}
                  refreshDataTable={refetch}
                  updateFilters={(id) => {
                    updateSearch({
                      ...filters,
                      folderId: id === 0 ? null : id,
                    });
                  }}
                />
                <Button
                  color="success"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleToggle}
                >
                  Создать папку
                </Button>
              </>
            )}
          </Stack>

          <DataTable
            sx={{
              "& .mf_cell_expired": {
                background: "#ff0000c7",
                opacity: 0.7,
                color: "white",
              },
            }}
            pushUri={"/modules/letters-v4/incomming/show"}
            columns={columns}
            items={items}
            isLoading={isFetching}
            components={{ Row: DataTableRow }}
            getRowClassName={(params: any) => {
              const cls = ExecutorColor[params.row.color]
                ? statusColor[params.row.color]
                : "";
              return params.row.isNew
                ? `unread-flag change-read-flag ${cls}`
                : `read-flag change-read-flag ${cls}`;
            }}
            totalItems={totalItems}
            checkboxSelection={false}
            getCellClassName={(params: any) => {
              const cls = ExecutorColor[params.row.color]
                ? statusColor[params.row.color]
                : "";
              return params.row.color && cls;
            }}
            {...pagination}
          />
        </div>
        <ModalForm
          open={open}
          onToggle={handleToggle}
          refreshDataTable={refetch}
        />
      </Card>
    </DndProvider>
  );
};

export default Registry;
