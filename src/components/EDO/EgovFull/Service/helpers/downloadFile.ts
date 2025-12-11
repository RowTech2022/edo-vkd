export const downloadFile = (res: any, withUrl?: boolean, name?: string) => {
  const a = document.createElement('a')
  a.href = res
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
