import { useEffect, useState, useRef } from "react";
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
import { FolderCard } from "../components/FolderCard";

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
import { LettersV4IncommingTab } from "../components/IncomingTabs";
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
  skipLayout?: boolean; // Проп для рендеринга без Layout (когда Layout уже есть выше)
};

const LettersV4NewOutcomingRegistry = (props: Props) => {
  const query = useParams();

  const { params: searchParams, setParams: setDynamicSearchParams } =
    useDynamicSearchParams();

  const param = searchParams.folderId;
  const viewType = Number(searchParams.tab || "") || undefined;
  // Если folderId не указан в URL или равен 0, используем -6 (дефолтная первая папка)
  const folderId = param && param !== "0" ? Number(param) : -6;

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
    [],
  );

  const prevFiltersRef = useRef<Nullable<IOutcomingV3RequestSearch>>(null);
  const prevPageRef = useRef<number>(0);

  // Проверяем, выбран ли тип для корзины/архива/закреплённого при инициализации
  const initialCartType = searchParams.cartType;
  const initialArchiveType = searchParams.archiveType;
  const initialPinnedType = searchParams.pinnedType;
  const initialIsCartArchivePinned = 
    viewType === LettersV4IncommingTab.CART ||
    viewType === LettersV4IncommingTab.ARCHIVE ||
    viewType === LettersV4IncommingTab.PINNED;
  const initialHasTypeSelected = initialCartType || initialArchiveType || initialPinnedType;
  
  const [filters, setFilters] = useState<Nullable<IOutcomingV3RequestSearch>>({
    folderId: -6, // Дефолтная первая папка
    outcomeNumber: null,
    state: null,
    receivedDate: null,
    contragent: null,
    // Устанавливаем viewType только если тип выбран или это не корзина/архив/закреплённый
    viewType: (initialIsCartArchivePinned && !initialHasTypeSelected) ? undefined : viewType,
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
    console.log("Outcoming folderInfo:", data?.folderInfo);
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

  // Отправка запросов - объединяем логику в один useEffect
  useEffect(() => {
    // Проверяем, выбран ли тип "outcomming" (этот компонент должен использоваться только для исходящих)
    const cartType = searchParams.cartType;
    const archiveType = searchParams.archiveType;
    const pinnedType = searchParams.pinnedType;
    
    const isOutcomingType = 
      cartType === "outcomming" || 
      archiveType === "outcomming" || 
      pinnedType === "outcomming";
    
    const isCartArchivePinned = 
      viewType === LettersV4IncommingTab.CART ||
      viewType === LettersV4IncommingTab.ARCHIVE ||
      viewType === LettersV4IncommingTab.PINNED;
    
    console.log("Outcoming useEffect:", {
      cartType,
      archiveType,
      pinnedType,
      isOutcomingType,
      isCartArchivePinned,
      viewType,
      filters,
    });
    
    // Если это корзина/архив/закреплённый и выбран "incomming", не отправляем запрос
    if (isCartArchivePinned && (cartType === "incomming" || archiveType === "incomming" || pinnedType === "incomming")) {
      console.log("Outcoming: Skipping request - incomming type selected");
      prevFiltersRef.current = filters;
      prevPageRef.current = page;
      return; // Не отправляем запрос, если выбран входящий тип
    }
    
    // Если это корзина/архив/закреплённый и тип не выбран, не отправляем запрос
    if (isCartArchivePinned && !cartType && !archiveType && !pinnedType) {
      console.log("Outcoming: Skipping request - no type selected");
      prevFiltersRef.current = filters;
      prevPageRef.current = page;
      return; // Не отправляем запрос, если тип не выбран
    }
    
    // Проверяем, изменились ли фильтры или страница
    // Если prevFiltersRef.current === null, это первая загрузка, отправляем запрос
    const isFirstLoad = prevFiltersRef.current === null;
    const filtersChanged = !isFirstLoad && JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    const pageChanged = prevPageRef.current !== page;
    
    console.log("Outcoming: Request check:", {
      isFirstLoad,
      filtersChanged,
      pageChanged,
      shouldSend: isFirstLoad || filtersChanged || pageChanged,
    });
    
    // Отправляем запрос только если что-то изменилось или это первая загрузка
    if (isFirstLoad || filtersChanged || pageChanged) {
      console.log("Outcoming: Sending request with filters:", filters);
      prevFiltersRef.current = filters;
      prevPageRef.current = page;
      fetchData({
        pageInfo: { pageNumber: page + 1, pageSize },
        filters: filters,
      });
    }
  }, [page, pageSize, filters, searchParams.cartType, searchParams.archiveType, searchParams.pinnedType, viewType]);

  const handleMoveToFolder = (data: any) => {
    moveToFolder(data).then(() => {});
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // Получаем параметры типа из searchParams
    const cartType = searchParams.cartType;
    const archiveType = searchParams.archiveType;
    const pinnedType = searchParams.pinnedType;
    
    const isCartArchivePinned = 
      viewType === LettersV4IncommingTab.CART ||
      viewType === LettersV4IncommingTab.ARCHIVE ||
      viewType === LettersV4IncommingTab.PINNED;
    
    // Если это корзина/архив/закреплённый и выбран "incomming", не обновляем фильтры
    if (isCartArchivePinned && (cartType === "incomming" || archiveType === "incomming" || pinnedType === "incomming")) {
      return; // Не обновляем фильтры, если выбран входящий тип
    }
    
    // Если это корзина/архив/закреплённый и тип не выбран, не обновляем фильтры
    if (isCartArchivePinned && !cartType && !archiveType && !pinnedType) {
      return; // Не обновляем фильтры, если тип не выбран
    }
    
    // Используем folderId из URL, если он есть и не равен 0, иначе -6 (дефолтная первая папка)
    const finalFolderId = param && param !== "0" ? Number(param) : -6;
    
    // Обновляем фильтры только если выбран тип "outcomming" или это не корзина/архив/закреплённый
    // viewType устанавливаем только если тип выбран
    const finalViewType = (isCartArchivePinned && !cartType && !archiveType && !pinnedType) ? undefined : viewType;
    
    setFilters({
      ...filters,
      folderId: finalFolderId,
      viewType: finalViewType, // viewType для фильтрации по корзине, архиву, закреплённым
    });
    setParams((state) => ({
      ...state,
      filters: {
        ...state.filters,
        folderId: finalFolderId,
        viewType: finalViewType,
      },
      pageInfo: {
        pageNumber: 1,
        pageSize,
      },
    }));
  }, [param, viewType, searchParams.cartType, searchParams.archiveType, searchParams.pinnedType]);

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
        <div>
          {folderInfo && folderInfo.length > 0 && (
            <div className="tw-flex tw-overflow-x-auto tw-mb-4">
              {folderInfo
                ?.map((item) => ({
                  ...item.folderInfo,
                  active: item.active,
                }))
                ?.filter?.((el) => el.id !== null && el.id <= 0)
                ?.map((item: any) => (
                  <div
                    key={item.id}
                    className="tw-min-w-[200px] tw-grid tw-grid-cols-1"
                  >
                    <FolderCard
                      data={item}
                      refetchData={refetchData}
                      exitVisible={false}
                      isIncoming={false}
                    />
                  </div>
                ))}
            </div>
          )}
          <div className="tw-my-4">
            <div className="tw-flex tw-items-center tw-w-full tw-gap-4 tw-mb-4 tw-bg-white tw-rounded-[12px] tw-p-2 tw-px-4">
            <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[170px] tw-gap-4">
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
        </div>
        <ModalForm
          open={open}
          onToggle={handleToggle}
          refreshDataTable={refetch}
        />
      </div>
    );
  };

  const content = renderContent();

  if (props.skipLayout) {
    return <DndProvider backend={HTML5Backend}>{content}</DndProvider>;
  }

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
        {content}
      </LettersV4Layout>
    </DndProvider>
  );
};

export default LettersV4NewOutcomingRegistry;
