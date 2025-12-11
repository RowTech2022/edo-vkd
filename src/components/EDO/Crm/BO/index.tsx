import { useEffect, useState } from "react";
import { Button, Box, LinearProgress, Dialog } from "@mui/material";
import { DataGrid, GridSelectionModel, ruRU } from "@mui/x-data-grid";
import { CrmCreate } from "../create";
import {
  useLazyFetchOrganisationSearchQuery,
  IOrganizationSearchRequest,
  IOrganizationSearchResponse,
} from "@services/organizationsApi";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Card, RegionsAndAreas, CustomPagination } from "@ui";
import { useNavigate } from "react-router";
import { organizationColumns } from "../statics/organizationColumns";

type Props = {
  isIncoming?: boolean;
};

const Registry = (props: Props) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(1);
  const [items, setItems] = useState<IOrganizationSearchResponse[]>();

  const [filters, setFilters] = useState<Nullable<IOrganizationSearchRequest>>({
    filters: {
      terCode: 0,
      orgId: null,
      inn: null,
      orgType: null,
    },
  });

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);
  const [createMode, setCreateMode] = useState(false);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchOrganisationSearchQuery();

  const fetchData = async (
    args: Nullable<IOrganizationSearchRequest> | void
  ) => {
    const { data } = await fetchIncomingLetters({
      ...args,
      filters: {
        terCode: activeRegion,
        orgId: null,
        inn: null,
        orgType: { id: "3", value: "" },
      },
    });
    setItems(data?.items);
    setTotalItems(data?.total || 0);
  };

  const search = () => {
    setPage(1);
    fetchData({ pageInfo: { pageNumber: 1 }, ...filters });
  };

  useEffect(() => {
    fetchData({ pageInfo: { pageNumber: page }, ...filters });
  }, [page]);

  const [activeRegion, setActiveRegion] = useState<number | null>(null);

  //const { data: organizations, isFetching: orgFetching } =    useFetchOrganizationsQuery(activeRegion || 0)

  return (
    <Card title={"Реестр"}>
      <div className="tw-py-4">
        <RegionsAndAreas
          onChange={(region: number) => {
            setActiveRegion(region);
            search();
          }}
        />

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
          rows={items || []}
          selectionModel={selectedRows}
          loading={isFetching}
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
          onClose={() => {}}
          onBackdropClick={() => setCreateMode(false)}
        >
          <CrmCreate
            onClose={() => setCreateMode(false)}
            orgType={{ id: "1", value: "Бюджетная организация" }}
            m_new={true}
          />
        </Dialog>
      </div>
    </Card>
  );
};

export default Registry;
