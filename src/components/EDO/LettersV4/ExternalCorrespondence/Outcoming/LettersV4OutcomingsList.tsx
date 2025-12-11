import { useEffect, useState } from "react";
import { Autocomplete, Button, Chip, TextField, Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import {
  DataTable,
  ListIcon,
  Loading,
  CustomTextField,
  FileAddIcon,
} from "@ui";
import {
  getStatusName,
  formatDate,
  newDateFormat,
  getStatusColor,
  OUTCOME_STATUSES_V4,
  getDataTableSx,
} from "@utils";

import { IncomingFolder } from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import {
  IOutcomingV3RequestBody,
  IOutcomingV3RequestSearch,
} from "@services/outcomingApiV3";
import { useParams } from "react-router";
import { useDynamicSearchParams, usePagination } from "@hooks";
import { LettersV4Layout } from "../components/LettersV4Layout";
import OutcomingCreateV4 from "./create";
import {
  IOutcomingSearchItemLettersV4,
  useLazyFetchOutcomingLettersV4ByIdQuery,
  useLazyFetchOutcomingLettersV4Query,
  useMoveToFolderOutcomingLettersV4Mutation,
} from "@services/lettersApiV4";
import { AppRoutes } from "@configs";
import { Link } from "react-router-dom";

const columns: GridColDef[] = [
  {
    field: "incomeNumber",
    headerName: "Входящий номер",
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    field: "outcomeNumber",
    headerName: "Исходящий номер",
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    field: `contragent`,
    headerName: "Получатель",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Tooltip placement="top" title={params.row?.contragent?.value}>
        <div>{params.row?.contragent?.value}</div>
      </Tooltip>
    ),
  },
  {
    field: "header",
    headerName: "Тема",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "sendDate",
    headerName: "Дата отправки",
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
    renderCell: (params) => {
      return (
        <div className="tw-flex tw-justify-center">
          <Chip
            label={getStatusName(params.row.state, "outcome_V4")}
            sx={{
              backgroundColor: getStatusColor(params.row.state),
            }}
          />
        </div>
      );
    },
  },
  {
    field: "term",
    headerName: "Срок",
    flex: 1,
    sortable: false,
    filterable: false,
  },
];

type Props = {
  isIncoming?: boolean;
};

const LettersV4NewOutcomingRegistry = (props: Props) => {
  const query = useParams();

  const { params: searchParams, setParams: setDynamicSearchParams } =
    useDynamicSearchParams();

  const param = searchParams.folderId;
  const viewType = Number(searchParams.tab || "") || undefined;
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
      pageNumber: 1,
      pageSize,
    },
  });
  const [open, setOpen] = useState(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<IOutcomingSearchItemLettersV4[]>();
  const [folderInfo, setFolderInfo] = useState<IncomingFolder[] | undefined>(
    []
  );

  const [filters, setFilters] = useState<Nullable<IOutcomingV3RequestSearch>>({
    folderId: null,
    outcomeNumber: null,
    state: null,
    receivedDate: null,
    contragent: null,
  });

  const contragents = useFetchContragentQuery({});

  const [
    fetchRecord,
    { data: outcomingLetter, isSuccess, isFetching: isRecordFetching },
  ] = useLazyFetchOutcomingLettersV4ByIdQuery();

  const refetchRecord = (recordId?: string) => {
    if (searchParams.record || recordId) {
      fetchRecord(Number(searchParams.recordId || recordId));
    }
  };

  const [fetchOutcomingLetters, { isFetching }] =
    useLazyFetchOutcomingLettersV4Query();

  const fetchData = async (args: Nullable<IOutcomingV3RequestBody>) => {
    const { data } = await fetchOutcomingLetters({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: {},
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder, { isLoading }] =
    useMoveToFolderOutcomingLettersV4Mutation();

  const search = async () => {
    setPage(0);
    fetchData({ pageInfo: { pageNumber: 1 }, filters: filters });
  };
  const updateSearch = (filters: Nullable<IOutcomingV3RequestSearch>) => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const refetchData = () => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
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
      viewType,
    });
    setParams((state) => ({
      ...state,
      filters: {
        ...state.filters,
        folderId,
        viewType,
      },
      pageInfo: {
        pageNumber: 1,
        pageSize,
      },
    }));
  }, [folderId, viewType]);

  useEffect(() => {
    if (searchParams.recordId) {
      refetchRecord(searchParams.recordId);
    }
  }, [searchParams.recordId]);

  const refetch = () => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  const renderContent = () => {
    if (isRecordFetching) {
      return (
        <div className="tw-flex tw-justify-center tw-h-[20rem]">
          <Loading />
        </div>
      );
    }

    if (outcomingLetter && searchParams.recordId) {
      return (
        <OutcomingCreateV4
          entry={outcomingLetter}
          refetchData={refetchRecord}
          refetchSearch={refetchData}
          short
        />
      );
    }

    return (
      <div>
        <div className="tw-mb-4">
          <div className="tw-flex tw-items-center tw-w-full tw-gap-4 tw-mb-4 tw-bg-white tw-rounded-[12px] tw-p-2 tw-px-4">
            <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[170px] tw-gap-4">
              <TextField
                sx={{
                  "& .MuiInputBase-root": { borderRadius: "8px !important" },
                }}
                label="Исходящий номер"
                size="small"
                name="outcomeNumber"
                value={(filters as any).outcomeNumber || ""}
                onChange={(event) => {
                  setFilters({
                    ...filters,
                    outcomeNumber: event.target.value,
                  } as any);
                  setDynamicSearchParams("outcomeNumber", event.target.value);
                }}
              />
              <TextField
                sx={{
                  "& .MuiInputBase-root": { borderRadius: "8px !important" },
                }}
                label="Входящий номер"
                size="small"
                name="incomeNumber"
                onChange={(event) => {
                  setFilters({
                    ...filters,
                    incomeNumber: event.target.value,
                  } as any);
                  setDynamicSearchParams("incomeNumber", event.target.value);
                }}
              />

              <DatePicker
                label="Дата отправки"
                inputFormat={newDateFormat}
                value={filters.receivedDate}
                onChange={(docDate) => {
                  setFilters({
                    ...filters,
                    receivedDate: docDate,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px !important",
                      },
                    }}
                    {...params}
                  />
                )}
              />
              <Autocomplete
                disablePortal
                options={contragents.isSuccess ? contragents.data.items : []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    label="Получатель"
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px !important",
                      },
                    }}
                  />
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
                options={OUTCOME_STATUSES_V4}
                getOptionLabel={(option) => option.name}
                size="small"
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    name="state"
                    label="Статус"
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px !important",
                      },
                    }}
                  />
                )}
                onChange={(_, value) => {
                  setFilters({
                    ...filters,
                    state: value?.id,
                  });
                }}
              />
            </div>
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
            <Link to={AppRoutes.LETTERS_V4_OUTCOMING_CREATE}>
              <Button
                className="lettersV4-add-btn"
                variant="contained"
                sx={{ borderRadius: "8px" }}
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
            sx={getDataTableSx("letters-v4-new")}
            getRowSpacing={(params) => {
              if (params.isFirstVisible) {
                return {
                  top: 12, // Отступ от header
                  bottom: 8, // Нижний отступ между строками
                };
              }

              return {
                top: 8,
                bottom: 8,
              };
            }}
            onRowClick={(row) => {
              // setDynamicSearchParams("minified", "true");
              setDynamicSearchParams("recordId", row?.id);
              // if (row?.row?.isNew) {
              //   changeReadFlag({
              //     id: row?.id,
              //     read: true,
              //   }).then(() => {
              //     refetchData();
              //   });
              // }
            }}
            columns={columns}
            items={items}
            isLoading={isFetching}
            checkboxSelection={false}
            components={{ Row: DataTableRow }}
            totalItems={totalItems}
            {...pagination}
          />
        </div>
        <ModalForm
          open={open}
          onToggle={handleToggle}
          refreshDataTable={refetch}
        />
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <LettersV4Layout
        refetchData={refetchData}
        items={items ?? []}
        folderList={
          folderInfo?.map((item) => ({
            ...item.folderInfo,
            active: item.active,
          })) ?? []
        }
      >
        {renderContent()}
      </LettersV4Layout>
    </DndProvider>
  );
};

export default LettersV4NewOutcomingRegistry;
