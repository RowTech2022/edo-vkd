import {
  api,
} from '../api'

interface ValueId {
  id: string
  value: string
}

export interface UserSearchRequest {
  login?: string
  name?: string
  surName?: string
  inn?: string
  phone?: string
  region?: ValueId
  userType?: ValueId
  status?: number
  certification?: string
}

export interface UserGeneral {
  name?: string
  login?: string
  passWord?: string
  surName?: string
  imageName?: string
  patronicName?: string
  email?: string
  phone?: string
  inn?: any
  passportNumber?: string
}
export interface UserCompany {
  id?: number
  inn: string
  name?: string
  loginAd?: string
  address?: string
  logo?: string
  phone?: string
  email?: string
}

export interface UserDetailsResponseBody {
  id?: number
  name?: string
  surName?: string
  displayName?: string
  inn?: string
  companyName?: string
  phone?: string
  positionName?: string
  email?: string
  telegram?: string
  avatar?: string
  userType?: number
  roles?: number[]
  userCompany?: UserCompany
  shortImage?: string
  userSign?: string
}

const userProfileApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchUserDetails: builder.query<UserDetailsResponseBody, void>({
      query: () => ({ url: `api/userprofile/userdetail`, method: 'POST' }),
    }),
  }),
})

export const { useFetchUserDetailsQuery, useLazyFetchUserDetailsQuery } =
  userProfileApi
