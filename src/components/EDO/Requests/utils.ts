import { FormikProps } from 'formik'

interface IGetFieldConfigs {
  onBlur: () => void
  helperText: string
  error: boolean
}

export type GetFieldConfigs = (
  formik: FormikProps<any>,
  key: string
) => IGetFieldConfigs

export const getFieldConfigs: GetFieldConfigs = (formik, key) => {
  return {
    onBlur: () => formik.setFieldTouched(key, true),
    helperText: formik.touched[key] ? (formik.errors[key] as string) : '',
    error: formik.errors[key] && formik.touched[key] ? true : false,
  }
}
