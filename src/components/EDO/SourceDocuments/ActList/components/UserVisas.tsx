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

interface IUserVisas {
  visas?: Act.Act["userVisas"];
}

export const UserVisas: FC<IUserVisas> = ({ visas }) => {
  return (
    <Card title="Визы пользователей">
      <div className="tw-py-4 tw-px-4">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Визирующий</TableCell>
                <TableCell>Состояние</TableCell>
                <TableCell>Установил</TableCell>
                <TableCell>Дата установки</TableCell>
                <TableCell>Принято отказа</TableCell>
                <TableCell>Комментарии</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visas?.map((visa) => (
                <TableRow key={visa.date}>
                  <TableCell>{visa.signedBy}</TableCell>
                  <TableCell>{visa.state}</TableCell>
                  <TableCell>{visa.setBy}</TableCell>
                  <TableCell>{visa.date}</TableCell>
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
