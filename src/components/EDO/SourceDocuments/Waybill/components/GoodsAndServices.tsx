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
import { WaybillProductDTO } from "@services/waybillsApi";

interface IGoodAndServices {
  canSave?: boolean;
  selectedProducts: WaybillProductDTO[];
  total: number;
  setSelectedProducts: (value: WaybillProductDTO[]) => void;
  setProductSelectorOpen: (open: boolean) => void;
  setTotal: (value: number) => void;
}

export const GoodsAndServices: FC<IGoodAndServices> = ({
  canSave,
  selectedProducts,
  total,
  setProductSelectorOpen,
  setSelectedProducts,
  setTotal,
}) => {
  const getCountHandler = (doc: WaybillProductDTO) => (e: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            count: Number(e.target.value),
            taxSumma: Number(e.target.value) * el.price * el.taxPercent,
            total:
              Number(e.target.value) * el.price +
              Number(e.target.value) * el.price * el.taxPercent,
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

  const getPriceHandler = (doc: WaybillProductDTO) => (e: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            price: Number(e.target.value),
            taxSumma: Number(e.target.value) * el.count * el.taxPercent,
            total:
              Number(e.target.value) * el.count +
              Number(e.target.value) * el.count * el.taxPercent,
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

  const getTaxHandler = (doc: WaybillProductDTO) => (e: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            taxPercent: Number(e.target.value),
            taxSumma: el.price * el.count * Number(e.target.value),
            total:
              el.price * el.count +
              el.price * el.count * Number(e.target.value),
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
              Добавить строку
            </Button>
            <Button>Удалить строку</Button>
          </>
        )}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Название закупок</TableCell>
                <TableCell>Единица измерения</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Налог %</TableCell>
                <TableCell>Сумма налога</TableCell>
                <TableCell>Итого</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts &&
                selectedProducts.map((doc) => (
                  <TableRow key={`doc-${doc.productId}-${doc.name}`}>
                    <TableCell>{doc.productId}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.measure}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        className="border-orange-200"
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
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        className="border-orange-200"
                        disabled={!canSave}
                        value={doc.taxPercent}
                        onChange={getTaxHandler(doc)}
                      />
                    </TableCell>

                    <TableCell>{doc.taxSumma}</TableCell>
                    <TableCell> {doc.total} </TableCell>
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
