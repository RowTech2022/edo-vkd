////signature ts

declare namespace SignatureSamples {
  interface Card {
    id: number
    state: number
    organisationInfo: {
      regUserId: number
      year: number
      orgPhone: string | null
      inn: string | null
      organizationName: string | null
      address: string | null
      accounts: string[] | null
    }
    sign: number
    signatures: {
      first_Fio: string | null
      first_Phone: string | null
      first_Signature: string | null
      first_SignatureTime: string
      second_Fio: string | null
      second_Phone: string | null
      second_Signature: string | null
      second_SignatureTime: string
      treasurerId: number | null
      treasurer_Fio: string | null
      treasurer_Position: string | null
      treasurer_Phone: string | null
      treasurer_Signature: string | null
      treasurer_SignatureTime: string
      treasurer_Org?: string | null
      treasurer_Inn?: string | null
    }
    userVisas: {
      signedBy: string
      state: string
      setBy: string
      date: string
      reason: string
      comment: string
      sign64: string
    }[]
    documentHistories: {
      state: string
      startDate: string
      endDate: string
      comment: string
    }[]
    transitions: {
      fieldSettings: {}
      buttonSettings: {
        btn_save: ButtonSettings
        btn_sign: ButtonSettings

        btn_approve: ButtonSettings
        btn_sign_b: ButtonSettings
        btn_sign_r: ButtonSettings
        btn_sign_grbs: ButtonSettings

        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
      buttonInfo: {}
    }
    createAt: string
    updateAt: string
    timestamp: string
  }
}
