import { BaseQueryFn } from '@reduxjs/toolkit/dist/query'
import { AxiosRequestConfig, AxiosError } from 'axios'
import { axios } from './axios'

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      endpoint: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
    },
    unknown,
    unknown
  > =>
    async ({ endpoint, method = 'GET', data }) => {
      try {
        const res = await axios(endpoint, { method, data })
        if (res.data instanceof Object && 'items' in res.data) {
          return { data: res.data.items }
        }
        return { data: res.data }
      } catch (error) {
        let err = error as AxiosError
        console.log('Error on request', error)
        return {
          error: { status: err.response?.status, data: err.response?.data },
        }
      }
    }
