interface IChapter {
  id: number
  terName: string
  terrCode: string
  subTers: IChapter[]
  name?: string
}

declare interface IChapters {
  items: IChapter[]
}
