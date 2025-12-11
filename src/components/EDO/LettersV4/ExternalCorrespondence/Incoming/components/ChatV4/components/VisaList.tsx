import React, { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

const VisaList = ({
  name,
  item,
  deleteItem,
  postVisaListTemp,
  list,
  deleteClick,
}) => {
  const handlePostVisaStatus = (newObj: any, event: any) => {
    event.stopPropagation();
    postVisaListTemp(newObj);
  };

  const handleDeleteVisaStatus = (id: number) => {
    deleteClick(id);
  };

  const newObj = {
    id: item.id,
    name: item.name,
    status: true,
  };

  const isActive = Array.isArray(list) && list?.some((e) => e.id == item.id);

  return (
    <div
      onClick={(event) => {
        handlePostVisaStatus(newObj, event);
      }}
      className={`${
        isActive ? "tw-bg-gray-400 tw-text-white" : ""
      } list tw-text-black tw-border-b-[1px] tw-border-b-[#00000020] tw-p-[15px] hover:tw-bg-gray-400 hover:tw-text-white tw-cursor-pointer tw-flex tw-items-center tw-justify-between tw-transition-all tw-ease-linear tw-duration-100`}
    >
      <div className="wrapper-info tw-flex tw-items-center tw-gap-2 tw-py-2">
        <AssignmentIcon className="tw-text-inherit" />
        <p>{name}</p>
      </div>
      {isActive ? (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteVisaStatus(deleteItem.id);
          }}
        >
          <ClearIcon
            sx={{
              ":hover": {
                color: "red",
              },
              transition: "all 0.1s",
            }}
          />
        </IconButton>
      ) : (
        <></>
      )}
    </div>
  );
};

export default VisaList;
