import { IncomingLettersV3MainDTO } from '@services/lettersApiV3'

type ResponseError = { error: unknown }
type ResponseSuccess = { data: IncomingLettersV3MainDTO }
type Response = ResponseError | ResponseSuccess
export function isMainDTO(obj: Response): obj is ResponseSuccess {
  return Boolean(typeof obj === 'object' && !('error' in obj))
}
