import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { IEgovApplicationCreateResponse } from "@services/egov/application-resident/models/create";
import { formatDate } from "@utils";

interface IEgovVisaForm {
  visa: IEgovApplicationCreateResponse["userVisas"];
}

export const EgovVisaForm: FC<IEgovVisaForm> = ({ visa }) => {
  return (
    <div className="tw-py-4 tw-px-4">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Визирующий</TableCell>
              <TableCell>Состояние</TableCell>
              <TableCell>Установил</TableCell>
              <TableCell>Дата установки</TableCell>
              <TableCell>Причина отказа</TableCell>
              <TableCell>Комментарии</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visa.map((visa: any) => (
              <TableRow key={visa.date}>
                <TableCell>{visa.signedBy}</TableCell>
                <TableCell>{visa.state}</TableCell>
                <TableCell>{visa.setBy}</TableCell>
                <TableCell>{formatDate(visa.date)}</TableCell>
                <TableCell>{visa.reason}</TableCell>
                <TableCell>{visa.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
