import { Box, Button, Chip, Typography } from "@mui/material";
import { FC } from "react";
import { GrbsListItem } from "@services/accessMfApi";

export interface ICustomSelectOption {
  id: string;
  value: string;
}

export interface IGrbsAccessListForm {
  titlePostfix: string;
  bzList: GrbsListItem[];
  dzList: GrbsListItem[];
  selectedBz: Record<string, boolean>;
  selectedDz: Record<string, boolean>;
  setSelected: (
    list: GrbsListItem[],
    isDz?: boolean,
    checkAll?: boolean
  ) => void;
  onClose: () => void;
  saveSeqnum: (isDz?: boolean, remove?: boolean) => void;
}

export const GrbsAccessListForm: FC<IGrbsAccessListForm> = ({
  titlePostfix,
  bzList,
  dzList,
  selectedBz,
  selectedDz,
  onClose,
  setSelected,
  saveSeqnum,
}) => {
  return (
    <Box minWidth="750px">
      <Box position="relative" paddingBottom={8}>
        <Typography
          variant="h6"
          sx={{
            paddingX: 3,
            paddingY: 1,
            background: "#607D8B",
            color: "#fff",
          }}
        >
          Список БЗ {titlePostfix}
        </Typography>
        <Box
          display={"flex"}
          gap={1}
          flexWrap="wrap"
          padding={2}
          sx={{
            maxHeight: "250px",
            overflowY: "auto",
            minHeight: "200px",
          }}
        >
          {bzList.map((item, idx) => {
            return (
              <Chip
                key={idx}
                color="success"
                variant={selectedBz[item.id] ? "filled" : "outlined"}
                label={item.id}
                onClick={() => setSelected([item], false)}
              />
            );
          })}

          {(!bzList || !bzList.length) && (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "17px",
              }}
              variant="subtitle1"
            >
              Нет данных
            </Typography>
          )}
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
          <Button
            variant="contained"
            onClick={() => setSelected(bzList, false, true)}
          >
            Выбрать все
          </Button>
          <Box display={"flex"} alignItems="center" columnGap={2}>
            <Button
              color="success"
              size="medium"
              variant="contained"
              onClick={() => saveSeqnum(false, false)}
            >
              Сохранить доступ
            </Button>
            <Button color="secondary" variant="contained" onClick={onClose}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Box>

      <Box paddingBottom={8} position="relative">
        <Typography
          variant="h6"
          sx={{
            paddingX: 3,
            paddingY: 1,
            background: "#03a9f4",
            color: "#fff",
          }}
        >
          Список ДЗ
        </Typography>

        <Box
          display={"flex"}
          gap={1}
          flexWrap="wrap"
          padding={2}
          sx={{
            maxHeight: "250px",
            overflowY: "auto",
            minHeight: "200px",
          }}
        >
          {dzList.map((item, idx) => {
            return (
              <Chip
                key={idx}
                color="success"
                variant={selectedDz[item.id] ? "filled" : "outlined"}
                label={item.id}
                onClick={() => setSelected([item], true)}
              />
            );
          })}

          {(!dzList || !dzList.length) && (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "17px",
              }}
              variant="subtitle1"
            >
              Нет данных
            </Typography>
          )}
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
          <Button
            variant="contained"
            onClick={() => {
              setSelected(dzList, true, true);
            }}
          >
            Выбрать все
          </Button>
          <Box display={"flex"} alignItems="center" columnGap={2}>
            <Button
              color="success"
              size="medium"
              variant="contained"
              onClick={() => saveSeqnum(true, false)}
            >
              Сохранить доступ
            </Button>
            <Button color="secondary" variant="contained" onClick={onClose}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
