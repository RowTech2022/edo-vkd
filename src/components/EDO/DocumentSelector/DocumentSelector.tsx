import { Box, Modal, Button, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CertifyingDocumentDTO,
  useLazyFetchDocumentsQuery,
} from "@services/signatureCardApi";

import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";

type Props = {
  open: boolean;
  onSelected: (docs: CertifyingDocumentDTO[]) => void;
  onClose: () => void;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "№", flex: 0.5 },
  { field: "name", headerName: "Название", flex: 3 },
  { field: "type", headerName: "Тип", flex: 2 },
  { field: "state", headerName: "Состояние", flex: 1 },
  { field: "approveDate", headerName: "Утверждено в", flex: 2 },
  { field: "approveBy", headerName: "Утверждено кем", flex: 2 },
];

const DocumentSelector = ({ open, onSelected, onClose }: Props) => {
  const [docs, setDocs] = useState<CertifyingDocumentDTO[]>();
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  // mutations
  const [fetchDocuments, { isFetching }] = useLazyFetchDocumentsQuery();

  useEffect(() => {
    if (open) {
      fetchDocuments().then(({ data }) => {
        setDocs(data);
      });
    }
  }, [open]);

  const handleDocSelect = () => {
    onSelected(docs?.filter((doc) => selectionModel.includes(doc.id)) || []);
  };

  return (
    <Modal open={open}>
      <Box className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-min-w-full tw-px-40">
        <DialogTitle
          className="tw-bg-primary tw-rounded-t-2xl"
          sx={{
            color: "#fff",
          }}
          textAlign={"center"}
          fontSize={25}
        >
          Добавить документ
        </DialogTitle>
        <Box maxHeight="65vh" style={{ overflowY: "auto" }}>
          <DataGrid
            classes={{
              root: "tw-bg-white tw-rounded-none",
            }}
            columns={columns}
            rows={docs ? docs : []}
            loading={isFetching}
            autoHeight
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            hideFooter
          />
        </Box>

        <Box
          sx={{ backgroundColor: "#fff" }}
          className="tw-p-4 tw-flex tw-gap-4 tw-rounded-b-2xl"
        >
          <Button variant="outlined" onClick={handleDocSelect}>
            Выбрать
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Отмена
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DocumentSelector;
