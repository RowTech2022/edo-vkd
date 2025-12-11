import { useEffect, useState } from "react";
import { Box, Button, LinearProgress, Dialog } from "@mui/material";
import { DataGrid, GridSelectionModel, ruRU } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";

import { applicationsColumn } from "./statics";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { RegionsAndAreas } from "@ui";
import {
  IApplication,
  IApplicationsRequest,
  useFetchApplicationsQuery,
} from "@services/applicationsApi";
import { RequestCreate } from "./create";

const Registry = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const filterDefault: IApplicationsRequest = {
    ids: null,
    filtres: {
      regionId: 0,
    },
    orderBy: {
      column: 1,
      order: 0,
    },
    pageInfo: {
      pageNumber: 1,
      pageSize: 0,
    },
  };

  const [activeRegion, setActiveRegion] = useState<number>(0);
  const [totalItems, setTotalItems] = useState(100);
  const [requests, setRequests] = useState<any>([]);
  const [createMode, setCreateMode] = useState(false);

  filterDefault.filtres.regionId = activeRegion;
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  filterDefault.pageInfo.pageNumber = page;
  const { data: applications, isFetching: orgFetching } =
    useFetchApplicationsQuery(filterDefault);

  const generateTableData = (items: IApplication[] = []) =>
    items.map(({ id, date, type, executor, region, state, createAt }, idx) => ({
      id,
      date,
      index: idx + 1,
      type: (type && type.value) || "",
      executor: executor.value || "",
      region: region.value || "",
      state,
      createAt,
    }));

  useEffect(() => {
    setRequests(generateTableData(applications?.items));
    setTotalItems(applications?.total || 0);
  }, [applications?.items]);

  return (
    <div className="tw-py-4">
      <RegionsAndAreas onChange={(region: number) => setActiveRegion(region)} />

      <Box display="flex" marginBottom="20px" justifyContent="end">
        <Link to={""}>
          <Button
            variant="contained"
            size="medium"
            onClick={() => setCreateMode(true)}
            startIcon={<AddCircleOutlineIcon fontSize="small" />}
          >
            Добавить
          </Button>
        </Link>
      </Box>
      <DataGrid
        classes={{
          root: "tw-bg-white !tw-rounded-2xl tw-border-[1px] tw-border-[#f6f4f3] tw-shadow-[0_0_4px_0_#00000025]",
          row: "tw-cursor-pointer",
        }}
        columns={applicationsColumn}
        rows={requests || []}
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
        page={page}
        pagination
        rowCount={totalItems}
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        components={{
          LoadingOverlay: LinearProgress,
        }}
        onPageChange={(page: any) => {
          setPage(page);
        }}
        onRowClick={(params: any) => {
          navigate(`/modules/requestsmodul/${params.id}`);
        }}
        onSelectionModelChange={(newSelectionModel: any) => {
          setSelectedRows(newSelectionModel);
        }}
      />
      <Dialog
        open={createMode}
        maxWidth="xl"
        onClose={() => {}}
        onBackdropClick={() => setCreateMode(false)}
      >
        <RequestCreate onClose={() => setCreateMode(false)} />
      </Dialog>
    </div>
  );
};

export default Registry;
