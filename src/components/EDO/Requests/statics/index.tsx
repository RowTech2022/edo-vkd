import { GridColDef } from "@mui/x-data-grid";
import { ISectionTab } from "@ui";
import { OPRK1 } from "../Request/tabs";
import Accounting from "../Request/tabs/accounting";
import Admin from "../Request/tabs/admin";
import IB1 from "../Request/tabs/ib1";
import IB2 from "../Request/tabs/ib2";
import OPRK2 from "../Request/tabs/oprk2";
import OPRK3 from "../Request/tabs/oprk3";
import { formatDate } from "@utils";

export const applicationsColumn: GridColDef[] = [
  {
    field: "index",
    headerName: "№",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "date",
    headerName: "Дата",
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return formatDate(params.value);
    },
  },
  {
    field: "type",
    headerName: "Тип",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "executor",
    headerName: "Исполнитель",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "region",
    headerName: "Регион",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "state",
    headerName: "Статус",
    flex: 2,
    sortable: false,
    filterable: false,
    valueFormatter: (params) => {
      return params.value ? "Активный" : "Неактивный";
    },
  },
];

export const oprk2Columns: GridColDef[] = [
  {
    field: "code",
    headerName: "Код",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "price",
    headerName: "Цена",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "count",
    headerName: "Количество",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "measure",
    headerName: "Ед.Измерения",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "ndsSumma",
    headerName: "Сумма НДС",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "total",
    headerName: "Итого",
    flex: 2,
    sortable: false,
    filterable: false,
  },
];

export const applicationTabItems: ISectionTab[] = [
  {
    title: "ОПРК",
    value: "oprk1",
    View: OPRK1,
  },
  {
    title: "ИБ",
    value: "ib",
    View: IB1,
  },
  {
    title: "Админа",
    value: "admin",
    View: Admin,
  },
  {
    title: "ОПРК",
    value: "oprk2",
    View: OPRK2,
  },
  {
    title: "ИБ",
    value: "ib2",
    View: IB2,
  },
  {
    title: "Бухгалтерия",
    value: "accountant",
    View: Accounting,
  },
  {
    title: "ОПРК",
    value: "oprk3",
    View: OPRK3,
  },
];
