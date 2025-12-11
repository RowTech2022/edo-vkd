import React, { useState, useEffect } from "react";
import { Button, Avatar, IconButton } from "@mui/material";

import StructureOrganizations from "./StructureOrganizations.js";
import {
  useFetchVisaTypesQuery,
  useFetchVisaTypesCreateMutation,
} from "@services/lettersApiV4.js";
import { useGetAvailableUserLetterV4Mutation } from "@services/userprofileApi";
import ClearIcon from "@mui/icons-material/Clear";

const SubVisa = ({
  handleShowSubVisa,
  userChats,
  setUsersChats,
  handlePostSubVisa,
  mergerId,
  setMergerId,
}) => {
  const { data, refetch } = useFetchVisaTypesQuery();
  const [getAvailableUsers, { data: availableUsersList }] =
    useGetAvailableUserLetterV4Mutation();
  const [createVisaType, { data: createVisaTypeResp, isSuccess, reset }] =
    useFetchVisaTypesCreateMutation();
  const [showStruct, setShowStruct] = useState(true);
  const [stateVisa, setStateVisa] = useState(false);
  const [visaListTemp, setVisaListTemp] = useState([]);
  const [ownVisaValue, setOwnVisaValue] = useState("");

  const newOwnVisa = {
    name: ownVisaValue,
  };

  const [showStructure, setShowStructure] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const handleShowStructure = (state: boolean) => {
    setShowStructure(state);
  };

  const handlePostOwnVisa = () => {
    createVisaType(newOwnVisa);
    setOwnVisaValue("");
  };

  const [dateTerm, setDateTerm] = useState("");

  const handlePutTerm = (event: any) => {
    setDateTerm(event.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      setVisaListTemp((prev: any) => [...prev, createVisaTypeResp]);
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    getAvailableUsers(searchValue);
  }, [getAvailableUsers, searchValue]);

  return (
    <>
      <div className="tw-bg-[#00000042] tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-10">
        <main
          onClick={(event) => event.stopPropagation()}
          className="tw-bg-[#fff] tw-absolute tw-flex tw-flex-col tw-gap-5 tw-items-start tw-justify-between tw-top-1/2 tw-left-1/2 tw-translate-x-[-20%] tw-translate-y-[-50%] tw-shadow-lg tw-w-[30%] tw-p-[20px]"
        >
          <div className="add-executors tw-flex tw-flex-col tw-gap-3 tw-items-start tw-w-full">
            <p className="tw-font-semibold tw-text-[15px]">
              Пригласить участника
            </p>

            <div className="tw-bg-[#fff] tw-mt-[15px] tw-w-full">
              <button
                onClick={() => {
                  setShowStruct(true);
                  handleShowStructure(true);
                }}
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

            {/* <Button
              onClick={() => handleShowStructure(true)}
              variant="outlined"
              sx={{ textTransform: "none", width: "100%" }}
            >
              Открыть структуру
            </Button> */}

            {!showStruct ? (
              <>
                <input
                  type="text"
                  placeholder="Поиск"
                  onChange={(e: any) => setSearchValue(e.target.value)}
                  className="tw-w-full tw-outline-none tw-p-[10px] tw-border-b-[1px] focus:tw-border-[#007bd24b]"
                />
                <main className="category-scrollbar tw-w-full tw-overflow-auto tw-h-[20vh]">
                  <ul>
                    {availableUsersList?.items?.map((e: any) => {
                      return (
                        <li
                          onClick={(event) => {
                            const obj = {
                              id: e.id,
                              name: e.value,
                              role: e.position,
                              image: null,
                            };
                            event.stopPropagation();
                            if (
                              !userChats.some((el: any) => el.id === obj.id)
                            ) {
                              setUsersChats((prev: any) => [...prev, obj]);
                            }
                          }}
                          key={e.id}
                          className={`${
                            userChats?.some((el: any) => el.id === e.id)
                              ? "tw-bg-[#00000010]"
                              : "tw-bg-transparent"
                          } tw-flex tw-justify-between tw-items-center tw-p-[10px] tw-border-b-[1px] hover:tw-bg-[#00000010] tw-cursor-pointer tw-transition-all tw-duration-100`}
                        >
                          <div className="user tw-flex tw-items-center tw-gap-5">
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
                              setUsersChats((prev: any) =>
                                prev.filter((el: any) => el.id !== e.id)
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
                </main>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="add-visa tw-w-full">
            <p className="tw-font-semibold tw-text-[15px]">Выбрать визу</p>
            <div className="visa-category tw-bg-[#fff] tw-mt-[15px] tw-w-full">
              <button
                onClick={() => setStateVisa(false)}
                className={`${
                  stateVisa === false ? "tw-bg-[#007bd248]" : ""
                } tw-border-r-[1px] tw-w-[50%] tw-p-[10px] tw-bg-[#007bd22a] hover:tw-bg-[#007bd248] tw-transition-all tw-duration-100`}
              >
                Шаблонные
              </button>
              <button
                onClick={() => setStateVisa(true)}
                className={`${
                  stateVisa === true ? "tw-bg-[#007bd248]" : ""
                } tw-border-r-[1px] tw-w-[50%] tw-p-[10px] tw-bg-[#007bd22a] hover:tw-bg-[#007bd248] tw-transition-all tw-duration-100`}
              >
                Личные
              </button>
            </div>
            <main className="tw-overflow-auto tw-h-[20vh] category-scrollbar">
              {stateVisa === false
                ? data?.defaultVisas?.map((e: any) => {
                    return (
                      <p
                        onClick={() => {
                          if (visaListTemp?.some((el) => el.id == e.id)) {
                            setVisaListTemp((prev: any) =>
                              prev.filter((item: any) => item.id !== e.id)
                            );
                          } else {
                            setVisaListTemp((prev: any) => [...prev, e]);
                          }
                        }}
                        key={e.id}
                        className={`${
                          visaListTemp?.some((el) => el.id === e.id)
                            ? "tw-bg-gray-400"
                            : ""
                        } tw-p-[10px] tw-border-b-[1px] tw-cursor-pointer hover:tw-bg-[#f9f9f9]`}
                      >
                        {e.name}
                      </p>
                    );
                  })
                : data?.userVisas?.map((e: any) => {
                    return (
                      <p
                        onClick={() => {
                          if (visaListTemp?.some((el) => el.id == e.id)) {
                            setVisaListTemp((prev: any) =>
                              prev.filter((item: any) => item.id !== e.id)
                            );
                          } else {
                            setVisaListTemp((prev: any) => [...prev, e]);
                          }
                        }}
                        key={e.id}
                        className={`${
                          visaListTemp?.some((el) => el.id === e.id)
                            ? "tw-bg-gray-400"
                            : ""
                        } tw-p-[10px] tw-border-b-[1px] tw-cursor-pointer hover:tw-bg-[#f9f9f9]`}
                      >
                        {e.name}
                      </p>
                    );
                  })}
            </main>
            <footer className="tw-flex tw-justify-end tw-gap-5 tw-items-center">
              <fieldset className="tw-flex tw-border-[2px] tw-border-[#007bd22a] tw-p-[10px] tw-w-full">
                <input
                  onChange={(event) => setOwnVisaValue(event.target.value)}
                  value={ownVisaValue}
                  type="text"
                  placeholder="Введите собственную визу"
                  className="tw-text-[#000] tw-outline-none tw-w-full placeholder:tw-text-[#000b] placeholder:tw-font-normal"
                />
                <Button onClick={() => handlePostOwnVisa()}>Создать</Button>
              </fieldset>
            </footer>
          </div>
          <div className="add-term tw-w-full tw-flex tw-gap-3">
            <input
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => handlePutTerm(event)}
              value={dateTerm}
              type="date"
              placeholder="Срок"
              className="tw-border-[#007bd22a] tw-w-full tw-border-[2px] tw-p-[10px] tw-text-[#007cd2] tw-font-medium tw-cursor-pointer"
            />
          </div>
          <div className="panel-control tw-flex tw-justify-end tw-w-full">
            <div className="wrapper-buttons tw-flex tw-gap-5">
              <Button
                onClick={() => {
                  handleShowSubVisa(false);
                  reset();
                  setUsersChats([]);
                }}
                variant="text"
                sx={{ textTransform: "none", fontWeight: "400" }}
              >
                Отмена
              </Button>
              <Button
                disabled={!visaListTemp.length || !userChats.length}
                onClick={() => {
                  handleShowSubVisa(false);
                  handlePostSubVisa({
                    visaTypes: visaListTemp,
                    term: dateTerm.length ? dateTerm : null,
                  });
                  reset();
                }}
                variant="contained"
                sx={{ textTransform: "none", fontWeight: "400" }}
              >
                Добавить
              </Button>
            </div>
          </div>
        </main>
      </div>
      {showStructure && (
        <StructureOrganizations
          mergerId={mergerId}
          setMergerId={setMergerId}
          closeModal={setShowStructure}
          postUser={(obj: any) => {
            if (!userChats.some((el: any) => el.id === obj.id)) {
              setUsersChats((prev: any) => [...prev, obj]);
            }
          }}
          deleteUser={(id: number) => {
            setUsersChats((prev: any) =>
              prev.filter((el: any) => el.id !== id)
            );
          }}
          users={userChats}
        />
      )}
    </>
  );
};

export default SubVisa;
