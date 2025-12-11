import { IEgovServiceRequestsCreateResponse } from '@services/egovServiceRequests'
import { IInitialValuesForUpdate } from './schemaForUpdate'

export const readyFiles: IEgovServiceRequestsCreateResponse['readyFiles'] = []

export const generateFromForUpdate = (
  value: IEgovServiceRequestsCreateResponse
) => {
  const data: IInitialValuesForUpdate = {
    id: value.id,
    files: value.files,
    timestamp: value.timestamp,
    acceptedFiles: value.readyFiles ? value.readyFiles : readyFiles,
  }
  return data
}
