import React, { useState } from "react";
import { Button } from "@mui/material";

import Conclusion from "./Conclusion";
import InviteToSubChat from "./InviteToSubChat";

const SubWrapperInputMessage = ({
  conclusionUsers,
  currentUserId,
  chatInfo,
  setConclusionFinished,
  conclusion,
  setConclusion,
  setRefetchConclusion,
  discutionRefetch,
}) => {
  const [inviteModal, setInviteModal] = useState(false);

  const handleModalInvite = (state: boolean) => {
    setInviteModal(state);
  };

  const handleModalConclusion = (state: boolean) => {
    setConclusion(state);
  };

  return (
    <>
      <div className="wrapper-input-message tw-border-t-[1px] tw-p-[30px] tw-justify-center tw-flex tw-flex-col tw-items-center tw-gap-4">
        <div className="panel-control tw-flex tw-items-center tw-gap-5">
          <Button
            disabled={chatInfo?.transitions?.add_members?.readOnly}
            onClick={() => handleModalInvite(true)}
            variant="contained"
          >
            Пригласить
          </Button>
          <Button
            disabled={chatInfo?.transitions?.create_conclusion?.readOnly}
            onClick={() => handleModalConclusion(true)}
            variant="contained"
          >
            Создать заключение
          </Button>
        </div>
      </div>
      {inviteModal && (
        <InviteToSubChat
          handleModal={handleModalInvite}
          discutionId={chatInfo?.chatId}
          discutionRefetch={discutionRefetch}
        />
      )}
      {conclusion && (
        <Conclusion
          setRefetchConclusion={setRefetchConclusion}
          handleModalConclusion={(modalstate: boolean, inFinished: boolean) => {
            handleModalConclusion(modalstate);
            setConclusionFinished(inFinished);
          }}
          users={conclusionUsers}
          currentUserId={currentUserId}
          chatInfo={chatInfo}
        />
      )}
    </>
  );
};

export default SubWrapperInputMessage;
