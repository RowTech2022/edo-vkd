import { Autocomplete, Button, TextField, Tooltip } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  exportToPDF,
  IAccessMfRequestBody,
  IAccessMfRequestSearch,
  useCopyMFAccessFormMutation,
  useLazyFetchAccessFormsQuery,
} from "@services/accessMfApi";
import {
  useFetchTreasureCodesQuery,
  useFetchUserPositionsQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { useCheckAprovedDocAccessApplicationMutation } from "@services/tfmisApi";
import { ACCESS_MF_STATUSES, newDateFormat } from "@utils";
import { format } from "date-fns";
import { usePagination } from "@hooks";

const Registry = () => {
  const columns: GridColDef[] = [
     {
    field: 'id',
    headerName: 'ID',
    flex: 1,
    sortable: false,
    filterable: false,
  },
    {
      field: "user",
      headerName: "Пользователь",
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.regUserInfo?.value}>
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
          </Tooltip>
        );
      },
    },
    {
      field: "treasureCode",
      headerName: "Еденица учёта",
      flex: 2,
      valueGetter: (params) => `${params.value.id}-${params.value.value}`,
      //valueGetter: (params) => params.value.id,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={params.formattedValue}>
            <span>{params.formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "position",
      headerName: "Должность",
      flex: 1.5,
      valueGetter: (params) => params.value.value,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.position?.value}>
            <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
              {params.row.position?.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "state",
      headerName: "Статус",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const status = () => {
          if (params.value === 1) return "Оформление";
          if (params.value === 2) return "Согласование";
          if (params.value === 3) return "На утверждение";
          if (params.value === 200) return "Утвержден";
          if (params.value === 100) return "Удален";
          else return "Статус не определен";
        };
        return (
          <Tooltip title={status()}>
            <span>{status()}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "createdDate",
      headerName: "Дата создания",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={format(new Date(params.value), newDateFormat)}>
            <span>{format(new Date(params.value), newDateFormat)}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "year",
      headerName: "Финансовый год",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.year}>
            <span>{params.row.year}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "copy",
      headerName: "Копировать",
      sortable: false,
      renderCell: (params) => {
        return (
          <Tooltip title={"Копировать"} placement="top">
            <ContentCopyIcon onClick={(e) => onCopyClick(e, params)} />
          </Tooltip>
        );
      },
    },
  ];

  const navigate = useNavigate();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<MfAccessForm[]>();

  const [filters, setFilters] = useState<Nullable<IAccessMfRequestSearch>>({
    inn: "",
    treasureCode: null,
    userType: null,
    year: null,
    state: null,
  });

  const yearsQuery = useFetchYearsQuery();
  const userPositionsQuery = useFetchUserPositionsQuery();
  const treasureCodesQuery = useFetchTreasureCodesQuery();
  const [fetchMfAccessCopyForm] = useCopyMFAccessFormMutation();

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [checkAprovedDoc] = useCheckAprovedDocAccessApplicationMutation();

  const [fetchMfAccessForms, { isFetching }] = useLazyFetchAccessFormsQuery();

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
  const fetchData = async (args: Nullable<IAccessMfRequestBody>) => {
    const { data } = await fetchMfAccessForms({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = async () => {
    if (page === 0) {
      fetchData({
        pageInfo: { pageNumber: 1, pageSize: pageSize },
        filtres: filters,
      });
    } else {
      setPage(0);
    }
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

  const CheckUprovedDocsApplication = () => {
    navigate(`/modules/documents/mf-access-forms/create`);
  };

  const onCopyClick = async (e: any, params: any) => {
    e.stopPropagation();

    toast.promise(
      fetchMfAccessCopyForm({
        id: params.row.id,
      }).then((res: any) => {
        if ((res as any).data) {
          navigate(`/modules/documents/mf-access-forms/show/${res.data.id}`);
        } else {
          toast.error(
            "Ошибка при копирование документа: \n" +
              JSON.stringify(res.error?.data?.Message)
          );
        }
      }),
      {
        pending: "Идет копирование документа ",
        error: "Произошла ошибка",
      }
    );
  };

  return (
    <>
      <Card title="Реестр формы доступов">
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
                renderInput={(params) => <TextField {...params} label="Год" />}
              />

              <Autocomplete
                disablePortal
                options={
                  userPositionsQuery.isSuccess
                    ? userPositionsQuery.data.items
                    : []
                }
                getOptionLabel={(option) => option.value}
                size="small"
                renderInput={(params) => (
                  <CustomTextField params={params} label="Должность" />
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    userType: parseInt((value?.id as string) || ""),
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
                renderInput={(params) => (
                  <CustomTextField params={params} label="Код казн." />
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    treasureCode: parseInt((value?.id as string) || ""),
                  });
                }}
              />
              <Autocomplete
                disablePortal
                options={ACCESS_MF_STATUSES}
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
            pushUri="/modules/documents/mf-access-forms/show"
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
