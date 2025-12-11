import { Box, Dialog } from "@mui/material";
import { FC, useCallback, useRef, useEffect, useState } from "react";
import { ChatForm } from "./components/ChatForm";
import {
  IChatMessage,
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

const chatURL = import.meta.env.VITE_PUBLIC_CHAT_URL || "/";
import { UploadFileLetters } from "@services/internal/incomingApi";

interface IChat {
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
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [resFiles, setResFiles] = useState<string[]>([]);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [lastId, setLastId] = useState<number>();
  const [lastSendId, setLastSendId] = useState<number>();

  useEffect(() => {
    if (lastSendId !== lastId && lastId && discutionId) {
      newMessage({
        discutionId,
        lastId,
      }).then((res: any) => {
        setMessages((prev) => [...prev, ...res.data.messages]);
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
              console.log(4578, "message received ", message, last);
            }
          );

          connection1.onclose((e) => {
            console.log(999, "close");
          });

          await connection1.start();

          setConnection(connection1);
        } catch (e) {
          console.log("ERROR", e);
        }
        setMessages(res.data.messages || []);
        setResFiles(res.data.files || []);
        setCanSendMessage(res.data.canSendMessage);
        setMsgsLoading(false);
      });
    }
  }, [discutionId, incomingId, discution]);

  const onSendMessage = (parentId: number, text: string, files: string[]) => {
    const msg = {
      text,
      user: {
        id: session?.user?.id || 0,
        value: session?.user?.displayName || "",
      },
      files: files,
      createAt: new Date(Date.now()).toString(),
    };
    setMessages([...messages, msg]);
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
    let newMessages = messages.map((item) => {
      if (item?.id === id) {
        return { ...item, text: text, files: files };
      }
      return item;
    });

    setMessages(newMessages);

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
        console.log("connection closed");
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
          mainFiles={mainFiles}
          resFiles={resFiles}
          onCloseDiscution={onCloseDiscution}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          onCloseModal={onCloseModal}
          getDiscutions={getDiscutions}
          canSendMessage={canSendMessage}
          messages={messages}
          msgsLoading={msgsLoading}
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
