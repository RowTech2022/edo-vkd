import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function StateIndicator(props: Props) {
  const states = [
    { id: 5, name: "Канцелярия" },
    { id: 200, name: "Завершено" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
