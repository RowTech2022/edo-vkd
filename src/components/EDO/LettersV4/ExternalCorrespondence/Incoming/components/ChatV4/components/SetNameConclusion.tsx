import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

const SetNameConclusion = ({
  handleSetNameConclusion,
  handleCreateConclusion,
}) => {
  const [value, setValue] = useState("");

  // Кнопка Создать включена
  const [buttonCreateConclusion, setButtonCreateConclusion] = useState(false);

  const handlePostSubTabConclusionList = () => {
    // Кнопка Создать отключается
    setButtonCreateConclusion(true);

    handleCreateConclusion({ title: value });
    handleSetNameConclusion(false);

    // Поле ввода очищается
    setValue("");
  };

  return (
    <div
      onClick={() => handleSetNameConclusion(false)}
      className="tw-fixed tw-w-full tw-h-full tw-top-0 tw-left-0 tw-z-10"
    >
      <form
        onClick={(event) => event.stopPropagation()}
        className="tw-absolute tw-bg-[#fff] tw-flex tw-flex-col tw-gap-5 tw-w-[30%] tw-shadow-lg tw-border-[1px] tw-translate-x-[-25%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2 tw-p-[20px]"
      >
        <p className="tw-font-[600]">Новое заключение</p>
        <input
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // предотвращаем перенос строки
              handlePostSubTabConclusionList();
            }
          }}
          disabled={buttonCreateConclusion}
          value={value}
          type="text"
          placeholder="Введите название заключение"
          className="tw-border-b-[1px] tw-border-[#000] tw-outline-none"
        />
        <div className="wrapper-buttons tw-flex tw-justify-end">
          <div className="buttons tw-flex tw-gap-5">
            <Button
              disabled={buttonCreateConclusion}
              onClick={() => handleSetNameConclusion(false)}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              Отмена
            </Button>
            <Button
              disabled={buttonCreateConclusion}
              onClick={() => {
                handlePostSubTabConclusionList();
              }}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Создать
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetNameConclusion;
