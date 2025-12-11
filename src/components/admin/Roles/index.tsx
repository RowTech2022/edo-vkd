import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import GroupsIcon from "@mui/icons-material/Groups";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import { GridColumns } from "@mui/x-data-grid";
import { DataTable, useSelectedRow } from "@ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Role,
  RoleSearchRequestBody,
  useDeleteRoleByIDMutation,
  useFetchRolesQuery,
} from "@services/admin/rolesApi";
import Access from "./access";
import AcceptRole from "./actions/acceptRole";
import Create from "./actions/create";
import Update from "./actions/update";
import Filters, { FilterFormProps } from "./filters";
import { formatDate } from "@utils";
import ModuleAccess from "./modules-access";
import { usePagination } from "@hooks";
import { Tooltip } from "@mui/material";
import Users from "./actions/users";

export default function Roles() {
  const { selectedRows, onSelectionModelChange } = useSelectedRow();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [filters, setFilters] = useState<RoleSearchRequestBody>({
    orderBy: {
      column: 1,
      order: 1,
    },
    pageInfo: {
      pageNumber: page + 1,
    },
  });
  const {
    data: rolesData,
    isFetching,
    refetch,
  } = useFetchRolesQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteRole, { isLoading, isError, isSuccess }] =
    useDeleteRoleByIDMutation();

  const columns = useMemo<GridColumns<Role>>(
    () => [
      {
        field: "roleName",
        headerName: "Название роли",
        flex: 2,
        sortable: false,
        filterable: false,
      },
      {
        field: "userType",
        headerName: "Тип пользователя",
        flex: 2,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => params.value?.value,
      },
      {
        field: "organisationType",
        headerName: "Тип организации",
        flex: 2,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => params.value?.value,
      },
      {
        field: "template",
        headerName: "Шаблон",
        flex: 2,
        sortable: false,
        filterable: false,
        valueFormatter: (params) => params.value?.value,
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
        width: 120,
        getActions: (params) => [
          <Update key={params.row.id} data={params.row} onSuccess={refetch} />,
          <Tooltip title="Пользователи">
            <GroupsIcon
              color="primary"
              onClick={() => {
                if (selectedRole?.id !== params.row.id) {
                  setSelectedRole(params.row);
                }
              }}
            />
          </Tooltip>,
        ],
      },
    ],
    [refetch]
  );

  const handleChangePage = useCallback((value: number) => {
    setPage(value);
    setFilters((state) => ({
      ...state,
      pageInfo: {
        ...state.pageInfo,
        pageNumber: value + 1,
      },
    }));
  }, []);

  const handleChangePageSize = useCallback((value: number) => {
    setPageSize(value);

    setFilters((state) => ({
      ...state,
      pageInfo: {
        ...state.pageInfo,
        pageSize: value,
      },
    }));
  }, []);

  const handleChangeFilters = useCallback((params?: FilterFormProps) => {
    if (params !== undefined) {
      setFilters((state) => ({
        filtres: params,
        orderBy: state.orderBy,
        pageInfo: state.pageInfo,
      }));
    } else {
      setFilters((state) => ({
        orderBy: state.orderBy,
        pageInfo: state.pageInfo,
      }));
    }
  }, []);

  const [moduleAccess, setModuleAccess] = useState(false);
  const handleDeleteRole = useCallback(() => {
    if (0 in selectedRows) {
      deleteRole(selectedRows[0] as number).then(({ data }: { data: any }) => {
        if (data?.items?.length) {
          const obj = rolesData?.items?.find(
            (el) => el?.id === selectedRows?.[0]
          );
          setSelectedRole(obj);
        } else {
          toast("Роль удалена.", {
            type: "success",
            position: "bottom-right",
          });
          refetch();
        }
      });
    }
  }, [deleteRole, selectedRows]);

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
  }, [isError]);

  return (
    <Stack spacing={3}>
      <Stack
        alignItems="center"
        direction="row"
        spacing={3}
        justifyContent="space-between"
      >
        <Filters onChange={handleChangeFilters} />
        <Stack alignItems="center" direction="row" spacing={3}>
          <Create onSuccess={refetch} />
          <AcceptRole onSuccess={refetch} />
          <LoadingButton
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
      </Stack>
      <DataTable
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
            {
              display: "none",
            },
        }}
        items={rolesData?.items}
        columns={columns}
        isLoading={isFetching}
        totalItems={rolesData?.total || 0}
        page={page}
        pageSize={pageSize}
        setPage={handleChangePage}
        setPageSize={handleChangePageSize}
        selectionModel={selectedRows}
        onSelectionModelChange={onSelectionModelChange}
      />
      <div className="tw-flex tw-justify-center tw-gap-2 tw-">
        <div
          onClick={() => setModuleAccess(false)}
          className={`tw-min-w-[150px] tw-py-2 tw-px-3 tw-rounded-xl tw-cursor-pointer ${
            !moduleAccess
              ? "tw-bg-primary tw-text-white"
              : "tw-bg-white tw-text-primary"
          }`}
        >
          Доступ по разделам
        </div>
        <div
          onClick={() => setModuleAccess(true)}
          className={`tw-min-w-[150px] tw-py-2 tw-px-3 tw-rounded-xl tw-cursor-pointer ${
            moduleAccess
              ? "tw-bg-primary tw-text-white"
              : "tw-bg-white tw-text-primary"
          }`}
        >
          Доступ по модулям
        </div>
      </div>
      {moduleAccess
        ? selectedRows.map((id) => <ModuleAccess key={id} id={Number(id)} />)
        : selectedRows.map((id) => <Access key={id} id={Number(id)} />)}
      {Boolean(selectedRole) && (
        <Modal
          open={Boolean(selectedRole)}
          onClose={() => setSelectedRole(null)}
        >
          <StyledCard>
            <StyledCardHeader
              title={`Пользователи с ролью ${selectedRole.roleName}`}
            />
            <CardContent style={{ maxHeight: 300, overflow: "auto" }}>
              <Users id={selectedRole.id} />
            </CardContent>
          </StyledCard>
        </Modal>
      )}
    </Stack>
  );
}
