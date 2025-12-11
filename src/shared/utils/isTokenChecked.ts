import { axios } from '@configs'

const TOKEN_CHECK_KEY = 'TOKEN-CHECK-KEY'
const TOKEN_SAVE_KEY = 'TOKEN_CERT'

export const isTokenChecked = () => {
  const str = localStorage.getItem(TOKEN_CHECK_KEY)

  if (!str) return false
  return Number(str) > Date.now()
}

export const setTokenChecked = () => {
  localStorage.setItem(TOKEN_CHECK_KEY, String(Date.now() + 60 * 60 * 1000))
}

export const removeTokenChecked = () => {
  localStorage.removeItem(TOKEN_CHECK_KEY)
  localStorage.removeItem(TOKEN_SAVE_KEY)
}

export const saveToken = (token: any) => {
  if (!token) return
  localStorage.setItem(TOKEN_SAVE_KEY, JSON.stringify(token))
}

export const getSavedTokenCert = () => {
  try {
    if (!isTokenChecked()) return
    const token = JSON.parse(localStorage.getItem(TOKEN_SAVE_KEY) || '{}')
    if (token) {
      axios.defaults.headers.common['CertId'] = token.certId.toString()
      axios.defaults.headers.common['CertExpiry'] = token.expiryDate.toString()
      axios.defaults.headers.common['CertStartDate'] =
        token.startDate.toString()
    }
  } catch (err) {
    console.log(err)
  }
}
