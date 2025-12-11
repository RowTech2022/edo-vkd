interface IOrganization {
  id: number
  name: string
  orgInn: string
  status: number
}

declare interface IOrganizations {
  items: IOrganization[]
}


declare interface Organisation {
  id: string
  value: string
}


