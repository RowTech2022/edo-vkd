import * as Yup from 'yup'

export const validationSchema = Yup.object({
  inn: Yup.string()
    .min(9, 'ИНН состоит из 9 цифр')
    .max(9, 'ИНН состоит из 9 цифр')
    .matches(/[0-9]{9}/, 'ИНН состоит из числовых значений')
    .required('Обязательно для заполнения'),
  name: Yup.string()
    .min(3, 'Минимальная длина ФИО 3')
    .required('Обязательно для заполнения'),
  contractNo: Yup.string().required('Обязательно для заполнения'),
  contractDate: Yup.date().required('Обязательно для заполнения'),
  grbs: Yup.object({
    id: Yup.string(),
    name: Yup.string(),
  }).required('Обязательно для заполнения'),
  pbs: Yup.object({
    id: Yup.string(),
    name: Yup.string(),
  }).required('Обязательно для заполнения'),
  seqnums: Yup.array().required('Обязательно для заполнения'),
  requisites: Yup.array().required('Обязательно для заполнения'),
  orgType: Yup.object({
    id: Yup.string(),
    name: Yup.string(),
  }).required('Обязательно для заполнения'),
  terCode: Yup.object({
    id: Yup.string(),
    name: Yup.string(),
  }).required('Обязательно для заполнения'),
  treasureCode: Yup.object({
    id: Yup.string(),
    name: Yup.string(),
  }).required('Обязательно для заполнения'),
})

export const getFileInitialData = (me: string, id: number = 0) => ({
  id,
  orgId: 0,
  url: '',
  name: '',
  type: 2,
  description: '',
  createAt: new Date(Date.now()).toISOString(),
  createBy: me,
})

export const getBlankFileInitialData = (me: string, id: number = 0) => ({
  id,
  organizationId: 0,
  url: '',
  name: '',
  docType: 1,
  language: 1,
  createAt: new Date(Date.now()).toISOString(),
  createBy: me,
  isNew: true
})