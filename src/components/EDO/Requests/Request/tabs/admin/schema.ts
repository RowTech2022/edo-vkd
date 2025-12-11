import { IApplicationByIdResponse } from '@services/applicationsApi'

export const initialValuesAdmin: IApplicationByIdResponse['admin'] = {
  id: 0,
  executor: {
    id: '',
    value: '',
  },
  loginVpn: '',
  passiveLoginVpn: false,
  newVpnLogin: '',
  newVpnPassword: '',
}
