import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { DataTable, ListIcon, Loading } from "@ui";
import { useNavigate } from "react-router";
import {
  IEgovServiceRequestsByIdsResponce,
  IEgovServiceRequestsByIdsSearchRequest,
  IEgovServiceRequestsSearchRequest,
  useLazyFetchEgovServiceRequestsByIdsQuery,
  useReadFlagChangeMutation,
} from "@services/egovServiceRequests";
import {
  EGOV_SERVICES_PAYMENT_STATUSES,
  getStatusName,
  newDateFormat,
} from "@utils";
import ClearIcon from "@mui/icons-material/Clear";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { statusLabel } from "../Organisation/helpers/constants";
import "./styles.css";
import {
  ExecutorColor,
  statusColor,
} from "@root/components/EDO/LettersV3.5/ExternalCorrespondence/Incoming";
import { toast } from "react-toastify/dist";
import { usePagination } from "@hooks";

export const tabsOptions: any[] = [
  {
    label: "Физическое лицо",
    value: "individual",
    code: 1,
  },
  {
    label: "Юридическое  лицо",
    value: "entity",
    code: 2,
  },
];

type Props = {
  orgId: number;
  srvId: string | number;
};

const Registry = (props: Props) => {
  const { orgId, srvId } = props;
  const navigate = useNavigate();
  const savedPage = Number(localStorage.getItem("page")) || 0;
  const savedPageSize = Number(localStorage.getItem("pageSize")) || 10;

  const savedFilters = JSON.parse(localStorage.getItem("filters") || "{}");

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<IEgovServiceRequestsByIdsResponce[]>();

  const [filters, setFilters] = useState<
    Nullable<IEgovServiceRequestsByIdsSearchRequest>
  >({
    organisationId: savedFilters.organisationId || null,
    serviceId: savedFilters.serviceId || null,
    state: savedFilters.state || null,
    docType: savedFilters.docType || null,
    payState: savedFilters.payState || null,
    userName: savedFilters.userName || "",
    paySum: savedFilters.paySum || null,
    date: savedFilters.date || null,
  });

  const [fetchServiceByIds, { isFetching }] =
    useLazyFetchEgovServiceRequestsByIdsQuery();

  const [changeReadFlag] = useReadFlagChangeMutation();

  const fetchDataServiceById = async (
    args: Nullable<IEgovServiceRequestsSearchRequest>
  ) => {
    const { data } = await fetchServiceByIds({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value ? value : null,
    };

    setFilters(updatedFilters);
    localStorage.setItem("filters", JSON.stringify(updatedFilters));
  };

  const fetchData = async (
    args: Nullable<IEgovServiceRequestsSearchRequest>
  ) => {
    const { data } = await fetchServiceByIds({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    // setFolderInfo(data?.folderInfo)
    setTotalItems(data?.total || 0);
  };

  const refetch = () => {
    fetchData({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const handleDateChange = (newValue: Date | null) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      date: newValue,
    }));
  };

  const handleSearch = () => {
    fetchDataServiceById({
      pageInfo: { pageNumber: page + 1, pageSize },
      filters: filters,
    });
  };

  const columnsServiceItems = [
    {
      field: "id",
      headerName: "№",
      flex: 1.1,
      sortable: false,
      filterable: false,
      cellClassName: "tw-relative tw-[120px]",

      renderCell: (params: any) => {
        const cls = params.row.isNew ? "flag" : "disabled-flag";
        return (
          <>
            <div
              className={cls}
              onClick={async (e) => {
                e.stopPropagation();
                await changeReadFlag({
                  id: params.id,
                  read: !params.row.isNew,
                });
                await refetch();
              }}
            ></div>
            <div className="tw-pl-[18px]">{params.row.id}</div>
          </>
        );
      },
    },
    // {
    //   field: 'incomeNumber',
    //   headerName: 'Входящий номер',
    //   flex: 1,
    //   sortable: false,
    //   filterable: false,
    //   cellClassName: 'tw-relative tw-[120px]',
    //   renderCell: (params) => {
    //     const cls = params.row.isNew ? 'flag' : 'disabled-flag'
    //     return (
    //       <>
    //         <div
    //           className={cls}
    //           onClick={async (e) => {
    //             e.stopPropagation()
    //             await changeReadFlag({
    //               id: params.id,
    //               read: !params.row.isNew,
    //             })
    //             await refetch()
    //           }}
    //         ></div>
    //         <div className="tw-pl-[18px]">{params.row.incomeNumber}</div>
    //       </>
    //     )
    //   },
    // },
    {
      field: "service",
      headerName: "Услуга",
      flex: 2,
      sortable: false,
      filterable: false,
      maxWidth: 100,
      valueFormatter: (params: any) => params.value.value,
    },
    {
      field: "user",
      headerName: "Пользователь",
      flex: 2,
      sortable: false,
      filterable: false,
      valueFormatter: (params: any) => params.value.value,
    },
    {
      field: "state",
      headerName: "Статус заявки",
      flex: 2,
      sortable: false,
      filterable: false,
      valueFormatter: (row: any) =>
        getStatusName(row.value, "egov_full_service"),
      renderCell: (row: any) => (
        <Tooltip title={getStatusName(row.value, "egov_full_service")}>
          <span>{getStatusName(row.value, "egov_full_service")}</span>
        </Tooltip>
      ),
    },
    {
      field: "payState",
      headerName: "Статус оплаты",
      flex: 2,
      sortable: false,
      filterable: false,
      valueFormatter: (row: any) =>
        getStatusName(row.value, "egov_service_payment"),
      renderCell: (row: any) => (
        <Tooltip title={getStatusName(row.value, "egov_service_payment")}>
          <span>{getStatusName(row.value, "egov_service_payment")}</span>
        </Tooltip>
      ),
    },
    {
      field: "docType",
      headerName: "Тип документа",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (row: any) => {
        return tabsOptions.find((item) => item.code === row.value)?.label;
      },
    },
    {
      field: "invoicePaidMoney",
      headerName: "Сумма",
      flex: 1.5,
      sortable: false,
      filterable: false,
      maxWidth: 80,
    },
    {
      field: "createAt",
      headerName: "Дата создания",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (row: any) => {
        return <>{row?.value?.slice(0, 19)?.replace("T", " ")}</>;
      },
    },
    {
      field: "invoiceNumberCode",
      headerName: "Счёт",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (row: any) => {
        return <>{row?.value}</>;
      },
    },
    {
      field: "invoiceNumber",
      headerName: "Квитанция",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <IconButton
            sx={{
              cursor:
                params.row.payState !== 1 && params.row.payState !== 2
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={(e: any): void => {
              e.stopPropagation();

              //@ts-ignore
              if (params.row.payState == null || params.row.payState == 0) {
                toast.error("Номер счета не найден ");
              } else {
                if (params.row.payState !== 1 || params.row.payState !== 2) {
                  window.open(
                    (import.meta.env.VITE_PUBLIC_RECIEPT_PATH || "") +
                      params.value
                  );
                }
              }
            }}
          >
            <UploadFile />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    setFilters({
      ...filters,
      organisationId: orgId,
      serviceId: Number(srvId),
    });
  }, [srvId, orgId]);

  useEffect(() => {
    if (filters.organisationId && filters.serviceId) {
      fetchDataServiceById({
        pageInfo: { pageNumber: page + 1, pageSize },
        filters: filters,
      });
    } else {
      setItems([]);
      setTotalItems(0);
    }
  }, [filters, page, pageSize]);

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
    localStorage.setItem("pageSize", newPageSize.toString());
  };

  return (
    <div className="tw-mb-4">
      <div className="tw-flex tw-flex-row-reverse tw-w-full tw-mb-5">
        {/* <Link
          to={`/modules/egovFull/Organisation/${orgId}/Service/${srvId}/create`}
        >
          <Button
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
        </Link> */}
      </div>
      <div className="tw-flex tw-gap-2 tw-mb-8">
        <TextField
          value={filters.userName || ""}
          size="small"
          label="Пользователь"
          name="userName"
          onChange={handleFilterChange}
        />
        <TextField
          value={filters.userPhone || ""}
          size="small"
          label="Номер телефона"
          name="userPhone"
          onChange={handleFilterChange}
        />
        <TextField
          sx={{ width: "200px" }}
          select
          value={filters.state}
          size="small"
          label="Статус заявки"
          name="state"
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: filters.state && (
              <InputAdornment position="end" sx={{ pr: 2 }}>
                <IconButton
                  onClick={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      state: null,
                    }));
                    localStorage.setItem(
                      "filters",
                      JSON.stringify({ ...filters, state: null })
                    );
                  }}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        >
          {Object.entries(statusLabel).map(([id, label]) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          sx={{ width: "200px" }}
          select
          value={filters.payState !== null ? filters.payState : ""}
          size="small"
          label="Статус оплаты"
          name="payState"
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: filters.payState !== null && (
              <InputAdornment position="end" sx={{ pr: 2 }}>
                <IconButton
                  onClick={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      payState: null,
                    }));
                    localStorage.setItem(
                      "filters",
                      JSON.stringify({ ...filters, payState: null })
                    );
                  }}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        >
          {EGOV_SERVICES_PAYMENT_STATUSES.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {status?.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          sx={{ width: "200px" }}
          select
          value={filters.docType || ""}
          size="small"
          label="Тип документа"
          name="docType"
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: filters.docType && (
              <InputAdornment position="end" sx={{ pr: 2 }}>
                <IconButton
                  onClick={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      docType: null,
                    }));
                    localStorage.setItem(
                      "filters",
                      JSON.stringify({ ...filters, docType: null })
                    );
                  }}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        >
          {tabsOptions.map((item, i) => (
            <MenuItem key={i} value={item.code}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          value={filters.paySum || ""}
          size="small"
          label="Сумма"
          name="paySum"
          onChange={handleFilterChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filters.date || null}
            onChange={handleDateChange}
            inputFormat={newDateFormat}
            label="Дата"
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
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
          onClick={handleSearch}
        >
          Список
        </Button>
      </div>
      <DataTable
        sx={{
          "& .mf_cell_expired": {
            background: "#ff0000c7",
            opacity: 0.7,
            color: "white",
          },
        }}
        pushUri={`/modules/egovFull/Organisation/${orgId}/Service/${srvId}/show`}
        columns={columnsServiceItems}
        items={items}
        isLoading={isFetching}
        getRowClassName={(params: any) => {
          const cls = ExecutorColor[params.row.color]
            ? statusColor[params.row.color]
            : "";
          return params.row.isNew
            ? `unread-flag change-read-flag ${cls}`
            : `read-flag change-read-flag ${cls}`;
        }}
        totalItems={totalItems}
        checkboxSelection={false}
        getCellClassName={(params: any) => {
          const cls = ExecutorColor[params.row.color]
            ? statusColor[params.row.color]
            : "";
          return params.row.color && cls;
        }}
        {...pagination}
      />
    </div>
  );
};

export default Registry;
