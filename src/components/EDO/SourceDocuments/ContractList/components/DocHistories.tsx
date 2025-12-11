import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Card } from "@ui";

import { formatDate } from "@utils";

interface IDocHistories {
  histories?: Contracts.Contract["documentHistories"];
}

export const DocHistories: FC<IDocHistories> = ({ histories }) => {
  return (
    <Card title="История состояний документа">
      <div className="tw-py-4 tw-px-4">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Состояние</TableCell>
                <TableCell>Начало</TableCell>
                <TableCell>Завершение</TableCell>
                <TableCell>Комментарий</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {histories?.map((dh) => (
                <TableRow key={dh.startDate}>
                  <TableCell>{dh?.state && formatDate(dh?.state)}</TableCell>
                  <TableCell>
                    {dh?.startDate && formatDate(dh?.startDate)}
                  </TableCell>
                  <TableCell>{dh.endDate}</TableCell>
                  <TableCell>{dh.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Card>
  );
};
