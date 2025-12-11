import { numberSchema, selectObjectSchema } from "@utils";
import * as Yup from 'yup'

export const initialValues: Pick<
  Accountant.JobResponsibilities,
  'year' | 'bo_Signature' | 'bo_SignatureTime' | 'infoCartSignaturas'
> = {
  year: new Date().getFullYear(),
  bo_Signature: null,
  bo_SignatureTime: null,
  infoCartSignaturas: null,
}

export type InitialValuesType = typeof initialValues;

export const validationSchema = Yup.object().shape({
  year: numberSchema(),
  infoCartSignaturas: selectObjectSchema(),
})
