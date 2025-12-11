import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function StateIndicator(props: Props) {
  const states = [
    { id: 0, name: "Оформление" },
    { id: 1, name: "Утверждение" },
    { id: 2, name: "Одобрение" },
    { id: 4, name: "Одобрен" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
