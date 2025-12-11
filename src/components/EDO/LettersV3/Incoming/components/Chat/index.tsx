import { Box, Dialog } from "@mui/material";
import { FC, useCallback, useRef, useEffect, useState } from "react";
import { ChatForm } from "./components/ChatForm";
import {
  IChatMessage2,
  IChatMessages2,
  useCloseDiscutionMutation,
  useDiscutionMutation,
  useEditMessageMutation,
  useNewMessageMutation,
  useSendMessageMutation,
} from "@services/chatApi";
import { useSession } from "@hooks";
import { IParentApi } from "@root/shared/types/Tree";
import { IAcquaintedRequest } from "@services/lettersApiV3";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

import { UploadFileLetters } from "@services/internal/incomingApi";
import { IUserWithAvatar } from "@services/api";
const chatURL = (import.meta.env.VITE_PUBLIC_CHAT_URL || "/") + "LattersV3_";

interface IChat {
  subject?: string | null;
  mainFiles?: UploadFileLetters[];
  discutionId?: number | null;
  executorId: number;
  incomingId: number;
  open?: boolean;
  setOpen: (open: boolean) => void;
  setMainDTO: (payload: any) => void;
  tree?: IParentApi | null;
  acquainted: (payload: IAcquaintedRequest) => void;
}

export const Chat: FC<IChat> = ({
  subject,
  mainFiles,
  discutionId,
  executorId,
  incomingId,
  open,
  setOpen,
  setMainDTO,
  tree,
  acquainted,
}) => {
  const messageEndRef = useRef<HTMLObjectElement>(null);
  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [closeDiscution] = useCloseDiscutionMutation();
  const [discution] = useDiscutionMutation();
  const [newMessage] = useNewMessageMutation();
  const { data: session } = useSession();

  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IChatMessages2[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [resFiles, setResFiles] = useState<string[]>([]);
  const [users, setUsers] = useState<IUserWithAvatar[]>([]);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [lastId, setLastId] = useState<number>();
  const [lastSendId, setLastSendId] = useState<number>();

  const checkUser = (newMsg: any) => {
    const ids = users.map((item) => item.id);
    if (!ids.includes(newMsg.user.id)) {
      setUsers((prev) => [...prev, newMsg.user]);
    }
  };

  const checkDate = (messages: IChatMessages2[], newMsg: IChatMessage2) => {
    const dates = messages.map((item) => item.date.substring(0, 10));
    let isNewDtae = dates.includes(newMsg?.createAt?.substring(0, 10))
      ? false
      : true;

    const msgs = messages.map((item) => {
      const { messages } = item;
      if (item.date.substring(0, 10) === newMsg.createAt?.substring(0, 10)) {
        return { ...item, messages: [...messages, newMsg] };
      }
      return item;
    });
    let createNewMsgs: IChatMessages2 = {
      date: newMsg?.createAt,
      messages: [newMsg],
    };
    setMessages(isNewDtae ? [...messages, createNewMsgs] : msgs);
  };

  useEffect(() => {
    let isIds = lastSendId !== 0 && lastId;
    if (isIds && lastSendId !== lastId && discutionId) {
      newMessage({
        discutionId,
        lastId,
      }).then((res: any) => {
        checkUser(res?.data?.messages[0]);
        checkDate(messages, res?.data?.messages[0]);
      });
    }
  }, [lastSendId, discutionId, lastId]);

  const getDiscutions = useCallback(async () => {
    if (discutionId) {
      discution({
        discutionId,
        letterId: incomingId,
      }).then(async (res: any) => {
        if (res.error) return;

        try {
          const connection1 = new HubConnectionBuilder()
            .withUrl(chatURL + discutionId, {
              skipNegotiation: true,
              transport: HttpTransportType.WebSockets,
            })
            .configureLogging(LogLevel.Information)
            .build();

          connection1.on(
            "receivemessage",
            (message: string, last: number, mesText: string) => {
              setLastId(last);
            }
          );

          connection1.onclose((e) => {});

          await connection1.start();

          setConnection(connection1);
        } catch (e) {
          console.log("ERROR", e);
        }
        setMessages(res.data.messages || []);
        setResFiles(res.data.files || []);
        setUsers(res.data.users || []);
        setCanSendMessage(res.data.canSendMessage);
        setMsgsLoading(false);
      });
    }
  }, [discutionId, incomingId, discution, setLastId]);

  const onSendMessage = (parentId: number, text: string, files: string[]) => {
    setLastSendId(0);
    let shortMessage;
    messages.map((item) => {
      item.messages.map((msg) => {
        if (msg.id === parentId) {
          let cutText = msg.text.slice(0, 99);
          return (shortMessage = cutText.slice(0, cutText.lastIndexOf(" ")));
        } else {
          return;
        }
      });
    });
    const msg: IChatMessage2 = {
      text,
      userId: session?.user?.id,
      parentId: parentId,
      parentShortMessage: shortMessage,
      files: files,
      createAt: new Date(Date.now()).toISOString(),
    };

    checkDate(messages, msg);

    if (discutionId) {
      sendMessage({
        text,
        discutionId,
        parentId,
        files,
      }).then((res: any) => {
        setLastSendId(res.data?.messageId);
      });
    }
  };

  const onEditMessage = (id: number, text: string, files: string[]) => {
    const editMessageById = (item: IChatMessages2) => {
      const grouped: IChatMessage2[] = [];
      const { messages } = item;
      messages?.forEach((msg) => {
        if (msg?.id === id) {
          grouped.push({ ...msg, text: text, files: files });
        } else {
          grouped.push(msg);
        }
      });
      return { ...item, messages: grouped };
    };
    let withEditedMessages = messages?.map((item) => editMessageById(item));

    setMessages(withEditedMessages);
    if (discutionId) {
      editMessage({
        text,
        discutionId,
        id,
        files,
      }).then((res: any) => {});
    }
  };

  const onCloseDiscution = () => {
    if (connection) {
      connection.stop().then(function () {
        setConnection(undefined);
      });
    }
    closeDiscution({
      executorId,
      incomingId,
      discutionId: discutionId || 0,
    }).then((res: any) => {
      if (!res.error) {
        setMainDTO(res.data);
      }
    });
    setOpen(false);
    setMessages([]);
  };

  const onCloseModal = () => {
    if (connection) {
      connection.stop().then(function () {
        console.log("connection closed");
        setConnection(undefined);
      });
    }
    setOpen(false);
    setMessages([]);
  };

  useEffect(() => {
    if (open) {
      getDiscutions();
    }

    return () => {
      setMessages([]);
    };
  }, [getDiscutions, open]);

  return (
    <Box>
      <Dialog
        sx={{ "& .MuiPaper-root": { maxWidth: "90%" } }}
        fullWidth={true}
        maxWidth="xl"
        open={Boolean(open)}
        onClose={() => onCloseModal()}
      >
        <ChatForm
          subject={subject}
          mainFiles={mainFiles}
          resFiles={resFiles}
          onCloseDiscution={onCloseDiscution}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          onCloseModal={onCloseModal}
          getDiscutions={getDiscutions}
          canSendMessage={canSendMessage}
          messages={messages}
          users={users}
          msgsLoading={msgsLoading}
          discutionId={discutionId}
          incomingId={incomingId}
          executorId={executorId}
          tree={tree}
          acquainted={acquainted}
          messageEndRef={messageEndRef}
        />
      </Dialog>
    </Box>
  );
};
