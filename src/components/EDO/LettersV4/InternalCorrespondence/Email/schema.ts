import { EmailV35LettersMainDTO, IEmailLettersV35CreateRequest } from "@services/lettersApiV35";
import * as Yup from 'yup'

export const lettersV3FilesSchema = Yup.object({
  files: Yup.array(),
})

export const initialValues: IEmailLettersV35CreateRequest & {
  firstTime?: boolean
} = {
  files: [],
}


export const INITIAL_VALUES: Pick<
  Nullable<EmailV35LettersMainDTO>,
  | 'incomeNumber'
  | 'creator'
  | 'subject'
  | 'files'
> = {
  incomeNumber: '',
  creator: '',
  subject: '',
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
