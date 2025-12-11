import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Autocomplete, Button, Stack, TextField, Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import {
  Card,
  DataTable,
  ListIcon,
  FileAddIcon,
  Loading,
  CustomTextField,
} from "@ui";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getStatusName,
  INCOMMING_STATUSES,
  formatDate,
  newDateFormat,
} from "@utils";

import {
  IncomingNewLettersDTO,
  IIncomingNewRequestBody,
  IIncomingNewRequestSearch,
  IncomingFolder,
} from "@services/lettersNewApi";
import { useFetchContragentQuery } from "@services/generalApi";
import {
  useLazyFetchIncomingLettersNewQuery,
  useMoveToFolderMutation,
} from "@services/lettersApiV3";
import FoldersPanel from "./folders";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "incomeNumber",
    headerName: "Входящий номер",
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Tooltip title={params.row?.incomeNumber}>
        <span>{params.row?.incomeNumber}</span>
      </Tooltip>
    ),
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
    renderCell: (params) => (
      <Tooltip title={params.row?.contragent?.value}>
        <span>{params.row?.contragent?.value}</span>
      </Tooltip>
    ),
  },
  {
    field: "header",
    headerName: "Тема",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Tooltip title={params.row?.header}>
        <span>{params.row?.header}</span>
      </Tooltip>
    ),
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
    renderCell: (params) => (
      <Tooltip title={formatDate(params.value)}>
        <span>{formatDate(params.value)}</span>
      </Tooltip>
    ),
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (row: any) => getStatusName(row.value, "income"),
    renderCell: (row) => (
      <Tooltip title={getStatusName(row.value, "income")}>
        <span>{getStatusName(row.value, "income")}</span>
      </Tooltip>
    ),
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
    renderCell: (params) => (
      <Tooltip title={params.value ? formatDate(params.value) : ""}>
        <span>{params.value ? formatDate(params.value) : ""}</span>
      </Tooltip>
    ),
  },
];

type Props = {
  isIncoming?: boolean;
};

const Registry = (props: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const query = useParams();
  const folderId = query.fid ? Number(query.fid) : 0;
  const [params, setParams] = useState({
    filters: {
      type: 2,
      folderId,
      smartFilter: "",
    },
    pageInfo: {
      pageNumber: 1,
    },
  });
  const [open, setOpen] = useState(false);
  const [totalItems, setTotalItems] = useState<number>(10);
  const [items, setItems] = useState<IncomingNewLettersDTO[]>();

  const [folderInfo, setFolderInfo] = useState<IncomingFolder[] | undefined>(
    []
  );

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [filters, setFilters] = useState<Nullable<IIncomingNewRequestSearch>>({
    folderId: null,
    incomeNumber: null,
    state: null,
    isIncoming: props.isIncoming,
    receivedDate: null,
    contragent: null,
  });

  const contragents = useFetchContragentQuery({});

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchIncomingLettersNewQuery();

  const fetchData = async (args: Nullable<IIncomingNewRequestBody>) => {
    const { data } = await fetchIncomingLetters({
      pageInfo: { pageNumber: page, pageSize: pageSize },
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder, { isLoading }] = useMoveToFolderMutation();

  const search = async () => {
    fetchData({ filters: filters });
  };
  const resetState = () => {
    setFilters({});
    setItems([]);
    setTotalItems(0);
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize: pageSize },
      filters: filters,
    });
  }, [
    page,
    pageSize,
    filters.folderId,
    filters.contragent,
    filters.receivedDate,
  ]);

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
      },
    }));
  }, [folderId]);

  const refetch = () => {
    fetchData({ pageInfo: { pageNumber: page + 1 }, filters: filters });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        title={
          props.isIncoming ? "Реестр входящих писем" : "Реестр испольнении"
        }
      >
        <div className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-4">
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
                options={contragents.isSuccess ? contragents.data.items : []}
                size="small"
                getOptionLabel={(option) => option.value as string}
                renderInput={(params) => (
                  <CustomTextField params={params} label="Отправитель" />
                )}
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
          <Stack className="tw-grid tw-grid-cols-[1fr_220px] tw-w-full tw-gap-4 tw-mb-4">
            {folderInfo && (
              <>
                <FoldersPanel
                  items={folderInfo}
                  selectedFolder={folderId}
                  moveToFolder={handleMoveToFolder}
                  refreshDataTable={refetch}
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
            pushUri={"/modules/latters-v3/incomming/show"}
            columns={columns}
            items={items}
            isLoading={isFetching}
            components={{ Row: DataTableRow }}
            totalItems={totalItems}
            getCellClassName={(params: any) => {
              return params.row.expired && "mf_cell_expired";
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
