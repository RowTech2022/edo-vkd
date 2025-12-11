import React from "react";

const TabVisa = ({ text, Icon, handleClick, disabled }) => {
  return (
    <div
      onClick={() => {
        if (disabled) {
          return;
        }
        handleClick(true);
      }}
      className={`${
        disabled ? "tw-cursor-not-allowed tw-opacity-60" : "tw-cursor-pointer"
      } wrapper-tab tw-flex tw-justify-between tw-border-[2px] tw-text-[#007cd2] tw-border-[#007cd2] tw-px-[10px] tw-py-[7px] hover:tw-bg-[#007cd2] hover:tw-text-white tw-rounded-lg tw-transition-all tw-duration-100`}
    >
      <p className="tw-font-medium">{text}</p>
      {Icon}
    </div>
  );
};

export default TabVisa;
