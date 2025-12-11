declare namespace TFMIS {
  declare interface AccessApplicationShort {
    id: number
    pbs: {
      id: string
      value: null
    }
    treasureCode: {
      id: number
      value?: unknown
    }
    inn: string
    state: number
    createdDate: string
    year: number
  }

  declare interface AccessApplication {
    id: number
    type: number
    state: number
    organisation: {
      regUserId?: number
      year?: number
      treasureCode?: { id: string; value: string } | null
      inn?: string | null

      orgName?: string
      orgId?: string
      address?: string

      pbsCode?: { id: string; value: string }[] | null
      seqnums?: { id: string; value: string }[] | null
    }
    userInfo: {
      first_Fio: string
      first_Position: { id: string; value: string }[]
      first_Inn: string
      first_Phone: string
      first_Email: string

      second_Fio: string
      second_Position: { id: string; value: string }[]
      second_Inn: string
      second_Phone: string
      second_Email: string

      budgetPreparationInfo: IKuratonAndHeadInfo | null
      budgetExpenditureInfo: IKuratonAndHeadInfo | null
    }

    certifyingDocuments: {
      id: number
      name: string
      type: string
      createdBy?: string
      createTs?: string
      approvedDate?: string
      approvedBy?: string
    }[]
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

        btn_approve: ButtonSettings
        btn_signBukh: ButtonSettings
        btn_signRukovoditel: ButtonSettings
        btn_signKuratorBudget: ButtonSettings
        btn_signHeadBudget: ButtonSettings
        btn_signKuratorExpen: ButtonSettings
        btn_signHeadExpen: ButtonSettings

        btn_undo: ButtonSettings
        btn_delete: ButtonSettings
      }
    }
    createAt: string
    updateAt: string
    timestamp: string
  }

  type ButtonSettings = {
    readOnly: boolean
    hide: boolean
  }

  declare interface IKuratonAndHeadInfo {
    docId: number

    kuratorId: number
    kuratorName: string
    kuratorFio: string
    kuratorPosition: { id: string; value: string }
    kuratorPhone: string

    headId: number
    headName: string
    headDepartFio: string
    headDepartPosition: { id: string; value: string }
    headDepartPhone: string
  }
}
