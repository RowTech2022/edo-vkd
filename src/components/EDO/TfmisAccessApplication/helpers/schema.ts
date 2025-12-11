import {
  innSchema,
  numberSchema,
  phoneSchema,
  selectArraySchema,
  selectSchema,
  stringSchema,
} from "@utils";
import * as Yup from 'yup'

const InitialKuratonAndHeadInfo = {
  docId: 0,

  kuratorId: 0,
  kuratorName: '',
  kuratorFio: '',
  kuratorPosition: { id: '', value: '' },
  kuratorPhone: '',

  headId: 0,
  headName: '',
  headDepartFio: '',
  headDepartPosition: { id: '', value: '' },
  headDepartPhone: '',
}

export const initialValues: Pick<
  TFMIS.AccessApplication,
  'organisation' | 'userInfo'
> = {
  organisation: {
    regUserId: 0,
    year: new Date().getFullYear(),
    treasureCode: null,
    inn: '',
    orgName: '',
    address: '',
    pbsCode: [],
    seqnums: [],
  },
  userInfo: {
    first_Fio: '',
    first_Position: [],
    first_Inn: '',
    first_Phone: '',
    first_Email: '',
    second_Fio: '',
    second_Position: [],
    second_Inn: '',
    second_Phone: '',
    second_Email: '',

    budgetExpenditureInfo: null,
    budgetPreparationInfo: null,
  },
}

export type InitialValuesType = typeof initialValues;

export const validationSchema = Yup.object().shape({
  organisation: Yup.object().shape({
    year: numberSchema(),
    inn: innSchema(),
    treasureCode: selectSchema(),
    orgName: stringSchema(),
    address: stringSchema(),
    pbsCode: selectArraySchema(),
    seqnums: selectArraySchema().min(1, 'Обязательно'),
  }),
  userInfo: Yup.object().shape({
    first_Fio: stringSchema(3, 130),
    first_Inn: innSchema(),
    first_Phone: phoneSchema(),
    second_Fio: stringSchema(3, 130),
    second_Inn: innSchema(),
    second_Phone: phoneSchema(),

    budgetExpenditureInfo: Yup.object().required('Обязательно'),
    budgetPreparationInfo: Yup.object().required('Обязательно'),
  }),
})
