import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";
import { EgovApplicationStatus } from "@root/components/Registries/Egov/ApplicationResident/helpers/constants";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function EgovIndicator(props: Props) {
  const states = [
    { id: EgovApplicationStatus.paperwork, name: "Оформление" },
    { id: EgovApplicationStatus.registration, name: "Регистрация" },
    { id: EgovApplicationStatus.resolution, name: "На резолюции" },
    { id: EgovApplicationStatus.execution, name: "На исполнении" },
    { id: EgovApplicationStatus.cancery, name: "Канцелярия" },
    { id: EgovApplicationStatus.accepted, name: "Завершено" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
