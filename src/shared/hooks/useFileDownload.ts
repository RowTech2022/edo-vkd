export const downloadFile = (file: string, fileName?: string) => {
  const a = document.createElement('a')
  a.href = file
  a.target = '_blank'
  a.download = fileName || Math.random().toString()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// another way download file--------------------------------------------------------------------------
export const downloadFileWithUrl = (res: any) => {
  const { file64, fileName } = res.data || {}
  const a = document.createElement('a')
  a.href = `data:application/pdf;base64,${file64}`
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const downloadFileWithUrl2 = (
  res: any,
  withUrl?: boolean,
  name?: string
) => {
  const { file64, fileName } = res.data || {}
  const a = document.createElement('a')

  const index = res?.slice('?') || res?.length || -1
  const url = res ? res.slice(0, index) : ''
  a.href = withUrl ? url : `data:application/pdf;base64,${file64}`
  a.download = name || fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
