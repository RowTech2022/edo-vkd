declare interface EDOModule {
  id: number
  image?: string | null
  name: string
  description: string
  disabled: boolean
  modulName: string
  parentModul: string
  subModuls?: EdoModule[] | null
  count: number
}
