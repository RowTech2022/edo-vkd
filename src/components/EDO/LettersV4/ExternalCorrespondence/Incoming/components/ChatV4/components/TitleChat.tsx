import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, IconButton, Button, Checkbox, Tooltip } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import SubVisa from "./SubVisa";
import SubChat from "./SubChat";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import ReplyMessage from "./ReplyMessage";
import {
  useLazyFetchDiscutionQuery,
  useSendMessageToParentMutation,
} from "@services/lettersApiV4";
import { IncomingCreateV4Context } from "../../../create";
import { format } from "date-fns";
import { SignIncoming } from "./SignIncoming";
import Conclusion from "./Conclusion";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

const TitleChat = ({
  currentChatUser,
  handlePostSubVisa,
  handlePostThirdVisa,
  initialValues,
  setSelectedUserChat,
  userChats,
}: {
  currentChatUser: any;
  handlePostSubVisa: (param: any) => void;
  handlePostThirdVisa: (param: any) => void;
  initialValues: any;
  setSelectedUserChat: any;
  userChats: any;
}) => {
  const chatInputRef = useRef(null);
  const { letterId } = useContext(IncomingCreateV4Context);

  const [mergerId, setMergerId] = useState(0);

  const { data: userDetails } = useFetchUserDetailsQuery();

  const [refetchConclusion, setRefetchConclusion] = useState(0);

  const [refetch, { data, isFetching }] = useLazyFetchDiscutionQuery({
    discutionId: currentChatUser?.chatId,
    letterId,
  } as any);

  const [
    sendMessageToParent,
    { isSuccess: isSendToParentSuccess, isLoading: isSendToParentLoading },
  ] = useSendMessageToParentMutation();

  const currentObj = initialValues?.child?.[
    Object.keys(initialValues?.child)[0]
  ]?.executors?.find((el: any) => el.id === currentChatUser?.executorId);

  const [chatInfo, setChatInfo] = useState(null);
  const [editMessage, setEditMessage] = useState(null);

  const [conclusion, setConclusion] = useState(false);

  const handleModalConclusion = (state: boolean) => {
    setConclusion(state);
  };

  const [replyMessage, setReplyMessage] = useState({
    visible: false,
    info: null,
  });

  const [subUserChats, setSubUserChats] = useState([]);
  const [selectedSubTab, setSelectedSubTab] = useState<number | string>(0);

  const [state, setState] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setChatInfo({
      chatId: currentObj?.child?.[Object.keys(currentObj?.child)[0]]?.chatId,
      transitions:
        currentObj?.child?.[Object.keys(currentObj?.child)[0]]?.transition
          ?.buttonSettings,
    });
    setState(open);

    if (open === false) {
      setSubUserChats(
        currentObj?.child?.[Object.keys(currentObj?.child)[0]]?.executors?.map(
          (el: any, i: number) => {
            return {
              id: +el.responsible.id,
              executorId: el.id,
              name: el.responsible.value,
              role: el.position,
              image: el.avatar,
              conclusions: el.conclusions,
              userId: +el?.responsible?.id,
              isMerger: el?.isMerger,
            };
          }
        )
      );
      setChatInfo(null);
    }
  };

  const [showSubVisa, setShowSubVisa] = useState(false);

  const handleShowSubVisa = (state: boolean) => {
    setShowSubVisa(state);
  };

  useEffect(() => {
    if (selectedSubTab === 0) {
      if (
        currentObj?.child?.[Object.keys(currentObj?.child)[0]]?.executors
          ?.length
      ) {
        setSubUserChats(
          currentObj?.child?.[
            Object.keys(currentObj?.child)[0]
          ]?.executors?.map((el: any, i: number) => {
            return {
              id: +el.responsible.id,
              executorId: el.id,
              name: el.responsible.value,
              role: el.position,
              image: el.avatar,
              conclusions: el.conclusions,
              userId: +el?.responsible?.id,
              isMerger: el?.isMerger,
            };
          })
        );
      } else {
        setSubUserChats([]);
      }
    }
  }, [
    currentObj?.child?.[Object.keys(currentObj?.child)[0]]?.executors,
    selectedSubTab,
  ]);

  const handleRefetchMessages = () => {
    refetch({
      discutionId: currentChatUser?.chatId,
      letterId,
    });
  };

  useEffect(() => {
    if (currentChatUser) {
      refetch({
        discutionId: currentChatUser?.chatId,
        letterId,
      });
    }
  }, [currentChatUser, isSendToParentSuccess]);

  useEffect(() => {
    setSelectedUserChat(
      userChats?.find((el: any) => el.id === currentChatUser.id)
    );
  }, [userChats, refetchConclusion]);

  return (
    <>
      <div className="tw-w-full tw-flex tw-flex-col tw-h-full tw-justify-between">
        <div className="tw-w-full tw-h-[73%]">
          <div className="wrapper-title tw-p-[30px] tw-h-[15%] tw-border-b-[1px] tw-flex tw-gap-5 tw-w-full tw-justify-between tw-items-center">
            <div className="wrapper-user tw-flex tw-items-center tw-gap-2 tw-w-[24%]">
              <IconButton sx={{ padding: "0px" }}>
                <Avatar src={currentChatUser?.image} />
              </IconButton>
              <div className="text tw-flex tw-flex-col">
                <p className="tw-text-[#007cd2] tw-font-[500]">
                  {currentChatUser?.name}
                </p>
                <p className="tw-text-[#989898] tw-text-[14px]">
                  {currentChatUser?.role}
                </p>
              </div>
            </div>
            <div className="panel-monitoring tw-flex tw-items-center tw-gap-3 tw-w-[37%] tw-justify-end">
              <div className="visa-users tw-flex tw-gap-2 tw-items-center">
                {subUserChats?.map((e) => {
                  return (
                    <Tooltip
                      title={e?.name + " / " + e?.role || ""}
                      placement="top-start"
                    >
                      <IconButton key={e.id} sx={{ padding: "0" }}>
                        <Avatar
                          src={e.image}
                          sx={{ width: "30px", height: "30px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="settings tw-flex tw-items-center tw-gap-3">
                {!currentChatUser.transitions?.create_conclusion?.hide ? (
                  <Button
                    disabled={
                      currentChatUser.transitions?.create_conclusion?.readOnly
                    }
                    onClick={() => handleModalConclusion(true)}
                  >
                    Создать заключение
                  </Button>
                ) : (
                  <></>
                )}

                {!currentChatUser.transitions?.add_visa?.hide ? (
                  <Button
                    disabled={currentChatUser.transitions?.add_visa?.readOnly}
                    onClick={() => handleShowSubVisa(true)}
                  >
                    Создать визу
                  </Button>
                ) : (
                  <></>
                )}

                {!currentChatUser.transitions?.sub_chat?.hide ? (
                  <Button
                    disabled={currentChatUser.transitions?.sub_chat?.readOnly}
                    onClick={toggleDrawer(true)}
                  >
                    Исполнение
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="tw-p-[30px] tw-h-[80%] tw-overflow-y-auto">
            {subUserChats?.length ? (
              <div className="visa tw-min-w-[1000px] tw-w-full tw-flex tw-justify-between tw-items-start tw-pb-[20px] tw-border-b-[1px]">
                <div className="user tw-w-[21%]">
                  <div className="w-full tw-flex tw-items-center tw-gap-5">
                    <Avatar src={currentChatUser?.image} />
                    <div className="tw-flex tw-flex-col tw-space-y-3 tw-items-start">
                      <p className="text-[12px] font-[400] tw-text-slate-400">
                        Визируюший
                      </p>
                      <div className="user-text">
                        <p className="tw-text-[#007cd2] tw-font-[500]">
                          {currentChatUser?.name}
                        </p>
                        <p className="tw-text-[#989898] tw-text-[14px]">
                          {currentChatUser?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="executors tw-w-[18%] tw-flex tw-flex-col tw-items-start tw-space-y-3">
                  <p className="text-[12px] font-[400] tw-text-slate-400">
                    Исполнители
                  </p>
                  {subUserChats?.map((e: any) => {
                    return (
                      <p key={e.id}>
                        {" "}
                        {e.name}{" "}
                        <Checkbox
                          checked={e.isMerger || mergerId === e.id}
                          disabled
                        />
                      </p>
                    );
                  })}
                </div>
                <div className="visa-message tw-w-[18%]">
                  <p className="text-[12px] font-[400] tw-text-slate-400 tw-mb-3">
                    Визы
                  </p>
                  {currentObj?.visaTypes?.map((e: any) => {
                    return <p key={e.id}>{e.value}</p>;
                  })}
                </div>
                <div className="term-state tw-w-[16%] tw-flex tw-flex-col tw-space-y-3">
                  <p className="text-[12px] font-[400] tw-text-slate-400">
                    Срок до:
                  </p>
                  <p className="text-[14px]">
                    {currentObj?.term
                      ? format(new Date(currentObj?.term), "dd-MM-yyyy")
                      : ""}
                  </p>
                </div>

                <div className="wrapper-signature tw-flex tw-flex-col tw-w-[15%]">
                  <div className="signature tw-flex tw-flex-col">
                    <p className="text-[12px] font-[400] tw-text-slate-400 tw-mb-3">
                      Подпись
                    </p>
                    <SignIncoming
                      disabled={true}
                      sign={currentObj.sign}
                      isChildSign={true}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <ChatMessages
              messages={data?.messages ?? []}
              isSendToParentSuccess={isSendToParentSuccess}
              isSendToParentLoading={isSendToParentLoading}
              sendToParentClick={sendMessageToParent}
              onReplyClick={(val) => {
                setReplyMessage({
                  visible: true,
                  info: val,
                });
                chatInputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
              onEditClick={(param) => {
                setEditMessage(param);
                chatInputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
            />
          </div>
        </div>
        <div className="tw-w-full tw-h-[27%] tw-flex tw-flex-col tw-justify-end tw-space-y-4 tw-p-4 tw-overflow-y-auto">
          {replyMessage.visible ? (
            <ReplyMessage
              obj={replyMessage.info}
              setShowReply={setReplyMessage}
            />
          ) : (
            <></>
          )}
          <ChatInput
            ref={chatInputRef}
            disabled={!data?.canSendMessage}
            chatInfoId={currentChatUser?.chatId}
            refetchMessages={handleRefetchMessages}
            setReplyMessage={setReplyMessage}
            replyMessage={replyMessage.info}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            chatUsers={data?.users || []}
          />
        </div>
      </div>

      <SwipeableDrawer
        anchor="right"
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <SubChat
          chatInfo={chatInfo}
          setChatInfo={setChatInfo}
          subUserChats={subUserChats}
          setSubUserChats={setSubUserChats}
          handlePostThirdVisa={handlePostThirdVisa}
          initialValues={currentObj}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
          mergerId={mergerId}
          setMergerId={setMergerId}
        />
      </SwipeableDrawer>
      {showSubVisa && (
        <SubVisa
          handleShowSubVisa={handleShowSubVisa}
          userChats={subUserChats}
          setUsersChats={setSubUserChats}
          mergerId={mergerId}
          setMergerId={setMergerId}
          handlePostSubVisa={(obj: any) =>
            handlePostSubVisa({
              ...obj,
              executorIds: subUserChats?.map((el: any) => el.id),
              mergerId,
            })
          }
        />
      )}
      {conclusion && (
        <Conclusion
          setRefetchConclusion={setRefetchConclusion}
          handleModalConclusion={(modalstate: boolean, inFinished: boolean) => {
            handleModalConclusion(modalstate);
            refetch({
              discutionId: currentChatUser?.chatId,
              letterId,
            });
          }}
          users={[currentChatUser]}
          currentUserId={userDetails?.id}
          chatInfo={chatInfo}
        />
      )}
    </>
  );
};

export default TitleChat;
