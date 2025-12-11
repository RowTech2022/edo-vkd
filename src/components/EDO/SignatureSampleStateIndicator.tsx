import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function StateIndicator(props: Props) {
  const states = [
    { id: 1, name: "Оформление" },
    { id: 2, name: "Руководитель БО" },
    { id: 3, name: "ГРБС" },
    { id: 4, name: "На утверждении" },
    { id: 200, name: "Утверждено" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
