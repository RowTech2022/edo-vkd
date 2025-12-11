import { useEffect, useState } from "react";
import { useDynamicSearchParams } from "./useDynamicSearchParams";

export const usePagination = () => {
  const { params, setParams } = useDynamicSearchParams();

  const [pagination, setPagination] = useState({
    page: Number(params.page) || 0,
    pageSize: Number(params.pageSize) || 10,
  });

  const setPage = (page: number) => {
    setParams("page", page);
    setPagination({
      ...pagination,
      page,
    });
  };

  const setPageSize = (pageSize: number) => {
    setParams({
      pageSize,
      page: 0,
    });

    setPagination({
      ...pagination,
      pageSize,
      page: 0,
    });
  };

  useEffect(() => {
    let newPagination = null;
    if (Number(params.page) !== pagination.page && params.page !== undefined) {
      newPagination = { ...pagination, page: Number(params.page) };
    }

    if (
      Number(params.pageSize) != pagination.pageSize &&
      params.pageSize !== undefined
    ) {
      newPagination = {
        ...(newPagination || pagination),
        pageSize: Number(params.pageSize),
      };
    }

    if (newPagination) setPagination(newPagination);
  }, [pagination.page, pagination.pageSize, params.page, params.pageSize]);

  return {
    ...pagination,
    setPage,
    setPageSize,
  };
};
