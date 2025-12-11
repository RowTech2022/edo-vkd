import { IApplicationByIdResponse } from '@services/applicationsApi'
import { IRequestHandlers } from '..'

export interface IExecutor {
  id: string
  value: string
}

export type ITabDetail = IApplicationByIdResponse & {
  handlers: IRequestHandlers
  loaderButtonId?: string
  executors?: Array<IExecutor>
}

export enum TabType {
  OPRK1 = 1,
  IB1 = 2,
  ADMIN = 3,
  OPRK2 = 4,
  IB2 = 5,
  ACCOUNTANT = 6,
  OPRK3 = 7,
}
