import StateIndicatorBase from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
};

export default function StateIndicator(props: Props) {
  const states = [
    { id: 1, name: "Подготовка" },
    { id: 2, name: "Ожидает подписание" },
    { id: 3, name: "Подписан 1-ой стороной" },
    { id: 4, name: "Подписан всеми сторонами" },
  ];

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
