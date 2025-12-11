import React, { useEffect, useState } from "react";
import { getConfirmationDetail } from "./api";
import { useParams } from "react-router-dom";
import DocumentPdf from "./DocumentPdf";
import { Avatar, Drawer, IconButton, MenuItem, TextField } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./styles.css";
const Confarmation = () => {
  const applicationId = useParams();
  const [item, setItem] = useState({
    finalFormUrl: "",
    executors: [
      {
        id: 0,
        userName: "",
        userImage: "",
      },
    ],
    language: 0,
    signer: "",
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const fetchData = async (id: string) => {
    try {
      const resp = await getConfirmationDetail(id);
      setItem(resp);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    }
  };

  const sidebarContent = (
    <div className="tw-p-4 tw-w-[300px]">
      <TextField
        disabled
        size="small"
        select
        fullWidth
        value={item?.language}
        onChange={() => {}}
        label="Бланк"
        sx={{
          marginBottom: 2,
          width: "100%",
          "& .MuiInputBase-root": {
            border: "1px solid #007cd2",
            borderRadius: "10px",
            outline: "none",
          },
        }}
      >
        <MenuItem value={4}>Без бланки</MenuItem>
        <MenuItem value={1}>Русский</MenuItem>
        <MenuItem value={2}>Таджикский</MenuItem>
        <MenuItem value={3}>Английский</MenuItem>
      </TextField>
      <TextField
        disabled
        value={item.signer}
        label="Подписыващий"
        placeholder="Подписыващий"
        variant="outlined"
        fullWidth
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            border: "1px solid #007cd2",
            borderRadius: "10px",
            outline: "none",
          },
        }}
      />
      <h1 className="tw-text-center tw-mt-4">Участники</h1>
      {item.executors.map((executor, idx) => (
        <div
          key={executor.id || idx}
          className="tw-flex tw-items-center tw-gap-2 tw-mt-4"
        >
          <Avatar src={executor.userImage} />
          <p>{executor.userImage}</p>
        </div>
      ))}
    </div>
  );
  useEffect(() => {
    if (applicationId) {
      fetchData(applicationId.id);
    }
  }, [applicationId]);

  return (
    <div>
      <div className="tw-flex tw-justify-center tw-mt-4">
        <div className="tw-flex tw-gap-5 tw-items-center tw-cursor-pointer">
          <img src="/log_2.png" alt="Логотип" />
          <h2 className="tw-flex tw-flex-col tw-items-center">
            <b>Вазорати корҳои дохилии</b>
            <b>Ҷумҳурии Тоҷикистон</b>
          </h2>
        </div>
      </div>
      <div className="tw-flex tw-mt-6 tw-w-[80%] tw-m-[auto]">
        <div className="tw-block sm:tw-hidden tw-absolute tw-left-0">
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="large"
            color="primary"
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
        <div className="tw-w-[40%] tw-hidden md:tw-block">
          <div>
            <TextField
              disabled={true}
              size="small"
              select
              fullWidth
              value={item?.language}
              defaultValue={item?.language}
              onChange={() => {}}
              label="Бланк"
              sx={{
                marginBottom: 2,
                width: "100%",
                "& .MuiInputBase-root": {
                  border: "1px solid #007cd2",
                  borderRadius: "10px",
                  outline: "none",
                },
              }}
            >
              <MenuItem value={1}>Русский</MenuItem>
              <MenuItem value={2}>Таджикский</MenuItem>
              <MenuItem value={3}>Английский</MenuItem>
            </TextField>
            <TextField
              disabled={true}
              value={item.signer}
              label="Подписыващий"
              placeholder="Подписыващий"
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  border: "1px solid #007cd2",
                  borderRadius: "10px",
                  outline: "none",
                },
              }}
            />
          </div>
          <div>
            <h1 className="tw-text-center tw-mt-[10px]">Участники</h1>

            {item.executors.map((item) => (
              <>
                <div className="tw-flex tw-items-center tw-gap-[10px] tw-mt-4">
                  <Avatar src={item.userImage} />
                  <p>{item.userImage}</p>
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="md:tw-w-[60%] tw-w-[100%]">
          {item.finalFormUrl && <DocumentPdf url={item.finalFormUrl} />}
        </div>
      </div>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {sidebarContent}
      </Drawer>
    </div>
  );
};

export default Confarmation;
