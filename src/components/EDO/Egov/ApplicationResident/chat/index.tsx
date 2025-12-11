import { Box, Dialog } from "@mui/material";
import { FC, useCallback, useRef, useEffect, useState } from "react";
import { ChatForm } from "./components/ChatForm";
import { IChatMessage } from "@services/chatApi";
import { useSession } from "@hooks";
import {
  useEditMessagenEgovApplicationMutation,
  useNewEgovMessageMutation,
  useOpenDiscutionEgovApplicationMutation,
  useSendMessagenEgovApplicationMutation,
} from "@services/egov/application-resident";
import { CheckPaymentForm } from "./components/CheckPaymentForm";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const chatURL =
  (import.meta.env.VITE_PUBLIC_CHAT_URL || "/") + "ResidentApplication_";

interface IChat {
  executorId?: number;
  applicationResidentId: number;
  discutionType: number;
  open?: boolean;
  setOpen: (open: boolean) => void;
}

export const Chat: FC<IChat> = ({
  open,
  executorId,
  applicationResidentId,
  discutionType,
  setOpen,
}) => {
  const [openDiscution] = useOpenDiscutionEgovApplicationMutation();
  const [sendMessage] = useSendMessagenEgovApplicationMutation();
  const [editMessage] = useEditMessagenEgovApplicationMutation();
  const [newMessage] = useNewEgovMessageMutation();
  const { data: session } = useSession();
  const [discutionId, setDiscutionId] = useState<number>(0);
  const [checkPaymentPopup, setCheckPaymentPopup] = useState(false);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [newMessageId, setNewMessageId] = useState(0);
  const [lastSendId, setLastSendId] = useState(0);
  const [resFiles, setResFiles] = useState<string[]>([]);

  const getDiscutions = useCallback(() => {
    openDiscution({
      executorId,
      applicationResidentId,
      discutionType,
    }).then((res: any) => {
      if (res.error) return;
      setMessages(res.data.messages || []);
      setDiscutionId(res.data.discutionId || 0);
      setResFiles(
        res.data.messages?.reduce(
          (acc: any, item: any) => [...acc, ...item.files],
          []
        ) || []
      );
      setCanSendMessage(
        discutionType === 2
          ? res.data.canSendMessage
          : res.data.canSendMessageInChat
      );
    });
  }, [applicationResidentId, discutionType, executorId, openDiscution]);

  const mRef = useRef<HTMLObjectElement>(null);

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
    sendMessage({
      discutionId,
      text,
      files,
    }).then((res: any) => {
      mRef.current?.scrollIntoView({ behavior: "smooth" });
      setLastSendId(res.data.messageId);
      getDiscutions();
    });
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
      }).then((res: any) => {
        if (!res.error) {
          getDiscutions();
        }
      });
    }
  };

  useEffect(() => {
    if (lastSendId !== newMessageId && newMessageId && discutionId) {
      newMessage({
        discutionId,
        lastId: newMessageId,
      }).then((res: any) => {
        setMessages((prev) => [...prev, ...res.data.messages]);
      });
    }
  }, [lastSendId, discutionId, newMessageId]);

  useEffect(() => {
    let connection: null | HubConnection = null;
    if (discutionId) {
      try {
        connection = new HubConnectionBuilder()
          .withUrl(chatURL + discutionId, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .build();

        connection.on(
          "receivemessage",
          (message: string, last: number, mesText: string) => {
            setNewMessageId(last);
            // getDiscutions()
          }
        );

        connection.onclose((e) => {
          console.log(999, "close");
        });

        connection.start();
      } catch (e) {
        console.log("ERROR", e);
        connection = null;
      }
    }

    return () => {
      if (connection) connection.stop();
    };
  }, [discutionId, setNewMessageId]);

  const onCloseDiscution = () => {
    setOpen(false);
    setMessages([]);
  };

  const onCloseModal = () => {
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
        fullWidth={true}
        maxWidth="xl"
        open={Boolean(open)}
        onClose={() => setOpen(false)}
      >
        <ChatForm
          resFiles={resFiles}
          onCloseDiscution={onCloseDiscution}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          onCloseModal={onCloseModal}
          getDiscutions={getDiscutions}
          canSendMessage={canSendMessage}
          messages={messages}
          checkPaymentVisible={discutionType === 1}
          openCheckPaymentForm={() => setCheckPaymentPopup(true)}
          mRef={mRef}
        />
      </Dialog>
      <Dialog
        maxWidth="lg"
        open={checkPaymentPopup}
        onClose={() => setCheckPaymentPopup(false)}
      >
        <CheckPaymentForm onClose={() => setCheckPaymentPopup(false)} />
      </Dialog>
    </Box>
  );
};
