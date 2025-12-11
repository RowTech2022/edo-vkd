import { ValueId, api } from '../api'

interface GroupTypesSearchResponseBody {
  items: ValueId[]
}

const groupTypesApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchGroupTypes: builder.query<GroupTypesSearchResponseBody, void>({
      query: () => ({
        url: '/api/Group/groupType',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useFetchGroupTypesQuery,
} = groupTypesApi
