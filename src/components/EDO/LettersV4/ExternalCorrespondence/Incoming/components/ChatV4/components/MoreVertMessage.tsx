import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const MoreVertMessage = ({ editClick }) => {
  return (
    <div className="wrapper tw-absolute tw-bg-[#fff] tw-shadow-lg tw-border-[1px] tw-rounded-lg tw-overflow-hidden tw-right-0 tw-z-10">
      <ul>
        <li
          onClick={editClick}
          className="tw-min-w-[150px] hover:tw-bg-[#f0f0f0] tw-p-[10px] tw-flex tw-items-center tw-gap-2 tw-cursor-pointer"
        >
          <EditOutlinedIcon className="tw-text-[#3a3a3a]" fontSize="small" />
          <p className="tw-text-[15px] tw-text-[#3a3a3a] tw-font-[500]">
            Изменить
          </p>
        </li>
      </ul>
    </div>
  );
};

export default MoreVertMessage;
