import React, { useState } from "react";
import { Button } from "@mui/material";

const CommentsConclusion = ({ handleShowCommentsConclusion, handleSave }) => {
  const [value, setValue] = useState("");

  return (
    <div
      onClick={() => handleShowCommentsConclusion(false)}
      className="tw-fixed tw-w-full tw-h-full tw-top-0 tw-left-0 tw-z-10"
    >
      <form
        onClick={(event) => event.stopPropagation()}
        className="tw-absolute tw-bg-[#fff] tw-flex tw-flex-col tw-gap-5 tw-w-[30%] tw-shadow-lg tw-border-[1px] tw-translate-x-[-25%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2 tw-p-[20px]"
      >
        <p className="tw-font-[600]">Комментарии к заключению</p>
        <input
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // предотвращаем перенос строки
              handleSave(value);
            }
          }}
          value={value}
          type="text"
          placeholder="Введите название комментарий"
          className="tw-border-b-[1px] tw-border-[#000] tw-outline-none"
        />
        <div className="wrapper-buttons tw-flex tw-justify-end">
          <div className="buttons tw-flex tw-gap-5">
            <Button
              onClick={() => handleShowCommentsConclusion(false)}
              variant="text"
              sx={{ textTransform: "none" }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => handleSave(value)}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentsConclusion;
