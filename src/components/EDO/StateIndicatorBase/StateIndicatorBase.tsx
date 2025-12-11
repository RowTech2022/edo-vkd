// StateIndicatorBase.tsx
import classNames from "classnames";
import { CheckIcon, ClockIcon } from "@ui";
import { useRef } from "react";

type Props = {
  activeState: number;
  endStatus: number;
  states: {
    id: number;
    name: string;
  }[];
  documentHistories?: any;
  onClickItem?: (state: any, element: HTMLDivElement) => void;
};

export default function StateIndicatorBase({
  endStatus,
  activeState,
  states,
  documentHistories,
  onClickItem,
}: Props) {
  const filteredStates = states.filter((state) => {
    if ([7, 8, 9, 10].includes(state.id)) {
      // оставляем и сам активный шаг, и предыдущий
      return state.id === activeState || state.id === activeState - 1;
    }
    if (state.id === 200 && activeState === 9) {
      return false;
    }
    return true;
  });

  const elementsRef = useRef<HTMLDivElement[]>([]);

  const lastElm = filteredStates.at(-1);

  return (
    <div className="tw-flex tw-justify-between tw-px-16 tw-pb-16">
      {filteredStates.map((state) => (
        <div
          ref={(element) => {
            if (element) {
              elementsRef.current[state.id] = element;
            }
          }}
          onClick={() => {
            onClickItem?.(state, elementsRef.current[state.id]);
          }}
          key={`${state.name}-${state.id}`}
          className={classNames(
            "tw-relative tw-items-start tw-gap-4",
            lastElm?.id === state?.id ? "!tw-w-unset" : "tw-w-full"
          )}
        >
          <div className="tw-width-full tw-grid tw-grid-cols-[40px_1fr] tw-items-center">
            <div
              className={classNames(
                "tw-w-10 tw-aspect-square tw-rounded-full tw-flex tw-items-center tw-justify-center",
                activeState === state.id &&
                  ![endStatus, 9].includes(activeState)
                  ? "tw-bg-[#FA8C15]"
                  : (activeState !== 100 && state.id < activeState) ||
                    activeState === endStatus ||
                    activeState === 9
                  ? "tw-bg-green-600"
                  : "tw-bg-primary"
              )}
            >
              {(activeState === 100 || activeState <= state.id) &&
              activeState !== endStatus &&
              activeState !== 9 ? (
                <ClockIcon stroke="none" fill="#fff" />
              ) : (
                <CheckIcon stroke="none" fill="#fff" />
              )}
              <p
                className={`tw-absolute -tw-bottom-10 tw-text-center tw-whitespace-normal tw-leading-tight ${
                  window.innerWidth < 1600 ? "tw-text-[12px]" : ""
                } `}
              >
                {state.name}
              </p>
            </div>
            <span
              className={classNames(
                "tw-h-2",
                state.id + 1 < activeState || state.id === endStatus
                  ? "tw-bg-green-600"
                  : state.id === activeState
                  ? "tw-bg-gradient-to-r tw-from-[#FA8C15] tw-to-primary"
                  : state.id === activeState - 1
                  ? "tw-bg-gradient-to-l tw-from-[#FA8C15] tw-to-green-600"
                  : "tw-bg-primary"
              )}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
