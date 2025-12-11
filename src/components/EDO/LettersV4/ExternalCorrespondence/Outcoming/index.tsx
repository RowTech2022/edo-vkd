import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import { Card, DataTable, ListIcon, Loading, CustomTextField } from "@ui";
import {
  getStatusName,
  formatDate,
  OUTCOME_STATUSES_V3,
  newDateFormat,
} from "@utils";

import { IncomingFolder } from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import FoldersPanel from "./folders";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import {
  IOutcomingV3RequestBody,
  IOutcomingV3RequestSearch,
  IOutcomingV3SearchResponse,
  useLazyFetchOutcomingV3LettersQuery,
  useMoveToFolderOutcomingV3Mutation,
} from "@services/outcomingApiV3";
import { useParams } from "react-router";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "incomeNumber",
    headerName: "Входящий номер",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "outcomeNumber",
    headerName: "Исходящий номер",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: `contragent`,
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
    valueFormatter: (row: any) => getStatusName(row.value, "outcome_V3"),
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

const Registry = (props: Props) => {
  const query = useParams();
  const folderId = query.fid ? Number(query.fid) : 0;

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
  const [items, setItems] = useState<IOutcomingV3SearchResponse[]>();
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

  const [fetchOutcomingLetters, { isFetching }] =
    useLazyFetchOutcomingV3LettersQuery();

  const fetchData = async (args: Nullable<IOutcomingV3RequestBody>) => {
    const { data } = await fetchOutcomingLetters({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder, { isLoading }] = useMoveToFolderOutcomingV3Mutation();

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

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  }, [page, pageSize]);

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

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card title="Реестр исходящих писем">
        <div className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-4">
            <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
              <TextField
                label="№"
                size="small"
                name="outcomeNumber"
                onChange={(event) => {
                  setFilters({
                    ...filters,
                    outcomeNumber: event.target.value,
                  });
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
                renderInput={(params) => <TextField size="small" {...params} />}
              />
              <Autocomplete
                disablePortal
                options={contragents.isSuccess ? contragents.data.items : []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                renderInput={(params) => (
                  <CustomTextField params={params} label="Отправитель" />
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
                options={OUTCOME_STATUSES_V3}
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
            pushUri={
              "/modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5/show"
            }
            columns={columns}
            items={items}
            isLoading={isFetching}
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
      </Card>
    </DndProvider>
  );
};

export default Registry;
