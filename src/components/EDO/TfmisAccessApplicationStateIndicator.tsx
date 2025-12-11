import StateIndicatorBase from "./StateIndicatorBase/StateIndicatorBase";

type Props = {
  activeState: number;
  endStatus: number;
  exception?: Array<number> | null;
};

export default function StateIndicator(props: Props) {
  let states = [
    { id: 1, name: "Оформление" },
    { id: 2, name: "Руководитель БО" },
    { id: 3, name: "Куратор(ПБ)" },
    { id: 4, name: "Начальник отдела (ПБ)" },
    { id: 5, name: "Куратор (ИБ)" },
    { id: 6, name: "Начальник отдела (ИБ)" },
    { id: 7, name: "Сардор" },
    { id: 8, name: "Утверждено" },
  ];

  props.exception
    ? (states = states.filter((el) => !props.exception?.includes(el.id)))
    : states;

  return (
    <StateIndicatorBase
      states={states}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
