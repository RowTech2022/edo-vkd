import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { GrbsListItem } from "@services/accessMfApi";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "react-toastify";

interface IGrbsForm {
  title: string;
  list: GrbsListItem[];
  selectedList: Record<string, boolean>;
  onClick: (item: GrbsListItem[], checkAll?: boolean) => void;
  onDoubleClick: (item: GrbsListItem) => void;
  onClose: () => void;
  saveGrbsAccess: (isPbs?: boolean, remove?: boolean, typeReq?: number) => void;
  removeGrbsAccess: (isPbs?: boolean) => void;
  isPbs?: boolean;
}

export const GrbsForm: FC<IGrbsForm> = ({
  title,
  list = [],
  selectedList = {},
  onClick,
  onDoubleClick,
  onClose,
  saveGrbsAccess,
  isPbs,
}) => {
  const [typeReq, setTypeReq] = useState(-1);

  const handleCheck = (isBz: boolean) => {
    if (typeReq === 0) {
      setTypeReq(typeReq + (isBz ? 2 : 1));
    } else if (typeReq === 1) {
      setTypeReq(typeReq + (isBz ? -2 : -1));
    } else if (typeReq === 2) {
      setTypeReq(typeReq + (isBz ? -2 : -3));
    } else {
      setTypeReq(isBz ? 1 : 2);
    }
  };

  return (
    <Box position={"relative"} overflow="hidden" minWidth="750px">
      <Typography
        variant="h6"
        className="tw-bg-primary"
        sx={{ paddingX: 3, paddingY: 2, color: "#fff" }}
      >
        {title}
      </Typography>
      <Box
        paddingX={2}
        paddingTop={3}
        paddingBottom={6}
        display="flex"
        flexWrap="wrap"
        gap={1}
        marginBottom={4}
        sx={{
          overflowY: "auto",
          minHeight: "500px",
          maxHeight: "600px",
        }}
      >
        {list &&
          list.map((item) => {
            const include = selectedList[item.id];
            return (
              <Box
                onDoubleClick={() => onDoubleClick(item)}
                onClick={() => onClick([item])}
                display="flex"
                flexDirection="column"
                alignItems="center"
                key={item.id}
                paddingX={1}
                paddingY={2}
                sx={{
                  background: include ? "#90caf9" : "inherit",
                  maxWidth: "150px",
                  textAlign: "center",
                  cursor: "pointer",
                  color: include ? "#fff" : "inherit",
                }}
              >
                <FolderIcon
                  sx={{ color: "#ffeb3b", width: 60, height: 70 }}
                  fontSize="large"
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "14px",
                    lineHeight: "16px",
                  }}
                >
                  {item.id + " - " + item.value}
                </Typography>
              </Box>
            );
          })}
      </Box>
      <Box
        width="100%"
        display="flex"
        justifyContent="end"
        alignItems={"center"}
        gap={2}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 99,
          padding: 2,
          background: "#fff",
          boxShadow: "0px -2px 5px #bbb",
        }}
      >
        <Button variant="contained" onClick={() => onClick(list, true)}>
          Выбрать все
        </Button>
        <FormControlLabel
          onChange={() => handleCheck(true)}
          control={<Switch checked={typeReq === 0 || typeReq === 1} />}
          label="БЗ"
        />
        <FormControlLabel
          onChange={() => handleCheck(false)}
          control={<Switch checked={typeReq === 0 || typeReq === 2} />}
          label="ДЗ"
        />
        <Box display={"flex"} alignItems="center" columnGap={2}>
          <Button
            color="success"
            size="medium"
            variant="contained"
            onClick={() => {
              if (Object.values(selectedList).some((value) => value === true)) {
                saveGrbsAccess(isPbs, false, typeReq);
                setTimeout(onClose, 3000);
              } else {
                toast.error("Выберите хотя бы один элемент", {
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
            }}
          >
            Сохранить доступ
          </Button>
          <Button color="secondary" variant="contained" onClick={onClose}>
            Закрыть
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
