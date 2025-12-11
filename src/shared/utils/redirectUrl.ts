export const CachedUrlKey = 'RedirectUrl'

export const setRedirectUrl = (url: string) => {
  localStorage.setItem(CachedUrlKey, url)
}

export const getRedirectUrl = () => {
  return localStorage.getItem(CachedUrlKey)
}

export const clearRedirectUrl = () => {
  localStorage.setItem(CachedUrlKey, '')
}
