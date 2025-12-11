import {
  Card,
  DataTable,
  ListIcon,
  Loading,
  FileAddIcon,
  CustomTextField,
} from "@ui";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLazyFinanceReportsQuery } from "@services/financeReport";
import { columns, financeReportStatuses } from "./helper/constant";
import { useFilters } from "./filters";
import {
  useFetchIndustriesQuery,
  useFetchOrganisationListQuery,
} from "@services/generalApi";
import { ValueId } from "@services/api";
import { newDateFormat, toISOString } from "@utils";
import { usePagination } from "@hooks";

const Registry = () => {
  const [text, setText] = useState<string | undefined>();
  const { requestData, setFilters } = useFilters();
  const [fetchFinanceReports, { data, isFetching }] =
    useLazyFinanceReportsQuery();
  const { data: companyList } = useFetchOrganisationListQuery({ text });
  const { data: industryList } = useFetchIndustriesQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const { filters } = requestData;
  const search = () => {};
  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };

  useEffect(() => {
    fetchFinanceReports({
      ...requestData,
      pageInfo: {
        pageNumber: page + 1,
        pageSize,
      },
    });
  }, []);

  return (
    <Card title="Реестр финансовых отчетов">
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
            <Autocomplete<ValueId>
              disablePortal
              options={companyList?.items || []}
              size="small"
              getOptionLabel={(option) => option.value}
              renderInput={(params) => (
                <CustomTextField params={params} label="Предприятие" />
              )}
              onChange={(event, value) => {
                setText(value?.value);
              }}
              onInputChange={onCompanyInputChange}
            />
            <Autocomplete
              disablePortal
              options={industryList?.items || []}
              onChange={(event, value) => {
                setFilters({ ...filters, industry: value });
              }}
              size="small"
              getOptionLabel={(option) => option.value}
              renderInput={(params) => (
                <CustomTextField params={params} label="Отрасль" />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата"
                inputFormat={newDateFormat}
                value={filters.term}
                onChange={(newValue: any) => {
                  setFilters({
                    ...filters,
                    term: toISOString(newValue) || null,
                  });
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              options={financeReportStatuses}
              onChange={(event, value) => {
                setFilters({ ...filters, state: value?.value || 0 });
              }}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Статус" />
              )}
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
          <Link to={`${pathname}/create`}>
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
        <DataTable
          pushUri="/modules/finance-report/show"
          columns={columns}
          items={data?.items || []}
          isLoading={isFetching}
          totalItems={data?.total}
          {...pagination}
        />
      </div>
    </Card>
  );
};

export default Registry;
