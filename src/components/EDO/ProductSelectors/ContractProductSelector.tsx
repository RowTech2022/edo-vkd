import { Box, Modal, Button } from "@mui/material";
import { Card } from "@ui";
import { useEffect, useState } from "react";
import { ContractProductDTO } from "@services/contractsApi";
import { useLazyFetchProductsListQuery } from "@services/productsApi";

import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onSelected: (docs: ContractProductDTO[]) => void;
  onClose: () => void;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "№", flex: 0.5 },
  { field: "name", headerName: "Название", flex: 3 },
  { field: "measure", headerName: "Единица измеренеия", flex: 2 },
];

const ContractProductSelector = ({ open, onSelected, onClose }: Props) => {
  const [fetchDocuments, { isFetching }] = useLazyFetchProductsListQuery();

  const [docs, setDocs] = useState<ContractProductDTO[]>();

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  useEffect(() => {
    if (open) {
      fetchDocuments().then(({ data }) => {
        let newusers = data?.items.map((element) => {
          return {
            id: element.id,
            productId: element.id,
            name: element.name,
            measure: element.measure.value,
            count: 0,
            price: 0,
            total: 0,
          } as ContractProductDTO;
        });

        setDocs(newusers);
      });
    }
  }, [open]);

  return (
    <Modal open={open}>
      <Box className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2  tw-min-w-full tw-px-40">
        <Card title="Добавить продукт">
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
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};

export default ContractProductSelector;
