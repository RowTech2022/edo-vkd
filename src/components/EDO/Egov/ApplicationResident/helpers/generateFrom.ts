import { IEgovApplicationCreateResponse } from '@services/egov/application-resident/models/create'
import { IInitialValues } from './schema'

export const readyFile: IEgovApplicationCreateResponse['readyFile'] = {
  id: 1,
  docId: 0,
  url: '',
  name: '',
  outDocNo: '',
  inDocNo: '',
  acceptedAt: '',
  acceptedBy: '',
}

export const generateFrom = (value: IEgovApplicationCreateResponse) => {
  const data: IInitialValues = {
    year: {
      id: value.year,
      value: String(value.year),
    },
    inn: {
      id: value.inn,
      value: value.nameOfTaxpayer,
    },
    nameOfTaxpayer: value.nameOfTaxpayer,
    address: value.address,
    city: value.city,
    phone: value.phone,
    email: value.email,
    acc: value.acc,
    bankName: value.bankName,
    contentApp: value.contentApp,
    goverment: value.goverment,
    count: {
      id: value.count,
      value: String(value.count),
    },
    fio: value.fio,
    files: value.files || [],
    acceptedFiles: [value.readyFile ? value.readyFile : readyFile],
  }

  return data
}
