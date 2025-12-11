import { IExecutor } from './interface'

export const reconstructOptions = (values: Array<IExecutor>) => {
  if (!values) return []
  return values.map(({ value, id }) => ({ id, label: value }))
}

export const isTransitionsAllowed = true

export const transitionsAllowed = (value: boolean) =>
  isTransitionsAllowed ? value : false
