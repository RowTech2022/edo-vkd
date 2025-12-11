declare namespace Accountant {
  interface JobResponsibilities {
    id: number
    state: number
    year: number
    inn: string
    orgName: string | null
    address: string | null
    bo_Fio: string | null
    bo_Position: {
      id: string
      value: string
    }
    info: {
      id: string
      value: string
    }
    bo_Phone: string | null | undefined
    bo_Signature: string | null
    bo_SignatureTime: string | null
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
    infoCartSignaturas: {
      organizationName: string
      address: string
      inn: string
      bo_Fio: string
      bo_Phone: string | null | undefined
    } | null
    transitions: {
      fieldSettings: {}
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign: ButtonSettings
        btn_signBo: ButtonSettings        
        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
      buttonInfo: {}
    }
    createAt: string
    updateAt: string
    timestamp: string
  }

  // declare interface InfoBlockAccountant {
  //   info: {
  //     id: string
  //     value: string
  //   }
  //   orgName: string
  //   adress: string
  //   inn: string
  // }
}
