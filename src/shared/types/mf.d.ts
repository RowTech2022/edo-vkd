declare namespace MF {
  declare interface AccessFormShort {
    id: number
    userType: { id: string; value: string }
    treasureCode: { id: string; value: string }
    inn: string
    state: number
    createdDate: string
    year: number
  }
  
  declare interface PageAccessInfo {
    id: number, 
    type: number, 
    page: string, 
    name: string, 
    code: number, 

    a1: boolean,
    a2: boolean, 
    a3: boolean, 
    a4: boolean, 
    a5: boolean,
    a6: boolean
    // a7: boolean,
    // a8: boolean
  }

    // organisation: {
    //   id: string
    //   value: string
    // }
  declare interface AccessForm {
    id: number
    state: number
    userInfo: {
      year?: number
      docType?: number
      treasureCode?: { id: string; value: string } | null
      userType?: { id: string; value: string } | null
      position?: { id: string; value: string } | null
      organization?: { id: string; value: string } | null
      fio?: string
      tfmisLogin?: string
      passPortInfo?: string
      phone?: string | null | undefined
      workPlace?: string
      inn?: string | null
      email?: string | null

      head?: { id: string; value: string } | null
      h_Fio?: string
      h_UserPosition?: { id: string; value: string } | null
      h_Phone?: string 
    }
    access: {
      pbsCode: { id: string; value: string }[]
      budgetVariant: { id: string; value: string }[]
      programs: { id: string; value: string }[]
      seqnums: { id: string; value: string }[]
      dzSeqnums: { id: string; value: string }[]
      pages: PageAccessInfo []
    }
    userVisas: {
      signedBy: string
      state: string
      setBy: string
      sign64: string
      date: string
      reason: string
      comment: string
    }[]
    documentHistories: {
      state: string
      startDate: string
      endDate: string
      comment: string
    }[]
    transitions: {
      fieldSettings: any
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign_kurator: ButtonSettings
        btn_sign_headDepart: ButtonSettings
        btn_sign_head: ButtonSettings
        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
    }
    currentGrbs: {
      items: GrbsListItem[]
    }
    createAt: string
    updateAt: string
    timestamp: string
  }
}
