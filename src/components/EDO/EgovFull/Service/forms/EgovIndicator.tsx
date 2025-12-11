import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";
import { EgovApplicationStatus } from "@root/components/Registries/EgovFull/Organisation/helpers/constants";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function EgovIndicator(props: Props) {
  const states = [
    { id: EgovApplicationStatus.New, name: "Новая" },
    { id: EgovApplicationStatus.Concelyar1, name: "Канцелярия" },
    { id: EgovApplicationStatus.Resolution, name: "Резолюция" },
    { id: EgovApplicationStatus.Execution, name: "Исполнение" },
    { id: EgovApplicationStatus.Collect, name: "Подготовка документов" },
    { id: EgovApplicationStatus.Concelyar2, name: "Канцелярия" },
    { id: EgovApplicationStatus.Done, name: "Завершено" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
