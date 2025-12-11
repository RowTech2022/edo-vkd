import { format } from 'date-fns'
import { newDateHMFormat } from './dateFormat'

export const formatDate = (date: string) => {
  if (!date) return ''
  return format(new Date(date), newDateHMFormat)
}
