import { useEffect, useState } from "react";
import { LinearProgress, Pagination } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridSelectionModel,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Card , RegionsAndAreas } from "@ui";
import { useNavigate } from "react-router";

import {
  useLazyFetchActivitySearchQuery,
  IActivitySearchRequestBody,
  IActivitySearchResult,
} from "@services/activityApi";
import { organizationColumns } from "../statics/organizationColumns";
import { useFetchOrganizationsQuery } from "@services/organizationsApi";

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

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<Nullable<IActivitySearchRequestBody>>({
    filtres: {
      state: null,
    },
  });

  const [items, setItems] = useState<IActivitySearchResult[]>();
  const [totalItems, setTotalitems] = useState(0);

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchActivitySearchQuery();

  const fetchData = async (
    args: Nullable<IActivitySearchRequestBody> | void
  ) => {
    const { data } = await fetchIncomingLetters(args);
    setItems(data?.items);
    setTotalitems(data?.total || 0);
  };

  const search = () => {
    setPage(1);
    fetchData({ pageInfo: { pageNumber: 1 }, ...filters });
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page }, ...filters });
  }, [page]);

  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  const { data: organizations, isFetching: orgFetching } =
    useFetchOrganizationsQuery(activeRegion || 0);

  return (
    <Card title="Реестр активностей">
      <div className="tw-py-4">
        <RegionsAndAreas
          onChange={(region: number) => setActiveRegion(region)}
        />

        <DataGrid
          classes={{
            root: "tw-bg-white !tw-rounded-lg",
            row: "tw-cursor-pointer",
          }}
          checkboxSelection
          columns={organizationColumns}
          rows={organizations?.items || []}
          selectionModel={selectedRows}
          loading={orgFetching}
          autoHeight
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          hideFooterSelectedRowCount
          initialState={{
            pagination: {
              page: 1,
              pageSize: 10,
            },
          }}
          pagination
          paginationMode="server"
          rowCount={totalItems}
          rowsPerPageOptions={[10]}
          components={{
            LoadingOverlay: LinearProgress,
            Pagination: CustomPagination,
          }}
          onPageChange={(page) => {
            setPage(page);
          }}
          onRowClick={(params) => {
            navigate(`/modules/crm/organization/${params.id}`);
          }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectedRows(newSelectionModel);
          }}
        />
      </div>
    </Card>
  );
};

export default Registry;
