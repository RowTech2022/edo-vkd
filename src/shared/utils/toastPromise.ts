import { ToastPromiseParams, toast } from 'react-toastify'

interface IHandleParam {
  then?: (data: any) => void
  catch?: (err: any) => void
}

export const toastPromise = (
  promise: Promise<any>,
  options?: ToastPromiseParams,
  handler?: IHandleParam
) => {
  const toastId = toast.loading((options?.pending as string) || '')

  promise.then((res) => {
    toast.dismiss(toastId)
    if (!res || 'error' in res) {
      if (handler?.catch) {
        handler.catch(res.error.data)
      }
      return
    }

    toast.success((options?.success as string) || '')
    if (handler?.then) {
      handler?.then(res.data)
    }
  })
}
