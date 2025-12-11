import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Card, DataTable, ListIcon, FileAddIcon, Loading } from "@ui";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { EgovFiltersKey, IEgovFilters } from "./helpers/types";
import {
  initialFilters,
  initialRequest,
  statusOptions,
} from "./helpers/constants";
import { ValueId } from "@services/api";
import { headerTitles } from "./helpers/tableConstants";
import { deepCopy } from "@utils";
import {
  useFetchEgovGovernmentsQuery,
  useFetchEgovInnListQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { useSearchEgovApplicationQuery } from "@services/egov/application-resident";
import { IEgovApplicationSearchRequest } from "@services/egov/application-resident/models/search";
import { usePagination } from "@hooks";

type Props = {
  isIncoming?: boolean;
};

const Registry = (props: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [filters, setFilters] = useState<IEgovFilters>(
    deepCopy(initialFilters)
  );

  const { data: govermentList } = useFetchEgovGovernmentsQuery();
  const { data: innList } = useFetchEgovInnListQuery();
  const { data: yearList } = useFetchYearsQuery();

  const transformedFilter = useMemo(() => {
    const req: IEgovApplicationSearchRequest = deepCopy(initialRequest);
    req.filters = {
      year: Number(filters.year?.id) || 0,
      //inn: (filters.inn?.id && String(filters.inn?.id)) || '',
      inn: filters.inn || "",
      goverment: filters.goverment || null,
      state: Number(filters.state?.id) || null,
    };

    req.pageInfo.pageNumber = page + 1;
    req.pageInfo.pageSize = pageSize;

    return req;
  }, [filters, page, pageSize]);

  const { data: dataList, isFetching } =
    useSearchEgovApplicationQuery(transformedFilter);

  const yearOptions = useMemo(
    () =>
      yearList?.map((year) => ({
        id: year,
        value: String(year),
      })) || [],
    [yearList]
  );

  const handles = {
    getChangeFilter(key: EgovFiltersKey) {
      return (event: SyntheticEvent<Element, Event>, value: ValueId | null) => {
        setFilters({
          ...filters,
          [key]: {
            id: value?.id,
            value: value?.value,
          },
        });
      };
    },
  };

  return (
    <Card title={"Заявления на получение статуса резидента РТ"}>
      <div className="tw-py-4">
        <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-5">
          <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[200px] tw-gap-4">
            <Autocomplete
              disablePortal
              options={yearOptions}
              size="small"
              getOptionLabel={(option) => option.value as string}
              renderInput={(params) => <TextField {...params} label="Год" />}
              onChange={handles.getChangeFilter("year")}
            />
            <TextField
              label="ИНН"
              size="small"
              value={filters.inn}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setFilters({
                  ...filters,
                  inn: event.target.value,
                });
              }}
            />

            <Autocomplete
              disablePortal
              options={govermentList?.items || []}
              size="small"
              getOptionLabel={(option) => option.value as string}
              renderInput={(params) => (
                <TextField {...params} label="Государство" />
              )}
              onChange={handles.getChangeFilter("goverment")}
            />

            <Autocomplete
              disablePortal
              options={statusOptions}
              size="small"
              getOptionLabel={(option) => option.value as string}
              renderInput={(params) => <TextField {...params} label="Статус" />}
              onChange={handles.getChangeFilter("state")}
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
              onClick={() => {}}
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
          pushUri={"/modules/eGov/Application-of-resident/show"}
          columns={headerTitles}
          items={dataList?.items || []}
          isLoading={isFetching}
          totalItems={dataList?.total}
          {...pagination}
        />
      </div>
    </Card>
  );
};

export default Registry;
