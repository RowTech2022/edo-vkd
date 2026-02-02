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

    if ([7 , 8 ].includes(state.id) && state.id !== activeState) return false;

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
                (() => {
                  // Если это последний элемент, не показываем линию
                  if (lastElm?.id === state?.id) {
                    return "tw-bg-transparent";
                  }
                  
                  // Находим следующий статус в списке
                  const currentIndex = filteredStates.findIndex(s => s.id === state.id);
                  const nextState = filteredStates[currentIndex + 1];
                  
                  // Если статус завершен (меньше активного)
                  const isStateCompleted = (activeState !== 100 && state.id < activeState) || 
                                          activeState === endStatus || 
                                          activeState === 11;
                  
                  // Если следующий статус - это активный статус, и текущий статус завершен
                  // то линия должна быть оранжево-серым градиентом (переход от завершенного к активному)
                  if (isStateCompleted && nextState?.id === activeState && activeState !== endStatus && activeState !== 11) {
                    return "tw-bg-gradient-to-r tw-from-green-600 tw-to-[#FA8C15]";
                  }
                  
                  // Если статус завершен и следующий статус тоже завершен - зеленая линия
                  const isNextStateCompleted = nextState && (
                    (activeState !== 100 && nextState.id < activeState) || 
                    activeState === endStatus || 
                    activeState === 11
                  );
                  
                  if (isStateCompleted && isNextStateCompleted) {
                    return "tw-bg-green-600";
                  }
                  
                  // Если текущий статус - активный
                  if (state.id === activeState) {
                    return "tw-bg-gradient-to-r tw-from-[#FA8C15] tw-to-primary";
                  }
                  
                  // Остальные случаи - серая линия
                  return "tw-bg-primary";
                })()
              )}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
