import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";
import { Avatar, Popover } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  activeState: number;
  endStatus: number;
  documentHistories?: any;
  executors: any[];
};

export default function StateIndicator(props: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState({});
  const open = Boolean(anchorEl);

  const contentRef = useRef<HTMLDivElement>(null);

  const { executors } = props;

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const states = [
    { id: 1, name: "Регистрация" },
    { id: 2, name: "На резолюции" },
    { id: 3, name: "На исполнении" },
    { id: 5, name: "Подготовка ответа" },
    { id: 7, name: "Ожидание согласование" },
    { id: 8, name: "Ожидает подписания" },
    { id: 9, name: "Ответ отклонено" },
    { id: 10, name: "Ожидания завершения" },
    { id: 200, name: "Завершено" },
  ];

  const handleClick = (state: any, target: HTMLDivElement) => {
    event.stopPropagation();
    const filteredExecutors =
      executors?.filter((item) => item.state === state.id) ?? [];
    if (filteredExecutors.length > 0) {
      setState(state);
      setAnchorEl(target);
    }
  };

  const renderExecutors = (state: any) => {
    const filteredExecutors =
      executors?.filter((item) => item.state === state.id) ?? [];

    if (filteredExecutors.length === 0)
      return (
        <div className="tw-py-3 tw-text-[14px] tw-text-[#333333E0] tw-text-center">
          Нет исполнителей
        </div>
      );

    return filteredExecutors.map((executor) => {
      return (
        <div className="tw-p-[4px] tw-flex tw-gap-[8px] tw-max-w-[230px] tw-py-[6px]">
          <Avatar
            src={executor.avatar}
            alt={executor?.responsible?.value || ""}
          />
          <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-[4px] tw-max-w-[200px] tw-text-[14px]">
            <p className="tw-truncate tw-max-w-[180px] tw-text-[#333333E0]">
              {executor?.responsible?.value || ""}
            </p>
            <p className="tw-truncate tw-max-w-[180px] tw-text-[#33333373]">
              {executor?.position || ""}
            </p>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      const target = e.target;
      if (
        target !== contentRef.current &&
        !contentRef.current?.contains(e.target as any)
      ) {
        handlePopoverClose();
      }
    };

    document.addEventListener("click", handlePopoverClose);

    return () => {
      document.removeEventListener("click", handlePopoverClose);
    };
  }, [contentRef.current]);

  return (
    <div>
      <StateIndicatorBase
        states={states}
        activeState={props.activeState}
        endStatus={props.endStatus}
        documentHistories={props.documentHistories}
        onClickItem={handleClick}
      />
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onBackdropClick={handlePopoverClose}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div
          ref={contentRef}
          className="tw-p-1 tw-rounded-[12px] tw-bg-indicator-gradient tw-px-2 tw-max-w-[250px]"
        >
          <h4 className="tw-text-[14px] tw-leading-[22px] tw-py-2 tw-px-3 tw-border-b tw-border-[#D8D8D8]">
            Исполнители
          </h4>
          {renderExecutors(state)}
        </div>
      </Popover>
    </div>
  );
}
