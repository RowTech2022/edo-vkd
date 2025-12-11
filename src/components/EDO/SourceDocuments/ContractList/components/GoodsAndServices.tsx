import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Card } from "@ui";
import { FC } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ContractProductDTO } from "@services/contractsApi";

interface IGoodAndServices {
  canSave?: boolean;
  total: number;
  selectedProducts: ContractProductDTO[];
  setSelectedProducts: (value: ContractProductDTO[]) => void;
  setTotal: (value: number) => void;
  setProductSelectorOpen: (open: boolean) => void;
}

export const GoodsAndServices: FC<IGoodAndServices> = ({
  canSave,
  total,
  selectedProducts,
  setProductSelectorOpen,
  setSelectedProducts,
  setTotal,
}) => {
  const getCountHandler = (doc: ContractProductDTO) => (event: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            count:
              Number(event.target.value) < 0 ? 0 : Number(event.target.value),
            total:
              (Number(event.target.value) < 0
                ? 0
                : Number(event.target.value)) * el.price,
          }
        : el
    );
    const result = updatedList.reduce(
      (total1, current) => (total1 = total1 + current.total),
      0
    );
    setTotal(result);
    setSelectedProducts(updatedList);
  };

  const getPriceHandler = (doc: ContractProductDTO) => (event: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            price:
              Number(event.target.value) < 0 ? 0 : Number(event.target.value),
            total:
              (Number(event.target.value) < 0
                ? 0
                : Number(event.target.value)) * el.count,
          }
        : el
    );
    const result = updatedList.reduce(
      (total1, current) => (total1 = total1 + current.total),
      0
    );
    setTotal(result);
    setSelectedProducts(updatedList);
  };

  return (
    <Card title="Наименование товаров и услуг">
      <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
        {canSave && (
          <>
            <Button
              onClick={() => {
                setProductSelectorOpen(true);
              }}
            >
              Добавить документ
            </Button>
            <Button>Удалить документ</Button>
          </>
        )}
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Название закупок</TableCell>
                <TableCell>Единица измерения</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Итого</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts &&
                selectedProducts.map((doc) => (
                  <TableRow key={`doc-${doc.productId}`}>
                    <TableCell>{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.measure}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        disabled={!canSave}
                        value={doc.count}
                        onChange={getCountHandler(doc)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        className="border-orange-200"
                        disabled={!canSave}
                        value={doc.price}
                        onChange={getPriceHandler(doc)}
                      />
                    </TableCell>
                    <TableCell
                      contentEditable="false"
                      suppressContentEditableWarning
                    >
                      {doc.count * doc.price}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ width: "100%" }}>
          <p style={{ float: "right", marginRight: "30px", color: "red" }}>
            <b>{"Итого: " + total} </b>
          </p>
        </div>
      </div>
    </Card>
  );
};
