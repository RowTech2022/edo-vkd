import { Box, Button, DialogTitle, Typography, styled } from "@mui/material";
import { FC, useState } from "react";
import { reactQuillModules } from "../../../helpers/constants";
import { IAnswerByOwnRequest } from "@services/lettersApiV3";
import { IParentApi } from "@root/shared/types/Tree";
import ReactQuill from "react-quill";

interface IAnswerForm {
  tree?: IParentApi | null;
  incomingId: number;
  executorId: number;
  type: number;
  filesContent?: JSX.Element;
  onClose: () => void;
  answerByOwn: (payload: IAnswerByOwnRequest) => void;
}

const Div = styled("div", {
  name: "MuiDiv",
  overridesResolver: (props, styles) => {
    return [styles.root];
  },
})();

export const AnswerForm: FC<IAnswerForm> = (props) => {
  const [text, setText] = useState(props.tree?.answerText || "");
  const [filesOpen, setFilesOpen] = useState(false);

  const { onClose, answerByOwn, filesContent, tree, ...otherProps } = props;

  const onSubmit = (type: number) => {
    const payload: IAnswerByOwnRequest = {
      text,
      ...otherProps,
    };
    payload.type = type;
    answerByOwn(payload);
  };

  return (
    <>
      <DialogTitle
        className="tw-bg-primary"
        sx={{
          position: "relative",
          color: "#fff",
        }}
        textAlign={"center"}
        fontSize={25}
      >
        <Button
          sx={{
            position: "absolute",
            top: "16px",
            left: "16px",
          }}
          variant="contained"
          onClick={() => setFilesOpen(!filesOpen)}
        >
          Показать файлы
        </Button>
        Ответить
      </DialogTitle>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          minHeight: "80vh",
        }}
      >
        <Box
          sx={{
            width: filesOpen ? "40%" : "100%",
            transition: "width .3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "80vh",
            }}
            padding={3}
          >
            <Div style={{ flex: 8 }} className="tw-my-5">
              <ReactQuill
                className="tw-h-[50vh]"
                value={text}
                modules={reactQuillModules}
                onChange={(value) => setText(value)}
                theme="snow"
              />
            </Div>

            {tree?.sign && (
              <Box display="flex" alignItems="center" justifyContent={"start"}>
                <Typography color={"#888"} variant="h6">
                  ЭЦП:
                </Typography>
                <Typography variant="body1">
                  <img src={`data:image/png;base64,${tree.sign.sign}`} />
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                justifyContent: "end",
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                disabled={!tree?.canSaveAnswer}
                variant="contained"
                onClick={() => onSubmit(0)}
              >
                Сохранить
              </Button>
              <Button
                disabled={!tree?.canApproveAnswer}
                variant="contained"
                onClick={() => onSubmit(1)}
              >
                Утвердить
              </Button>
              <Button variant="contained" onClick={onClose}>
                Закрыть
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            opacity: filesOpen ? 1 : 0,
            transition: "all .3s ease",
            width: filesOpen ? "60%" : "0%",
          }}
        >
          <Box padding={2}>{filesContent}</Box>
        </Box>
      </Box>
    </>
  );
};
