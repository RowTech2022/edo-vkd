import { useEffect, useState } from "react";
import {
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  GridSelectionModel,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Autocomplete, Button, Pagination, TextField } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  Card,
  FileAddIcon,
  DownloadIcon,
  DataTable,
  ListIcon,
  Loading,
  CustomTextField,
} from "@ui";
import { useFetchOnlyPBSQRQuery } from "@services/pbsApi";
import {
  useFetchTreasureCodesQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import {
  exportToPDF,
  TFMISAccessApplicationsRequestBody,
  TFMISAccessApplicationsRequestSearch,
  useCheckAprovedDocAccessApplicationMutation,
  useLazyFetchTFMISAccessApplicationsQuery,
} from "@services/tfmisApi";
import { ACCESS_TFMIS_STATUSES, formatDate } from "@utils";
import { Link, useNavigate } from "react-router-dom";
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
    field: "pbs",
    headerName: "ПБС",
    flex: 1,
    valueGetter: (params) => params.value?.id,
    sortable: false,
    filterable: false,
  },
  {
    field: "treasureCode",
    headerName: "Единица учета",
    flex: 2,
    valueGetter: (params) => `${params.value.id}-${params.value.value}`,
    sortable: false,
    filterable: false,
  },
  {
    field: "inn",
    headerName: "ИНН",
    flex: 1.5,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 1,
    sortable: false,
    valueFormatter: (params) => {
      if (params.value === 1) return "Оформление";
      if (params.value === 2) return "Руководитель БО";
      if (params.value === 3) return "Куратор(ПБ)";
      if (params.value === 4) return "Начальник отдела (ПБ)";
      if (params.value === 5) return "Куратор (ИБ)";
      if (params.value === 6) return "Начальник отдела (ИБ)";
      if (params.value === 7) return "На утверждение";
      if (params.value === 200) return "Утвержден";
      if (params.value === 100) return "Удален";
      else return "Статус не определен";
    },
    filterable: false,
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
    align: "center",
  },
];

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
};

const Registry = () => {
  const navigate = useNavigate();

  const savedPage = Number(localStorage.getItem("page")) || 0;
  const savedPageSize = Number(localStorage.getItem("pageSize")) || 10;

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<TFMISApplication[]>();

  const savedFilters = JSON.parse(localStorage.getItem("filters") || "{}");
  const [filters, setFilters] = useState<TFMISAccessApplicationsRequestSearch>({
    pbs: savedFilters.pbs || "",
    treasureCode: savedFilters.treasureCode || null,
    year: savedFilters.year || null,
    state: savedFilters.state || null,
  });

  const yearsQuery = useFetchYearsQuery();
  //const pbsQuery1 = useFetchPBSQuery()
  const pbsQuery = useFetchOnlyPBSQRQuery();

  const treasureCodesQuery = useFetchTreasureCodesQuery();

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [checkAprovedDoc] = useCheckAprovedDocAccessApplicationMutation();

  const [fetchTFMISAccessApplications, { isFetching }] =
    useLazyFetchTFMISAccessApplicationsQuery();

  const fetchData = async (
    args: Nullable<TFMISAccessApplicationsRequestBody>
  ) => {
    const { data } = await fetchTFMISAccessApplications({
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
    setPage(0);
    setPageSize(newPageSize);
    localStorage.setItem("pageSize", newPageSize.toString());
  };

  useEffect(() => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filtres: filters,
    });
  }, [page, pageSize, filters]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

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

  const CheckUprovedDocsApplication = () => {
    navigate(`/modules/documents/tfmis-access-applications/create`);
  };

  return (
    <>
      <Card title="Реестр заявок">
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
                value={filters.year} // Делаем year значением фильтра
                onChange={(event, value) => {
                  setFilters({ ...filters, year: value });
                }}
                size="small"
                renderInput={(params) => <TextField {...params} label="Год" />}
              />
              <Autocomplete
                disablePortal
                options={pbsQuery.isSuccess ? pbsQuery.data.items : []}
                getOptionLabel={(option) => option.value}
                size="small"
                value={
                  pbsQuery.isSuccess
                    ? pbsQuery.data.items.find(
                        (item) => item.id === filters.pbs
                      )
                    : null
                }
                renderInput={(params) => (
                  <CustomTextField params={params} label="ПБС" />
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    pbs: value?.id || "",
                  });
                }}
              />
              <Autocomplete
                disablePortal
                options={
                  treasureCodesQuery.isSuccess
                    ? treasureCodesQuery.data.items
                    : []
                }
                getOptionLabel={(option) => option.value}
                size="small"
                value={
                  treasureCodesQuery.isSuccess
                    ? treasureCodesQuery.data.items.find(
                        (item) => item.id === filters.treasureCode
                      ) || null
                    : null
                }
                renderInput={(params) => (
                  <CustomTextField params={params} label="Единица учета" />
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    // @ts-ignore
                    treasureCode: value ? value.id : null,
                  });
                }}
              />
              <Autocomplete
                disablePortal
                options={ACCESS_TFMIS_STATUSES}
                getOptionLabel={(option) => option.name}
                size="small"
                value={
                  ACCESS_TFMIS_STATUSES.find(
                    (item) => item.id === filters.state
                  ) || null
                }
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
                    state: value?.id || null,
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
            pushUri="/modules/documents/tfmis-access-applications/show"
            columns={columns}
            items={items}
            isLoading={isFetching}
            totalItems={totalItems}
            {...pagination}
          />
        </div>
      </Card>
    </>
  );
};

export default Registry;
