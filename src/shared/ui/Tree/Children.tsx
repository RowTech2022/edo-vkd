import React from "react";
import { IParentApi, IExecutorList, ITreeQueryList } from "../../types/Tree";
import Parent from "./Parent";

interface IChildrenProps {
  incomingId: number;
  data: IParentApi;
  addRow?: any;
  tree?: IParentApi;
  executorsList?: Array<IExecutorList>;
  priorityList?: Array<ITreeQueryList>;
  resolutionList?: Array<ITreeQueryList>;
  changeVal?: any;

  saveUsers?: any;
  approveUsers?: any;

  createChildResult?: any;
  updateChildResult?: any;
  approveChildResult?: any;

  createMainResult?: any;
  updateMainResult?: any;
  approveMainResult?: any;
}

const Children: React.FC<IChildrenProps> = ({
  incomingId,
  data,
  addRow,
  tree,
  executorsList,
  priorityList,
  resolutionList,
  changeVal,

  saveUsers,
  approveUsers,

  createChildResult,
  updateChildResult,
  approveChildResult,

  createMainResult,
  updateMainResult,
  approveMainResult,
}) => {
  return (
    <>
      <ul style={{ width: "99%" }} className="tw-ml-auto">
        <li
          className={
            data.execType === 0 || data.execType == 4
              ? "tw-mt-1 tw-ml-4"
              : "tw-mt-1 tw-ml-4"
          }
        >
          <Parent
            incomingId={incomingId}
            saveUsers={saveUsers}
            approveUsers={approveUsers}
            changeVal={changeVal}
            executorsList={executorsList}
            data={data}
            priorityList={priorityList}
            resolutionList={resolutionList}
            addRow={addRow}
            tree={data}
            createChildResult={createChildResult}
            updateChildResult={updateChildResult}
            approveChildResult={approveChildResult}
            createMainResult={createMainResult}
            updateMainResult={updateMainResult}
            approveMainResult={approveMainResult}
          />
          {/* {data.canAdd && <div id={data.parentId} className='tw-mt-3 tw-ml-8'><Button onClick={(e) => addRow(tree,data)} variant="text">Добавить</Button></div>} */}
        </li>
      </ul>
    </>
  );
};

export default Children;
