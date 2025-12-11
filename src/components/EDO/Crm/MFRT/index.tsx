import { useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Pagination,
  Tabs,
  Dialog,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CrmCreate } from "../create";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridSelectionModel,
  ruRU,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import { IActivitySearchRequestBody } from "@services/activityApi";
import { useFetchOrganizationsQuery } from "@services/organizationsApi";
import { organizationColumns } from "../statics/organizationColumns";
import styled from "@emotion/styled";
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

const TabList = styled(Tabs)`
  & .MuiTabs-flexContainer > .MuiButtonBase-root {
    border-right: 1px solid #cecece;
  }

  & .MuiTabs-flexContainer > .MuiButtonBase-root:first-child {
    border-left: 1px solid #cecece;
  }
` as typeof Tabs;

const Registry = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [createMode, setCreateMode] = useState(false);

  const [filters, setFilters] = useState<Nullable<IActivitySearchRequestBody>>({
    filtres: {
      state: null,
    },
  });

  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  const [totalItems, setTotalitems] = useState(0);

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

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
          window.open(`/modules/crm/organization/${params.id}`, "_blank");
          // navigate(`/modules/crm/organization/${params.id}`)
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
          orgType={{ id: "3", value: "Министерство и ведомства" }}
          m_new={true}
        />
      </Dialog>
    </div>
  );
};

export default Registry;
