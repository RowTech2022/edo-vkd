import { SxProps } from "@mui/system";

const getLettersV4Sx = () => ({
  "& .mf_cell_expired": {
    background: "#ff0000c7",
    opacity: 0.7,
    color: "white",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    textTransform: "uppercase",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "auto",
  },
  borderRadius: "12px",
  width: "100%",
  overflowX: "auto",
});

const getLettersV4NewSx = (): SxProps => ({
  backgroundColor: "transparent !important",
  border: "none !important",
  boxShadow: "none !important",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#fff",
    border: "none !important",
  },

  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#fff",
    marginTop: "10px",
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    // my: 1,
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#E7F0FB",
    minHeight: "56px !important",
    maxheight: "56px !important",
    py: "2px",
    transition: "all 0.5s ease",
  },

  "& .disabled-flag": {
    display: "none !important",
  },

  "& .mf_cell_expired": {
    background: "#ff0000c7",
    opacity: 0.7,
    color: "white",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    textTransform: "uppercase",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "auto",
  },
  borderRadius: "12px",
  width: "100%",
  overflowX: "auto",
});

export const getDataTableSx = (type: "letters-v4" | "letters-v4-new") => {
  switch (type) {
    case "letters-v4":
      return getLettersV4Sx();
    case "letters-v4-new":
      return getLettersV4NewSx();
    default:
      return {};
  }
};
