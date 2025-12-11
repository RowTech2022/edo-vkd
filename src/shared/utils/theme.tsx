import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    "2xl": true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#607D8B",
    },
    secondary: {
      main: "#009688",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#FEFBFF",
          borderRadius: "26px",
          ".MuiOutlinedInput-notchedOutline": {
            border: "2px solid #00968897",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#009688",
          },
          // MUI DISABLED STYLES
          "&.Mui-disabled": {
            ".MuiOutlinedInput-notchedOutline": {
              border: "2px solid #00968867",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00968867",
            },
          },
          input: {
            "&.Mui-disabled": {
              WebkitTextFillColor: "#00000087",
              marginRight: 18,
              textOverflow: "ellipsis",
            },
          },
        },
      },
    },
    //AUTOCOMPLETE LABEL
    MuiInputLabel: {
      styleOverrides: {
        root: {
          background: "#FEFBFF !important",
          padding: "0 8px",
          borderRadius: "10px",
          "&.MuiFormLabel-filled": {
            transform: "translate(9px, -9px) scale(0.75) !important",
          },
          "&.Mui-focused": {
            transform: "translate(9px, -9px) scale(0.75)",
          },
          "&.Mui-disabled": {
            color: "#00000087 !important",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "26px",
          "&.Mui-disabled": {
            color: "black",
            opacity: "0.40 !important",
          },
        },
        sizeSmall: {
          lineHeight: "normal",
          padding: "7px 9px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .Mui-disabled": {
            "& .MuiAutocomplete-popupIndicator": {
              opacity: 0.5,
            },
          },
        },
        // MUI AUTOCOMPLETE POPUP ARROW STYLES
        popupIndicator: {
          svg: {
            display: "none",
          },
          "&::after": {
            content: "''",
            width: "9px",
            height: "9px",
            margin: "8px",
            borderBottom: "2px solid #009688",
            borderLeft: "2px solid #009688",
            transform: "rotate(-45deg) translate(2px, -2px)",
          },
        },
        // MUI AUTOCOMPLETE POPPER STYLES
        paper: {
          marginLeft: -8,
          marginRight: -8,
          borderRadius: 26,
          border: "8px solid #F1F3FD",
          background:
            "linear-gradient(0deg, rgba(96, 125, 139, 0.16) 0%, rgba(96, 125, 139, 0.16) 100%), #FEFBFF",
          boxShadow:
            "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
          // MUI AUTOCOMPLETE POPPER SCROLLBAR STYLES
          "& ::-webkit-scrollbar": {
            width: 4,
          },

          "& ::-webkit-scrollbar-track": {
            webkitBoxShadow: "5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset",
            backgroundColor: "#f9f9fd",
          },

          "& ::-webkit-scrollbar-thumb": {
            backgroundColor: "#607D8B",
          },
        },
        option: {
          "&:hover": {
            background: "#00968824 !important",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        // REACTQUILL STYLES
        ".quill": {
          "& .ql-toolbar": {
            border: "none !important",
            padding: "0 !important",
          },
          "& .ql-formats": {
            borderRadius: "5px",
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            height: "36px",
            display: "inline-flex !important",
            alignItems: "center",
            marginBottom: 8,
            "& button": {
              borderRight: "1px solid #00000014 !important",
              width: "36px !important",
              height: "36px !important",
              padding: "9px !important",
              "&.ql-active": {
                background: "#138EFF10 !important",
              },
              "&:last-child": {
                border: "none !important",
              },
            },
          },
          "& .ql-container.ql-snow": {
            borderRadius: "5px",
            border: "1px solid #DFE5E8",
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          },
        },
        // MUI DATAGRID STYLES
        "& .MuiDataGrid-main": {
          "& .MuiCheckbox-root svg": {
            width: 16,
            height: 16,
            backgroundColor: "transparent",
            border: "1px solid #009688",
            borderRadius: 4,
          },
          "& .MuiCheckbox-root svg path": {
            display: "none",
          },
          "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg":
            {
              backgroundColor: "#009688",
              borderColor: "#009688",
            },
          "& .MuiCheckbox-root.Mui-checked:after": {
            position: "absolute",
            display: "table",
            border: "1px solid #fff",
            borderTop: 0,
            borderLeft: 0,
            transform: "rotate(45deg) translate(-50%,-50%)",
            opacity: 1,
            transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
            content: '""',
            top: "48%",
            left: "39%",
            width: 4.71428571,
            height: 9.14285714,
          },
          "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after":
            {
              width: 8,
              height: 8,
              backgroundColor: "#1890ff",
              transform: "none",
              top: "39%",
              border: 0,
            },
          "& .MuiDataGrid-cell": {
            padding: "0 5px !important",
            "&:focus": {
              outline: "none !important",
            },
          },
          "& .MuiDataGrid-columnHeader": {
            padding: "0 5px !important",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none !important",
          },
          "& .MuiDataGrid-row > div": {
            borderBottom: "none !important",
          },
        },
        // MUI DATAGRID SHOW COLUMN STYLES
        "& .MuiDataGrid-panelWrapper": {
          "& .MuiInputLabel-root.MuiFormLabel-filled": {
            transform: "translate(-6px, 2px) scale(0.75) !important",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            transform: "translate(-6px, 2px) scale(0.75)",
          },
        },
        // DATAGRID PAGINATION STYLES
        "& .MuiDataGrid-footerContainer": {
          "& .MuiTablePagination-root": { borderBottom: 0 },
          "& .MuiTablePagination-toolbar": {
            "& .MuiInputBase-root": {
              order: 4,
            },
            "& .MuiTablePagination-select": {
              padding: "8px",
              borderRadius: "26px",
              background: "#F6F4F3",
              "&:before": {
                content: `"Стр - "`,
              },
            },
            "& .MuiTablePagination-selectLabel": {
              display: "none !important",
            },
            "& .MuiTablePagination-displayedRows": {
              padding: "8px",
              borderRadius: "26px",
              background: "#F6F4F3",
              order: 2,
            },
            "& button:nth-last-child(2)": {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              opacity: 0.8,
              order: 1,
              marginRight: 4,
              "&:hover": {
                background: "none",
                opacity: 1,
              },
              "&::after": {
                paddingRight: 4,
                fontSize: 12,
                content: "'Назад'",
              },
            },
            "& button:last-child": {
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              opacity: 0.8,
              order: 3,
              marginLeft: 4,
              "&:hover": {
                background: "none",
                opacity: 1,
              },
              "&::before": {
                paddingLeft: 4,
                fontSize: 12,
                content: "'След'",
              },
            },
            "& .MuiIconButton-root": {
              padding: 4,
            },
            "& .MuiTouchRipple-root": {
              borderRadius: "16px",
            },
          },
        },
        //KOD PBS_TREE TFMISS ACCESS CREATE
        "& .PbsTree_pbs-input__VJh_Q": {
          background: "#FEFBFF !important",
          borderRadius: "26px !important",
          border: "2px solid #9E9E9E57 !important",
          "&:hover": {
            borderColor: "#9E9E9E97 !important",
          },
        },
        "& .MuiDialog-container": {
          "& .MuiPaper-root": { borderRadius: "20px", overflow: "unset" },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0, // мобилки === <500px
      sm: 640, // маленькие экраны === 640px+
      md: 768, // планшеты === 768px+
      lg: 1024, // десктопы === 1024px+
      xl: 1280, // большие экраны === 1280px+
      '2xl': 1536, // большие экраны === 1536px+
    },
  },
});
