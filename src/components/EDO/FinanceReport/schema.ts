import { IFinanceReportsCreateRequest } from '@services/financeReport/models/create'
import { selectSchema } from "@utils";
import * as Yup from 'yup'

export const financeReportSchema = Yup.object({
  company: selectSchema(),
  industry: selectSchema(),
  government: selectSchema(),
  ownershipType: selectSchema(),
  inn: Yup.string().required('Обязательно'),
  accountant: Yup.string().required('Обязательно'),
  phone: Yup.string().required('Обязательно'),
  address: Yup.string().required('Обязательно'),
  date: Yup.string().required('Обязательно'),
  term: Yup.string().required('Обязательно'),
  measure: selectSchema(),
  reportType: selectSchema(),
  files: Yup.array(),
})

export const initialValues: IFinanceReportsCreateRequest & {
  firstTime?: boolean
} = {
  company: null,
  industry: null,
  government: null,
  ownershipType: null,
  inn: '',
  accountant: '',
  phone: '',
  address: '',
  date: '',
  term: '',
  measure: null,
  reportType: null,
  files: [],
  reportDetails: {
    items: [],
  },
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
