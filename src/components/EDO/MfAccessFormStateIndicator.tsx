import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function StateIndicator(props: Props) {
  const states = [
    { id: 1, name: "Куратор" },
    { id: 2, name: "Нач Отдела" },
    { id: 3, name: "Сардор" },
    { id: 4, name: "Утверждено" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
