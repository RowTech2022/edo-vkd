import { IApplicationByIdResponse } from '@services/applicationsApi'

export const initialValuesIb: IApplicationByIdResponse['ib'] = {
  id: 0,
  executor: {
    id: '',
    value: '',
  },
  loginTfmis: '',
  passiveLoginTfmis: false,
  loginEdo: '',
  passiveLoginEdo: false,
  newTfmisLogin: '',
  newTfmisPassword: '',
  newEdoLogin: '',
  newEdoPassword: '',
}
