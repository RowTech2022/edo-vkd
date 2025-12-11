import React, { useEffect, useState, useContext } from "react";
import { Button, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAddMembersToChatMutation } from "@services/lettersApiV4";
import { IncomingCreateV4Context } from "../../../create";
import { useGetAvailableUserLetterV4Mutation } from "@services/userprofileApi";

const InviteToSubChat = ({ handleModal, discutionId, discutionRefetch }) => {
  const { refetchData } = useContext(IncomingCreateV4Context);

  const [getAvailableUsers, { data: availableUsersList }] =
    useGetAvailableUserLetterV4Mutation();

  const [selectedIds, setSelectedIds] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  const [
    addMembers,
    { data: addMemberResp, isSuccess: addMemberSuccess, reset },
  ] = useAddMembersToChatMutation();

  const handlePostInvitedToSubChatTabs = (id: number) => {
    if (!selectedIds?.includes(id)) {
      setSelectedIds((prev: number[]) => [...prev, id]);
    } else {
      setSelectedIds((prev: number[]) =>
        prev?.filter((el: number) => el !== id)
      );
    }
  };

  const handleSubmit = () => {
    addMembers({ userIds: selectedIds, discutionId });
  };

  useEffect(() => {
    if (addMemberSuccess) {
      handleModal(false);
      reset();
      discutionRefetch();
    }
  }, [addMemberSuccess]);

  useEffect(() => {
    getAvailableUsers(searchValue);
  }, [getAvailableUsers, searchValue]);

  return (
    <div
      onClick={() => handleModal(false)}
      className="modal tw-bg-[#00000030] tw-w-full tw-h-[100vh] tw-fixed tw-z-10"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="modal tw-flex tw-flex-col tw-shadow-lg tw-items-center tw-w-[30%] tw-rounded-lg tw-bg-[#fff] tw-absolute tw-translate-x-[-90%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2"
      >
        <header className="tw-border-b-[1px] tw-p-[20px] tw-w-full tw-text-center">
          <h1 className="tw-font-bold">Пригласить участника</h1>
        </header>
        <main className="category-scrollbar tw-w-full tw-overflow-auto tw-h-[30vh] tw-px-5">
          <input
            type="text"
            placeholder="Поиск"
            onChange={(e: any) => setSearchValue(e.target.value)}
            className="tw-w-full tw-outline-none tw-p-[10px] tw-border-b-[1px] focus:tw-border-[#007bd24b]"
          />
          <ul>
            {availableUsersList?.items?.map((e: any) => {
              return (
                <li
                  onClick={() => handlePostInvitedToSubChatTabs(e?.id)}
                  key={e.id}
                  className={`${
                    selectedIds?.includes(e?.id)
                      ? "tw-bg-[#00000010]"
                      : "tw-bg-transparent"
                  } tw-flex tw-justify-between tw-items-center tw-p-[10px] tw-border-b-[1px] hover:tw-bg-[#00000010] tw-cursor-pointer tw-transition-all tw-duration-100`}
                >
                  <div className="user tw-flex tw-items-center tw-gap-5">
                    <Avatar src={e?.image} />
                    <div className="role-title tw-flex tw-flex-col ">
                      <p className="tw-font-semibold">{e.value}</p>
                      <p className="tw-font-medium tw-text-[#00000095]">
                        {e?.position}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </main>
        <footer className="tw-py-[15px]">
          <Button onClick={handleSubmit} variant="contained">
            Пригласить
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default InviteToSubChat;
