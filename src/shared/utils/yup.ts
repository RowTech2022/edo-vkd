import { FormikProps } from 'formik'
import * as Yup from 'yup'

export const stringArraySchema = () =>
  Yup.array().of(Yup.string()).nullable().required('Обязательно')

export const selectArraySchema = () =>
  Yup.array().of(
    Yup.object()
      .shape({
        id: Yup.mixed(),
        value: Yup.string().required('Обязательно'),
      })
      .nullable()
      .required('Обязательно')
  )

export const selectSchema = () =>
  Yup.object()
    .shape({
      id: Yup.mixed(),
      value: Yup.string(),
    })
    .nullable()
    .required('Обязательно')

    export const yearSchema = () =>
  Yup.number().nullable()

export const selectObjectSchema = () =>
  Yup.object()
    .shape({
      organizationName: Yup.string().required('Обязательно'),
      address: Yup.string(),
      inn: Yup.string(),
      bo_Fio: Yup.string(),
      bo_Phone: Yup.string(),
    })
    .nullable()
    .required('Обязательно')

export const stringSchema = (min?: number, max?: number) =>
  Yup.string()
    .min(min || 1, `Минимальная допустимая длина строки ${min}`)
    .max(max || 120, `Максимальная допустимая длина строки ${max}`)
    .required('Обязательно')
    .nullable()

export const numberSchema = () => Yup.number().required('Обязательно')

export const dateSchema = () => Yup.date().required('Обязательно')

export const innSchema = () =>
  Yup.string()
    .length(9, 'Необходимая длина ИНН 9 символов')
    .required('Обязательно')
    .nullable()

export const phoneSchema = () =>
  Yup.string()
    .length(9, 'Необходимая длина телефона 9 символов')
    // .matches(/^\+992[0-9]{9}$/, 'Правильный формат телефона: +992XXXXXXXXX')
    .required('Обязательно')
    .nullable()

export const emailSchema = () =>
  Yup.string()
    .required('Обязательно')
    .email('Неправильный формат электронной почты')
    .nullable()

type GetFieldErrors = (
  formik: FormikProps<any>,
  key: string
) => { helperText?: string | boolean }

export const getValue = (obj: any, key: string) => {
  const keys = key.split('.')

  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]]
    if (!obj) return false
  }

  return obj
}

export const getFieldErrors: GetFieldErrors = (formik, key) => {
  const { touched, errors } = formik
  const touchVal = getValue(touched, key),
    errorVal = getValue(errors, key)
  const error = Boolean(touchVal && errorVal)
  return {
    error,
    helperText: error ? (errorVal as string) : '',
  }
}
