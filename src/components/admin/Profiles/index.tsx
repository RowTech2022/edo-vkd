import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { Input, InputGroup, DataTable } from "@ui";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonIcon from "@mui/icons-material/Person";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  UserSearchRequest,
  UserSearchRequestBody,
  UserResponseBody,
  UserSearchResponseBody,
  useLazyFetchUsersQuery,
} from "@services/admin/userApi";
import { useFetchUserTypesQuery } from "@services/generalApi";
import { USER_STATUSES } from "@utils";
import { useNavigate } from "react-router";
import { usePagination } from "@hooks";

const columns: GridColumns = [
  {
    field: "name",
    headerName: "ФИО",
    sortable: false,
    filterable: false,
    flex: 2,
    renderCell: (params: any) => {
      const { name, surName } = params?.row?.general;
      return `${surName} ${name}`;
    },
  },
  {
    field: "email",
    headerName: "Email",
    sortable: false,
    filterable: false,
    renderCell: (row: any) => row?.row?.general?.email,
  },
  {
    field: "inn",
    headerName: "ИНН",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (row: any) => row?.row?.general?.inn,
  },
  {
    field: "phone",
    headerName: "Телефон",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (row: any) => row?.row?.general?.phone,
  },
  {
    field: "passportNumber",
    headerName: "Паспорт",
    flex: 2,
    sortable: false,
    filterable: false,
    renderCell: (row: any) => row?.row?.general?.passportNumber,
  },
];

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserResponseBody>();
  const pagination = usePagination();
  const [items, setItems] = useState<UserSearchResponseBody[]>();
  const [totalItems, setTotalItems] = useState<number>(10);
  const [filters, setFilters] = useState<Nullable<UserSearchRequest>>();

  const { data: userTypes } = useFetchUserTypesQuery();
  const [fetchUsers, { isFetching }] = useLazyFetchUsersQuery();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const fetchData = async (args: Nullable<UserSearchRequestBody>) => {
    const { data } = await fetchUsers({
      pageInfo: { pageNumber: page, pageSize: pageSize },
      orderBy: { column: 1, order: 1 },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  useEffect(() => {
    fetchData({
      filtres: filters,
      pageInfo: { pageNumber: page + 1, pageSize: pageSize },
    });
  }, [page, pageSize]);

  const handleRowClick = (row: any) => {
    setUser(row);
  };

  const handleRowDoubleClick = (row: any) => {
    handleProfileClick(row?.id);
  };

  const refetch = () => {
    fetchData({
      filtres: filters,
      pageInfo: { pageNumber: 1, pageSize: pageSize },
    });
  };

  const handleSearch = () => {
    setPage(0);
    refetch();
  };

  const handleCreate = () => {
    navigate("/users/me/admin/create");
  };

  const handleProfileClick = (id?: number) => {
    navigate(`/users/me/admin/profile/${id || user?.id}`);
  };

  const handleTableClear = () => {
    setItems([]);
    setTotalItems(0);
  };

  const handleFormClear = () => {
    setFilters({});
  };

  return (
    <div className="tw-my-5">
      <form>
        <div className="tw-flex tw-columns-2 tw-gap-5 sm:tw-flex-wrap tw-flex-nowrap">
          <div>
            <div className="tw-flex-row tw-h-10">Условия поиска:</div>
            <div className="tw-flex-row">
              <InputGroup>
                <Input
                  label="Логин"
                  name="login"
                  type="text"
                  value={filters?.login}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      login: event.target.value,
                    });
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Input
                  label="Имя"
                  name="name"
                  type="text"
                  value={filters?.name || ""}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      name: event.target.value,
                    });
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Input
                  label="Фамилия"
                  name="surName"
                  type="text"
                  value={filters?.surName}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      surName: event.target.value,
                    });
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Input
                  label="ИНН пользователя"
                  name="inn"
                  type="text"
                  value={filters?.inn}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      inn: event.target.value,
                    });
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Input
                  label="Номер телефона"
                  name="phone"
                  type="phone"
                  value={filters?.phone}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      phone: event.target.value,
                    });
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Input
                  type="select"
                  label="Тип пользователя"
                  name="userType"
                  value={filters?.userType}
                  options={userTypes?.items}
                  onChange={(_, value) => {
                    setFilters({
                      ...filters,
                      userType: {
                        id: value?.id?.toString() || "",
                        value: value?.value || "",
                      },
                    });
                  }}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Input
                  type="select"
                  label="Статус пользователя"
                  name="status"
                  options={USER_STATUSES}
                  onChange={(_, value) => {
                    setFilters({
                      ...filters,
                      status: value?.id,
                    });
                  }}
                  value={USER_STATUSES.find((e) => e.id == filters?.status)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Input
                  label="Сертификат"
                  name="certification"
                  type="text"
                  value={filters?.certification}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      certification: event.target.value,
                    });
                  }}
                />
              </InputGroup>
            </div>
            <div className="tw-flex tw-gap-5">
              <Button
                variant="outlined"
                color="success"
                endIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Найти
              </Button>
              <Button
                type="reset"
                variant="outlined"
                color="error"
                endIcon={<CancelIcon fill="red" />}
                onClick={() => handleFormClear()}
              >
                Очистить
              </Button>
            </div>
          </div>
          <div className="tw-flex-grow">
            <div className="tw-flex tw-justify-between">
              <div className="tw-flex tw-items-center tw-flex-row tw-h-10 tw-gap-5 tw-mb-2">
                <Button
                  variant="outlined"
                  startIcon={
                    <PersonAddAltIcon fill="currentColor" stroke="none" />
                  }
                  onClick={handleCreate}
                >
                  Создать
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => handleProfileClick()}
                  disabled={!user}
                >
                  Профиль
                </Button>
                <Button
                  variant="outlined"
                  startIcon={
                    <PersonRemoveIcon fill="currentColor" stroke="none" />
                  }
                  onClick={handleTableClear}
                >
                  Очистить таблицу
                </Button>
              </div>
            </div>
            <div className="tw-flex-row tw-h-full">
              <DataTable
                sx={{
                  "& .MuiDataGrid-columnHeadersInner": { paddingX: "10px" },
                  "& .MuiDataGrid-row": { paddingX: "10px" },
                }}
                checkboxSelection={false}
                onRowDoubleClick={handleRowDoubleClick}
                onRowClick={handleRowClick}
                columns={columns}
                items={items}
                isLoading={isFetching}
                totalItems={totalItems || 0}
                getRowId={(row: any) => row.general.id}
                {...pagination}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
