import { TokenInfo } from 'pages/api/auth/[...nextauth]'

declare module 'next-auth' {
  interface User {
    id: number
    giverName: string
    familyName: string
    displayName: string
    inn?: string
    companyName?: string
    phone?: string
    email?: string
    avatar?: string
    userType?: number
    roles?: number[]
    passport?: string
    userCompany?: any
  }
  interface Session {
    user?: User
    rutoken?: TokenInfo
    accessToken?: string | unknown
    refreshToken?: string | unknown
    accessTokenExpires?: number | string | unknown
  }
}
