export const getParamFromUrl = (url: string, paramKey: string) => {
  if (url) {
    const idx = url?.indexOf('?')
    if (idx !== -1) {
      return new URLSearchParams(url.slice(idx + 1)).get(paramKey)
    }
  }
  return ''
}
