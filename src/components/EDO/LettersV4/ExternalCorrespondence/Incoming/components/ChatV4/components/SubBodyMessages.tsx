import React, { useState, useEffect, useContext, useRef } from "react";

import SubTabVisaUser from "./SubTabVisaUser";

import MemoVisaExecutors from "./MemoVisaExecutors";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import {
  useLazyFetchDiscutionQuery,
  useSendMessageToParentMutation,
  useChangeExecutorsMutation,
} from "@services/lettersApiV4";
import { IncomingCreateV4Context } from "../../../create";
import ReplyMessage from "./ReplyMessage";
import { toast } from "react-toastify";

const SubBodyMessages = ({
  isActiveSubTabVisa,
  isActiveSubVisa,
  thirdExecutor,
  secondExecutor,
  chatInfo,
  conclusionFinished,
  subUserChats,
  setSubUserChats,
  selectedSubTab,
  refetchChat,
  chatData,
  setMergerId,
  mergerId,
}) => {
  const chatInputRef = useRef(null);
  const { letterId, refetchData } = useContext(IncomingCreateV4Context);
  const [replyMessage, setReplyMessage] = useState({
    visible: false,
    info: null,
  });

  const [editMessage, setEditMessage] = useState(null);
  const [editExecutorsModal, setEditExecutorsModal] = useState(false);

  const [
    sendMessageToParent,
    {
      isSuccess: isSendToParentSuccess,
      isLoading: isSendToParentLoading,
      isError: isSendToParentError,
      error: sendToParentError,
    },
  ] = useSendMessageToParentMutation();

  const [changeExecutorsMutate] = useChangeExecutorsMutation();

  const handleRefetchMessages = () => {
    refetchChat({
      discutionId: chatInfo?.chatId,
      letterId,
    });
  };

  const handleEditExecutors = (tabname: null | string) => {
    changeExecutorsMutate({
      incomingId: letterId,
      tabName: tabname,
      userIds: subUserChats?.map((el: any) => el.userId),
    }).then((resp: any) => {
      if (!resp.hasOwnProperty("error")) {
        setEditExecutorsModal(false);
        refetchData();
      } else {
        toast.error(resp?.error?.data?.Message);
      }
    });
  };

  useEffect(() => {
    if (chatInfo) {
      refetchChat({
        discutionId: chatInfo?.chatId,
        letterId,
      });
    }
  }, [chatInfo, isActiveSubTabVisa, conclusionFinished, isSendToParentSuccess]);

  useEffect(() => {
    if (isSendToParentError && sendToParentError) {
      const err = sendToParentError as {
        data?: { Message?: string };
        error?: string;
      };
      const errMsg = err.data?.Message || err.error || "Ошибка при отправке";

      toast.error(errMsg);
    }
  }, [isSendToParentError, isSendToParentError]);

  return (
    <main className="category-scrollbar tw-h-[69vh] tw-overflow-auto tw-relative">
      <ul>
        {isActiveSubTabVisa ? (
          <SubTabVisaUser
            disabledSign={thirdExecutor?.transitions?.sign?.readOnly}
            obj={thirdExecutor}
            editExecutorsModal={editExecutorsModal}
            handleToggleModal={(state: boolean) => setEditExecutorsModal(state)}
            editExecutorsSubmit={() => handleEditExecutors(selectedSubTab)}
            setUsersChats={setSubUserChats}
            userChats={subUserChats}
          />
        ) : (
          <></>
        )}
        {isActiveSubVisa && secondExecutor?.childs ? (
          <MemoVisaExecutors
            disabledSign={secondExecutor?.transitions?.sign?.readOnly}
            obj={secondExecutor}
            editExecutorsModal={editExecutorsModal}
            handleToggleModal={(state: boolean) => setEditExecutorsModal(state)}
            editExecutorsSubmit={() => handleEditExecutors(null)}
            setUsersChats={setSubUserChats}
            userChats={subUserChats}
            mergerId={mergerId}
            setMergerId={setMergerId}
          />
        ) : (
          <></>
        )}
      </ul>
      {chatInfo ? (
        <div className="tw-h-[80%] tw-flex tw-flex-col tw-justify-between tw-items-start tw-p-5">
          <ChatMessages
            isSendToParentLoading={isSendToParentLoading}
            messages={chatData?.messages ?? []}
            isSendToParentSuccess={isSendToParentSuccess}
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

          <div className="tw-mt-8 tw-w-full">
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
              chatInfoId={chatInfo?.chatId}
              disabled={!chatData?.canSendMessage}
              refetchMessages={handleRefetchMessages}
              setReplyMessage={setReplyMessage}
              replyMessage={replyMessage.info}
              editMessage={editMessage}
              setEditMessage={setEditMessage}
              chatUsers={chatData?.users || []}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
};

export default SubBodyMessages;
