import { Table, TableBody, TablePagination, TableRow } from "@mui/material";
import { useEffect } from "react";

type CustomPaginationProps = {
  page: number;
  pageSize: number;
  rowCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
};

export const CustomPagination = ({
  page,
  pageSize,
  rowCount,
  onPageChange,
  onPageSizeChange,
}: CustomPaginationProps) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageSizeChange(newPageSize);
  };

  useEffect(() => {
    let pagBlock = document.getElementsByClassName(
      "MuiTablePagination-toolbar"
    )[0];
    let prevBtn = document.querySelectorAll('[title="Go to previous page"]')[0];
    let nextBtn = document.querySelectorAll('[title="Go to next page"]')[0];

    if (pagBlock && prevBtn && nextBtn) {
      pagBlock.appendChild(prevBtn);
      pagBlock.appendChild(nextBtn);
    }
  }, []);

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TablePagination
            component="div"
            count={rowCount}
            page={page || 0}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            rowsPerPage={pageSize || 10}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CustomPagination;
