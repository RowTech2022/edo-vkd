import { FormikProps } from 'formik'
import {
  stringSchema,
} from "@utils";
import * as Yup from 'yup'
import { IEgovServicesRequestData } from '@services/egovServices'

export interface IInitialValues extends IEgovServicesRequestData { }

export type EgovFullFormikType = FormikProps<InitialValuesType>

export const initialValues: IInitialValues = {
  name: '',
  description: '',
  files: [],
  price: 0,
  treatmentPrice: 0,
  phoneNumber : '',
  term  : 0
}

export const validationSchema = Yup.object().shape({
  name: stringSchema(),
  description: stringSchema(1, 4000),
})

export type InitialValuesType = typeof initialValues
