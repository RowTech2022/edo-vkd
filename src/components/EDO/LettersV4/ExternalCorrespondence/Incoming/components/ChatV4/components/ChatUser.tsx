import React, { useState } from "react";
import { Avatar, Checkbox } from "@mui/material";

const ChatUser = ({
  item,
  handlePutUserChatStatus,
  isActive,
  mergerId,
  setMergerId,
  disabledCheckbox,
}) => {
  const {
    id,
    name,
    image,
    role,
    chatId,
    parentId,
    transitions,
    executorId,
    isMerger,
  } = item;

  const newObj = {
    id: id,
    name: name,
    image: image,
    role: role,
    chatId,
    executorId,
    parentId,
    transitions,
  };

  const [showMoreVert, setShowMoreVert] = useState(false);

  const handleShowMoreVert = () => {
    setShowMoreVert(!showMoreVert);
  };

  const handleGetById = () => {};

  return (
    <div
      onClick={() => {
        handlePutUserChatStatus(newObj);
        handleGetById();
      }}
      className={`${
        isActive
          ? "tw-bg-[#007cd2] tw-text-[#f9f9f9]"
          : "tw-bg-[#f9f9f9] tw-text-[#007cd2]"
      } wrapper-chat  tw-shadow-lg tw-border-[1px] tw-rounded-lg tw-w-full tw-p-[15px] hover:tw-bg-[#007cd2] tw-cursor-pointer tw-transition-all tw-duration-100`}
    >
      <div className="w-full tw-flex tw-justify-end tw-items-center">
        {(mergerId === id || isMerger) && (
          <p
            className={`${
              isActive ? "tw-text-white" : "tw-text-blue-600"
            } tw-text-[14px] tw-font-[400]`}
          >
            Главный исполнитель
          </p>
        )}

        <Checkbox
          color="primary"
          checked={mergerId === id || (isMerger ? true : false)}
          disabled={disabledCheckbox}
          className={(isActive && "tw-text-white tw-border-white") || ""}
          onChange={(e) => {
            setMergerId(id);
            // if (!canChoose) return;

            // if (e.target.checked) {
            //   handlePostUser({
            //     id: userId,
            //     name: userName,
            //     role: userPosition,
            //     image: userImage,
            //   });
            // } else {
            //   deleteUser(userId);
            //   // if (userId === mergerId) {
            //   //   setMergerId(null);
            //   // }
            // }
          }}
        />
      </div>

      <header className="tw-flex tw-justify-between tw-items-center">
        <div className="user-info tw-flex tw-items-center tw-gap-2">
          <Avatar src={image} sx={{ border: "1px solid #fff" }} />
          <div className="text">
            <p className="tw-font-[500]">{name}</p>
            <p
              className={`${
                isActive
                  ? "tw-text-[#f9f9f9] tw-text-[15px]"
                  : "tw-text-[#a9a9a9]"
              } tw-text-[15px]`}
            >
              {role}
            </p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ChatUser;
