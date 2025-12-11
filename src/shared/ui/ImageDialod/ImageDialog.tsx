import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type IProps = {
  open: boolean;
  onClose: () => void;
  image: string
};

const ImageDialog = (props: IProps) => {
  const { open, onClose, image } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
          borderRadius: "10px !important",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: -16,
          top: -16,
          zIndex: 1,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
          width: 26,
          height: 26,
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Box
        maxWidth={"70vw"}
        component="img"
        src={image}
        alt="fullscreen"
        onLoad={() => {
          setIsLoaded(true);
        }}
        sx={{
          height: "auto",
          maxHeight: "80vh",
          objectFit: "contain",
          borderRadius: "10px !important",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "10px",
          zIndex: 2,
          opacity: isLoaded ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <CircularProgress style={{ color: "#fff" }} />
      </Box>
    </Dialog>
  );
};

export default ImageDialog;
