import { AppRoutes } from "@configs";
import { CrmBoRegistryPage } from "./modules/crm/bo";
import { CrmBOCreatePage } from "./modules/crm/bo/create";
import { CrmBOShowPage } from "./modules/crm/bo/show/[id]";
import { CrmIndividualsRegistryPage } from "./modules/crm/individuals";
import { CrmIndividualsCreatePage } from "./modules/crm/individuals/create";
import { CrmIndividualsShowPage } from "./modules/crm/individuals/show/[id]";
import { CrmKORegistryPage } from "./modules/crm/ko";
import { CrmKOCreatePage } from "./modules/crm/ko/create";
import { CrmKOShowPage } from "./modules/crm/ko/show/[id]";
import { CrmMFRTRegistryPage } from "./modules/crm/mfrt";
import { CrmMFRTCreatePage } from "./modules/crm/mfrt/create";
import { CrmMFRTShowPage } from "./modules/crm/mfrt/show/[id]";
import { CrmReportsRegistryPage } from "./modules/crm/reports";
import { CrmReportsCreatePage } from "./modules/crm/reports/create";
import { CrmReportsShowPage } from "./modules/crm/reports/show/[id]";
import { CrmSearchRegistryPage } from "./modules/crm/search";
import { CrmSearchCreatePage } from "./modules/crm/search/create";
import { CrmSearchShowPage } from "./modules/crm/search/show/[id]";
import { CrmOrganizationShowPage } from "./modules/crm/organization/[id]";
import { CrmModulePage } from "./modules/crm";
import { DocumentsModulePage } from "./modules/documents";
import { ChiefAccountantJobResponsibilitiesRegistryPage } from "./modules/documents/chief-accountant-job-responsibilities";
import { ChiefAccountantJobResponsibilitiesCreatePage } from "./modules/documents/chief-accountant-job-responsibilities/create";
import { ChiefAccountantJobResponsibilitiesShowPage } from "./modules/documents/chief-accountant-job-responsibilities/show/[id]";
import { MFAccessFormsRegistryPage } from "./modules/documents/mf-access-forms";
import { MFAccessFormsCreatePage } from "./modules/documents/mf-access-forms/create";
import { MFAccessFormsShowPage } from "./modules/documents/mf-access-forms/show/[id]";
import { SignaturesSampleCardRegistryPage } from "./modules/documents/signatures-sample-card";
import { SignaturesSampleCardCreatePage } from "./modules/documents/signatures-sample-card/create";
import { SignaturesSampleCardShowPage } from "./modules/documents/signatures-sample-card/show/[id]";
import { TfmisAccessApplicationsRegistryPage } from "./modules/documents/tfmis-access-applications";
import { TfmisAccessApplicationCreatePage } from "./modules/documents/tfmis-access-applications/create";
import { TfmisAccessApplicationShowPage } from "./modules/documents/tfmis-access-applications/show/[id]";
import { EgovModulePage } from "./modules/eGov";
import { EgovApplicationOfResidentRegistryPage } from "./modules/eGov/Application-of-resident";
import { EgovApplicationOfResidentCreatePage } from "./modules/eGov/Application-of-resident/create";
import { EgovApplicationOfResidentShowPage } from "./modules/eGov/Application-of-resident/show/[id]";
import { EgovFullModulePage } from "./modules/egovFull";
import { EgovFullOrganizationRegistryPage } from "./modules/egovFull/Organisation";
import { EgovFullOrganizationShowPage } from "./modules/egovFull/Organisation/[fid]/show/[id]";
import { EgovFullOrganizationCreatePage } from "./modules/egovFull/Organisation/[fid]/create";
import { EgovFullOrganizationServiceCreatePage } from "./modules/egovFull/Organisation/[fid]/Service/[sid]/create";
import { EgovFullOrganizationServiceShowPage } from "./modules/egovFull/Organisation/[fid]/Service/[sid]/show/[id]";
import { FinanceReportModulePage } from "./modules/finance-report";
import { FinanceReportCreatePage } from "./modules/finance-report/create";
import { FinanceReportShowPage } from "./modules/finance-report/show/[id]";
import { LettersModulePage } from "./modules/latters";
import { LettersActivityShowPage } from "./modules/latters/activity/show/[id]";
import { LettersActivityCreatePage } from "./modules/latters/activity/create";
import { LettersActivityRegistryPage } from "./modules/latters/activity";
import { LettersCorExecutionCreatePage } from "./modules/latters/corExecution/create";
import { LettersCorExecutionRegistryPage } from "./modules/latters/corExecution";
import { LettersCorExecutionShowPage } from "./modules/latters/corExecution/show/[id]";
import { LettersCorIncomingShowPage } from "./modules/latters/corIncoming/show/[id]";
import { LettersCorIncomingCreatePage } from "./modules/latters/corIncoming/create";
import { LettersCorIncomingRegistryPage } from "./modules/latters/corIncoming";
import { LettersIncomingShowPage } from "./modules/latters/incomming/show/[id]";
import { LettersIncomingCreatePage } from "./modules/latters/incomming/create";
import { LettersIncomingRegistryPage } from "./modules/latters/incomming";
import { LettersNewIncomingShowPage } from "./modules/latters/newIncoming/show/[id]";
import { LettersNewIncomingCreatePage } from "./modules/latters/newIncoming/create";
import { LettersNewIncomingRegistryPage } from "./modules/latters/newIncoming";
import { LettersNewOutcomingShowPage } from "./modules/latters/outcomingNew/show/[id]";
import { LettersNewOutcomingCreatePage } from "./modules/latters/outcomingNew/create";
import { LettersNewOutcomingRegistryPage } from "./modules/latters/outcomingNew";
import { LettersOutcomingShowPage } from "./modules/latters/outcomming/show/[id]";
import { LettersOutcomingRegistryPage } from "./modules/latters/outcomming";
import { LettersOutcomingCreatePage } from "./modules/latters/outcomming/create";
import { LettersV3ModulePage } from "./modules/latters-v3";
import { LettersV3IncomingShowPage } from "./modules/latters-v3/incomming/show/[id]";
import { LettersV3IncomingCreatePage } from "./modules/latters-v3/incomming/create";
import { LettersV3IncomingRegistryPage } from "./modules/latters-v3/incomming";
import { LettersV3OutcomingShowPage } from "./modules/latters-v3/outcomming/show/[id]";
import { LettersV3OutcomingCreatePage } from "./modules/latters-v3/outcomming/create";
import { LettersV3OutcomingRegistryPage } from "./modules/latters-v3/outcomming";
import { LettersV35ModulePage } from "./modules/letters-v3.5";
import { LettersV35ExternalCorrespondencePage } from "./modules/letters-v3.5/ExternalCorrespondence";
import { LettersV35ExternalCorIncomingShowPage } from "./modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5/show/[id]";
import { LettersV35ExternalCorIncomingCreatePage } from "./modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5/create";
import { LettersV35ExternalCorIncomingRegistryPage } from "./modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5";
import { LettersV35ExternalCorOutcomingShowPage } from "./modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5/show/[id]";
import { LettersV35ExternalCorOutcomingCreatePage } from "./modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5/create";
import { LettersV35ExternalCorOutcomingRegistryPage } from "./modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5";
import { LettersV35InternalCorrespondencePage } from "./modules/letters-v3.5/InternalCorrespondence";
import { LettersV35InternalChatShowPage } from "./modules/letters-v3.5/InternalCorrespondence/chat/show/[id]";
import { LettersV35InternalChatCreatePage } from "./modules/letters-v3.5/InternalCorrespondence/chat/create";
import { LettersV35InternalChatRegistryPage } from "./modules/letters-v3.5/InternalCorrespondence/chat";

import { LettersV4ModulePage } from "./modules/letters-v4";
import { LettersV4IncomingShowPage } from "./modules/letters-v4/incomming/show/[id]";
import { LettersV4IncomingCreatePage } from "./modules/letters-v4/incomming/create";
import { LettersV4OutcomingShowPage } from "./modules/letters-v4/outcomming/show/[id]";
import { LettersV4OutcomingCreatePage } from "./modules/letters-v4/outcomming/create";
import { HomePage } from "./Home";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  AdminLayout,
  Layout,
  ModuleLayout,
  ProfileMenuLayout,
} from "@root/layouts";
import { AnimatePresence } from "framer-motion";
import { LoginPage } from "./auth/login";
import { RequestsModulePage } from "./modules/requestsmodul";
import { RequestsModuleShowPage } from "./modules/requestsmodul/[id]";
import { RequestsBOPage } from "./modules/requestsmodul/request_bo";
import { RequestsFizPage } from "./modules/requestsmodul/request_fiz";
import { RequestsKOPage } from "./modules/requestsmodul/request_ko";
import { RequestsReportPage } from "./modules/requestsmodul/request_report";
import { RequestsSearchPage } from "./modules/requestsmodul/request_search";
import { RequestsPage } from "./modules/requestsmodul/requestpage";
import { SourceDocumentsModulePage } from "./modules/source-documents";
import { DocumentsActRegistryPage } from "./modules/source-documents/act";
import { DocumentsActShowPage } from "./modules/source-documents/act/show/[id]";
import { DocumentsActCreatePage } from "./modules/source-documents/act/create";
import { DocumentsContractsRegistryPage } from "./modules/source-documents/contracts";
import { DocumentsContractsShowPage } from "./modules/source-documents/contracts/show/[id]";
import { DocumentsContractsCreatePage } from "./modules/source-documents/contracts/create";
import { DocumentsInvoicesRegistryPage } from "./modules/source-documents/invoices";
import { DocumentsInvoicesShowPage } from "./modules/source-documents/invoices/show/[id]";
import { DocumentsInvoicesCreatePage } from "./modules/source-documents/invoices/create";
import { DocumentsProxiesRegistryPage } from "./modules/source-documents/proxies";
import { DocumentsProxiesShowPage } from "./modules/source-documents/proxies/show/[id]";
import { DocumentsProxiesCreatePage } from "./modules/source-documents/proxies/create";
import { DocumentsTravelExpensesRegistryPage } from "./modules/source-documents/travel-expenses";
import { DocumentsTravelExpensesShowPage } from "./modules/source-documents/travel-expenses/show/[id]";
import { DocumentsTravelExpensesCreatePage } from "./modules/source-documents/travel-expenses/create";
import { DocumentsWaybillsRegistryPage } from "./modules/source-documents/waybills";
import { DocumentsWaybillsShowPage } from "./modules/source-documents/waybills/show/[id]";
import { DocumentsWaybillsCreatePage } from "./modules/source-documents/waybills/create";
import { AdminPage } from "./users/me/admin";
import { AdminProfileCreatePage } from "./users/me/admin/create";
import { AdminGroupsPage } from "./users/me/admin/groups";
import AdminRolesPage from "./users/me/admin/roles";
import { AdminProfileShowPage } from "./users/me/admin/profile/[id]";
import { AdminProfilesPage } from "./users/me/admin/profiles";
import { AdminProfilePage } from "./users/me/profile";
import { AdminProfileOrganizationPage } from "./users/me/profile/organisation";
import NotFoundPage from "./notFound/NotFoundPage";
import { LettersV4IncomingRegistryPage2 } from "./modules/letters-v4/incomming-new/LettersV4IncomingRegistryPage";
import { LettersV4OutcommingRegistryPage2 } from "./modules/letters-v4/outcomming-new/LettersV4OutcommingRegistryPage2";
import Confarmation from "./confarmation";

export const routes: IRoute[] = [
  {
    path: AppRoutes.HOME,
    element: <HomePage />,
  },


  // CRM MODULE ROUTING
  {
    path: AppRoutes.CRM_MODULE,
    element: <CrmModulePage />,
  },

  {
    path: AppRoutes.CRM_BO,
    element: <CrmBoRegistryPage />,
  },
  {
    path: AppRoutes.CRM_BO_CREATE,
    element: <CrmBOCreatePage />,
  },
  {
    path: AppRoutes.CRM_BO_SHOW,
    element: <CrmBOShowPage />,
  },

  {
    path: AppRoutes.CRM_INDIVIDUALS,
    element: <CrmIndividualsRegistryPage />,
  },
  {
    path: AppRoutes.CRM_INDIVIDUALS_CREATE,
    element: <CrmIndividualsCreatePage />,
  },
  {
    path: AppRoutes.CRM_INDIVIDUALS_SHOW,
    element: <CrmIndividualsShowPage />,
  },

  {
    path: AppRoutes.CRM_KO,
    element: <CrmKORegistryPage />,
  },
  {
    path: AppRoutes.CRM_KO_CREATE,
    element: <CrmKOCreatePage />,
  },
  {
    path: AppRoutes.CRM_KO_SHOW,
    element: <CrmKOShowPage />,
  },

  {
    path: AppRoutes.CRM_MFRT,
    element: <CrmMFRTRegistryPage />,
  },
  {
    path: AppRoutes.CRM_MFRT_CREATE,
    element: <CrmMFRTCreatePage />,
  },
  {
    path: AppRoutes.CRM_MFRT_SHOW,
    element: <CrmMFRTShowPage />,
  },

  {
    path: AppRoutes.CRM_REPORTS,
    element: <CrmReportsRegistryPage />,
  },
  {
    path: AppRoutes.CRM_REPORTS_CREATE,
    element: <CrmReportsCreatePage />,
  },
  {
    path: AppRoutes.CRM_REPORTS_SHOW,
    element: <CrmReportsShowPage />,
  },

  {
    path: AppRoutes.CRM_SEARCH,
    element: <CrmSearchRegistryPage />,
  },
  {
    path: AppRoutes.CRM_SEARCH_CREATE,
    element: <CrmSearchCreatePage />,
  },
  {
    path: AppRoutes.CRM_SEARCH_SHOW,
    element: <CrmSearchShowPage />,
  },

  {
    path: AppRoutes.CRM_ORGANIZATION,
    element: <CrmOrganizationShowPage />,
  },

  // DOCUMENTS MODULE ROUTING
  {
    path: AppRoutes.DOCUMENTS_MODULE,
    element: <DocumentsModulePage />,
  },
  {
    path: AppRoutes.DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES,
    element: <ChiefAccountantJobResponsibilitiesRegistryPage />,
  },
  {
    path: AppRoutes.DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES_CREATE,
    element: <ChiefAccountantJobResponsibilitiesCreatePage />,
  },
  {
    path: AppRoutes.DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES_SHOW,
    element: <ChiefAccountantJobResponsibilitiesShowPage />,
  },

  {
    path: AppRoutes.DOCUMENTS_MF_ACCESS_FORMS,
    element: <MFAccessFormsRegistryPage />,
  },
  {
    path: AppRoutes.DOCUMENTS_MF_ACCESS_FORMS_CREATE,
    element: <MFAccessFormsCreatePage />,
  },
  {
    path: AppRoutes.DOCUMENTS_MF_ACCESS_FORMS_SHOW,
    element: <MFAccessFormsShowPage />,
  },

  {
    path: AppRoutes.DOCUMENTS_SIGNATURES_SAMPLE_CARD,
    element: <SignaturesSampleCardRegistryPage />,
  },
  {
    path: AppRoutes.DOCUMENTS_SIGNATURES_SAMPLE_CARD_CREATE,
    element: <SignaturesSampleCardCreatePage />,
  },
  {
    path: AppRoutes.DOCUMENTS_SIGNATURES_SAMPLE_CARD_SHOW,
    element: <SignaturesSampleCardShowPage />,
  },

  {
    path: AppRoutes.DOCUMENTS_TFMIS_ACCESS_APPLICATIONS,
    element: <TfmisAccessApplicationsRegistryPage />,
  },
  {
    path: AppRoutes.DOCUMENTS_TFMIS_ACCESS_APPLICATIONS_CREATE,
    element: <TfmisAccessApplicationCreatePage />,
  },
  {
    path: AppRoutes.DOCUMENTS_TFMIS_ACCESS_APPLICATIONS_SHOW,
    element: <TfmisAccessApplicationShowPage />,
  },

  // EGOV MODULE ROUTING
  {
    path: AppRoutes.EGOV_MODULE,
    element: <EgovModulePage />,
  },
  {
    path: AppRoutes.EGOV_APPLICATION_OF_RESIDENT,
    element: <EgovApplicationOfResidentRegistryPage />,
  },
  {
    path: AppRoutes.EGOV_APPLICATION_OF_RESIDENT_CREATE,
    element: <EgovApplicationOfResidentCreatePage />,
  },
  {
    path: AppRoutes.EGOV_APPLICATION_OF_RESIDENT_SHOW,
    element: <EgovApplicationOfResidentShowPage />,
  },

  // EGOV FULL MODULE ROUTING
  {
    path: AppRoutes.EGOV_FULL_MODULE,
    element: <EgovFullModulePage />,
  },

  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_REGISTRY,
    element: <EgovFullOrganizationRegistryPage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_DETAILS,
    element: <EgovFullOrganizationRegistryPage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_CREATE,
    element: <EgovFullOrganizationCreatePage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_CREATE_INNER,
    element: <EgovFullOrganizationCreatePage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_SHOW,
    element: <EgovFullOrganizationShowPage />,
  },

  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_SERVICE,
    element: <EgovFullOrganizationRegistryPage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_SERVICE_CREATE,
    element: <EgovFullOrganizationServiceCreatePage />,
  },
  {
    path: AppRoutes.EGOV_FULL_ORGANIZATION_SERVICE_SHOW,
    element: <EgovFullOrganizationServiceShowPage />,
  },

  // FINANCE REPORT MODULE ROUTING
  {
    path: AppRoutes.FINANCE_REPORT_MODULE,
    element: <FinanceReportModulePage />,
  },
  {
    path: AppRoutes.FINANCE_REPORT_CREATE,
    element: <FinanceReportCreatePage />,
  },
  {
    path: AppRoutes.FINANCE_REPORT_SHOW,
    element: <FinanceReportShowPage />,
  },

  // LETTERS MODULE ROUTING
  {
    path: AppRoutes.LETTERS_MODULE,
    element: <LettersModulePage />,
  },

  {
    path: AppRoutes.LETTERS_ACTIVITY_SHOW,
    element: <LettersActivityShowPage />,
  },
  {
    path: AppRoutes.LETTERS_ACTIVITY_CREATE,
    element: <LettersActivityCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_ACTIVITY,
    element: <LettersActivityRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_COR_INCOMING_MAIN,
    element: <Navigate to={AppRoutes.LETTERS_COR_INCOMING} />,
  },
  {
    path: AppRoutes.LETTERS_COR_EXECUTION_SHOW,
    element: <LettersCorExecutionShowPage />,
  },
  {
    path: AppRoutes.LETTERS_COR_EXECUTION_CREATE,
    element: <LettersCorExecutionCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_COR_EXECUTION,
    element: <LettersCorExecutionRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_COR_INCOMING_SHOW,
    element: <LettersCorIncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_COR_INCOMING_CREATE,
    element: <LettersCorIncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_COR_INCOMING,
    element: <LettersCorIncomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_INCOMING_MAIN,
    element: <Navigate to={AppRoutes.LETTERS_INCOMING} />,
  },
  {
    path: AppRoutes.LETTERS_INCOMING_SHOW,
    element: <LettersIncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_INCOMING_CREATE,
    element: <LettersIncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_INCOMING,
    element: <LettersIncomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_NEW_INCOMING_SHOW,
    element: <LettersNewIncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_NEW_INCOMING_CREATE,
    element: <LettersNewIncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_NEW_INCOMING,
    element: <LettersNewIncomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_NEW_OUTCOMING_SHOW,
    element: <LettersNewOutcomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_NEW_OUTCOMING_CREATE,
    element: <LettersNewOutcomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_NEW_OUTCOMING,
    element: <LettersNewOutcomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_OUTCOMING_SHOW,
    element: <LettersOutcomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_OUTCOMING_CREATE,
    element: <LettersOutcomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_OUTCOMING,
    element: <LettersOutcomingRegistryPage />,
  },

  // LETTERSV3 MODULE ROUTING
  {
    path: AppRoutes.LETTERS_V3,
    element: <LettersV3ModulePage />,
  },

  {
    path: AppRoutes.LETTERS_V3_INCOMING_SHOW,
    element: <LettersV3IncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V3_INCOMING_CREATE,
    element: <LettersV3IncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_INCOMING,
    element: <LettersV3IncomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_V3_OUTCOMING_SHOW,
    element: <LettersV3OutcomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V3_OUTCOMING_CREATE,
    element: <LettersV3OutcomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_OUTCOMING,
    element: <LettersV3OutcomingRegistryPage />,
  },

  // LETTERSV3.5 MODULE ROUTING
  {
    path: AppRoutes.LETTERS_V3_5,
    element: <LettersV35ModulePage />,
  },

  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE,
    element: <LettersV35ExternalCorrespondencePage />,
  },

  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING_SHOW,
    element: <LettersV35ExternalCorIncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING_CREATE,
    element: <LettersV35ExternalCorIncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING,
    element: <LettersV35ExternalCorIncomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING_SHOW,
    element: <LettersV35ExternalCorOutcomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING_CREATE,
    element: <LettersV35ExternalCorOutcomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING,
    element: <LettersV35ExternalCorOutcomingRegistryPage />,
  },

  {
    path: AppRoutes.LETTERS_V3_5_INTERNAL_CORRESPONDENCE,
    element: <LettersV35InternalCorrespondencePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT_SHOW,
    element: <LettersV35InternalChatShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT_CREATE,
    element: <LettersV35InternalChatCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT,
    element: <LettersV35InternalChatRegistryPage />,
  },

  // LETTERSV4 MODULE ROUTING
  {
    path: AppRoutes.LETTERS_V4,
    element: <LettersV4ModulePage />,
  },

  {
    path: AppRoutes.LETTERS_V4_INCOMING_SHOW,
    element: <LettersV4IncomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V4_INCOMING_CREATE,
    element: <LettersV4IncomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V4_INCOMING,
    element: <LettersV4IncomingRegistryPage2 />,
  },

  {
    path: AppRoutes.LETTERS_V4_OUTCOMING_SHOW,
    element: <LettersV4OutcomingShowPage />,
  },
  {
    path: AppRoutes.LETTERS_V4_OUTCOMING_CREATE,
    element: <LettersV4OutcomingCreatePage />,
  },
  {
    path: AppRoutes.LETTERS_V4_OUTCOMING,
    element: <LettersV4OutcommingRegistryPage2 />,
  },

  // REQUESTS MODULE
  {
    path: AppRoutes.REQUESTS_MODULE,
    element: <RequestsModulePage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_DETAILS,
    element: <RequestsModuleShowPage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_BO,
    element: <RequestsBOPage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_FIZ,
    element: <RequestsFizPage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_KO,
    element: <RequestsKOPage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_REPORT,
    element: <RequestsReportPage />,
  },
  {
    path: AppRoutes.REQUESTS_MODULE_SEARCH,
    element: <RequestsSearchPage />,
  },
  {
    path: AppRoutes.REQUEST_PAGE,
    element: <RequestsPage />,
  },

  // SOURCE DOCUMENTS
  {
    path: AppRoutes.SOURCE_DOCUMENTS_MODULE,
    element: <SourceDocumentsModulePage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_ACT,
    element: <DocumentsActRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_ACT_SHOW,
    element: <DocumentsActShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_ACT_CREATE,
    element: <DocumentsActCreatePage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_CONTRACTS,
    element: <DocumentsContractsRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_CONTRACTS_SHOW,
    element: <DocumentsContractsShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_CONTRACTS_CREATE,
    element: <DocumentsContractsCreatePage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_INVOICES,
    element: <DocumentsInvoicesRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_INVOICES_SHOW,
    element: <DocumentsInvoicesShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_INVOICES_CREATE,
    element: <DocumentsInvoicesCreatePage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_PROXIES,
    element: <DocumentsProxiesRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_PROXIES_SHOW,
    element: <DocumentsProxiesShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_PROXIES_CREATE,
    element: <DocumentsProxiesCreatePage />,
  },

  {
    path: AppRoutes.SOURCE_DOCUMENTS_TRAVEL_EXPENSES,
    element: <DocumentsTravelExpensesRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_TRAVEL_EXPENSES_SHOW,
    element: <DocumentsTravelExpensesShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_TRAVEL_EXPENSES_CREATE,
    element: <DocumentsTravelExpensesCreatePage />,
  },

  {
    path: AppRoutes.SOURCE_DOCUMENTS_WAYBILLS,
    element: <DocumentsWaybillsRegistryPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_WAYBILLS_SHOW,
    element: <DocumentsWaybillsShowPage />,
  },
  {
    path: AppRoutes.SOURCE_DOCUMENTS_WAYBILLS_CREATE,
    element: <DocumentsWaybillsCreatePage />,
  },

  // USERS
  {
    path: AppRoutes.USERS_ADMIN,
    element: <AdminPage />,
  },
  {
    path: AppRoutes.USERS_ADMIN_GROUPS,
    element: <AdminGroupsPage />,
  },
  {
    path: AppRoutes.USERS_ADMIN_ROLES,
    element: <AdminRolesPage />,
  },
  {
    path: AppRoutes.USERS_ADMIN_PROFILE_DETAILS,
    element: <AdminProfileShowPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: AppRoutes.AUTH_LOGIN,
    element: <LoginPage />,
  },
   {
    path: AppRoutes.CONFARMATION,
    element :<Confarmation/>
  },
  {
    path: AppRoutes.USERS_PROFILE,
    element: (
      <ProfileMenuLayout>
        <AdminProfilePage />
      </ProfileMenuLayout>
    ),
  },
  {
    path: AppRoutes.USERS_ORGANIZATION,
    element: (
      <ProfileMenuLayout>
        <AdminProfileOrganizationPage />
      </ProfileMenuLayout>
    ),
  },
  {
    path: AppRoutes.USERS_ADMIN_CREATE,
    element: (
      <AdminLayout>
        <AdminProfileCreatePage />
      </AdminLayout>
    ),
  },
  {
    path: AppRoutes.USERS_ADMIN_PROFILES,
    element: (
      <AdminLayout>
        <AdminProfilesPage />
      </AdminLayout>
    ),
  },
  {
    path: "/",
    element: <Layout />,
    children: routes.map((item) => {
      return {
        ...item,
        element: (
          <AnimatePresence key={item.path} exitBeforeEnter>
            <ModuleLayout>{item.element}</ModuleLayout>
          </AnimatePresence>
        ),
      };
    }),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
