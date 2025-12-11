import { IApplicationByIdResponse } from '@services/applicationsApi'

export const initialValuesAccountant: IApplicationByIdResponse['accountant'] = {
  id: 0,
  executor: {
    id: '',
    value: '',
  },
  invoices: [],
  acts: [],
  waybills: [],
}
