import { useEffect, useState } from "react";
import { Box, Button, LinearProgress, Pagination, Dialog } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridSelectionModel,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CrmCreate } from "../create";
import { useNavigate } from "react-router";

import {
  useLazyFetchActivitySearchQuery,
  IActivitySearchRequestBody,
  IActivitySearchResult,
} from "@services/activityApi";
import { organizationColumns } from "../statics/organizationColumns";
import { useFetchOrganizationsQuery } from "@services/organizationsApi";
import { RegionsAndAreas } from "@ui";

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

  const [createMode, setCreateMode] = useState(false);

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
    <div className="tw-py-4">
      <RegionsAndAreas onChange={(region: number) => setActiveRegion(region)} />

      <Box display="flex" marginBottom="15px" justifyContent="end">
        <Button
          type="button"
          color="primary"
          variant="contained"
          size="medium"
          onClick={() => setCreateMode(true)}
          sx={{ fontWeight: 600, height: "42px" }}
          startIcon={<AddCircleOutlineIcon fontSize="small" />}
        >
          Добавить
        </Button>
      </Box>
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
      <Dialog
        open={createMode}
        maxWidth="lg"
        onClose={() => {}}
        onBackdropClick={() => setCreateMode(false)}
      >
        <CrmCreate
          onClose={() => setCreateMode(false)}
          orgType={{ id: "2", value: "Коммерческая организация" }}
          m_new={true}
        />
      </Dialog>
    </div>
  );
};

export default Registry;
