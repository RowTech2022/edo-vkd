import {
  innSchema,
  phoneSchema,
  selectSchema,
  stringArraySchema,
  stringSchema,
  yearSchema,
} from "@utils";
import * as Yup from 'yup'

export const initialValues: Pick<
  SignatureSamples.Card,
  'organisationInfo' | 'signatures'
> = {
  organisationInfo: {
    regUserId: 0,
    year: new Date().getFullYear(),
    inn: null,
    organizationName: null,
    orgPhone: null,
    address: null,
    accounts: null,
  },
  signatures: {
    first_Fio: null,
    first_Phone: null,
    first_Signature: null,
    first_SignatureTime: '',
    second_Fio: null,
    second_Phone: null,
    second_Signature: null,
    second_SignatureTime: '',
    treasurerId: 0,
    treasurer_Fio: null,
    treasurer_Position: null,
    treasurer_Phone: null,
    treasurer_Signature: null,
    treasurer_SignatureTime: '',
    treasurer_Org: null,
    treasurer_Inn: null,
  },
}

export type InitialValuesType = typeof initialValues

export const validationSchema = Yup.object().shape({
  organisationInfo: Yup.object().when('signatures', (signature, schema) => {
    return schema.shape({
      year: yearSchema(),
      orgPhone: phoneSchema(),
      inn: innSchema().notOneOf([signature?.treasurer_Inn], 'ИНН организации "информация организациии" не должно совпадать с ИНН организации "ГРБС"'),
      organizationName: stringSchema().notOneOf([signature?.treasurer_Org], 'Название организации "информация организациии" не должно совпадать с названием организации "ГРБС"'),
      address: stringSchema(),
      accounts: stringArraySchema(),
    })
  }),
  signatures: Yup.object().when('organisationInfo', (org, schema) => {
    return schema.shape({
      first_Fio: stringSchema(3, 130),
      first_Signature: stringSchema(),
      first_Phone: phoneSchema().test('Not Equal', 'Намера руководителя не должны совпадать с намерами главного бухгалтера и намерами организации', function (phone) {
        const { second_Phone } = this.parent || {}
        return second_Phone !== phone
      }),
      second_Fio: stringSchema(3, 130),
      second_Signature: stringSchema(),
      second_Phone: phoneSchema().test('Not Equal', 'Намера главного бугалтера не должны совпадать с намерами руководителя и намерами организации', function (phone) {
        const { first_Phone } = this.parent || {}
        return first_Phone !== phone
      }),
      treasurer_Fio: stringSchema(3, 130),
      treasurer_Position: stringSchema(),
      treasurer_Org: stringSchema().notOneOf([org.organizationName], 'Название организации "ГРБС" не должно совпадать с названием организации "информация организациии"'),
      treasurer_Inn: stringSchema().notOneOf([org.inn], 'ИНН организации "ГРБС" не должно совпадать с ИНН организации "информация организациии"'),
    })
  }),
}, [['organisationInfo', 'signatures']])
