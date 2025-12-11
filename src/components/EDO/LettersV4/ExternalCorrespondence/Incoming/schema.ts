import { ILettersV3CreateRequest } from "@services/lettersApiV3";
import { IncomingNewLettersMainDTO } from "@services/lettersNewApi";
import * as Yup from 'yup'

export const lettersV4FilesSchema = Yup.object({
  files: Yup.array(),
})

export const initialValues: ILettersV3CreateRequest & {
  firstTime?: boolean
} = {
  files: [],
}


export const INITIAL_VALUES: Pick<
  Nullable<IncomingNewLettersMainDTO>,
  | 'incomeNumber'
  | 'outcomeNumber'
  | 'receivedDate'
  | 'senderType'
  | 'contragent'
  | 'contact'
  | 'haveMainResult'
  | 'executor'
  | 'content1'
  | 'term'
  | 'body'
  | 'files'
> = {
  incomeNumber: '',
  outcomeNumber: '',
  receivedDate: null,
  senderType: null,
  contragent: null,
  contact: null,
  executor: null,
  haveMainResult: false,
  content1: null,
  term: null,
  body: null,
  files: null,
}

export const getFileInitialData = (me: string, id: number = 0) => ({
  id,
  reportId: 0,
  url: '',
  name: '',
  type: 2,
  description: '',
  createAt: new Date(Date.now()).toISOString(),
  createBy: me,
})
