import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import {
  DataTable,
  ListIcon,
  FileAddIcon,
  Loading,
  CustomTextField,
  Archive2Icon,
  DeleteIcon,
  PinIcon,
} from "@ui";
import { Link, useLocation } from "react-router-dom";
import {
  getDataTableSx,
  getStatusColor,
  getStatusName,
  INCOMMING_STATUSES_V4,
  newDateFormat,
  toastPromise,
} from "@utils";

import {
  IIncomingNewRequestBody,
  IIncomingNewRequestSearch,
  IncomingFolder,
  IncomingNewLettersDTO,
} from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import {
  useAddToArchiveLetterV4IncommingMutation,
  useAddToCartLetterV4IncommingMutation,
  useChangeReadFlagMutation,
  useDeleteLetterV4IncommingMutation,
  useLazyFetchIncomingLettersNewV4Query,
  useLazyFetchLettersV4ByIdQuery,
  useMoveToFolderLettersV4Mutation,
  usePinLetterV4IncommingMutation,
  useRemoveArchiveLetterV4IncommingMutation,
  useRemoveFromCartLetterV4IncommingMutation,
  useUnpinLetterV4IncommingMutation,
} from "@services/lettersApiV4";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import dayjs from "dayjs";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import { LettersV4Layout } from "../components/LettersV4Layout";
import { useDynamicSearchParams, usePagination } from "@hooks";
import { IntcomingCreateV4 } from "@components";
import { LettersV4IncommingTab } from "../components/IncomingTabs";
import { MoveToFolderModal } from "../components/MoveToFolderModal";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { AppRoutes } from "@configs";
import { FolderCard } from "../components/FolderCard";

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

const LettersV4NewIncomingRegistry = (props: Props) => {
  const { pathname, search } = useLocation();
  const { params: searchParams, setParams: setDynamicSearchParams } =
    useDynamicSearchParams();
  const queryParams = new URLSearchParams(search);
  const param = searchParams.folderId;
  const viewType = Number(searchParams.tab || "") || undefined;
  const folderId = param ? Number(param) : 0;

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [
    fetchRecord,
    { data: incomingLetter, isSuccess, isFetching: isRecordFetching },
  ] = useLazyFetchLettersV4ByIdQuery();

  const refetchRecord = (recordId?: string) => {
    if (searchParams.recordId || recordId) {
      fetchRecord(Number(searchParams.recordId || recordId));
    }
  };

  const [open, setOpen] = useState(false);
  const [totalItems, setTotalItems] = useState<number>(10);
  const [items, setItems] = useState<IncomingNewLettersDTO[]>();
  const [folderInfo, setFolderInfo] = useState<IncomingFolder[] | undefined>(
    []
  );

  const [selectedItem, setSelectedItem] = useState<IncomingNewLettersDTO>();

  const [filters, setFilters] = useState<Nullable<IIncomingNewRequestSearch>>({
    folderId: null,
    incomeNumber: null,
    state: searchParams.state ? Number(searchParams.state) : null,
    isIncoming: props.isIncoming,
    receivedDate: null,
    contragent: null,
    viewType,
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

  const [fetchIncomingLetters, { isFetching, data: incomingData }] =
    useLazyFetchIncomingLettersNewV4Query();

  const fetchData = async (args: Nullable<IIncomingNewRequestBody>) => {
    const { data } = await fetchIncomingLetters({
      pageInfo: { pageNumber: page, pageSize: pageSize },
      filters: {},
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder] = useMoveToFolderLettersV4Mutation();

  // Actions
  const [pinLetter] = usePinLetterV4IncommingMutation();
  const [unpinLetter] = useUnpinLetterV4IncommingMutation();
  const [addToArchive] = useAddToArchiveLetterV4IncommingMutation();
  const [addToCart] = useAddToCartLetterV4IncommingMutation();
  const [removeFromCart] = useRemoveFromCartLetterV4IncommingMutation();
  const [removeFromArchive] = useRemoveArchiveLetterV4IncommingMutation();
  const [deleteLetter] = useDeleteLetterV4IncommingMutation();

  const refetchData = () => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize: pageSize },
      filters: filters,
    });
  };

  const handlePinLetter = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = pinLetter({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо закрепляется`,
        error: "Произошло ошибка",
        success: `Письмо успешно закреплено`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleUnPinLetter = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = unpinLetter({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо открепляется`,
        error: "Произошло ошибка",
        success: `Письмо успешно откреплено`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleAddToArchive = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = addToArchive({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо добавляется в архив`,
        error: "Произошло ошибка",
        success: `Письмо успешно добавлено в архив`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleRemoveFromArchive = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = removeFromArchive({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо удаляется из архива`,
        error: "Произошло ошибка",
        success: `Письмо успешно удалено из архива`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleAddToCart = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = addToCart({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо добавляется в корзину`,
        error: "Произошло ошибка",
        success: `Письмо успешно добавлено в корзину`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleRemoveFromCart = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = removeFromCart({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо удаляется из корзины`,
        error: "Произошло ошибка",
        success: `Письмо успешно удалено из корзины`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

  const handleDeleteLetter = (id) => (event: any) => {
    event?.stopPropagation();
    const promise = deleteLetter({ id });
    toastPromise(
      promise,
      {
        pending: `Письмо удаляется`,
        error: "Произошло ошибка",
        success: `Письмо успешно удалено`,
      },
      {
        then: (data) => {
          refetchData();
        },
      }
    );
  };

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
      folderId: folderId ? folderId : null,
      state: Number(searchParams.state) || null,
      viewType,
    });
  }, [folderId, viewType]);

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

  useEffect(() => {
    if (searchParams.recordId) {
      refetchRecord(searchParams.recordId);
    }
  }, [searchParams.recordId]);

  const { incomeNumber, receivedDate, contragent, state } = searchParams;

  let stateOption = null;

  try {
    stateOption = state ? JSON.parse(state) : null;
  } catch (e) {
    stateOption = null;
  }

  useEffect(() => {
    let queryFilters: any = {};

    if (incomeNumber) {
      queryFilters.incomeNumber = incomeNumber;
    }

    if (receivedDate) {
      queryFilters.receivedDate = new Date(receivedDate);
    }

    if (contragent) {
      let value = null;
      try {
        value = JSON.parse(contragent);
      } catch (e) {
        value = null;
      }
      queryFilters.contragent = value;
    }

    if (stateOption) {
      queryFilters.state = stateOption.id;
    }

    setFilters({
      ...filters,
      ...queryFilters,
      folderId: Number(searchParams.folderId) || filters.folderId || null,
      state: queryFilters.state || Number(searchParams.state) || null,
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "incomeNumber",
      headerName: "Входящий номер",
      width: 120,
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
                  read: true,
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
      field: "outcomeNumber",
      headerName: "Исходящий номер",
      width: 120,
      sortable: false,
      filterable: false,
    },
    {
      field: "contragent",
      headerName: "Отправитель",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip placement="top" title={params.row?.contragent?.value}>
          <div>{params.row?.contragent?.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "receivedDate",
      headerName: "Дата получения",
      width: 150,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD.MM.YYYY");
      },
    },
    {
      field: "header",
      headerName: "Тема",
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: "mainExecutor",
      headerName: "Исполнитель",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip placement="top" title={params.row?.mainExecutor?.value}>
          <div title={params.row?.mainExecutor?.value}>
            {params.row?.mainExecutor?.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "state",
      headerName: "Статус",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="tw-flex tw-justify-center">
            <Chip
              label={getStatusName(params.row.state, "income_v4")}
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
      headerName: "Действие",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const { inArchive, isPinned, inCart } = params.row ?? {};
        return (
          <div className="tw-flex">
            <IconButton
              title="Переместить в папку"
              onClick={(event: any) => {
                event?.stopPropagation();
                setSelectedItem(params.row);
              }}
            >
              <DriveFileMoveIcon style={{ color: "#53AEDD" }} />
            </IconButton>
            <IconButton
              title={
                Number(searchParams.tab) === LettersV4IncommingTab.CART
                  ? "Удалить"
                  : "Добавить в корзину"
              }
              onClick={
                Number(searchParams.tab) === LettersV4IncommingTab.CART
                  ? handleRemoveFromCart(params.row?.id)
                  : handleAddToCart(params.row?.id)
              }
            >
              <DeleteIcon />
            </IconButton>
            {!inArchive && (
              <IconButton
                title="В архив"
                onClick={handleAddToArchive(params.row?.id)}
              >
                <Archive2Icon />
              </IconButton>
            )}
            {inArchive && (
              <IconButton
                title="Удалить из архива"
                onClick={handleRemoveFromArchive(params.row?.id)}
              >
                <Archive2Icon fill="#53AEDD" />
              </IconButton>
            )}
            {!isPinned && (
              <IconButton
                title="Закрепить письмо"
                onClick={handlePinLetter(params.row?.id)}
              >
                <PinIcon />
              </IconButton>
            )}
            {isPinned && (
              <IconButton
                title="Открепить письмо"
                onClick={handleUnPinLetter(params.row?.id)}
              >
                <PinIcon fill="#53AEDD" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (pathname === AppRoutes.LETTERS_V4_INCOMING) {
      setDynamicSearchParams("folderType", "incomming");
    }
  }, []);

  const renderContent = () => {
    if (isRecordFetching) {
      return (
        <div className="tw-flex tw-justify-center tw-h-[20rem]">
          <Loading />
        </div>
      );
    }

    if (incomingLetter && searchParams.recordId) {
      return (
        <IntcomingCreateV4
          entry={incomingLetter}
          refetchData={refetchRecord}
          refetchSearch={refetchData}
          short
        />
      );
    }

    return (
      <div>
        <div>
          <div className="tw-flex tw-overflow-x-auto">
            {folderInfo
              ?.map((item) => ({
                ...item.folderInfo,
                active: item.active,
              }))
              ?.filter?.((el) => el.id < 0)
              ?.map((item: any) => (
                <div
                  key={item.id}
                  className="tw-min-w-[200px] tw-grid tw-grid-cols-1"
                >
                  <FolderCard
                    data={item}
                    refetchData={refetchData}
                    exitVisible={false}
                  />
                </div>
              ))}
          </div>
          <div className="tw-flex tw-items-center tw-gap-4 tw-mb-[10px] tw-mt-2 tw-bg-white tw-rounded-[12px] tw-p-2 tw-px-4">
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2 tw-mt-2">
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
                  });
                  setDynamicSearchParams("incomeNumber", event.target.value);
                }}
              />

              <DatePicker
                label="Дата получения"
                inputFormat={newDateFormat}
                value={
                  filters.receivedDate ? new Date(filters.receivedDate) : null
                }
                onChange={(docDate) => {
                  setFilters({
                    ...filters,
                    receivedDate: docDate ? (docDate as any) : "",
                  });

                  let docDateStr: any = docDate;
                  try {
                    docDateStr = new Date(docDate as any).toISOString();
                  } catch {
                    docDateStr = docDate || "";
                  }
                  setDynamicSearchParams("receivedDate", docDateStr);
                }}
                renderInput={(params) => (
                  <TextField
                    sx={{
                      maxWidth: "150px",
                      "& .MuiInputBase-root": {
                        borderRadius: "8px !important",
                      },
                    }}
                    size="small"
                    {...params}
                  />
                )}
              />
              <Autocomplete
                sx={{
                  minWidth: "150px",
                  "& .MuiInputBase-root": { borderRadius: "8px !important" },
                  width: "200px",
                }}
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
                value={filters.contragent || null}
                onChange={(_, value) => {
                  const contragent = {
                    id: value?.id?.toString() || "",
                    value: value?.value || "",
                  };
                  setFilters({
                    ...filters,
                    contragent: !value ? null : contragent,
                  });
                  setDynamicSearchParams(
                    "contragent",
                    !value ? "" : JSON.stringify(contragent)
                  );
                }}
                onInputChange={onContragentInputChange}
              />
              <Autocomplete
                sx={{
                  "& .MuiInputBase-root": { borderRadius: "8px !important" },
                  width: "150px",
                }}
                disablePortal
                options={INCOMMING_STATUSES_V4}
                getOptionLabel={(option) => option?.name}
                size="small"
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    name="state"
                    label="Статус"
                  />
                )}
                value={
                  typeof stateOption !== "object"
                    ? INCOMMING_STATUSES_V4?.find((el) => el.id === stateOption)
                    : stateOption
                }
                onChange={(_, value) => {
                  setFilters({
                    ...filters,
                    state: !value ? null : value?.id,
                  });
                  setDynamicSearchParams(
                    "state",
                    !value ? "" : JSON.stringify(value)
                  );
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
              to={
                incomingData?.transition?.buttonSettings?.btn_add?.readOnly
                  ? "#"
                  : `${
                      pathname.split("/").slice(-1)[0] ===
                      "ExternalCorrespondence"
                        ? pathname + "/corIncoming-v3.5/create"
                        : pathname + "/create"
                    }`
              }
            >
              <Button
                disabled={
                  incomingData?.transition?.buttonSettings?.btn_add?.readOnly
                }
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

          <div className="tw-overflow-x-auto">
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
                setDynamicSearchParams("recordId", row?.id);
                if (row?.row?.isNew) {
                  changeReadFlag({
                    id: row?.id,
                    read: true,
                  }).then(() => {
                    refetchData();
                  });
                }
              }}
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
      <MoveToFolderModal
        {...(pathname.includes("incomming") ? { isIncoming: true } : {})}
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        refetchData={refetchData}
      />
    </DndProvider>
  );
};

export default LettersV4NewIncomingRegistry;
