import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import { GridColumns } from "@mui/x-data-grid";
import { useSelectedRow, DataTable } from "@ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  GroupSearchRequest,
  GroupSearchRequestBody,
  useDeleteGroupByIDMutation,
  useFetchGroupsQuery,
} from "@services/admin/groupApi";
import Access from "./access";
import Filters from "./filters";
import CreateGroup from "./modals/create";
import UpdateGroup from "./modals/update";
import { formatDate } from "@utils";
import { usePagination } from "@hooks";

export default function Groups() {
  const { selectedRows, onSelectionModelChange } = useSelectedRow();
  const [deleteGroup, { isLoading, isError, isSuccess }] =
    useDeleteGroupByIDMutation();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [filters, setFilters] = useState<GroupSearchRequestBody>({
    orderBy: {
      column: 1,
      order: 1,
    },
    pageInfo: {
      pageNumber: page + 1,
      pageSize,
    },
  });
  const { data, isFetching, refetch } = useFetchGroupsQuery(filters, {
    refetchOnMountOrArgChange: true,
  });
  const columns = useMemo<GridColumns>(
    () => [
      {
        field: "groupName",
        headerName: "Группа",
        flex: 2,
        sortable: false,
        filterable: false,
      },
      {
        field: "groupType",
        headerName: "Тип группы",
        flex: 2,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => params.value.value,
      },
      {
        field: "template",
        headerName: "Роль",
        flex: 2,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => params.value.value,
      },
      {
        field: "createdDate",
        headerName: "Дата создания",
        flex: 2,
        maxWidth: 150,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => formatDate(params.value),
      },
      {
        field: "actions",
        type: "actions",
        width: 40,
        getActions: (params) => [
          <UpdateGroup
            key={params.row.id}
            data={params.row}
            onSuccess={refetch}
          />,
        ],
      },
    ],
    [refetch]
  );
  const handleChangeFilters = (params?: GroupSearchRequest) => {
    if (params) {
      setFilters((state) => ({ ...state, filtres: params }));
    } else {
      setFilters((state) => ({
        orderBy: state.orderBy,
        pageInfo: state.pageInfo,
      }));
    }
  };
  const handleChangePage = (value: number) => {
    setPage(value);
    setFilters((state) => ({
      ...state,
      pageInfo: {
        ...state.pageInfo,
        pageNumber: value + 1,
      },
    }));
  };

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setFilters((state) => ({
      ...state,
      pageInfo: {
        ...state.pageInfo,
        pageSize: value,
      },
    }));
  };

  const handleDeleteRole = useCallback(() => {
    if (0 in selectedRows) {
      deleteGroup(selectedRows[0] as number);
    }
  }, [deleteGroup, selectedRows]);

  useEffect(() => {
    refetch();
  }, [refetch, filters]);

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast("Группа удалена.", {
        type: "success",
        position: "bottom-right",
      });
      refetch();
    }
  }, [isError, isSuccess, refetch]);

  return (
    <Stack spacing={3}>
      <Filters onChange={handleChangeFilters} />
      <Stack
        alignItems="center"
        direction="row"
        spacing={3}
        justifyContent="right"
      >
        <CreateGroup onSuccess={refetch} />
        <LoadingButton
          sx={{ minWidth: 136 }}
          color="error"
          variant="outlined"
          loading={isLoading}
          disabled={selectedRows.length === 0}
          startIcon={<DeleteIcon />}
          onClick={handleDeleteRole}
        >
          Удалить
        </LoadingButton>
      </Stack>
      <DataTable
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
            {
              display: "none",
            },
        }}
        items={data?.items}
        columns={columns}
        isLoading={isFetching}
        totalItems={data?.total || 0}
        page={page}
        pageSize={pageSize}
        setPage={handleChangePage}
        setPageSize={handleChangePageSize}
        selectionModel={selectedRows}
        onSelectionModelChange={onSelectionModelChange}
      />
      {selectedRows.map((id) => (
        <Access key={id} id={id} />
      ))}
    </Stack>
  );
}
