import React from "react";

import { Avatar, Checkbox, IconButton } from "@mui/material";

import { format } from "date-fns";
import { SignIncoming } from "./SignIncoming";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import EditExecutorsModal from "./EditExecutorsModal";

const SubTabVisaUser = ({
  obj,
  disabledSign,
  editExecutorsSubmit,
  userChats,
  setUsersChats,
  editExecutorsModal,
  handleToggleModal,
}) => {
  return (
    <>
      <div className="visa tw-min-w-[1260px] tw-w-full tw-flex tw-justify-between tw-items-start tw-p-[30px] tw-border-b-[1px]">
        <div className="user tw-w-[21%] tw-flex tw-flex-col tw-items-center tw-space-y-3">
          <p className="text-[12px] font-[400] tw-text-slate-400">Визируюший</p>

          <div className="w-full tw-flex tw-items-center tw-gap-5">
            <Avatar src={obj?.image} />
            <div className="user-text">
              <p className="tw-text-[#007cd2] tw-font-[500]">{obj?.name}</p>
              <p className="tw-text-[#989898] tw-text-[14px]">{obj?.role}</p>
            </div>
          </div>
        </div>

        <div className="executors tw-w-[18%] tw-flex tw-flex-col tw-items-start tw-space-y-3">
          <p className="text-[12px] font-[400] tw-text-slate-400">
            Исполнители
          </p>
          {obj?.childs?.map((e: any) => {
            return (
              <p key={e.id}>
                {" "}
                {e.name} <Checkbox checked={e.isMerger} disabled />
              </p>
            );
          })}
        </div>
        <div className="visa-message tw-w-[18%]">
          <p className="text-[12px] font-[400] tw-text-slate-400 tw-mb-3">
            Визы
          </p>
          {obj?.visaMessage?.map((e: any) => {
            return <p key={e.id}>{e.value}</p>;
          })}
        </div>
        <div className="term-state tw-w-[16%] tw-flex tw-flex-col tw-space-y-3">
          <p className="text-[12px] font-[400] tw-text-slate-400">Срок до:</p>
          <p className="text-[14px]">
            {obj.term ? format(new Date(obj.term), "dd-MM-yyyy") : ""}
          </p>
        </div>
        <div className="wrapper-signature tw-flex tw-flex-col tw-w-[15%]">
          <div className="signature tw-flex tw-flex-col">
            <p className="text-[12px] font-[400] tw-text-slate-400 tw-mb-3">
              Подпись
            </p>
            <SignIncoming
              disabled={disabledSign}
              sign={obj.sign}
              isChildSign={true}
            />
          </div>
        </div>

        {!obj?.transitions?.change_conclusion?.hide ? (
          <IconButton
            disabled={obj?.transitions?.change_conclusion?.readOnly}
            onClick={() => handleToggleModal(true)}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </div>

      <EditExecutorsModal
        handleSubmit={editExecutorsSubmit}
        handlePostSubTabVisa={(obj: any) => {
          if (!userChats.some((el: any) => el.userId === obj.userId)) {
            setUsersChats((prev: any) => [...prev, obj]);
          }
        }}
        setSelectedUser={setUsersChats}
        selectedUser={userChats}
        visible={editExecutorsModal}
        handleToggleModal={() => handleToggleModal(false)}
      />
    </>
  );
};

export default SubTabVisaUser;
