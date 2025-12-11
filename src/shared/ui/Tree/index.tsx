import { useState } from "react";
import Button from "@mui/material/Button";
import {
  IParentApi,
  IExecutorList,
  IMainResultSend,
  IResultApprove,
  ITreeQueryList,
} from "@root/shared/types/Tree";
import ReactQuill from "react-quill";
import Parent from "./Parent";
import { Card } from "@ui";

interface ITreeProps {
  incomingId: number;
  data: Array<IParentApi>;
  addRow?: any;
  executorsLists?: Array<IExecutorList>;
  priorityList?: Array<ITreeQueryList>;
  resolutionList?: Array<ITreeQueryList>;
  changeVal?: any;
  saveUsers?: any;
  approveUsers?: any;

  firstLevelOnly?: boolean;

  haveMainResult: boolean;
  canSaveMainResolution: boolean;
  canApproveMainResolution: boolean;
  mainResult: string;
  mainResultId: number | null;

  createChildResult?: any;
  updateChildResult?: any;
  approveChildResult?: any;

  createMainResult?: any;
  updateMainResult?: any;
  approveMainResult?: any;

  removeUserRow?: (child: IParentApi) => void;
  onSearchExecutor?: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const Tree: React.FC<ITreeProps> = ({
  incomingId,

  data,

  addRow,

  executorsLists,
  priorityList,
  resolutionList,

  changeVal,

  haveMainResult,
  canSaveMainResolution: canSaveMainResolution,
  canApproveMainResolution: canApproveMainResolution,
  mainResult,
  mainResultId,
  firstLevelOnly,

  saveUsers,
  approveUsers,

  createChildResult,
  updateChildResult,
  approveChildResult,

  createMainResult,
  updateMainResult,
  approveMainResult,
  removeUserRow,
  onSearchExecutor,
}) => {
  const [mainResultText, setMainResultText] = useState(mainResult || "");

  const saveMainData = () => {
    var currentId = mainResultId || 0;
    let forSave: IMainResultSend = {
      id: currentId,
      incomingId: incomingId,
      text: mainResultText,
    };

    updateMainResult(forSave);
  };

  const approveMainData = () => {
    var currentId = mainResultId || 0;
    let forApprove: IResultApprove = {
      id: currentId,
      timestamp: "",
    };

    approveMainResult(forApprove);
  };

  return (
    <>
      {data.map((tree, index) => {
        return (
          <Parent
            incomingId={incomingId}
            approveUsers={approveUsers}
            saveUsers={saveUsers}
            fristLevelOnly={firstLevelOnly}
            tree={tree}
            key={tree.id || index + "_" + Math.random().toString(23)}
            changeVal={changeVal}
            addRow={addRow}
            data={tree}
            resolutionList={resolutionList}
            executorsList={executorsLists}
            priorityList={priorityList}
            createChildResult={createChildResult}
            updateChildResult={updateChildResult}
            approveChildResult={approveChildResult}
            createMainResult={createMainResult}
            updateMainResult={updateMainResult}
            approveMainResult={approveMainResult}
            removeUserRow={removeUserRow}
            onSearchExecutor={onSearchExecutor}
          />
        );
      })}

      {haveMainResult && (
        <div className="tw-mt-2">
          <Card title="Ответное письмо">
            <ReactQuill
              modules={modules}
              value={mainResultText}
              onChange={(e) => {
                setMainResultText(e);
              }}
              theme="snow"
            />
            <div className="tw-flex tw-justify-center tw-gap-3 tw-mt-4">
              <Button disabled={!canSaveMainResolution} onClick={saveMainData}>
                Сохранить
              </Button>
              <Button
                disabled={!canApproveMainResolution}
                onClick={approveMainData}
              >
                Одобрить
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Tree;
