import { FormikProps } from 'formik'
import * as Yup from 'yup'
import { IEgovServiceRequestsCreateRequest } from '@services/egovServiceRequests'

export interface IInitialValues extends IEgovServiceRequestsCreateRequest { }

export type EgovFullFormikType = FormikProps<InitialValuesType>

export const initialValues: IInitialValues = {
  serviceId: 0,
  files: [],
}

export const validationSchema = Yup.object().shape({})

export type InitialValuesType = typeof initialValues
