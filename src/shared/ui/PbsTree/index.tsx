import { Box, Chip, CircularProgress, IconButton } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styles from "./index.module.scss";
import { useFetchPBSTreeMutation } from "@services/pbsApi";
import FolderIcon from "@mui/icons-material/Folder";
import BusinessIcon from "@mui/icons-material/Business";

import { GridExpandMoreIcon } from "@mui/x-data-grid";

interface IList {
  list: Array<any> | null;
  code?: string;
  nextList?: IList;
  loading?: boolean;
}

interface IPbs {
  code: string;
  name: string;
}

export interface IPbsResult {
  id: string;
  value: string;
}

export interface IPbsNumberResult {
  id: number;
  value: string;
}

export interface IPbsTree {
  value: IPbsResult[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: IPbsResult[]) => void;
}

export const PbsTree: FC<IPbsTree> = ({
  value = [],
  disabled = false,
  placeholder = "Код ПБС",
  onChange,
}) => {
  const myRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Selected organization codes
  const [grbsCode, setGrbsCode] = useState("");
  const [rbsCode, setRbsCode] = useState("");

  // Lists
  const [{ grbsList = [], loadingGrbs = false }, setGrbsList] = useState<
    any | null
  >({});
  const [{ rbsList = [], loadingRbs = false }, setRbsList] = useState<
    any | null
  >({});
  const [{ pbsList = [], loadingPbs = false }, setPbsList] = useState<
    any | null
  >({});

  const [fetchPbsTree] = useFetchPBSTreeMutation();

  const handleToggle = (newIsOpen: boolean) => {
    if (disabled) return;
    if (newIsOpen) {
      setIsOpen(newIsOpen);
    } else {
      setIsOpen(newIsOpen);
      setGrbsCode("");
      setRbsCode("");
      setRbsList({ rbsList: [], loadingRbs: false });
      setPbsList({ pbsList: [], loadingPbs: false });
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      if (e.target === myRef.current || myRef?.current?.contains(e.target)) {
        return;
      }
      handleToggle(false);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    setGrbsList({ grbsList: [], loadingGrbs: true });
    fetchPbsTree({ filter: "1" })
      .then((res: any) => {
        const grbs = {
          grbsList: res.data.grbsInfo,
          loadingGrbs: false,
        };
        setGrbsList(grbs);
      })
      .catch((err) => {
        setGrbsList({ grbsList: [], loadingGrbs: false });
      });
  }, []);

  const listsConf: IList = {
    list: grbsList,
    code: grbsCode,
    loading: loadingGrbs,
    nextList: {
      list: rbsList,
      code: rbsCode,
      loading: loadingRbs,
      nextList: {
        list: pbsList,
        loading: loadingPbs,
      },
    },
  };

  const handleChangeCode = (e: any, item: IPbs, iconClicked?: boolean) => {
    const { code, name } = item;
    e.stopPropagation();
    if (code.length === 3 && iconClicked) {
      if (code === grbsCode) {
        setRbsList({ rbsList: [], loadingRbs: false });
        setPbsList({ pbsList: [], loadingPbs: false });
        setGrbsCode("");
        setRbsCode("");
        return;
      }

      setGrbsCode(code);

      setRbsList({ rbsList: [], loadingRbs: true });
      fetchPbsTree({ filter: code })
        .then((res: any) => {
          setRbsList({
            rbsList: res.data.grbsInfo[0].rbsInfo,
            loadingRbs: false,
          });
        })
        .catch((err) => {
          setRbsList({ rbsList: [], loadingRbs: false });
        });
    } else if (code.length === 5 && iconClicked) {
      if (code === rbsCode) {
        setPbsList({ pbsList: [], loadingPbs: false });
        setRbsCode("");
        return;
      }

      setRbsCode(code);

      setPbsList({ pbsList: [], loadingPbs: true });
      fetchPbsTree({ filter: code })
        .then((res: any) => {
          setPbsList({
            pbsList: res.data.grbsInfo[0].rbsInfo[0].pbsInfo || [],
            loadingPbs: false,
          });
        })
        .catch((err) => {
          setPbsList({ pbsList: [], loadingPbs: false });
        });
    }
    if (item.code.length > 5 || !iconClicked) {
      const found = value.some((val) => val.id === item.code);

      if (found) {
        onChange(value.filter((val) => val.id !== item.code));
      } else {
        onChange([...value, { id: item.code, value: item.name }]);
      }
    }
  };

  const renderIcon = (item: any, code: string) => {
    if (item.code.length > 5) return null;

    return item.code === code ? (
      <RemoveIcon fontSize="small" />
    ) : (
      <AddIcon fontSize="small" />
    );
  };

  const getHandlers = (item: any) => {
    return {
      onClick: (e: any) => handleChangeCode(e, item),
    };
  };

  const renderLabelIcon = (item: any, code?: string) => {
    const isSelectedGrbs =
      item.code.length === 3 && item.code === code && loadingRbs;
    const isSelectedRbs =
      item.code.length === 5 && item.code === code && loadingPbs;

    if (isSelectedGrbs || isSelectedRbs) {
      return <CircularProgress color="primary" size={18} />;
    }

    return item.code.length <= 5 ? (
      <FolderIcon sx={{ color: "#ffeb3b" }} fontSize="small" />
    ) : (
      <BusinessIcon sx={{ color: "#78909c" }} fontSize="small" />
    );
  };

  const renderItem = ({ list, code, loading, nextList }: IList) => {
    return (
      <Box className={"pbs-boxlist"}>
        {!loading &&
          list &&
          list.map((item: any, idx: number) => {
            const isActive = value.some((val) => val.id === item.code);
            return (
              <Box key={idx}>
                <Box
                  className={`pbs-boxlist-item ${isActive ? "active" : ""}`}
                  display="flex"
                  alignItems="center"
                  columnGap="8px"
                  sx={{
                    cursor: "pointer",
                  }}
                  {...getHandlers(item)}
                >
                  <IconButton
                    sx={{ width: "22px", height: "22px" }}
                    onClick={(e) => handleChangeCode(e, item, true)}
                  >
                    {renderIcon(item, code as string)}
                  </IconButton>
                  <Box whiteSpace="nowrap" paddingRight="10px">
                    {renderLabelIcon(item, code)} {item.name}
                  </Box>
                </Box>

                {item.code === code && renderItem(nextList as IList)}
              </Box>
            );
          })}
      </Box>
    );
  };

  const handleDelete = (item: IPbsResult) => {
    const newValue = value.filter((val) => val.id !== item.id);

    onChange(newValue);
  };

  const renderValue = () => {
    if (!value || !value.length)
      return <div className="ellipsis">{placeholder}</div>;

    return (
      <Box width="100%" display="flex" flexWrap="wrap" gap="10px">
        {value.map((item, idx) => (
          <Chip
            size="small"
            key={idx}
            label={item.value}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </Box>
    );
  };

  const containerClass = "pbs-container" + (isOpen ? " pbs-open" : "");

  const sx: any = {};
  if (isOpen) {
    sx.borderColor = "#19766e !important";
    sx.borderWidth = "3px !important";
  }

  return (
    <Box
      sx={{ sx }}
      ref={myRef}
      className={
        styles["pbs-input"] +
        (isOpen ? " pbs-active" : disabled ? " disabled" : "")
      }
      onClick={() => handleToggle(!isOpen)}
    >
      {renderValue()}
      <Box>
        <GridExpandMoreIcon
          color="secondary"
          fontSize="medium"
          sx={{
            transform: isOpen ? "rotate(180deg)" : "",
            transition: ".3s ease",
          }}
        />
      </Box>
      <Box className={containerClass}>{renderItem(listsConf)}</Box>
    </Box>
  );
};
