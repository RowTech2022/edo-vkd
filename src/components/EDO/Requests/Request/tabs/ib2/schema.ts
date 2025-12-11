import { IApplicationByIdResponse } from '@services/applicationsApi'

export const initialValuesIb2: IApplicationByIdResponse['ib2'] = {
  id: 0,
  executor: {
    id: '',
    value: '',
  },
  loginTfmis: '',
  tfmisCert: '',
  loginEdo: '',
  edoCert: '',
}
