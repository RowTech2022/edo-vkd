import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@utils";

export const getColumns = (
  changeReadFlag: (args: any) => Promise<any>,
  refetch: (args?: any) => void
) => {
  const columns: GridColDef[] = [
    {
      type: "actions",
      field: "id",
      width: 10,
      minWidth: 10,
      cellClassName: "tw-p-0 tw-justify-start",
      renderCell: (params) => (
        <div
          className="tw-h-full tw-w-[4px] tw-bg-secondary"
          onClick={() =>
            changeReadFlag({ id: params.value, read: params.row.new }).then(
              () => {
                refetch();
              }
            )
          }
        />
      ),
    },
    {
      field: "contragent",
      headerName: "От кого",
      flex: 10,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => params.value.value,
    },
    {
      field: "subject",
      headerName: "Тема",
      flex: 10,
      sortable: false,
      filterable: false,
    },
    {
      field: "date",
      headerName: "Дата получения",
      flex: 20,
      sortable: false,
      filterable: false,
      valueFormatter: (params) => formatDate(params.value),
    },
  ];

  return columns;
};
