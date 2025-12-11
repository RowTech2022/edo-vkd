import { IEgovApplicationCreateRequest } from '@services/egov/application-resident/models/create'
import { IInitialValues } from './schema'

export const transformValues = (values: IInitialValues) => {
  const { year, inn, count, ...others } = values

  return {
    ...others,
    year: year?.id,
    inn: inn?.id,
    count: values.count?.id ? Number(values.count.id) : 0,
  } as IEgovApplicationCreateRequest
}
