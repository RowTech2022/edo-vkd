import { Autocomplete, Button, TextField } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import {
  Card,
  DownloadIcon,
  DataTable,
  ListIcon,
  CustomTextField,
  Loading,
  FileAddIcon,
} from "@ui";
import { ChangeEvent, useEffect, useState } from "react";
import {
  AccountantResponsibilityDTO,
  exportToPDF,
  IAccountantResponsibilitiesRequestBody,
  IAccountantResponsibilitiesRequestSearch,
  useCheckAprovedDocAccountantResponsibilitiesMutation,
  useLazyFetchAccountantResponsibilitiesQuery,
} from "@services/accountantApi";
import { useFetchYearsQuery } from "@services/generalApi";
import { ACCOUNTANT_RESPONSIBILITY_STATUSES, formatDate } from "@utils";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "user",
    headerName: "Пользователь",
    flex: 1.5,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return (
        <div className="tw-flex tw-gap-2 tw-items-center">
          {params.row.regUserInfo?.avatar ? (
            <img
              className="tw-w-11 tw-h-11 tw-rounded-full"
              src={params.row.regUserInfo?.avatar}
              alt=""
            />
          ) : (
            <AccountCircleOutlinedIcon sx={{ fontSize: 44 }} />
          )}
          {params.row.regUserInfo?.value}
        </div>
      );
    },
  },
  {
    field: "orgName",
    headerName: "Название организации",
    flex: 4,
    sortable: false,
    filterable: false,
  },
  {
    field: "inn",
    headerName: "ИНН",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 1,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      if (params.value === 1) return "Оформление";
      if (params.value === 2) return "Руководитель БО";
      if (params.value === 3) return "ГРБС";
      if (params.value === 4) return "Утверждено";
      if (params.value === 100) return "Удален";
      if (params.value === 200) return "Утвержден";
      else return "Статус не определен3";
    },
  },
  {
    field: "createdDate",
    headerName: "Дата создания",
    flex: 1,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
    sortable: false,
    filterable: false,
  },
  {
    field: "year",
    headerName: "Финансовый год",
    flex: 1,
    sortable: false,
    filterable: false,
  },
];

const Registry = () => {
  const navigate = useNavigate();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState(0);
  const [checkAprovedDoc] =
    useCheckAprovedDocAccountantResponsibilitiesMutation();
  const [items, setItems] = useState<AccountantResponsibilityDTO[]>();

  const [filters, setFilters] = useState<
    Nullable<IAccountantResponsibilitiesRequestSearch>
  >({
    inn: "",
    state: null,
    year: null,
  });

  const yearsQuery = useFetchYearsQuery();
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchAccountantResponsibilities, { isFetching }] =
    useLazyFetchAccountantResponsibilitiesQuery();

  const fetchData = async (
    args: Nullable<IAccountantResponsibilitiesRequestBody> | void
  ) => {
    const { data } = await fetchAccountantResponsibilities({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = () => {
    if (page === 0) {
      fetchData({
        pageInfo: { pageNumber: 1, pageSize: pageSize },
        filtres: filters,
      });
    } else {
      setPage(0);
    }
  };

  const CheckUprovedDocsApplication = () => {
    navigate(`/modules/documents/chief-accountant-job-responsibilities/create`);
  };

  const handleDownloadPDF = async () => {
    const response = await exportToPDF({
      ids: selectedRows.map((v) => parseInt(v.toString())),
      ...filters,
      pageInfo: { pageNumber: page + 1, pageSize },
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "document.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filtres: filters,
    });
  }, [page, pageSize]);

  return (
    <Card title="Реестр должностных обязанностей бухгалтера">
      <div className="tw-mb-4">
        <div className="tw-flex tw-justify-between tw-w-full tw-gap-4 tw-mb-4">
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(187px, 1fr))",
              gap: 12,
            }}
          >
            <Autocomplete
              disablePortal
              options={yearsQuery.isSuccess ? yearsQuery.data : []}
              getOptionLabel={(option) => option.toString()}
              value={filters.year}
              onChange={(event, value) => {
                setFilters({ ...filters, year: value });
              }}
              size="small"
              renderInput={(params) => (
                <TextField {...params} label="Год"></TextField>
              )}
            />
            <TextField
              label="ИНН"
              size="small"
              value={filters.inn}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setFilters({ ...filters, inn: event.target.value });
              }}
            />
            <Autocomplete
              disablePortal
              options={ACCOUNTANT_RESPONSIBILITY_STATUSES}
              getOptionLabel={(option) => option.name}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} name="state" label="Статус" />
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
            <Button
              style={{ display: "none" }}
              startIcon={
                <DownloadIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={handleDownloadPDF}
            >
              Скачать в PDF
            </Button>
          </div>
          <Link to={""}>
            <Button
              className="tw-h-fit tw-float-right"
              variant="contained"
              color="primary"
              startIcon={
                <FileAddIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={CheckUprovedDocsApplication}
            >
              Добавить
            </Button>
          </Link>
        </div>

        <DataTable
          pushUri="/modules/documents/chief-accountant-job-responsibilities/show"
          columns={columns}
          items={items}
          isLoading={isFetching}
          totalItems={totalItems}
          {...pagination}
        />
      </div>
    </Card>
  );
};

export default Registry;
