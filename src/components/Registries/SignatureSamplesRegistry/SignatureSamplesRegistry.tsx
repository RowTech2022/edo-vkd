import { Autocomplete, Button, TextField } from "@mui/material";
import { GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import {
  Card,
  DownloadIcon,
  DataTable,
  ListIcon,
  FileAddIcon,
  Loading,
  CustomTextField,
} from "@ui";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { ChangeEvent, useEffect, useState } from "react";
import { useFetchYearsQuery } from "@services/generalApi";
import {
  exportToPDF,
  ISignatureCardRequestBody,
  ISignatureCardRequestSearch,
  SignatureSamplesCardDTO,
  useLazyFetchSignaturesSampleCardsQuery,
} from "@services/signatureCardApi";
import { CARD_SIGNATURE_STATUSES, formatDate } from "@utils";
import { AppRoutes } from "@configs";
import { usePagination } from "@hooks";

const columns: GridColDef[] = [
  {
    field: "user",
    headerName: "Пользователь",
    flex: 2,
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
    flex: 2,
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
    flex: 2,
    valueFormatter: (params) => {
      if (params.value === 1) return "Оформление";
      if (params.value === 2) return "Руководитель БО";
      if (params.value === 3) return "ГРБС";
      if (params.value === 4) return "Утвержден";
      if (params.value === 200) return "Утверждено";
      if (params.value === 100) return "Удален";
      else return "Статус не определен";
    },
    sortable: false,
    filterable: false,
  },
  {
    field: "createdDate",
    headerName: "Дата создания",
    flex: 2,
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
  const { pathname } = useLocation();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const savedPage = Number(localStorage.getItem("page")) || 0;
  const savedPageSize = Number(localStorage.getItem("pageSize")) || 10;

  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<SignatureSamplesCardDTO[]>();

  const [filters, setFilters] = useState<Nullable<ISignatureCardRequestSearch>>(
    {
      inn: "",
      state: null,
      year: null,
    }
  );

  const yearsQuery = useFetchYearsQuery();

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [fetchSignatureSampleCards, { isFetching }] =
    useLazyFetchSignaturesSampleCardsQuery();

  const fetchData = async (args: Nullable<ISignatureCardRequestBody>) => {
    const { data } = await fetchSignatureSampleCards({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = async () => {
    if (page === 0) {
      fetchData({
        pageInfo: { pageNumber: 1, pageSize },
        filtres: filters,
      });
    } else {
      setPage(0);
    }
  };

  const changePageSize = (newPageSize: number) => {
    setPage(0); // Reset to the first page when the page size changes
    setPageSize(newPageSize);
    localStorage.setItem("page", "0"); // Reset page to 0 when changing page size
    localStorage.setItem("pageSize", newPageSize.toString());
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

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filtres: filters,
    });
  }, [page, pageSize]);

  return (
    <Card title="Реестр образцов подписей">
      <div className="tw-mb-4">
        <div className="tw-flex tw-justify-between tw-space tw-w-full tw-gap-4 tw-mb-4">
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
              options={CARD_SIGNATURE_STATUSES}
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
          <Link to={AppRoutes.DOCUMENTS_SIGNATURES_SAMPLE_CARD_CREATE}>
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
            >
              Добавить
            </Button>
          </Link>
        </div>

        <DataTable
          pushUri="/modules/documents/signatures-sample-card/show"
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
