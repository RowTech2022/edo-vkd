export enum apiRoutes {
  // Finance report
  financeReportSearch = "/api/financereport/search",
  createFinanceReport = "/api/financereport/create",
  updateFinanceReport = "/api/financereport/update",
  signFinanceReport = "/api/financereport/sign",
  undoDocumentFinanceReport = "/api/financereport/undoDocument",
  acceptFinanceReport = "/api/financereport/accept",
  getByIdFinanceReport = "/api/financereport/get/",

  // Egov application
  createEgovApplicationResident = "/api/EGovApplicationResident/create",
  updateEgovApplicationResident = "/api/EGovApplicationResident/update",
  sendToResolutionEgovApplicationResident = "/api/EGovApplicationResident/sendToResolution",
  signEgovApplicationResident = "/api/EGovApplicationResident/signDocument",
  getByIdEgovApplicationResident = "/api/EGovApplicationResident/get/",
  searchEgovApplicationResident = "/api/EGovApplicationResident/search",
  openDiscutionEgovApplicationResident = "/api/EGovApplicationResident/opendiscution",
  sendMessageEgovApplicationResident = "/api/EGovApplicationResident/sendmessage",
  editMessageEgovApplicationResident = "/api/EGovApplicationResident/editmessage",
  undoDocEgovApplication = "/api/EGovApplicationResident/undoDocument",
  signDocEgovApplication = "/api/EGovApplicationResident/signDocument",
  acceptEgovApplication = "/api/EGovApplicationResident/accept",
  checkPaymentsApplication = "/api/EGovApplicationResident/checkPayments",
  getTextOfApplicationEgov = "/api/general/eGov_GetTextOfApplication/text",
  newMessage = "api/EgovApplicationResident/newmessage",

  // File service
  uploadFileV2 = "/api/file/UploadFileV2",
  downloadFileV2 = "/api/file/downloadFile2",
  saveOrReplace = "/api/file/saveOrReplace",
}
