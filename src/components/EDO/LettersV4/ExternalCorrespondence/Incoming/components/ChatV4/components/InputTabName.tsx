import React, { useEffect, useState } from "react";
import { Button, Avatar, IconButton } from "@mui/material";
import { toast } from "react-toastify";

import ClearIcon from "@mui/icons-material/Clear";
import {
  useFetchVisaTypesQuery,
  useFetchVisaTypesCreateMutation,
  useFetchOrganisationsStructQuery,
} from "@services/lettersApiV4";
import { useGetAvailableUserLetterV4Mutation } from "@services/userprofileApi";

const InputTabName = ({
  handleShowTabName,
  handlePostThirdVisa,
  selectedUser,
  setSelectedUser,
  selectedVisa,
  setSelectedVisa,
}) => {
  const { data, refetch } = useFetchVisaTypesQuery();

  const [searchValue, setSearchValue] = useState("");

  const { data: users } = useFetchOrganisationsStructQuery();

  const [getAvailableUsers, { data: availableUsersList }] =
    useGetAvailableUserLetterV4Mutation();
  const [createVisaType, { data: createVisaTypeResp, isSuccess, reset }] =
    useFetchVisaTypesCreateMutation();

  const [tabNameValue, setTabNameValue] = useState("");
  const [ownVisaValue, setOwnVisaValue] = useState("");
  const newOwnVisa = {
    name: ownVisaValue,
  };

  const [stateVisa, setStateVisa] = useState(false);
  const [showStruct, setShowStruct] = useState(true);
  const [dateTerm, setDateTerm] = useState("");

  // Нужно написать post запрос для getSubTabVisaMessages
  const handlePostSubTabVisa = (item: any) => {
    if (!selectedUser?.some((el: any) => el.userId === item.userId)) {
      setSelectedUser((prev: any) => [...prev, item]);
    } else {
      setSelectedUser((prev: any) =>
        prev.filter((el: any) => el.userId !== item.userId)
      );
    }
  };

  const handleSubTabVisaMessage = (item: any) => {
    if (!selectedVisa?.some((el: any) => el.id === item.id)) {
      setSelectedVisa((prev: any) => [...prev, item]);
    } else {
      setSelectedVisa((prev: any) =>
        prev.filter((el: any) => el.id !== item.id)
      );
    }
  };

  const handlePutTerm = (event: any) => {
    setDateTerm(event.target.value);
  };

  const handlePutSubTabVisaTerm = () => {
    if (!tabNameValue.length) {
      toast("Название вкладки обязателен!", {
        type: "warning",
        position: "top-right",
      });
      return;
    }

    const newObj = {
      tabName: tabNameValue,
      executorIds: selectedUser?.map((e: any) => e.userId),
      visaTypes: selectedVisa,
      term: dateTerm.length ? dateTerm : null,
      files: [],
      type: 1,
    };
    handlePostThirdVisa(newObj);
    handleShowTabName(false);
  };

  const handlePostOwnVisa = () => {
    createVisaType(newOwnVisa);
    setOwnVisaValue("");
  };

  useEffect(() => {
    if (isSuccess) {
      handleSubTabVisaMessage(createVisaTypeResp);
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    getAvailableUsers(searchValue);
  }, [getAvailableUsers, searchValue]);

  return (
    <div
      onClick={() => handleShowTabName(false)}
      className="tw-bg-[#00000042] tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-10"
    >
      <main
        onClick={(event) => event.stopPropagation()}
        className="tw-bg-[#fff] tw-absolute tw-flex tw-flex-col tw-gap-5 tw-items-start tw-justify-between tw-top-1/2 tw-left-1/2 tw-translate-x-[-20%] tw-translate-y-[-50%] tw-shadow-lg tw-w-[30%] tw-p-[20px]"
      >
        <h1 className="tw-text-center tw-mx-auto tw-font-semibold">
          Создание беседы
        </h1>
        <div className="add-tab tw-flex tw-flex-col tw-items-start tw-w-full">
          <p className="tw-font-semibold tw-text-[15px]">Новая вкладка</p>
          <fieldset className="tw-flex tw-border-b-[1px] tw-w-full">
            <input
              onChange={(event) => setTabNameValue(event.target.value)}
              value={tabNameValue}
              type="text"
              placeholder="Введите название вкладки"
              className="tw-outline-none tw-w-full tw-py-[5px] tw-text-[15px]"
            />
          </fieldset>
        </div>
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
          <div className="add-executors tw-flex tw-flex-col tw-items-start tw-w-full">
            <p className="tw-font-semibold tw-text-[15px]">
              Пригласить участника
            </p>
            <main className="category-scrollbar tw-w-full tw-overflow-auto tw-h-[20vh]">
              <ul>
                {users?.struct?.[0]?.child?.map((e: any) => {
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
            </main>
          </div>
        ) : (
          <div className="add-executors tw-flex tw-flex-col tw-items-start tw-w-full">
            <p className="tw-font-semibold tw-text-[15px]">
              Пригласить участника
            </p>
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
                        event.stopPropagation();
                        handlePostSubTabVisa({
                          userId: e.id,
                          position: e.value,
                          fullName: e.position,
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
            </main>
          </div>
        )}

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
            {stateVisa === false ? (
              data?.defaultVisas?.map((e: any) => {
                return (
                  <p
                    onClick={() => handleSubTabVisaMessage(e)}
                    key={e.id}
                    className={`${
                      selectedVisa?.some((el: any) => el.id === e.id)
                        ? "tw-bg-slate-300"
                        : "tw-bg-transparent"
                    } tw-p-[10px] tw-border-b-[1px] tw-cursor-pointer hover:tw-bg-[#f9f9f9]`}
                  >
                    {e.name}
                  </p>
                  // <VisaListExecutors key={e.id} name={e.name} item={e} />
                );
              })
            ) : (
              <>
                {data?.userVisas.map((e: any) => {
                  return (
                    <p
                      onClick={() => handleSubTabVisaMessage(e)}
                      key={e.id}
                      className={`${
                        selectedVisa?.some((el: any) => el.id === e.id)
                          ? "tw-bg-slate-300"
                          : "tw-bg-transparent"
                      } tw-p-[10px] tw-border-b-[1px] tw-cursor-pointer hover:tw-bg-[#f9f9f9]`}
                    >
                      {e.name}
                    </p>
                  );
                })}

                <fieldset className="tw-flex tw-border-[2px] tw-border-[#007bd22a] tw-p-[10px] tw-w-full tw-mt-6">
                  <input
                    onChange={(event) => setOwnVisaValue(event.target.value)}
                    value={ownVisaValue}
                    type="text"
                    placeholder="Введите собственную визу"
                    className="tw-text-[#000] tw-outline-none tw-w-full placeholder:tw-text-[#000b] placeholder:tw-font-normal"
                  />
                  <Button onClick={() => handlePostOwnVisa()}>Создать</Button>
                </fieldset>
              </>
            )}
          </main>
          {/* <footer className="flex justify-end gap-5 items-center">
            <fieldset className="flex border-[2px] border-[#007bd22a] p-[10px]  w-full">
              <input
                onChange={(event) =>
                  Dispatch(setOwnVisaValue(event.target.value))
                }
                value={ownVisaValue}
                type="text"
                placeholder="Введите собственную визу"
                className=" text-[#000] outline-none  w-full  placeholder:text-[#000b] placeholder:font-normal"
              />
              <Button onClick={() => handleShowOwnVisa()}>Добавить</Button>
            </fieldset>
          </footer> */}
        </div>
        <div className="add-term tw-w-full">
          <input
            onChange={(event) => handlePutTerm(event)}
            min={new Date().toISOString().split("T")[0]}
            value={dateTerm}
            type="date"
            placeholder="Срок"
            className="tw-border-[#007bd22a] tw-w-full tw-border-[2px] tw-p-[10px] tw-text-[#007cd2] tw-font-medium tw-cursor-pointer "
          />
        </div>
        <div className="panel-control tw-flex tw-justify-end tw-w-full">
          <div className="wrapper-buttons tw-flex tw-gap-5">
            <Button
              onClick={() => {
                handleShowTabName(false);
                reset();
              }}
              variant="text"
              sx={{ textTransform: "none", fontWeight: "400" }}
            >
              Отмена
            </Button>
            <Button
              disabled={!selectedUser?.length || !selectedVisa?.length}
              onClick={() => {
                handlePutSubTabVisaTerm();
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
  );
};

export default InputTabName;
