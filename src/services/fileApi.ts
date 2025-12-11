import {
  api,
} from './api'

export interface IFilesRequest {
  data: FormData
}

export interface IFileResponce {
  url: string
}

export interface IFileDownloadRequest {
  data: IFileDownloadPayload
}

export interface IFileDownloadPayload {
  fileName: string
  type: any
}

export interface IFileDownloadWithHash {
  hash: string
}

export interface IFileDowloadResponse {
  data: any
}


export interface IFileRequestContact {
  data: FormData
}


const fileApi = api.injectEndpoints({



  endpoints: (builder) => ({
    fetchDownloadFiles: builder.mutation<IFileDowloadResponse, IFileDownloadRequest>({
      query: (data) => ({
        url: '/api/file/DownloadFile2',
        //url: 'https://localhost:44383/Api/File/DownloadFile2',
        //url: 'https://localhost:44334/Api/File/downloadFile',
        //https://row-file-service.azurewebsites.net/index.html
        method: 'POST',
        params: data.data,
      }),
    }),

    fetchDownloadFilesWithHash: builder.mutation<IFileDowloadResponse, IFileDownloadWithHash>({
      query: (data) => ({
        url: '/api/file/DownloadFile2',
        //url: 'https://localhost:44383/Api/File/DownloadFile2',
        //url: 'https://localhost:44334/Api/File/downloadFile',
        //https://row-file-service.azurewebsites.net/index.html
        method: 'POST',
        data: data,
      }),
    }),


    fetchUploadFiles: builder.mutation<IFileResponce, IFilesRequest>({
      query: (data) => ({
        url: '/api/File/UploadFile',
        //url: 'https://localhost:44383/Api/File/UploadFile',
        //url: 'https://localhost:44334/Api/File/UploadFile',
        method: 'POST',
        data: data.data,
      }),
    }),

    fetchUploadFiles2: builder.mutation<IFileResponce, IFilesRequest>({
      query: (data) => ({
        url: '/api/File/UploadFileV2',
        //url: 'https://localhost:44383/Api/File/UploadFile',
        //url: 'https://localhost:44334/Api/File/UploadFile',
        method: 'POST',
        data: data.data,
      }),
    }),

  }),
})

export const {
  //useFetchUploadMutation,
  //useLazyDownloadFileQuery,
  useFetchUploadFilesMutation,
  useFetchDownloadFilesMutation,
  useFetchDownloadFilesWithHashMutation,
  useFetchUploadFiles2Mutation
  //useFetchUploadFileContractMutation,
  //useFetchUploadFileContract1Mutation
} = fileApi
