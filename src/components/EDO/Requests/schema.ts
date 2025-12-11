import * as Yup from 'yup'

export const validationSchema = Yup.object({
  organisation: Yup.object({
    id: Yup.string(),
    label: Yup.string(),
  }).required('Обязательно для заполнения'),
  inn: Yup.string()
    .min(9, 'ИНН состоит из 9 цифр')
    .max(9, 'ИНН состоит из 9 цифр')
    .matches(/[0-9]{9}/, 'ИНН состоит из числовых значений')
    .required('Обязательно для заполнения'),
  fio: Yup.string()
    .min(3, 'Минимальная длина ФИО 3')
    .required('Обязательно для заполнения'),
  serialNumber: Yup.string().required('Обязательно для заполнения'),
  hasToken: Yup.boolean().required('Обязательно для заполнения'),
  tokenNumber: Yup.string().notRequired(),
  phone: Yup.string()
    .matches(/[0-9]{9}/, 'Введите правильный номер из 9 цифр')
    .required('Обязательно для заполнения'),
  email: Yup.string().email().required('Обязательно для заполнения'),
  prikazUrl: Yup.string().notRequired(),
  passportUrl: Yup.string().notRequired(),
})
