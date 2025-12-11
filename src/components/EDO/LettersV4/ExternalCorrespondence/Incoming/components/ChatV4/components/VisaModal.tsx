import React, { useState, useEffect } from "react";
import VisaList from "./VisaList";
import { Button, Dialog } from "@mui/material";
import {
  useFetchVisaTypesQuery,
  useFetchVisaTypesCreateMutation,
} from "@services/lettersApiV4";

const VisaModal = ({
  handleShowVisa,
  postVisaTemp,
  selectedVisaList,
  modalState,
  finishClick,
  mode,
}) => {
  const [ownVisaValue, setOwnVisaValue] = useState("");

  const { data, refetch } = useFetchVisaTypesQuery();
  const [createVisaType, { data: createVisaTypeResp, isSuccess, reset }] =
    useFetchVisaTypesCreateMutation();

  const [stateVisa, setStateVisa] = useState(false);
  const [ownVisaInput, setOwnVisaInput] = useState(false);

  const newOwnVisa = {
    name: ownVisaValue,
  };

  const handleShowOwnVisa = () => {
    if (selectedVisaList.length > 0) {
      handleShowVisa(false);
      reset();
      setOwnVisaInput(false);
      finishClick();
    }
    if (ownVisaValue.length > 0) {
      createVisaType(newOwnVisa);
      setOwnVisaValue("");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      postVisaTemp((prev: any) => [...prev, createVisaTypeResp]);
      finishClick();
      reset();
      refetch();
      setOwnVisaInput(false);
    }
  }, [isSuccess]);

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": { maxWidth: "50%" },
      }}
      fullWidth={true}
      maxWidth="md"
      open={Boolean(modalState)}
      onClose={() => {
        handleShowVisa(false);
        reset();
        setOwnVisaInput(false);
        setOwnVisaValue("");
      }}
    >
      <header className="tw-pt-[15px] tw-bg-[#007cd2]">
        <div className="title">
          <h1 className="tw-text-center tw-text-[#f9f9f9] tw-text-[18px]">
            {mode === "create" ? "Выбрать визу" : "Изменить визу"}
          </h1>
        </div>
        <div className="visa-category tw-bg-[#fff] tw-mt-[15px]">
          <button
            onClick={() => setStateVisa(false)}
            className={`${
              stateVisa === false ? "tw-bg-[#007bd248]" : ""
            } tw-border-r-[1px] tw-w-[50%] tw-p-[10px] tw-bg-[#007bd22a] hover:tw-bg-[#007bd248] tw-transition-all tw-duration-100`}
          >
            Шаблонные
          </button>
          <button
            onClick={() => setStateVisa(true)}
            className={`${
              stateVisa === true ? "tw-bg-[#007bd248]" : ""
            } tw-border-r-[1px] tw-w-[50%] tw-p-[10px] tw-bg-[#007bd22a] hover:tw-bg-[#007bd248] tw-transition-all tw-duration-100`}
          >
            Личные
          </button>
        </div>
      </header>
      <main className="tw-bg-[#f9f9f9] tw-overflow-auto tw-h-[30vh]">
        {stateVisa === false
          ? data?.defaultVisas?.map((e: any) => {
              return (
                <VisaList
                  key={e.id}
                  name={e.name}
                  item={e}
                  deleteItem={e}
                  list={selectedVisaList}
                  deleteClick={(id: number) => {
                    postVisaTemp((prev: any) =>
                      prev.filter((el: any) => el.id !== id)
                    );
                  }}
                  postVisaListTemp={(obj: any) => {
                    if (!selectedVisaList.some((el: any) => el.id === obj.id)) {
                      postVisaTemp((prev: any) => [...prev, obj]);
                    } else {
                      postVisaTemp((prev: any) =>
                        prev.filter((el: any) => el.id !== obj.id)
                      );
                    }
                  }}
                />
              );
            })
          : data?.userVisas?.map((e: any) => {
              return (
                <VisaList
                  key={e.id}
                  name={e.name}
                  item={e}
                  deleteItem={e}
                  deleteClick={(id: number) => {
                    postVisaTemp((prev: any) =>
                      prev.filter((el: any) => el.id !== id)
                    );
                  }}
                  postVisaListTemp={(obj: any) => {
                    if (!selectedVisaList.some((el: any) => el.id === obj.id)) {
                      postVisaTemp((prev: any) => [...prev, obj]);
                    } else {
                      postVisaTemp((prev: any) =>
                        prev.filter((el: any) => el.id !== obj.id)
                      );
                    }
                  }}
                  list={selectedVisaList}
                />
              );
            })}
      </main>
      <footer className="tw-bg-[#007cd2] tw-flex tw-justify-end tw-gap-5 tw-items-center tw-p-[10px]">
        {ownVisaInput === false ? (
          <Button
            onClick={() => setOwnVisaInput(true)}
            variant="outlined"
            sx={{
              border: "1px solid #f9f9f9",
              color: "#f9f9f9",
              "&:hover": {
                bgcolor: "#f9f9f9",
                border: "1px solid #f9f9f9",
                color: "#007cd2",
              },
            }}
          >
            Создать
          </Button>
        ) : (
          <input
            onChange={(event) => setOwnVisaValue(event.target.value)}
            value={ownVisaValue}
            type="text"
            placeholder="Наименование визы"
            className="tw-bg-[transparent] tw-text-[#fff] tw-border-[1px] tw-border-[#fff] tw-outline-none tw-p-[5.7px] tw-w-full tw-rounded-[5px] placeholder:tw-text-[#fff] placeholder:tw-font-light"
          />
        )}
        <Button
          onClick={() => {
            handleShowOwnVisa();
          }}
          disabled={!selectedVisaList.length && !ownVisaValue.length}
          variant={
            !selectedVisaList.length && !ownVisaValue.length
              ? "contained"
              : "outlined"
          }
          sx={{
            border: "1px solid #f9f9f9",
            color: "#f9f9f9",
            "&:hover": {
              bgcolor: "#f9f9f9",
              border: "1px solid #f9f9f9",
              color: "#007cd2",
            },
          }}
        >
          {ownVisaInput ? "Сохранить" : "Добавить"}
        </Button>
      </footer>
    </Dialog>
  );
};

export default VisaModal;
