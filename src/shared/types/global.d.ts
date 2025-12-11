declare global {
  var JCWebClient2: any

  var etokenPlugin: any

  window: Window

  export interface IButtonSetting {
    readOnly: boolean
    hide: boolean
  }

  export interface CreateFolderProps {
    name: string
  }

  export interface IRoute {
    path: string;
    element: React.ReactNode;
  }

  export interface TokenInfo {
    startDate: string
    expiryDate: string
    deviceId: number
    certId: string
  }
}


export { }
