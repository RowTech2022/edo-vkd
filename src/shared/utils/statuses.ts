import { ValueId } from "@root/services";

export const CARD_SIGNATURE_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Руководитель БО" },
  { id: 3, name: "ГРБС" },
  { id: 4, name: "На утверждении" },
  { id: 200, name: "Утверждено" },
];

export const ACCOUNTANT_RESPONSIBILITY_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Подписан" },
  { id: 200, name: "Утверждено" },
];

export const ACCESS_TFMIS_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Руководитель БО" },
  { id: 3, name: "Куратор(ПБ)" },
  { id: 4, name: "Начальник отдела (ПБ)" },
  { id: 5, name: "Куратор(ИБ)" },
  { id: 6, name: "Начальник отдела (ИБ)" },
  { id: 7, name: "Сардор" },
  { id: 200, name: "Утверждено" },
];

export const ACCESS_MF_STATUSES = [
  { id: 1, name: "Куратор" },
  { id: 2, name: "Нач Отдела" },
  { id: 3, name: "Сардор" },
  { id: 200, name: "Утверждено" },
];

export const WAY_BILL_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Утверждение" },
  { id: 3, name: "Одобрение" },
  { id: 4, name: "Одобрен" },
];

export const CONTRACT_STATUSES = [
  { id: 1, name: "Подготовка" },
  { id: 2, name: "Ожидает подписания" },
  { id: 3, name: "Подписан 1-ой стороной" },
  { id: 4, name: "Подписан всеми сторонами" },
];

export const INVOICE_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Утверждение" },
  { id: 3, name: "Одобрение" },
  { id: 4, name: "Одобрено" },
];

export const TRAVEL_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Утверждение" },
  { id: 3, name: "Утверждено" },
];

export const PROXY_STATUSES = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Утверждение" },
  { id: 3, name: "Утверждено" },
];

export const INTERNAL_EMAIL_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Регистрация" },
  { id: 2, name: "На резолюцию" },
  { id: 3, name: "На исполнении" },
  { id: 4, name: "Канцелярия" },
  { id: 5, name: "Завершено" },
  { id: 6, name: "Отклонено" },
  { id: 100, name: "Удалено" },
];

export const INCOMMING_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Регистрация" },
  { id: 2, name: "На резолюции" },
  { id: 3, name: "На исполнении" },
  { id: 4, name: "Канцелярия" },
  { id: 5, name: "Завершено" },
  { id: 6, name: "Отклонено" },
];

export const INCOMMING_STATUSES_V4: { id: number; name: string }[] = [
  { id: 1, name: "Регистрация" },
  { id: 2, name: "На резолюции" },
  { id: 3, name: "На исполнении" },
  { id: 4, name: "Канцелярия" },
  { id: 5, name: "Подготовка ответа" },  
  { id: 6, name: "Отклонено" },  
  { id: 7, name: "Ожидания соглосавания" },
  { id: 8, name: "Ожидания подписа" },  
  { id: 9, name: "Ответ отклонено" },  
  { id: 10, name: "Ожидания зовершения" },  
  { id: 11, name: "Отклонено" },  
  { id: 100, name: "Удалено" },  
  { id: 200, name: "Завершено" }
];

export const INCOMMING_STATUSES_COLOR: { id: number; color: string }[] = [
  { id: 1, color: "#FADD6D" },
  { id: 2, color: "#74FFB7" },
  { id: 3, color: "#FADD6D" },
  { id: 4, color: "#FADD6D" },
  { id: 5, color: "#3BD952" },
  { id: 6, color: "#FF5454" },
  { id: 7, color: "#03A9F4" },
  { id: 8, color: "#FFEB3B" },
  { id: 9, color: "#FF4D4F" },
  { id: 10, color: "#FFB347" },
  { id: 11, color: "#9E9E9E" },
  { id: 100, color: "#FF0000" },
  { id: 200, color: "#3BD952" },
];

export const INCOMMING_STATUSES_WITHOUT_FIRST: { id: number; name: string }[] =
  [
    { id: 2, name: "На резолюции" },
    { id: 3, name: "На исполнении" },
    { id: 4, name: "Канцелярия" },
    { id: 5, name: "Завершено" },
    { id: 6, name: "Отклонено" },
  ];

export const ACTIVITY_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Не начато" },
  { id: 2, name: "В работе" },
  { id: 3, name: "Одобрение" },
  { id: 4, name: "Завершено" },
  { id: 5, name: "Отменено" },
];

export const RESOLUTION_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Обработка" },
  { id: 2, name: "На исполнении" },
  { id: 3, name: "Исполнена" },
  { id: 4, name: "Отменено" },
];

export const OUTCOME_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Подготовка" },
  { id: 2, name: "Одобрение" },
  { id: 3, name: "Отправлено" },
];

export const OUTCOME_STATUSES_V3: { id: number; name: string }[] = [
  { id: 1, name: "Канцелярия" },
  { id: 2, name: "Готов к завершению" },
  { id: 5, name: "Завершено" },
  { id: 6, name: "Отклонено" },
  { id: 100, name: "Удалено" },
];


export const OUTCOME_STATUSES_V4: { id: number; name: string }[] = [
  { id: 1, name: "Новая письмо" },
  { id: 2, name: "Канцелярия" },
  { id: 3, name: "Подготовка ответа" },
  { id: 4, name: "Ожидания соглосавания" },
  { id: 5, name: "Ожидания подписа" },
  { id: 6, name: "Канцелярия" },
  { id: 7, name: "Ожидания завершение" },
  { id: 8, name: "Ответ отклонено" },
  { id: 11, name: "Отклонено" },
  { id: 200, name: "Отправлено" }
];
export const ACT_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Оформление" },
  { id: 2, name: "Утверждение" },
  { id: 3, name: "Одобрение" },
  { id: 4, name: "Одобрен" },
];

export const EGOV_FULL_SERVICE_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Новая" },
  { id: 2, name: "Регистрация" },
  { id: 3, name: "Резолюция" },
  { id: 4, name: "Исполнение" },
  { id: 5, name: "Подготовка документа" },
  { id: 6, name: "Канцелярия" },
  { id: 7, name: "Завершено" },
  { id: 8, name: "Отклонено" },
];

export const EGOV_FULL_SERVICES_STATUSES: { id: number; name: string }[] = [
  { id: 1, name: "Новая" },
  { id: 2, name: "Утвержденная" },
];

export const EGOV_SERVICES_PAYMENT_STATUSES: { id: number; name: string }[] = [
  { id: 0, name: "Не оплачено" },
  { id: 1, name: "Оплачено" },
  { id: 2, name: "Частично оплачено" },
];

export const FIN_REPORTS: { id: number; name: string }[] = [
  {
    id: 1,
    name: "Подготовка",
  },
  {
    id: 2,
    name: "Утверждение",
  },
  {
    id: 3,
    name: "На расмотрении",
  },
  {
    id: 4,
    name: "Отвергнуто",
  },
  {
    id: 200,
    name: "Принято",
  },
];

export const USER_STATUSES: ValueId[] = [
  {
    id: "0",
    value: "Не указан",
  },
  {
    id: "1",
    value: "Активный",
  },
  {
    id: "2",
    value: "Неактивный",
  },
  {
    id: "3",
    value: "Освобожден от должности",
  },
  {
    id: "4",
    value: "В отпуске",
  },
  {
    id: "5",
    value: "Отсутствует",
  },
];

export const LANGUAGES: { id: number; name: string }[] = [
  { id: 1, name: "TJ" },
  { id: 2, name: "RU" },
  { id: 3, name: "EN" },
];

export const ORGANIZATION_DOC_TYPE: { id: number; name: string }[] = [
  { id: 1, name: "Blank" },
  { id: 2, name: "Logo" },
  { id: 3, name: "OtherDocs" },
];


const STATUSES = {
  contract: CONTRACT_STATUSES,
  way_bill: WAY_BILL_STATUSES,
  invoice: INVOICE_STATUSES,
  travel: TRAVEL_STATUSES,
  proxy: PROXY_STATUSES,
  email: INTERNAL_EMAIL_STATUSES,
  income: INCOMMING_STATUSES,
  income_v4: INCOMMING_STATUSES_V4,
  outcome_V4: OUTCOME_STATUSES_V4,
  outcome_V3: OUTCOME_STATUSES_V3,
  execution: INCOMMING_STATUSES_WITHOUT_FIRST,
  outcome: OUTCOME_STATUSES,
  activity: ACTIVITY_STATUSES,
  resolution: RESOLUTION_STATUSES,
  user: USER_STATUSES,
  act: ACT_STATUSES,
  egov_full_service: EGOV_FULL_SERVICE_STATUSES,
  egov_full_services: EGOV_FULL_SERVICES_STATUSES,
  fin_report: FIN_REPORTS,
  egov_service_payment: EGOV_SERVICES_PAYMENT_STATUSES,
} as any;

export const getStatusName = (id: number, name: string): string => {
  let status = "";
  if (STATUSES[name]) {
    status =
      STATUSES[name].find((b: any) => b.id === id)?.name || "Статус не определено";
  }
  return status;
};

export const getStatusColor = (id: number): string => {
  return INCOMMING_STATUSES_COLOR.find((b: any) => b.id === id)?.color;
};
