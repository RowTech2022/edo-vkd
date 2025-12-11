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
import { Link, useLocation, useParams } from "react-router-dom";
import {
  getStatusName,
  formatDate,
  INTERNAL_EMAIL_STATUSES,
  newDateFormat,
} from "@utils";

import FoldersPanel from "./folders";
import ModalForm from "./folders/modal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DataTableRow from "@root/components/EDO/Letters/Incoming/DataTableRow";
import {
  EmailFolder,
  Emailv35LettersDTO,
  IEmailRequestBody,
  IEmailRequestSearch,
  useEmailMoveToFolderMutation,
  useLazyFetchLettersEmailQuery,
} from "@services/lettersApiV35";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "incomeNumber",
    headerName: "Номер",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "creator",
    headerName: "Отправитель",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "subject",
    headerName: "Тема",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "createAt",
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
    valueFormatter: (row: any) => getStatusName(row.value, "email"),
  },
];

function convertUTCDateToLocalDate(date: any) {
  if (!date) return;
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return newDate.toISOString();
}

type Props = {
  isIncoming?: boolean;
};

const Registry = (props: Props) => {
  const query = useParams();
  const { pathname } = useLocation();
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
  const [totalItems, setTotalItems] = useState<number>(10);
  const [items, setItems] = useState<Emailv35LettersDTO[]>();
  const [folderInfo, setFolderInfo] = useState<EmailFolder[] | undefined>([]);

  const [filters, setFilters] = useState<Nullable<IEmailRequestSearch>>({
    folderId: null,
    incomeNumber: null,
    creator: null,
    subject: null,
    state: null,
    createAt: null,
  });

  const [InternalEmail, { isFetching }] = useLazyFetchLettersEmailQuery();

  const fetchData = async (args: Nullable<IEmailRequestBody>) => {
    const { data } = await InternalEmail({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setFolderInfo(data?.folderInfo);
    setTotalItems(data?.total || 0);
  };

  const [moveToFolder, { isLoading }] = useEmailMoveToFolderMutation();

  const search = async () => {
    setPage(0);
    fetchData({ pageInfo: { pageNumber: 1 }, filters: filters });
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: {
        ...filters,
        createAt: convertUTCDateToLocalDate(filters.createAt),
      },
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
      filters: {
        ...filters,
        createAt: convertUTCDateToLocalDate(filters.createAt),
      },
    });
  };

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        title={props.isIncoming ? "Реестр входящих писем" : "Реестр исполнения"}
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
                value={filters.createAt}
                onChange={(docDate: any) => {
                  setFilters({
                    ...filters,
                    createAt: docDate && docDate.toISOString(),
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
              <TextField
                label="Отправитель"
                size="small"
                name="creator"
                onChange={(params) => {
                  setFilters({
                    ...filters,
                    creator: params?.target.value,
                  });
                }}
              />
              <Autocomplete
                disablePortal
                options={INTERNAL_EMAIL_STATUSES}
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
            <Link
              to={`${
                pathname.split("/").slice(-1)[0] === "InternalCorrespondence"
                  ? pathname + "/chat/create"
                  : pathname + "/create"
              }`}
            >
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
          {folderInfo && (
            <Stack className="tw-grid tw-grid-cols-[1fr_220px] tw-w-full tw-gap-4 tw-mb-4">
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
            </Stack>
          )}

          <DataTable
            sx={{
              "& .mf_cell_expired": {
                background: "#ff0000c7",
                color: "white",
                opacity: 0.7,
              },
            }}
            pushUri={"/modules/letters-v3.5/InternalCorrespondence/chat/show"}
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
