import { Box, Modal, Button } from "@mui/material";
import { Card } from "@ui";
import { useEffect, useState } from "react";
import { useLazyFetchProductsListQuery } from "@services/productsApi";

import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onSelected: (docs: Products.ProductShort[]) => void;
  onClose: () => void;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "№", flex: 0.5 },
  { field: "name", headerName: "Название", flex: 3 },
  {
    field: "measure",
    valueFormatter: (params) => {
      return params.value.value;
    },
    headerName: "Единица измеренеия",
    flex: 2,
  },
];

const InvoiceProductSelector = ({ open, onSelected, onClose }: Props) => {
  const [fetchDocuments, { isFetching }] = useLazyFetchProductsListQuery();

  const [docs, setDocs] = useState<Products.ProductShort[]>();

  const [productAdd, setProductAdd] = useState<boolean>(false);

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  useEffect(() => {
    if (open) {
      fetchDocuments().then(({ data }) => {
        let newusers = data?.items.map((element) => {
          return {
            id: element.id,
            name: element.name,
            measure: element.measure.value,
          } as Products.ProductShort;
        });

        setDocs(newusers);
      });
    }
  }, [open]);

  return (
    <div>
      <Modal open={open}>
        <Box className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2  tw-min-w-full tw-px-40">
          <Card title="Добавить продукт">
            <Box className="tw-bg-white tw-p-4 tw-flex tw-gap-4">
              <Button
                variant="contained"
                onClick={() => {
                  onSelected(
                    docs
                      ? docs?.filter((doc) => selectionModel.includes(doc.id))
                      : []
                  );
                }}
              >
                Выбрать
              </Button>
              <Button onClick={onClose}>Отмена</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setProductAdd(true);
                }}
              >
                Добавить
              </Button>
            </Box>
            <DataGrid
              classes={{
                root: "tw-bg-white",
              }}
              columns={columns}
              rows={docs ? docs : []}
              autoHeight
              loading={isFetching}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              hideFooter
            />
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default InvoiceProductSelector;
