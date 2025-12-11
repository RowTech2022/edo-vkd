import {
  IEgovServiceRequestsCreateRequest,
  IEgovServiceRequestsDTO,
} from '@services/egovServiceRequests'

export const transformValues = (values: IEgovServiceRequestsDTO) => {
  const { ...others } = values
  let newFiles = others.files.map((item) => {
    return {
      fileId: item.id,
      fileName: item.name,
      filePath: item.url,
      createAt: item.createAt,
      createAtBy: '',
    }
  })

  return {
    ...others,
    files: newFiles,
  } as IEgovServiceRequestsCreateRequest
}
