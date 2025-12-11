import { FC, useState } from "react";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import {
  IHistoryResponse,
  useFetchHistoryDataQuery,
} from "@services/organizationsApi";
import { defaultFilterHistory, historyTableHead } from "../statics";
import { LinearProgress } from "@mui/material";
import { CustomPagination } from "@ui";

const OrganizationHistory: FC<{}> = () => {
  const [filter, setFilter] = useState(defaultFilterHistory);

  const { data, isFetching } = useFetchHistoryDataQuery(filter);

  const { items = [] } = data || {};

  const generateTableRows = (items: IHistoryResponse["items"] = []) => {
    return items.map(
      ({ id, organization: { value }, inn, status, year, docDate }, idx) => ({
        id,
        index: idx + 1,
        name: value,
        inn,
        status,
        year,
        docDate,
      })
    );
  };

  const rows = generateTableRows(items);
  return (
    <div className="History">
      <DataGrid
        classes={{
          root: "tw-bg-white !tw-rounded-lg",
          row: "tw-cursor-pointer",
        }}
        columns={historyTableHead}
        rows={rows || []}
        rowCount={0}
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
        rowsPerPageOptions={[10]}
        components={{
          LoadingOverlay: LinearProgress,
          Pagination: CustomPagination,
        }}
      />
    </div>
  );
};

export default OrganizationHistory;
