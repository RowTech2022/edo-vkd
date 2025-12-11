import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

enum Status {
  prepare = 1,
  approve,
  consider,
  accepted,
}

export default function StateIndicator(props: Props) {
  const states = [
    { id: Status.prepare, name: "Подготовка" },
    { id: Status.approve, name: "Утверждение" },
    { id: Status.consider, name: "На расмотрении" },
    { id: Status.accepted, name: "Принято" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
