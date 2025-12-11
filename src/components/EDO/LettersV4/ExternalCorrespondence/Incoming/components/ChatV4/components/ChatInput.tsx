import {
  Input,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { FC, useState, useEffect, forwardRef, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  useSendMessageV4Mutation,
  useEditMessageV4Mutation,
} from "@services/lettersApiV4";
import { useGetAvailableUserMutation } from "@services/userprofileApi";

interface IUser {
  value: string;
  avatar: string;
}

interface IProps {
  disabled?: boolean;
  refetchMessages: () => void;
  chatInfoId: number | null;
  setReplyMessage: any;
  replyMessage: { name: string; message: string; id: number } | null;
  editMessage: any;
  setEditMessage: any;
  ref: any;
  chatUsers: IUser[];
}

export const JSON_REGEXP = /@\{"login":"[^"]+","id":"\d+","value":"[^"]+"\} /g;

export const normalizeValue = (value: string) => {
  return value?.replace(/@({.*?})/, (match, group) => {
    try {
      const parsed = JSON.parse(group);
      return `@${parsed.login}`;
    } catch (e) {
      return match; // если вдруг JSON невалидный
    }
  });
};

export const normalizeValue2 = (value: any) => {
  const safeValue = typeof value === "string" ? value : "";

  return safeValue.replaceAll(JSON_REGEXP, (match) => {
    try {
      const userObj = JSON.parse(match.slice(1));
      return `<span class="text-blue">${userObj.value}</span> `;
    } catch (e) {
      return match;
    }
  });
};




export const normalizeBeforeSending = (
  value: string,
  userMap: Map<string, string>
) => {
  return value.replaceAll(/@[0-9a-zA-z.@]{1,} /g, (match, login) => {
    return `@${userMap.get(match.slice(1, match.length - 1))} `;
  });
};

export const ChatInput = forwardRef<HTMLDivElement, IProps>(
  (
    {
      disabled,
      chatInfoId,
      refetchMessages,
      setReplyMessage,
      replyMessage,
      editMessage,
      setEditMessage,
      chatUsers,
    },
    ref
  ) => {
    const [value, setValue] = useState("");
    const [mentionQuery, setMentionQuery] = useState("");
    const [showMentions, setShowMentions] = useState(false);

    const userMap = useRef<Map<string, string>>(new Map());

    const [getAvailableUser, { data: users }] = useGetAvailableUserMutation();

    const [sendMessage, { isLoading }] = useSendMessageV4Mutation();
    const [editMessageMutate, { isLoading: editMessageLoading }] =
      useEditMessageV4Mutation();

    const handleSendMessage = () => {
      if (disabled) return;
      if (value.trim()) {
        if (editMessage) {
          const text = normalizeBeforeSending(value, userMap.current);
          editMessageMutate({
            discutionId: chatInfoId,
            id: editMessage?.id,
            text,
            files: [],
          }).then(() => {
            refetchMessages();
            setValue("");
            setReplyMessage({ visible: false, info: null });
            setEditMessage(null);
          });
        } else {
          const text = normalizeBeforeSending(value, userMap.current);
          sendMessage({
            discutionId: chatInfoId,
            parentId: replyMessage?.id,
            text,
            files: [],
          }).then(() => {
            refetchMessages();
            setValue("");
            setReplyMessage({ visible: false, info: null });
          });
        }
      }
    };

    useEffect(() => {
      if (editMessage) {
        const text = editMessage?.text.replaceAll(
          JSON_REGEXP,
          (match, user) => {
            try {
              const userObj = JSON.parse(match.slice(1));
              userMap.current.set(
                userObj.login,
                match.slice(1, match.length - 1)
              );
              return `@${userObj.login} `;
            } catch (e) {
              return match;
            }
          }
        );
        setValue(text);
      }
    }, [editMessage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);

      const cursorPos = e.target.selectionStart ?? val.length;
      const textBeforeCursor = val.slice(0, cursorPos);
      const mentionMatch = /@(\w*)$/.exec(textBeforeCursor);

      if (mentionMatch) {
        getAvailableUser(mentionMatch[1]);
        setMentionQuery(mentionMatch[1]);
        setShowMentions(true);
      } else {
        setShowMentions(false);
        setMentionQuery("");
      }
    };

    const handleSelectUser = (user: any) => {
      const cursorIndex = value.lastIndexOf("@" + mentionQuery);
      if (cursorIndex === -1) return;

      const before = value.slice(0, cursorIndex);
      const after = value.slice(cursorIndex + mentionQuery.length + 1);

      const updated = `${before}@${JSON.stringify(user)} ${after}`;

      userMap.current.set(user.login, JSON.stringify(user));

      setValue(updated);
      setMentionQuery("");
      setShowMentions(false);
    };

    return (
      <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
        <div className="tw-relative">
          {showMentions && users?.items?.length > 0 && (
            <Paper className="tw-absolute tw-bottom-full tw-z-50 tw-max-h-28 tw-overflow-auto tw-w-[220px] tw-rounded-md tw-shadow-md">
              <List dense>
                {users.items.map((user) => (
                  <ListItem
                    key={user.id}
                    button
                    onClick={() => handleSelectUser(user)}
                  >
                    <ListItemText
                      primary={user.value}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </div>

        <div className="tw-w-full tw-flex tw-gap-3 tw-items-start">
          <div className="tw-flex-1">
            <Input
              ref={ref}
              disabled={disabled}
              disableUnderline
              value={normalizeValue(value)}
              placeholder="Введите сообщение"
              fullWidth
              multiline
              rows={2}
              className="tw-border-2 tw-border-primary tw-rounded-2xl"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                minHeight: "48px",
                width: "100%",
                paddingX: "16px",
                paddingY: "10px",
              }}
            />
          </div>
          <div
            className="tw-py-2 tw-cursor-pointer"
            onClick={handleSendMessage}
          >
            <SendIcon fontSize="large" />
          </div>
        </div>
      </div>
    );
  }
);
