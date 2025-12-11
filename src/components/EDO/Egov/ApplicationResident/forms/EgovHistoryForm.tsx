import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IEgovApplicationCreateResponse } from "@services/egov/application-resident/models/create";
import { formatDate } from "@utils";

interface IEgovHistoryForm {
  history: IEgovApplicationCreateResponse["documentHistories"];
}
export const EgovHistoryForm: FC<IEgovHistoryForm> = ({ history }) => {
  return (
    <div className="tw-py-4 tw-px-4">
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Состояние</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Завершение</TableCell>
              <TableCell>Комментарий</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history &&
              history.map((dh: any) => (
                <TableRow key={dh.startDate}>
                  <TableCell>{dh.state}</TableCell>
                  <TableCell>{formatDate(dh.startDate)}</TableCell>
                  <TableCell>{formatDate(dh.endDate)}</TableCell>
                  <TableCell>{dh.comment}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
