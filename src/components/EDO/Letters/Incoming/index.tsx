import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { GridColDef } from "@mui/x-data-grid";
import { Card, DataTable, ListIcon, Loading } from "@ui";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useChangeReadFlagMutation,
  useFetchInternalIncomingLettersQuery,
  useMoveToFolderMutation,
} from "@services/internal/incomingApi";
import DataTableRow from "./DataTableRow";
import FoldersPanel from "./folders";
import ModalForm from "./folders/modal";
import { formatDate, sliceEnd } from "@utils";
import { useParams } from "react-router";
import { AppRoutes } from "@configs";

export default function Registry() {
  const [changeReadFlag, changeReadFlagRequest] = useChangeReadFlagMutation();
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
  const { data, isFetching, refetch } = useFetchInternalIncomingLettersQuery(
    params,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [moveToFolder, { isLoading }] = useMoveToFolderMutation();
  const columns: GridColDef[] = [
    {
      type: "actions",
      field: "id",
      width: 10,
      minWidth: 10,
      cellClassName: "tw-p-0 tw-justify-start",
      renderCell: (params) => (
        <div
          className="tw-h-full tw-w-[4px] tw-bg-secondary"
          onClick={() =>
            changeReadFlag({ id: params.value, read: params.row.new }).then(
              () => {
                refetch();
              }
            )
          }
        />
      ),
    },
    {
      field: "contragent",
      headerName: "От кого",
      flex: 10,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => params.value.value,
    },
    {
      field: "subject",
      headerName: "Тема",
      flex: 10,
      sortable: false,
      filterable: false,
    },
    {
      field: "date",
      headerName: "Дата получения",
      flex: 20,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => formatDate(params.value),
    },
  ];
  const handleChangePage = useCallback((page: number) => {
    setParams((state) => ({
      ...state,
      pageInfo: {
        ...state.pageInfo,
        pageNumber: page + 1,
      },
    }));
  }, []);
  const handleMoveToFolder = (data: any) => {
    moveToFolder(data).then(() => {
      refetch();
    });
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
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

  return (
    <Card title="Реестр входящих писем">
      <DndProvider backend={HTML5Backend}>
        <div className="tw-py-4">
          <Stack className="tw-mb-4" spacing={2}>
            <Stack spacing={2} direction="row">
              <Button
                variant="outlined"
                disabled={isFetching || isLoading}
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
                onClick={() => refetch()}
              >
                Обновить список
              </Button>
              <Button
                color="success"
                variant="outlined"
                disabled={isFetching || isLoading}
                startIcon={<AddIcon />}
                onClick={handleToggle}
              >
                Создать папку
              </Button>
            </Stack>
            {data?.folderInfo && (
              <FoldersPanel
                items={data?.folderInfo}
                selectedFolder={folderId}
                moveToFolder={handleMoveToFolder}
                refreshDataTable={refetch}
              />
            )}
          </Stack>
          <DataTable
            page={params.pageInfo.pageNumber - 1}
            items={data?.items}
            columns={columns}
            pushUri={sliceEnd(AppRoutes.LETTERS_INCOMING_SHOW, 4)}
            rowStyle={(params: any) =>
              params.row.new === true ? "new tw-bg-sky-100 tw-font-bold" : ""
            }
            isLoading={
              isFetching || isLoading || changeReadFlagRequest.isLoading
            }
            checkboxSelection={false}
            components={{ Row: DataTableRow }}
            totalItems={data?.total || 0}
            setPage={handleChangePage}
          />
        </div>
      </DndProvider>
      <ModalForm
        open={open}
        onToggle={handleToggle}
        refreshDataTable={refetch}
      />
    </Card>
  );
}
