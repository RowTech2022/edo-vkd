import { IHistoryRequest } from "@services/organizationsApi";
import OrganizationHistory from "../history";
import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "@utils";
import { ISectionTab } from "@ui";

export const tabItems: ISectionTab[] = [
  {
    title: "Корреспонденция",
    value: "1",
    View: () => <div>Контент Корреспонденция</div>,
  },
  {
    title: "Заявки",
    value: "2",
    View: () => <div>Контент Заявки</div>,
  },
  {
    title: "Обращения",
    value: "3",
    View: () => <div>Контент Обращения</div>,
  },
  {
    title: "Организация",
    value: "4",
    View: () => <div>Контент Организация</div>,
  },
  {
    title: "История",
    value: "5",
    View: () => <OrganizationHistory />,
  },
  {
    title: "Взаиморасчет",
    value: "6",
    View: () => <div>Контент Взаиморасчет</div>,
  },
];

export const defaultFilterHistory: IHistoryRequest = {
  ids: [],
  filtres: {
    dateFrom: "2021-10-22T12:18:43.317Z",
    dateTo: "2022-10-22T12:18:43.317Z",
    docType: 0,
  },
  orderBy: {
    column: 1,
    order: 0,
  },
  pageInfo: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export const historyTableHead: GridColDef[] = [
  {
    field: "index",
    headerName: "№",
    flex: 1,
    sortable: false,
    filterable: false,
  },
  {
    field: "name",
    headerName: "Название",
    flex: 4,
    sortable: false,
    filterable: false,
  },
  {
    field: "inn",
    headerName: "Инн",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  {
    field: "status",
    headerName: "Статус",
    flex: 3,
    sortable: false,
    filterable: false,
  },
  {
    field: "docDate",
    headerName: "Дата создания",
    flex: 3,
    sortable: false,
    filterable: false,
    valueFormatter: (params: any) => formatDate(params.value),
  },
  {
    field: "year",
    headerName: "ФИН.Год",
    flex: 2,
    sortable: false,
    filterable: false,
  },
];
