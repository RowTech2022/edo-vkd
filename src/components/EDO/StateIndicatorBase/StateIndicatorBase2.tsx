// StateIndicatorBase.tsx
import classNames from "classnames";
import { CheckIcon, ClockIcon } from "@ui";

type Props = {
  activeState: number;
  endStatus: number;
  states: {
    id: number;
    name: string;
  }[];
};

export default function StateIndicatorBase2({
  endStatus,
  activeState,
  states,
}: Props) {
const  filteredStates = states.filter((state) => {
    if (state.id === 11) return false;

    if ([3, 7 , 8 ].includes(state.id) && state.id !== activeState) return false;

    if (state.id === 200 && activeState === 11) return false;

    return true;
  });

  if (activeState === 11) {
    filteredStates.push({ id: 11, name: "Отклонено" });
  }

  filteredStates.sort((a, b) => a.id - b.id);

  const lastElm = filteredStates.at(-1);

  return (
     <div className="tw-flex tw-justify-between tw-px-16 tw-pb-16">
      {filteredStates.map((state) => (
        <div
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
                activeState === state.id && ![endStatus, 11].includes(activeState)
                  ? "tw-bg-[#FA8C15]"
                  : (activeState !== 100 && state.id < activeState) ||
                    activeState === endStatus ||
                    activeState === 11
                  ? "tw-bg-green-600"
                  : "tw-bg-primary"
              )}
            >
              {(activeState === 100 || activeState <= state.id) &&
              activeState !== endStatus &&
              activeState !== 11 ? (
                <ClockIcon stroke="none" fill="#fff" />
              ) : (
                <CheckIcon stroke="none" fill="#fff" />
              )}
              <p className="tw-absolute -tw-bottom-10 tw-text-center tw-whitespace-normal tw-leading-tight">
                {state.name}
              </p>
            </div>
            <span
              className={classNames(
                "tw-h-2",
                activeState === state.id && ![endStatus, 11].includes(activeState)
                  ? "tw-bg-gradient-to-r tw-from-[#FA8C15] tw-to-primary"
                  : state.id === activeState - 1 && state.id + 1 !== endStatus
                  ? "tw-bg-gradient-to-r tw-from-green-600 tw-to-[#FA8C15]"
                  : (activeState !== 100 && state.id < activeState) ||
                    activeState === endStatus ||
                    state.id === endStatus ||
                    activeState === 9
                  ? "tw-bg-green-600"
                  : "tw-bg-primary"
              )}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
