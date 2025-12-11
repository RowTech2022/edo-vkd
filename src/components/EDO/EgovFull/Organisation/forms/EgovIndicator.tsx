import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";
import { EgovServiceApplicationStatus } from "@root/components/Registries/EgovFull/Service/helpers/constants";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function EgovIndicator(props: Props) {
  const states = [
    { id: EgovServiceApplicationStatus.New, name: "Новая" },
    { id: EgovServiceApplicationStatus.Approved, name: "Утвержденная" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
