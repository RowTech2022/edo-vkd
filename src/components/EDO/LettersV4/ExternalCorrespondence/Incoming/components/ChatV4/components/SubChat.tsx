import React, { useState, useContext } from "react";
import SubTitleChat from "./SubTitleChat";
import SubBodyMessages from "./SubBodyMessages";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import { useLazyFetchDiscutionQuery } from "@services/lettersApiV4";
import { IncomingCreateV4Context } from "../../../create";

import SubWrapperInputMessage from "./SubWrapperInputMessage";

const SubChat = ({
  subUserChats,
  setSubUserChats,
  handlePostThirdVisa,
  initialValues,
  chatInfo,
  setChatInfo,
  selectedSubTab,
  setSelectedSubTab,
  mergerId,
  setMergerId,
}) => {
  const { letterId } = useContext(IncomingCreateV4Context);
  const [isActiveSubVisa, setIsActiveSubVisa] = useState(false);
  const [thirdExecutorObj, setThirdExecutorObj] = useState(null);
  const [conclusionFinished, setConclusionFinished] = useState(false);
  const [conclusion, setConclusion] = useState(false);
  const [refetchConclusion, setRefetchConclusion] = useState(0);
  const { data: userDetails } = useFetchUserDetailsQuery();

  const [refetch, { data, isFetching }] = useLazyFetchDiscutionQuery({
    discutionId: chatInfo?.chatId,
    letterId,
  } as any);

  return (
    <main className="tw-min-w-[1000px] tw-flex tw-flex-col tw-h-full tw-justify-between">
      <SubTitleChat
        setSubUserChats={setSubUserChats}
        handlePostThirdVisa={handlePostThirdVisa}
        initialValues={initialValues}
        setSubTab={setIsActiveSubVisa}
        setThirdExecutorObj={setThirdExecutorObj}
        isActiveSubVisa={isActiveSubVisa}
        thirdExecutorObj={thirdExecutorObj}
        setSelectedSubTab={setSelectedSubTab}
        selectedSubTab={selectedSubTab}
        chatInfo={chatInfo}
        setChatInfo={setChatInfo}
        isConclusion={refetchConclusion}
        showedUsers={data?.users}
      />
      <SubBodyMessages
        subUserChats={subUserChats}
        setSubUserChats={setSubUserChats}
        isActiveSubTabVisa={isActiveSubVisa}
        isActiveSubVisa={!isActiveSubVisa}
        chatInfo={chatInfo}
        conclusionFinished={conclusionFinished}
        selectedSubTab={selectedSubTab}
        chatData={data}
        refetchChat={refetch}
        mergerId={mergerId}
        setMergerId={setMergerId}
        secondExecutor={{
          image: initialValues?.avatar,
          name: initialValues?.responsible?.value,
          role: initialValues?.position,
          childs: initialValues?.child?.[
            Object.keys(initialValues?.child)[0]
          ]?.executors?.map((el: any) => {
            return {
              id: +el.responsible.id,
              name: el.responsible.value,
              isMerger: el.isMerger,
            };
          }),
          visaMessage: initialValues?.visaTypes,
          term: initialValues?.term,
          sign: initialValues?.sign,
          transitions: initialValues?.transitions?.buttonSettings,
        }}
        thirdExecutor={{
          image: thirdExecutorObj?.avatar,
          name: thirdExecutorObj?.responsible?.value,
          role: thirdExecutorObj?.position,
          childs: thirdExecutorObj?.childs?.[selectedSubTab]?.map((el: any) => {
            return {
              id: +el.responsible.id,
              name: el.responsible.value,
              isMerger: el.isMerger,
            };
          }),
          visaMessage: thirdExecutorObj?.visaTypes,
          term: thirdExecutorObj?.term,
          sign: thirdExecutorObj?.sign,
          transitions: thirdExecutorObj?.transitions?.buttonSettings,
        }}
      />

      {chatInfo ? (
        <SubWrapperInputMessage
          chatInfo={chatInfo}
          discutionRefetch={() =>
            refetch({
              discutionId: chatInfo?.chatId,
              letterId,
            })
          }
          conclusionUsers={subUserChats}
          currentUserId={userDetails?.id}
          conclusion={conclusion}
          setConclusion={setConclusion}
          setRefetchConclusion={setRefetchConclusion}
          setConclusionFinished={(state: boolean) =>
            setConclusionFinished(state)
          }
        />
      ) : (
        <></>
      )}
    </main>
  );
};

export default SubChat;
