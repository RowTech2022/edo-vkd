import { Box, Dialog } from "@mui/material";
import { FC, useCallback, useRef, useEffect, useState } from "react";
import { ChatForm } from "./components/ChatForm";
import { IParentApi } from "@root/shared/types/Tree";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

import { IEgovServiceRequiredFilesResponce } from "@services/egovServiceRequests";
import {
  useCloseChatMutation,
  useGetChatByIdMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useNewMessageMutation,
  useEditMessage2Mutation,
} from "@services/chatEgovApi";
import {
  IChatMessage2,
  IChatMessages2,
  IChatUserInfo,
} from "@services/chatApiV35";
const chatURL = import.meta.env.VITE_PUBLIC_CHAT_URL || "/"; // + 'LattersV3_'

interface IChat {
  subject?: string | null;
  mainFiles?: IEgovServiceRequiredFilesResponce[];
  discutionId?: number | null;
  executorId: number;
  incomingId: number;
  open?: boolean;
  closeChat: (id: number) => void;
  setMainDTO: (payload: any) => void;
  tree?: IParentApi | null;
  prefix: string;
}

export const Chat: FC<IChat> = ({
  subject,
  mainFiles,
  discutionId: chatId,
  executorId,
  incomingId,
  open,
  closeChat,
  setMainDTO,
  tree,
  prefix,
}) => {
  const messageEndRef = useRef<HTMLObjectElement>(null);
  const [discution] = useGetChatByIdMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [editMessage, { isLoading: editing }] = useEditMessageMutation();
  const [editMessage2] = useEditMessage2Mutation();
  const [closeDiscution] = useCloseChatMutation();
  const [newMessage] = useNewMessageMutation();

  const [connection, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<IChatMessages2[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [resFiles, setResFiles] = useState<string[]>([]);
  const [users, setUsers] = useState<IChatUserInfo[]>([]);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [lastId, setLastId] = useState<number>();
  const [lastSendId, setLastSendId] = useState<number>();

  const checkUser = (newMsg: any) => {
    const ids = users?.map((item) => item.id);
    if (!ids.includes(newMsg?.user?.id)) {
      setUsers((prev) => [...prev, newMsg?.user]);
    }
  };

  const checkDate = (messages: IChatMessages2[], newMsg: IChatMessage2) => {
    const dates = messages?.map((item) => item?.date?.substring(0, 10));
    let isNewDtae = dates?.includes(newMsg?.createAt?.substring(0, 10))
      ? false
      : true;

    const msgs = messages?.map((item) => {
      const { messages } = item;
      if (item?.date?.substring(0, 10) === newMsg?.createAt?.substring(0, 10)) {
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
    if (isIds && lastSendId !== lastId && chatId) {
      newMessage({
        chatId,
        lastId,
      })?.then((res: any) => {
        checkUser(res?.data?.messages[0]);
        checkDate(messages, res?.data?.messages[0]);
      });
    }
  }, [lastSendId, chatId, lastId]);

  const getDiscutions = useCallback(async () => {
    if (chatId) {
      discution(chatId)
        .then(async (res: any) => {
          if (res.error) {
            console.log(333, res);
            return;
          }

          try {
            const connection1 = new HubConnectionBuilder()
              .withUrl(chatURL + prefix + chatId, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
              })
              .configureLogging(LogLevel.Information)
              .build();

            connection1.on(
              "receivemessage",
              (message: string, last: number, mesText: string) => {
                setLastId(last);
                console.log("get new messages", last);
              }
            );

            connection1.onclose((e) => {
              console.log(999, "close");
            });

            await connection1.start();
            console.log(888, "start");

            setConnection(connection1);
          } catch (e) {
            console.log("ERROR", e);
          }
          setMessages(res?.data?.messages || []);
          setResFiles(res?.data?.files || []);
          setUsers(res?.data?.users || []);
          setCanSendMessage(res?.data?.canSendMessage);
          setMsgsLoading(false);
        })
        .catch((e) => console.log(4444, e));
    }
  }, [chatId, incomingId, discution, setLastId]);

  const onSendMessage = (parentId: number, text: string, files: string[]) => {
    setLastSendId(0);

    if (chatId) {
      sendMessage({
        text,
        chatId: chatId,
        parentId,
        files,
      }).then((res: any) => {
        if (!res.error) {
          checkUser(res?.data);
          checkDate(messages, res?.data as IChatMessage2);
          setLastSendId(res?.data?.messageId);
        }
      });
    }
  };

  const onEditMessage = (id: number, text: string, files: string[]) => {
    const editMessageById = (item: IChatMessages2, res: IChatMessage2) => {
      const grouped: IChatMessage2[] = [];
      const { messages } = item;
      messages?.forEach((msg) => {
        if (msg?.id === res.id) {
          grouped?.push({ ...msg, text: res?.text, files: res?.files });
        } else {
          grouped?.push(msg);
        }
      });
      return { ...item, messages: grouped };
    };

    if (chatId) {
      editMessage2({
        text,
        chatId,
        id,
        files,
      }).then((res: any) => {
        if (!res.error) {
          checkUser(res?.data);
          let withEditedMessages = messages?.map((item) =>
            editMessageById(item, res?.data)
          );
          setMessages(withEditedMessages);
        }
      });
    }
  };

  const onCloseDiscution = (id: number) => {
    if (connection) {
      connection.stop().then(function () {
        console.log("connection closed");
        setConnection(undefined);
      });
    }
    closeDiscution({
      docId: incomingId,
      chatId: chatId || 0,
      messageId: id || 0,
    }).then((res: any) => {
      if (!res.error) {
        setMainDTO(res?.data);
        closeChat(incomingId || 0);
      }
    });
    setMessages([]);
  };

  const onCloseModal = () => {
    if (connection) {
      connection?.stop()?.then(function () {
        console.log("connection closed");
        setConnection(undefined);
      });
    }
    closeChat(incomingId || 0);
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
          discutionId={chatId}
          incomingId={incomingId}
          executorId={executorId}
          tree={tree}
          messageEndRef={messageEndRef}
          isMsgLoading={sending || editing}
        />
      </Dialog>
    </Box>
  );
};
