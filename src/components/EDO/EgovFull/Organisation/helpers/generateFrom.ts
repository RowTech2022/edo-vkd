import { IInitialValues } from './schema'
import { IEgovServicesCreateResponse } from '@services/egovServices'


export const generateFrom = (value: IEgovServicesCreateResponse) => {
  const data: IInitialValues = {
    name: value.name,
    price : value.price,
    term: value.term,
    phoneNumber : value.phoneNumber,
    treatmentPrice :value.treatmentPrice,
    description: value.description,
    files: value.files || [],
  }

  return data
}
