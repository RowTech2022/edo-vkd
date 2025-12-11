export interface ITransition {
  transitions: {
    fieldSettings: {}
    buttonSettings: {
      btn_save: ButtonSettings
      btn_sign: ButtonSettings
      btn_undo: ButtonSettings
      btn_delete: ButtonSettings
    }
    buttonInfo: {}
  }
}

type ButtonSettings = {
  readOnly: boolean
  hide: boolean
}
