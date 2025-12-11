import axios from "axios"


const baseUrl =  import.meta.env.VITE_PUBLIC_API_BASE_URL

const baseApiReq = axios.create({
  baseURL: baseUrl,
})

export const getConfirmationDetail = async(id: string) => {

     const {data} = await baseApiReq.get(`/api/OutComingV4/getSignedDocs/${id}`)

    return data
}