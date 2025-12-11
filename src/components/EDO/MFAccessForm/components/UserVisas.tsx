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

interface IUserVisas {
  visas?: MF.AccessForm["userVisas"];
}

export const UserVisas: FC<IUserVisas> = ({ visas }) => {
  return (
    <Card title="Визы пользователей">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Визирующий</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Установил</TableCell>
                <TableCell>Подпись</TableCell>
                <TableCell>Дата установки</TableCell>
                <TableCell>Причина отказа</TableCell>
                <TableCell>Комментарии</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visas &&
                visas.map((visa) => (
                  <TableRow key={visa.date}>
                    <TableCell>{visa.signedBy}</TableCell>
                    <TableCell>{visa.state}</TableCell>
                    <TableCell>{visa.setBy}</TableCell>
                    <TableCell>
                      {" "}
                      {visa.sign64 === null ? (
                        ""
                      ) : (
                        <img src={`data:image/png;base64,${visa.sign64}`} />
                      )}{" "}
                    </TableCell>
                    <TableCell>
                      {visa?.date && formatDate(visa?.date)}
                    </TableCell>
                    <TableCell>{visa.reason}</TableCell>
                    <TableCell>{visa.comment}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Card>
  );
};
