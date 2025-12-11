export enum AppRoutes {
    AUTH_LOGIN = '/auth/login',

    HOME = '/',

    //CONFARMATION
    CONFARMATION = '/confirmation/:id',

    // CRM PAGES
    CRM_MODULE = '/modules/crm',

    CRM_BO = '/modules/crm/bo',
    CRM_BO_CREATE = '/modules/crm/bo/create',
    CRM_BO_SHOW = '/modules/crm/bo/show/:id',

    CRM_INDIVIDUALS = '/modules/crm/individuals',
    CRM_INDIVIDUALS_CREATE = '/modules/crm/individuals/create',
    CRM_INDIVIDUALS_SHOW = '/modules/crm/individuals/show/:id',

    CRM_KO = '/modules/crm/ko',
    CRM_KO_CREATE = '/modules/crm/ko/create',
    CRM_KO_SHOW = '/modules/crm/ko/show/:id',

    CRM_MFRT = '/modules/crm/mfrt',
    CRM_MFRT_CREATE = '/modules/crm/mfrt/create',
    CRM_MFRT_SHOW = '/modules/crm/mfrt/show/:id',

    CRM_REPORTS = '/modules/crm/reports',
    CRM_REPORTS_CREATE = '/modules/crm/reports/create',
    CRM_REPORTS_SHOW = '/modules/crm/reports/show/:id',

    CRM_SEARCH = '/modules/crm/search',
    CRM_SEARCH_CREATE = '/modules/crm/search/create',
    CRM_SEARCH_SHOW = '/modules/crm/search/show/:id',

    CRM_ORGANIZATION = '/modules/crm/organization/:id',


    // DOCUMENTS PAGES
    DOCUMENTS_MODULE = '/modules/documents',

    DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES = '/modules/documents/chief-accountant-job-responsibilities',
    DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES_CREATE = '/modules/documents/chief-accountant-job-responsibilities/create',
    DOCUMENTS_CHIEF_ACCOUNTANT_JOB_RESPONSIBILITIES_SHOW = '/modules/documents/chief-accountant-job-responsibilities/show/:id',

    DOCUMENTS_MF_ACCESS_FORMS = '/modules/documents/mf-access-forms',
    DOCUMENTS_MF_ACCESS_FORMS_CREATE = '/modules/documents/mf-access-forms/create',
    DOCUMENTS_MF_ACCESS_FORMS_SHOW = '/modules/documents/mf-access-forms/show/:id',

    DOCUMENTS_SIGNATURES_SAMPLE_CARD = '/modules/documents/signatures-sample-card',
    DOCUMENTS_SIGNATURES_SAMPLE_CARD_CREATE = '/modules/documents/signatures-sample-card/create',
    DOCUMENTS_SIGNATURES_SAMPLE_CARD_SHOW = '/modules/documents/signatures-sample-card/show/:id',

    DOCUMENTS_TFMIS_ACCESS_APPLICATIONS = '/modules/documents/tfmis-access-applications',
    DOCUMENTS_TFMIS_ACCESS_APPLICATIONS_CREATE = '/modules/documents/tfmis-access-applications/create',
    DOCUMENTS_TFMIS_ACCESS_APPLICATIONS_SHOW = '/modules/documents/tfmis-access-applications/show/:id',

    // EGOV PAGES
    EGOV_MODULE = '/modules/eGov',

    EGOV_APPLICATION_OF_RESIDENT = '/modules/egov/Application-of-resident',
    EGOV_APPLICATION_OF_RESIDENT_CREATE = '/modules/egov/Application-of-resident/create',
    EGOV_APPLICATION_OF_RESIDENT_SHOW = '/modules/egov/Application-of-resident/show/:id',

    // EGOV FULL PAGES
    EGOV_FULL_MODULE = '/modules/egovFull',

    EGOV_FULL_ORGANIZATION_REGISTRY = '/modules/egovFull/Organisation',
    EGOV_FULL_ORGANIZATION_DETAILS = '/modules/egovFull/Organisation/:fid',
    EGOV_FULL_ORGANIZATION_CREATE = '/modules/egovFull/Organisation/create',
    EGOV_FULL_ORGANIZATION_CREATE_INNER = '/modules/egovFull/Organisation/:fid/create',
    EGOV_FULL_ORGANIZATION_SHOW = '/modules/egovFull/Organisation/:fid/show/:id',
    EGOV_FULL_ORGANIZATION_SERVICE = '/modules/egovFull/Organisation/:fid/Service/:sid',
    EGOV_FULL_ORGANIZATION_SERVICE_CREATE = '/modules/egovFull/Organisation/:fid/Service/:sid/create',
    EGOV_FULL_ORGANIZATION_SERVICE_SHOW = '/modules/egovFull/Organisation/:fid/Service/:sid/show/:id',

    // FINANCE REPORT PAGES
    FINANCE_REPORT_MODULE = '/modules/finance-report',
    FINANCE_REPORT_CREATE = '/modules/finance-report/create',
    FINANCE_REPORT_SHOW = '/modules/finance-report/show/:id',

    // LETTERS PAGES
    LETTERS_MODULE = '/modules/latters',

    LETTERS_ACTIVITY = '/modules/latters/activity',
    LETTERS_ACTIVITY_CREATE = '/modules/latters/activity/create',
    LETTERS_ACTIVITY_SHOW = '/modules/latters/activity/show/:id',

    LETTERS_COR_EXECUTION = '/modules/latters/corIncoming/corExecution',
    LETTERS_COR_EXECUTION_CREATE = '/modules/latters/corIncoming/corExecution/create',
    LETTERS_COR_EXECUTION_SHOW = '/modules/latters/corIncoming/corExecution/show/:id',

    LETTERS_COR_INCOMING_MAIN = '/modules/latters/corIncoming',
    LETTERS_COR_INCOMING = '/modules/latters/corIncoming/corIncoming',
    LETTERS_COR_INCOMING_CREATE = '/modules/latters/corIncoming/corIncoming/create',
    LETTERS_COR_INCOMING_SHOW = '/modules/latters/corIncoming/corIncoming/show/:id',

    LETTERS_INCOMING_MAIN = '/modules/latters/incomming',

    LETTERS_INCOMING = '/modules/latters/incomming/incomming',
    LETTERS_INCOMING_CREATE = '/modules/latters/incomming/incomming/create',
    LETTERS_INCOMING_SHOW = '/modules/latters/incomming/incomming/show/:id',

    LETTERS_NEW_INCOMING = '/modules/latters/newIncoming',
    LETTERS_NEW_INCOMING_CREATE = '/modules/latters/newIncoming/create',
    LETTERS_NEW_INCOMING_SHOW = '/modules/latters/newIncoming/show/:id',

    LETTERS_NEW_OUTCOMING = '/modules/latters/incomming/outcomingNew',
    LETTERS_NEW_OUTCOMING_CREATE = '/modules/latters/incomming/outcomingNew/create',
    LETTERS_NEW_OUTCOMING_SHOW = '/modules/latters/incomming/outcomingNew/show/:id',

    LETTERS_OUTCOMING = '/modules/latters/corIncoming/outcomming',
    LETTERS_OUTCOMING_CREATE = '/modules/latters/corIncoming/outcomming/create',
    LETTERS_OUTCOMING_SHOW = '/modules/latters/corIncoming/outcomming/show/:id',

    // LETTERS V3
    LETTERS_V3 = '/modules/latters-v3/',

    LETTERS_V3_INCOMING = '/modules/latters-v3/incomming',
    LETTERS_V3_INCOMING_CREATE = '/modules/latters-v3/incomming/create',
    LETTERS_V3_INCOMING_SHOW = '/modules/latters-v3/incomming/show/:id',

    LETTERS_V3_OUTCOMING = '/modules/latters-v3/outcomming',
    LETTERS_V3_OUTCOMING_CREATE = '/modules/latters-v3/outcomming/create',
    LETTERS_V3_OUTCOMING_SHOW = '/modules/latters-v3/outcomming/show/:id',

    // LETTERS V3.5
    LETTERS_V3_5 = '/modules/letters-v3.5/',

    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE = '/modules/letters-v3.5/ExternalCorrespondence',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING = '/modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING_CREATE = '/modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5/create',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_INCOMING_SHOW = '/modules/letters-v3.5/ExternalCorrespondence/corIncoming-v3.5/show/:id',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING = '/modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING_CREATE = '/modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5/create',
    LETTERS_V3_5_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING_SHOW = '/modules/letters-v3.5/ExternalCorrespondence/coroutcomming-v3.5/show/:id',

    LETTERS_V3_5_INTERNAL_CORRESPONDENCE = '/modules/letters-v3.5/InternalCorrespondence',
    LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT = '/modules/letters-v3.5/InternalCorrespondence/chat',
    LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT_CREATE = '/modules/letters-v3.5/InternalCorrespondence/chat/create',
    LETTERS_V3_5_INTERNAL_CORRESPONDENCE_CHAT_SHOW = '/modules/letters-v3.5/InternalCorrespondence/chat/show/:id',

 // LETTERS V4
 LETTERS_V4 = '/modules/letters-v4',

 LETTERS_V4_INCOMING = '/modules/letters-v4/incomming',
 LETTERS_V4_INCOMING_CREATE = '/modules/letters-v4/incomming/create',
 LETTERS_V4_INCOMING_SHOW = '/modules/letters-v4/incomming/show/:id',

 LETTERS_V4_OUTCOMING = '/modules/letters-v4/outcomming',
 LETTERS_V4_OUTCOMING_CREATE = '/modules/letters-v4/outcomming/create',
 LETTERS_V4_OUTCOMING_SHOW = '/modules/letters-v4/outcomming/show/:id',
 LETTERS_V4_EXTERNAL_CORRESPONDENCE_COR_OUTCOMING = '/modules/letters-v4/ExternalCorrespondence/coroutcomming-v4',

    // REQUESTS MODULE PAGES
    REQUESTS_MODULE = '/modules/requestsmodul',
    REQUEST_PAGE = '/modules/requestpage',
    REQUESTS_MODULE_DETAILS = '/modules/requestsmodul/:id',
    REQUESTS_MODULE_BO = '/modules/requestsmodul/request_bo',
    REQUESTS_MODULE_FIZ = '/modules/requestsmodul/request_fiz',
    REQUESTS_MODULE_KO = '/modules/requestsmodul/request_ko',
    REQUESTS_MODULE_REPORT = '/modules/requestsmodul/request_report',
    REQUESTS_MODULE_SEARCH = '/modules/requestsmodul/request_search',
    REQUESTS_MODULE_PAGE = '/modules/requestsmodul/requestpage',

    // SOURCE DOCUMENTS PAGES
    SOURCE_DOCUMENTS_MODULE = '/modules/source-documents',

    SOURCE_DOCUMENTS_ACT = '/modules/source-documents/act',
    SOURCE_DOCUMENTS_ACT_CREATE = '/modules/source-documents/act/create',
    SOURCE_DOCUMENTS_ACT_SHOW = '/modules/source-documents/act/show/:id',

    SOURCE_DOCUMENTS_CONTRACTS = '/modules/source-documents/contracts',
    SOURCE_DOCUMENTS_CONTRACTS_CREATE = '/modules/source-documents/contracts/create',
    SOURCE_DOCUMENTS_CONTRACTS_SHOW = '/modules/source-documents/contracts/show/:id',

    SOURCE_DOCUMENTS_INVOICES = '/modules/source-documents/invoices',
    SOURCE_DOCUMENTS_INVOICES_CREATE = '/modules/source-documents/invoices/create',
    SOURCE_DOCUMENTS_INVOICES_SHOW = '/modules/source-documents/invoices/show/:id',

    SOURCE_DOCUMENTS_PROXIES = '/modules/source-documents/proxies',
    SOURCE_DOCUMENTS_PROXIES_CREATE = '/modules/source-documents/proxies/create',
    SOURCE_DOCUMENTS_PROXIES_SHOW = '/modules/source-documents/proxies/show/:id',

    SOURCE_DOCUMENTS_TRAVEL_EXPENSES = '/modules/source-documents/travel-expenses',
    SOURCE_DOCUMENTS_TRAVEL_EXPENSES_CREATE = '/modules/source-documents/travel-expenses/create',
    SOURCE_DOCUMENTS_TRAVEL_EXPENSES_SHOW = '/modules/source-documents/travel-expenses/show/:id',

    SOURCE_DOCUMENTS_WAYBILLS = '/modules/source-documents/waybills',
    SOURCE_DOCUMENTS_WAYBILLS_CREATE = '/modules/source-documents/waybills/create',
    SOURCE_DOCUMENTS_WAYBILLS_SHOW = '/modules/source-documents/waybills/show/:id',

    // USERS PAGES
    USERS_PROFILE = '/users/me/profile',
    USERS_ORGANIZATION = '/users/me/profile/organisation',

    USERS_ADMIN = '/users/me/admin',
    USERS_ADMIN_CREATE = '/users/me/admin/create',
    USERS_ADMIN_GROUPS = '/users/me/admin/groups',
    USERS_ADMIN_PROFILES = '/users/me/admin/profiles',
    USERS_ADMIN_ROLES = '/users/me/admin/roles',
    USERS_ADMIN_PROFILE_DETAILS = '/users/me/admin/profile/:id',

    

}   