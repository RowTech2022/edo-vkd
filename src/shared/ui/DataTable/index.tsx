import { LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridRowId,
  GridSelectionModel,
  ruRU,
} from "@mui/x-data-grid";
import { useState } from "react";
import Pagination from "./Pagination";
import { useNavigate } from "react-router";
export * from "./Pagination";
export function useSelectedRow() {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const onSelectionModelChange = (selection: GridSelectionModel) => {
    if (selection.length > 1) {
      const selectionSet = new Set(selectedRows);
      const result = selection.filter((s) => !selectionSet.has(s));
      setSelectedRows(result);
    } else {
      setSelectedRows(selection);
    }
  };
  return { selectedRows, onSelectionModelChange };
}

export const DataTable = ({
  sx,
  columns,
  items,
  isLoading,
  page,
  totalItems,
  setPage,
  setPageSize,
  pushUri,
  rowStyle,
  getRowId,
  components = {},
  onRowClick,
  showCellRightBorder,
  showColumnRightBorder,
  checkboxSelection = true,
  selectionModel,
  onSelectionModelChange,
  getCellClassName,
  borderRadius,
  pageSize,
  ...props
}: any) => {
  const navigate = useNavigate();

  const defaultSx = {
    "& .new": {
      backgroundColor: "#D8EDFF",
      fontWeight: 700,
      borderBottom: "1px solid #fff  !important",
    },
  };

  const cellClassName = (params: any) => {
    const className =
      getCellClassName !== undefined ? getCellClassName(params) : "";
    const defaultCalssName = params.row.isNew ? "new" : "";
    return className || defaultCalssName;
  };

  return (
    <DataGrid
      sx={{
        ...sx,
        ...defaultSx,
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "normal",
          lineHeight: "normal",
          textTransform: "uppercase",
        },
      }}
      autoHeight
      columns={columns}
      getRowId={getRowId}
      classes={{
        root: "tw-bg-white tw-border-[1px] tw-border-[#f6f4f3] tw-shadow-[0_0_4px_0_#00000025]",
        row: "tw-cursor-pointer",
      }}
      checkboxSelection={checkboxSelection}
      getRowClassName={rowStyle}
      rows={items ? items : []}
      selectionModel={selectionModel}
      loading={isLoading}
      localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
      showCellRightBorder={showCellRightBorder}
      showColumnRightBorder={showColumnRightBorder}
      hideFooterSelectedRowCount
      // initialState={{
      //   pagination: {
      //     page,
      //     pageSize: pageSize || 10,
      //   },
      // }}
      components={{
        LoadingOverlay: LinearProgress,
        Pagination: () => {
          return (
            <Pagination
              page={page}
              pageSize={pageSize || 10}
              rowCount={totalItems}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          );
        },
        ...components,
      }}
      pagination
      paginationMode="server"
      // rowsPerPageOptions={[10, 20, 30, 40, 50]}
      onRowClick={(params) => {
        if (pushUri) {
          navigate(`${pushUri}/${params.id}`);
        }
        onRowClick && onRowClick(params);
      }}
      onSelectionModelChange={onSelectionModelChange}
      getCellClassName={cellClassName}
      {...props}
    />
  );
};
