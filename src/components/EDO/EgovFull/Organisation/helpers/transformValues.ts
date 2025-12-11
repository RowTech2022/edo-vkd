import { IInitialValues } from './schema'
import { IEgovServicesRequestData } from '@services/egovServices'

export const transformValues = (values: IInitialValues) => {
  const { ...others } = values

  return {
    ...others,
  } as IEgovServicesRequestData
}
