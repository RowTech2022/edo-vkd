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
import { ProxyProductDTO } from "@services/proxyApi";

interface IGoodAndServices {
  canSave?: boolean;
  selectedProducts: ProxyProductDTO[];
  setSelectedProducts: (value: ProxyProductDTO[]) => void;
  setProductSelectorOpen: (open: boolean) => void;
}

export const GoodsAndServices: FC<IGoodAndServices> = ({
  canSave,
  selectedProducts,
  setProductSelectorOpen,
  setSelectedProducts,
}) => {
  const getCountHandler = (doc: ProxyProductDTO) => (event: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            count: Number(event.target.value),
          }
        : el
    );
    setSelectedProducts(updatedList);
  };

  const getCountTextHandler = (doc: ProxyProductDTO) => (event: any) => {
    let updatedList = selectedProducts.map((el) =>
      el.id === doc.id
        ? {
            ...el,
            countText: event.target.value,
          }
        : el
    );
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
                <TableCell>Количество(прописью)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts &&
                selectedProducts.map((doc) => (
                  <TableRow key={`doc-${doc.productId}`}>
                    <TableCell>{doc.productId}</TableCell>
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
                        disabled={!canSave}
                        value={doc.countText}
                        onChange={getCountTextHandler(doc)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Card>
  );
};
