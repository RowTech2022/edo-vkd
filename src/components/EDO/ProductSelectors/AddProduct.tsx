import { Box, Modal, Button } from "@mui/material";
import { Card } from "@ui";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddProduct = ({ open, onClose }: Props) => {
  const [productWinOpen, setProductWinOpen] = useState<boolean>(false);

  return (
    <div>
      <Modal open={open}>
        <Box className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2  tw-min-w-full tw-px-40">
          <Card title="Добавить продукт12313245">
            <Box className="tw-bg-white tw-p-4 tw-flex tw-gap-4">
              <Button variant="contained" onClick={() => {}}>
                Выбрать
              </Button>
              <Button onClick={onClose}>Отмена</Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setProductWinOpen(true);
                }}
              >
                Добавить
              </Button>
            </Box>
          </Card>
        </Box>
      </Modal>

      <div id="modals">
        <AddProduct
          open={productWinOpen}
          onClose={() => {
            setProductWinOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AddProduct;
