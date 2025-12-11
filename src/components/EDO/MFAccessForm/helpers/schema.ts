import {
  emailSchema,
  innSchema,
  numberSchema,
  phoneSchema,
  selectArraySchema,
  selectSchema,
  stringSchema,
} from "@utils";
import * as Yup from 'yup'

export const initialValues: Pick<
  MF.AccessForm,
  'userInfo' | 'access' | 'currentGrbs'
> = {
  userInfo: {
    tfmisLogin: '',
    email: null,
    fio: '',
    inn: '',
    organization: null,
    passPortInfo: '',
    phone: null,
    position: null,
    treasureCode: null,
    userType: null,
    workPlace: '',
    year: new Date().getFullYear(),
    docType: 0,

    head: null,
    h_Fio: '',
    h_UserPosition: null,
    h_Phone: '',
  },
  access: {
    budgetVariant: [],
    dzSeqnums: [],
    pbsCode: [],
    programs: [],
    seqnums: [],
    pages: [],
  },
  currentGrbs: {
    items: [],
  },
}

export type InitialValuesType = typeof initialValues;

export const validationSchema = Yup.object().shape({
  userInfo: Yup.object().shape({
    tfmisLogin: stringSchema(),
    email: emailSchema(),
    fio: stringSchema(),
    inn: innSchema(),
    organization: selectSchema(),
    passPortInfo: stringSchema(),
    phone: phoneSchema(),
    position: selectSchema(),
    treasureCode: selectSchema(),
    userType: selectSchema(),
    year: numberSchema(),
    docType: numberSchema().min(1, 'Обязательно'),

    head: selectSchema(),
    // h_UserPosition: selectSchema(),
    // h_Phone: phoneSchema(),
  }),
  access: Yup.object().shape({
    dzSeqnums: selectArraySchema().nullable(),
    pbsCode: selectArraySchema().nullable(),
    programs: selectArraySchema(),
    seqnums: selectArraySchema().nullable(),
    // pages: Yup.array().min(1, 'Обязательно'),
  }),
})
