import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import UserStructure from "./UserStructure";
import { useFetchOrganisationsStructQuery } from "@services/lettersApiV4";

const StructureOrganizations = ({
  closeModal,
  postUser,
  users,
  deleteUser,
  finishClick,
  setMergerId,
  mergerId,
}: {
  closeModal: any;
  postUser: (obj: any) => void;
  users: any;
  deleteUser: (id: number) => void;
  finishClick?: (id: number) => void;
  setMergerId: any;
  mergerId: number;
}) => {
  const { data } = useFetchOrganisationsStructQuery();

  const [searchValue, setSearchValue] = useState(null);

  const handleModal = () => {
    closeModal(false);
  };

  const stopPropagation = (event: any) => {
    event.stopPropagation();
  };

  const handlePostUser = (newObj: any) => {
    postUser(newObj);
  };

  const renderUserStructure = (user: any, checkboxVisible = true) => {
    return (
      <div key={user.userId} className="tw-relative">
        <UserStructure
          mergedId={mergerId}
          userId={user.userId}
          userImage={user.imageUrl}
          userName={user.fullName}
          userPosition={user.position}
          setMergerId={setMergerId}
          canChoose={user?.canChoose}
          checked={mergerId == user.userId}
          handlePostUser={(record) => {
            if (user?.canChoose) {
              handlePostUser(record);
            } else {
              return;
            }
          }}
          deleteUser={deleteUser}
          checkboxVisible={checkboxVisible}
        />
        <div className="tw-w-full tw-flex tw-flex-wrap tw-justify-center tw-gap-3 tw-overflow-hidden">
          {user?.child
            ?.filter((user: any) => {
              if (searchValue) {
                return user.fullName
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());
              }
              return true;
            })
            ?.map((childUser: any) => renderUserStructure(childUser))}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleModal}
      className="wrapper-modal tw-w-full tw-h-full tw-fixed tw-top-0 tw-left-0 tw-z-10"
    >
      <div
        onClick={stopPropagation}
        className="modal tw-bg-[#343434] tw-w-[85%] tw-h-[85%] tw-rounded-lg tw-absolute tw-translate-x-[-50%] tw-translate-y-[-50%] tw-top-1/2 tw-left-1/2 tw-flex tw-flex-col tw-justify-between tw-overflow-hidden"
      >
        <header className="tw-bg-[#3E3E3E] tw-p-[20px] tw-flex tw-items-center tw-justify-between">
          <input
            onChange={({ target }) => {
              if (target.value.length) {
                setSearchValue(target.value);
              } else {
                setSearchValue(null);
              }
            }}
            value={searchValue}
            type="text"
            placeholder="Поиск исполнителей ..."
            className="tw-bg-[transparent] tw-text-[#fff] tw-border-[1px] tw-border-[#fff] tw-outline-none tw-p-[5.7px] tw-w-[20%] tw-rounded-[5px] placeholder:tw-text-[#fff] placeholder:tw-font-light"
          />
          <h1 className="tw-text-[#fff] tw-text-[20px] tw-mx-auto tw-w-[30%]">
            Структура организации
          </h1>
          <IconButton onClick={handleModal}>
            <CloseIcon
              className="icon-effects"
              sx={{
                fontSize: "30px",
                color: "#fff",
                fontWeight: "500",
                cursor: "pointer",
              }}
            />
          </IconButton>
        </header>
        <main className="structure-scrollbar tw-h-[100%] tw-flex tw-flex-col tw-items-center tw-overflow-y-auto tw-pb-[60px]">
          {data?.struct?.map((user: any) => renderUserStructure(user, false))}
        </main>
        <footer className="tw-bg-[#3E3E3E] tw-flex tw-justify-between tw-h-[15%] tw-items-center tw-p-[20px]">
          <div className="wrapper-users tw-flex tw-flex-row tw-space-x-3 tw-items-center">
            {users?.map((e: any) => {
              return (
                <div className="tw-flex tw-flex-row -tw-space-x-3 tw-items-start">
                  <Tooltip
                    title={e?.name + " / " + e?.role || ""}
                    placement="top-start"
                  >
                    <span>
                      <IconButton
                        onClick={() => {
                          deleteUser(e.id);
                        }}
                        key={e?.id}
                      >
                        <Avatar src={e?.image} />
                      </IconButton>
                      {mergerId === e?.id ? (
                        <p className="tw-text-white tw-text-[14px] tw-font-light">
                          Исполнитель
                        </p>
                      ) : (
                        <></>
                      )}
                      <p></p>
                    </span>
                  </Tooltip>

                  <CloseIcon
                    className="hover:tw-text-[#a74343] tw-cursor-pointer"
                    onClick={() => {
                      deleteUser(e.id);
                      if (e.id === mergerId) {
                        setMergerId(null);
                      }
                    }}
                    sx={{
                      fontSize: "18px",
                      color: "red",
                      zIndex: "10",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="panel-control">
            <Button
              onClick={async () => {
                handleModal();
                finishClick(mergerId || users[0]?.id);
              }}
              disabled={!users.length}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: "normal",
                fontSize: "15px",
              }}
            >
              Добавить
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StructureOrganizations;
