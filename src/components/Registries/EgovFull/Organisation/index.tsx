import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { DataTable, FileAddIcon } from "@ui";
import { Link } from "react-router-dom";
import { IEgovServicesSearch } from "./helpers/types";
import { initialFilters } from "./helpers/constants";
import { headerTitles } from "./helpers/tableConstants";
import { deepCopy } from "@utils";
import {
  IEgovServicesSearchRequest,
  IEgovServicesSearchResponce,
  useLazyFetchEgovServicesQuery,
} from "@services/egovServices";
import { usePagination } from "@hooks";

type Props = {
  orgId: number;
};

const Registry = (props: Props) => {
  const { orgId } = props;

  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(0);
  const [items, setItems] = useState<IEgovServicesSearchResponce[]>();
  const [filters, setFilters] = useState<IEgovServicesSearch>(
    deepCopy(initialFilters)
  );

  const [fetchEgovServices, { isFetching }] = useLazyFetchEgovServicesQuery();

  const fetchData = async (args: Nullable<IEgovServicesSearchRequest>) => {
    const { data } = await fetchEgovServices({
      pageInfo: { pageNumber: page + 1, pageSize },
      ...args,
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  useEffect(() => {
    if (orgId)
      setFilters({
        ...filters,
        organisationId: orgId,
      });
  }, [orgId]);

  useEffect(() => {
    if (filters.organisationId !== 0)
      fetchData({
        pageInfo: { pageNumber: page + 1, pageSize },
        filters: filters,
      });
  }, [filters.organisationId, page, pageSize]);

  const changePageSize = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  return (
    <div className="tw-mb-4">
      <div className="tw-flex tw-flex-row-reverse tw-w-full tw-mb-5">
        <Link to={`/modules/egovFull/Organisation/${orgId}/create`}>
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
        </Link>
      </div>
      <DataTable
        pushUri={`/modules/egovFull/Organisation/${orgId}/show`}
        columns={headerTitles}
        items={items || []}
        isLoading={isFetching}
        totalItems={totalItems}
        {...pagination}
      />
    </div>
  );
};

export default Registry;
