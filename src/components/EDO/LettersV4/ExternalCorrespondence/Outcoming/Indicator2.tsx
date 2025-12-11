import StateIndicatorBase2 from "@root/components/EDO/StateIndicatorBase/StateIndicatorBase2";

type Props = {
  activeState: number;
  endStatus: number;
  letterType?: number;
};

export default function Indicator2(props: Props) {
  const states = [
    { id: 2, name: "Канцелярия" },
    { id: 200, name: "Отправлено" },
  ];
  const states2 = [
    { id: 1, name: "Новое письмо" },
    // { id: 2, name: "Канцелярия" },
    { id: 3, name: "Подготовка ответа" },
    { id: 4, name: "Ожидания соглосавания" },
    { id: 5, name: "Ожидания подписа" },
    { id: 6, name: "Канцелярия" },
    { id: 7, name: "Ожидания завершение" },
    { id: 8, name: "Ответ отклонено" },
    { id: 11, name: "Отклонено" },
    { id: 200, name: "Отправлено" },
  ];

  const selectedStates = Number(props.letterType) === 1 ? states2 : states;

  //    if (Number(props.letterType) !== 2) {
  //     const showId = [2, 5].includes(props.activeState) ? props.activeState : 2;
  //     selectedStates = selectedStates.filter(
  //       (s) => (s.id !== 2 && s.id !== 5) || s.id === showId
  //     );
  //   }

  return (
    <StateIndicatorBase2
      states={selectedStates}
      activeState={props.activeState}
      endStatus={props.endStatus}
    />
  );
}
