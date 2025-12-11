import { FC } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AngleDoubleLeftIcon, DiskIcon, FileDeleteIcon, SearchIcon , CustomButton } from "@ui";

import "react-datepicker/dist/react-datepicker.css";

interface IAgreementViewModal {
  entry?: Contracts.Contract;
  create?: boolean;
  docOpen: boolean;
  penHandlers: any;
  pdf: any;
  setRejectModalOpen: (open: boolean) => void;
  handlePenClick: () => void;
  docClose: () => void;
  sendToSign: () => void;
  handleSign: () => void;
}
export const AgreementViewModal: FC<IAgreementViewModal> = ({
  entry,
  create,
  docOpen,
  penHandlers,
  pdf,
  docClose,
  sendToSign,
  handlePenClick,
  setRejectModalOpen,
  handleSign,
}) => {
  return (
    <Dialog open={docOpen} scroll="paper" fullWidth maxWidth="xl">
      <DialogTitle id="scroll-dialog-title">Просмотр договора</DialogTitle>
      <DialogActions className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
        <Button
          startIcon={
            <AngleDoubleLeftIcon
              align="right"
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={docClose}
        >
          Назад
        </Button>
        <Button
          disabled={entry?.transitions.buttonSettings.btn_sendtosign.readOnly}
          startIcon={
            <DiskIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={sendToSign}
        >
          Отправить на подпись
        </Button>
        <CustomButton
          withRuToken
          startIcon={
            <FileDeleteIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          disabled={entry?.transitions.buttonSettings.btn_sign.readOnly}
          {...penHandlers}
          onClick={() => {
            handlePenClick();
            handleSign();
          }}
        >
          Подписать
        </CustomButton>
        <Button
          disabled={
            create || entry?.transitions.buttonSettings.btn_undo.readOnly
          }
          startIcon={
            <SearchIcon
              width="16px"
              height="16px"
              fill="currentColor"
              stroke="none"
            />
          }
          onClick={() => {
            setRejectModalOpen(true);
          }}
        >
          Отклонить
        </Button>
      </DialogActions>
      <DialogContent dividers={true}>
        <div>
          {pdf.loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <object
              data={pdf.file}
              type="application/pdf"
              width="100%"
              height="500px"
              name="pdf"
            >
              <p>
                Alternative text - include a link{" "}
                <a href={pdf.file}>to the PDF!</a>
              </p>
            </object>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
