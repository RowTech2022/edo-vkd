import { FormikProps } from 'formik'
import * as Yup from 'yup'
import {
  IEgovServiceRequestsCreateResponse,
  IEgovServiceRequestsUpdateRequest,
} from '@services/egovServiceRequests'
import { readyFiles } from './generateFromForUpdate'

export interface IInitialValuesForUpdate
  extends Omit<IEgovServiceRequestsUpdateRequest, ''> {
  acceptedFiles: IEgovServiceRequestsCreateResponse['readyFiles']
}

export type EgovFullFormikTypeForUpdate = FormikProps<InitialValuesType>

export const initialValuesForUpdate: IInitialValuesForUpdate = {
  id: 0,
  files: [],
  timestamp: '',
  acceptedFiles: readyFiles,
}

export const validationSchema = Yup.object().shape({})

export type InitialValuesType = typeof initialValuesForUpdate
