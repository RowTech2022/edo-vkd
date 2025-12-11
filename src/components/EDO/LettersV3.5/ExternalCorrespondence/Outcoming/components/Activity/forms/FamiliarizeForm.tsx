import { Box, Button, DialogTitle, Typography } from "@mui/material";
import { FC, useState } from "react";
import { reactQuillModules } from "../../../helpers/constants";
import { IAcquaintedRequest } from "@services/lettersApiV3";
import { IParentApi } from "@root/shared/types/Tree";
import ReactQuill from "react-quill";

interface IFamiliarizeForm {
  incomingId: number;
  executorId: number;
  tree: IParentApi | null;
  onClose: () => void;
  acquainted: (payload: IAcquaintedRequest) => void;
}

export const FamiliarizeForm: FC<IFamiliarizeForm> = (props) => {
  const { onClose, acquainted, ...otherProps } = props;
  const [text, setText] = useState(props.tree?.answerComment || "");

  const onAcquainted = () => {
    const payload: IAcquaintedRequest = {
      text,
      ...otherProps,
    };

    acquainted(payload);
  };

  return (
    <>
      <DialogTitle
        className="tw-bg-primary"
        sx={{
          color: "#fff",
        }}
        textAlign={"center"}
        fontSize={25}
      >
        Шинос шудам
      </DialogTitle>
      <Box padding={3}>
        <div className="tw-my-5 tw-h-[250px]">
          <ReactQuill
            className="tw-h-[100%]"
            value={text}
            modules={reactQuillModules}
            onChange={(value) => setText(value)}
            theme="snow"
          />
        </div>
        {props.tree?.sign && (
          <Box display="flex" alignItems="center" justifyContent={"start"}>
            <Typography color={"#888"} variant="h6">
              ЭЦП:
            </Typography>
            <Typography variant="body1">
              <img src={`data:image/png;base64,${props.tree.sign.sign}`} />
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
            disabled={!props.tree?.canAcquainted}
            variant="contained"
            onClick={onAcquainted}
          >
            Подписать
          </Button>
          <Button variant="contained" onClick={onClose}>
            Закрыть
          </Button>
        </Box>
      </Box>
    </>
  );
};
