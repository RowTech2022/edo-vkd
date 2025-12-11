import { FormikProps } from 'formik'
import { ValueId } from '@services/api'
import { IEgovApplicationCreateRequest } from '@services/egov/application-resident/models/create'
import { emailSchema, phoneSchema, selectSchema, stringSchema } from "@utils";
import * as Yup from 'yup'
import { readyFile } from './generateFrom'
import { IEgovAcceptRequest } from '@services/egov/application-resident/models/actions'

export interface IInitialValues
  extends Omit<IEgovApplicationCreateRequest, 'inn' | 'year' | 'count'> {
  inn: ValueId | null
  year: ValueId | null
  count: ValueId | null
  acceptedFiles: Array<IEgovAcceptRequest['readyFile']>
}

export type EgovFormikType = FormikProps<InitialValuesType>

export const initialValues: IInitialValues = {
  year: null,
  inn: null,
  nameOfTaxpayer: '',
  address: '',
  city: null,
  phone: '',
  email: '',
  acc: '',
  bankName: '',
  contentApp: '',
  goverment: null,
  count: null,
  fio: '',
  files: [],
  acceptedFiles: [readyFile],
}

export const validationSchema = Yup.object().shape({
  year: selectSchema(),
  inn: selectSchema(),
  nameOfTaxpayer: stringSchema(),
  address: stringSchema(),
  city: selectSchema(),
  phone: phoneSchema(),
  email: emailSchema(),
  acc: stringSchema(16, 24),
  bankName: stringSchema(3),
  contentApp: Yup.string(),
  government: selectSchema(),
  count: selectSchema(),
  fio: stringSchema(3, 130),
})

export type InitialValuesType = typeof initialValues
