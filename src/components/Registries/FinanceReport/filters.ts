import { useState } from 'react'
import { IFinanceReportsSearchRequest } from '@services/financeReport/models/search'

export const useFilters = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [filters, setFilters] = useState<
    IFinanceReportsSearchRequest['filters']
  >({
    term: null,
    company: null,
    industry: null,
    state: null,
  })

  const requestData = {
    ids: null,
    filters,
    orderBy: {
      column: 1,
      order: 0,
    },
    pageInfo: {
      pageNumber: page,
      pageSize: perPage,
    },
  }

  return {
    requestData,
    setPage,
    setPerPage,
    setFilters,
  }
}
