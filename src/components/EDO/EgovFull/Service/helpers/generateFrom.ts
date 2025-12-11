import { IInitialValues } from './schema'
import { IEgovServiceRequestsDTO } from '@services/egovServiceRequests'

export const generateFrom = (value: IEgovServiceRequestsDTO) => {
  const data: IInitialValues = {
    serviceId: value.id,
    files: value.files.map((x) => {
      return {
        fileId: x.id,
        fileName: x.name,
        filePath: x?.url,
        createAt: x.createAt,
        createAtBy: '',
      }
    }),
  }
  return data
}
