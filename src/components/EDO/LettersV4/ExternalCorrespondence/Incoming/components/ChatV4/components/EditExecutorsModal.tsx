import { useState, useEffect } from "react";
import { Modal, Avatar, IconButton, Button, Checkbox } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import { useFetchOrganisationsStructQuery } from "@services/lettersApiV4";
import { useGetAvailableUserLetterV4Mutation } from "@services/userprofileApi";

function EditExecutorsModal({
  visible,
  handleToggleModal,
  setSelectedUser,
  selectedUser,
  handlePostSubTabVisa,
  handleSubmit,
}) {
  const { data: users } = useFetchOrganisationsStructQuery();
  const [getAvailableUsers, { data: availableUsersList }] =
    useGetAvailableUserLetterV4Mutation();
  const [showStruct, setShowStruct] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getAvailableUsers(searchValue);
  }, [getAvailableUsers, searchValue]);

  return (
    <Modal open={visible} onClose={handleToggleModal}>
      <main className="tw-w-[30%] tw-mx-auto tw-mt-[15%] tw-p-8 tw-max-h-[400px] tw-flex tw-flex-col tw-space-y-4 tw-items-center tw-overflow-auto tw-bg-white">
        <h3>Изменить исполнителей</h3>
        <div className="tw-bg-[#fff] tw-mt-[15px] tw-w-full">
          <button
            onClick={() => setShowStruct(true)}
            className={`${
              showStruct === true ? "tw-bg-slate-700" : ""
            } tw-border-r-[1px] tw-text-white tw-w-[50%] tw-p-[10px] tw-bg-slate-400 hover:tw-bg-slate-700 tw-transition-all tw-duration-100`}
          >
            Моя структура
          </button>
          <button
            onClick={() => setShowStruct(false)}
            className={`${
              showStruct === false ? "tw-bg-slate-700" : ""
            } tw-border-r-[1px] tw-text-white tw-w-[50%] tw-p-[10px] tw-bg-slate-400 hover:tw-bg-slate-700 tw-transition-all tw-duration-100`}
          >
            Общая структура
          </button>
        </div>

        {showStruct ? (
          <ul className="tw-w-full">
            {users?.struct?.[0]?.child?.map((e: any) => {
              const selectedUsers = selectedUser?.find(
                (el: any) => el.userId === e.userId
              );

              return (
                <li
                  onClick={(event) => {
                    event.stopPropagation();
                    handlePostSubTabVisa(e);
                  }}
                  key={e.id}
                  className={`${
                    selectedUser?.some((el: any) => el.userId === e.userId)
                      ? "tw-bg-[#00000010]"
                      : "tw-bg-transparent"
                  } tw-flex tw-justify-between tw-items-center tw-p-[10px] tw-border-b-[1px] hover:tw-bg-[#00000010] tw-cursor-pointer tw-transition-all tw-duration-100`}
                >
                  <div className="user tw-flex tw-items-center tw-gap-5">
                    <Checkbox
                      color="primary"
                      checked={selectedUser?.some(
                        (el: any) =>
                          el.userId === e.userId &&
                          selectedUsers.userId == e.userId
                      )}
                    />
                    <Avatar src={e.imageUrl} />
                    <div className="role-title tw-flex tw-flex-col ">
                      <p className="tw-font-semibold">{e.fullName}</p>
                      <p className="tw-font-medium tw-text-[#00000095]">
                        {e.position}
                      </p>
                    </div>
                  </div>
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedUser((prev: any) =>
                        prev.filter((el: any) => el.userId !== e.userId)
                      );
                    }}
                  >
                    <ClearIcon
                      sx={{
                        transition: "all .2s",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                    />
                  </IconButton>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Поиск"
              onChange={(e: any) => setSearchValue(e.target.value)}
              className="tw-w-full tw-outline-none tw-p-[10px] tw-border-b-[1px] focus:tw-border-[#007bd24b]"
            />

            <ul className="tw-w-full">
              {availableUsersList?.items?.map((e: any) => {
                const selectedUsers = selectedUser?.find(
                  (el: any) => el.userId === e.id
                );

                return (
                  <li
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePostSubTabVisa({
                        userId: e.id,
                        fullName: e.value,
                        position: e.position,
                      });
                    }}
                    key={e.id}
                    className={`${
                      selectedUser?.some((el: any) => el.userId === e.id)
                        ? "tw-bg-[#00000010]"
                        : "tw-bg-transparent"
                    } tw-flex tw-justify-between tw-items-center tw-p-[10px] tw-border-b-[1px] hover:tw-bg-[#00000010] tw-cursor-pointer tw-transition-all tw-duration-100`}
                  >
                    <div className="user tw-flex tw-items-center tw-gap-5">
                      <Checkbox
                        color="primary"
                        checked={selectedUser?.some(
                          (el: any) =>
                            el.userId === e.id && selectedUsers.userId == e.id
                        )}
                      />
                      <Avatar src={e.image} />
                      <div className="role-title tw-flex tw-flex-col ">
                        <p className="tw-font-semibold">{e.value}</p>
                        <p className="tw-font-medium tw-text-[#00000095]">
                          {e.position}
                        </p>
                      </div>
                    </div>
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedUser((prev: any) =>
                          prev.filter((el: any) => el.userId !== e.id)
                        );
                      }}
                    >
                      <ClearIcon
                        sx={{
                          transition: "all .2s",
                          "&:hover": {
                            color: "red",
                          },
                        }}
                      />
                    </IconButton>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Button
          disabled={!selectedUser?.length}
          onClick={handleSubmit}
          sx={{ minWidth: 136 }}
          variant="contained"
          type="button"
        >
          Сохранить
        </Button>
      </main>
    </Modal>
  );
}

export default EditExecutorsModal;
