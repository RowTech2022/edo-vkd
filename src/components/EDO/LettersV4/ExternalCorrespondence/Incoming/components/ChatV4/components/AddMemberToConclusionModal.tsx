import React, { useEffect, useState } from "react";
import { Avatar, IconButton, Button } from "@mui/material";
import { useGetAvailableUserLetterV4Mutation } from "@services/userprofileApi";

const AddMemberToConclusionModal = ({ handleModalVisible, handleSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [getAvailableUsers, { data: availableUsersList }] =
    useGetAvailableUserLetterV4Mutation();

  const handlePostSubTabConclusionListEds = ({
    id,
    value,
    position,
  }: {
    id: number;
    value: string;
    position: string;
  }) => {
    if (selectedUsers.some((el) => el.id === id)) {
      setSelectedUsers((prev: { id: number; value: string }[]) =>
        prev.filter((el: { id: number; value: string }) => el.id !== id)
      );
    } else {
      setSelectedUsers(
        (prev: { id: number; value: string; position: string }[]) => [
          ...prev,
          { id, value, position },
        ]
      );
    }
  };

  useEffect(() => {
    getAvailableUsers(searchValue);
  }, [getAvailableUsers, searchValue]);

  return (
    <div
      onClick={() => handleModalVisible(false)}
      className="tw-w-full tw-h-full tw-fixed tw-top-0 tw-left-0 tw-z-10"
    >
      <main
        onClick={(event) => event.stopPropagation()}
        className="tw-bg-[#fff] tw-shadow-lg tw-border-[1px] tw-absolute tw-translate-x-[-25%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2"
      >
        <p className="tw-p-[10px] tw-font-[600] tw-text-center">
          Добавить участников
        </p>
        <form>
          <input
            type="text"
            placeholder="Поиск"
            onChange={(e: any) => setSearchValue(e.target.value)}
            className="tw-w-full tw-outline-none tw-p-[10px] tw-border-b-[1px] focus:tw-border-[#007bd24b]"
          />
          <ul className="tw-h-[400px] tw-w-[450px] tw-flex tw-flex-col tw-justify-between tw-overflow-y-auto">
            {availableUsersList?.items?.map((e: any) => {
              return (
                <li
                  onClick={() =>
                    handlePostSubTabConclusionListEds({
                      id: e.id,
                      value: e.value,
                      position: e.position,
                    })
                  }
                  key={e.id}
                  className={`${
                    selectedUsers.some((item) => item.id === e.id)
                      ? "tw-bg-slate-300"
                      : ""
                  } tw-border-b-[1px] tw-p-[10px] tw-flex tw-gap-5 tw-items-center tw-cursor-pointer hover:tw-bg-[#f0f0f0] tw-transition-all tw-duration-100`}
                >
                  <IconButton sx={{ padding: "0px" }}>
                    <Avatar src={e.image} />
                  </IconButton>
                  <div className="user-name tw-flex tw-flex-col">
                    <p className="tw-text-[#007cd2] tw-font-[500]">{e.value}</p>
                    <p className="tw-text-[#989898] tw-text-[15px]">
                      {e.position}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="panel-control tw-flex tw-justify-end tw-p-[10px]">
            <div className="wrapper-buttons tw-flex tw-items-center tw-gap-5">
              <Button
                onClick={() => {
                  handleModalVisible(false);
                  setSearchValue("");
                }}
                variant="text"
                sx={{ textTransform: "none" }}
              >
                Отмена
              </Button>
              <Button
                disabled={!selectedUsers.length}
                onClick={() => {
                  handleSubmit(selectedUsers);
                  setSearchValue("");
                }}
                variant="contained"
                sx={{ textTransform: "none", fontWeight: "400" }}
              >
                Добавить
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddMemberToConclusionModal;
