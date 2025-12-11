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
  histories?: MF.AccessForm["documentHistories"];
}

export const DocHistories: FC<IDocHistories> = ({ histories }) => {
  return (
    <Card title="История состояний документа">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
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
              {histories &&
                histories.map((dh) => (
                  <TableRow key={dh.startDate}>
                    <TableCell>{dh.state}</TableCell>
                    <TableCell>
                      {dh.startDate && formatDate(dh.startDate)}
                    </TableCell>
                    <TableCell>
                      {dh.endDate && formatDate(dh.endDate)}
                    </TableCell>
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
