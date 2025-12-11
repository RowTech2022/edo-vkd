interface ErrorCodes {
  ALREADY_LOGGED_IN: number;
  ASN1_ERROR: number;
  ATTRIBUTE_READ_ONLY: number;
  ATTRIBUTE_SENSITIVE: number;
  ATTRIBUTE_TYPE_INVALID: number;
  ATTRIBUTE_VALUE_INVALID: number;
  BAD_PARAMS: number;
  BASE64_DECODE_FAILED: number;
  BUFFER_TOO_SMALL: number;
  CANNOT_SAVE_PIN_IN_CACHE: number;
  CANT_HARDWARE_VERIFY_CMS: number;
  CANT_LOCK: number;
  CA_CERTIFICATES_NOT_FOUND: number;
  CEK_NOT_AUTHENTIC: number;
  CERTIFICATE_CATEGORY_BAD: number;
  CERTIFICATE_EXISTS: number;
  CERTIFICATE_HASH_NOT_UNIQUE: number;
  CERTIFICATE_NOT_FOUND: number;
  CERTIFICATE_VERIFICATION_ERROR: number;
  CMS_CERTIFICATE_ALREADY_PRESENT: number;
  CRYPTOKI_ALREADY_INITIALIZED: number;
  DATA_INVALID: number;
  DATA_LEN_RANGE: number;
  DECRYPT_UNSUCCESSFUL: number;
  DEVICE_ERROR: number;
  DEVICE_NOT_FOUND: number;
  DIDNOT_FIND_SESSION: number;
  FUNCTION_FAILED: number;
  FUNCTION_REJECTED: number;
  HOST_NOT_FOUND: number;
  HTTP_ERROR: number;
  INAPPROPRIATE_PIN: number;
  INFORMATION_SENSITIVE: number;
  KEY_FUNCTION_NOT_PERMITTED: number;
  KEY_HANDLE_INVALID: number;
  KEY_ID_NOT_UNIQUE: number;
  KEY_INDIGESTIBLE: number;
  KEY_LABEL_NOT_UNIQUE: number;
  KEY_NEEDED: number;
  KEY_NOT_FOUND: number;
  KEY_NOT_NEEDED: number;
  KEY_NOT_WRAPPABLE: number;
  KEY_SIZE_RANGE: number;
  KEY_UNEXTRACTABLE: number;
  LICENCE_READ_ONLY: number;
  MECHANISM_INVALID: number;
  MECHANISM_PARAM_INVALID: number;
  MUTEX_BAD: number;
  MUTEX_NOT_LOCKED: number;
  NEED_TO_CREATE_THREADS: number;
  NEW_PIN_MODE: number;
  VITE_OTP: number;
  NOT_ENOUGH_MEMORY: number;
  NO_EVENT: number;
  OBJECT_HANDLE_INVALID: number;
  OPERATION_ACTIVE: number;
  OPERATION_NOT_INITIALIZED: number;
  PEM_ERROR: number;
  PIN_CHANGED: number;
  PIN_EXPIRED: number;
  PIN_INCORRECT: number;
  PIN_INVALID: number;
  PIN_IN_HISTORY: number;
  PIN_LENGTH_INVALID: number;
  PIN_LOCKED: number;
  PKCS11_CANCEL: number;
  PKCS11_LOAD_FAILED: number;
  PKCS11_OK: number;
  RANDOM_NO_RNG: number;
  RANDOM_SEED_NOT_SUPPORTED: number;
  SAVED_STATE_INVALID: number;
  SESSION_CLOSED: number;
  SESSION_COUNT: number;
  SESSION_EXISTS: number;
  SESSION_INVALID: number;
  SESSION_PARALLEL_NOT_SUPPORTED: number;
  SESSION_READ_ONLY: number;
  SESSION_READ_ONLY_EXISTS: number;
  SESSION_READ_WRITE_SO_EXISTS: number;
  SIGNATURE_INVALID: number;
  SIGNATURE_LEN_RANGE: number;
  SLOT_ID_INVALID: number;
  STATE_UNSAVEBLE: number;
  TEMPLATE_INCOMPLETE: number;
  TOKEN_INVALID: number;
  TOKEN_NOT_PRESENT: number;
  TOKEN_NOT_RECOGNIZED: number;
  TOKEN_WRITE_PROTECTED: number;
  TST_VERIFICATION_ERROR: number;
  TS_ESS_SIGNING_CERT_ERROR: number;
  TS_MUST_BE_ONE_SIGNER: number;
  TS_NONCE_NOT_RETURNED: number;
  TS_NO_CONTENT: number;
  TS_POLICY_MISMATCH: number;
  TS_TOKEN_MISSED: number;
  TS_TSA_UNTRUSTED: number;
  TS_UNSUPPORTED_VERSION: number;
  TS_WRONG_CONTENT_TYPE: number;
  UNKNOWN_KEY_TYPE: number;
  UNKNOWN_OBJECT_NAME: number;
  UNKNOWN_OID: number;
  UNSUPPORTED_BY_TOKEN: number;
  UNWRAPPING_KEY_HANDLE_INVALID: number;
  UNWRAPPING_KEY_SIZE_RANGE: number;
  UNWRAPPING_KEY_TYPE_INCONSISTENT: number;
  USER_ANOTHER_ALREADY_LOGGED_IN: number;
  USER_NOT_LOGGED_IN: number;
  USER_PIN_NOT_INITIALIZED: number;
  USER_TOO_MANY_TYPES: number;
  USER_TYPE_INVALID: number;
  WRAPPED_KEY_LEN_RANGE: number;
  WRAPPING_KEY_HANDLE_INVALID: number;
  WRAPPING_KEY_SIZE_RANGE: number;
  WRAPPING_KEY_TYPE_INCONSISTENT: number;
  WRONG_BIG_NUMBER: number;
  WRONG_KEY_TYPE: number;
  X509V3_INVALID_OBJECT_IDENTIFIER: number;
  X509_AKID_ISSUER_SERIAL_MISMATCH: number;
  X509_AKID_SKID_MISMATCH: number;
  X509_APPLICATION_VERIFICATION: number;
  X509_CERT_CHAIN_TOO_LONG: number;
  X509_CERT_HAS_EXPIRED: number;
  X509_CERT_NOT_YET_VALID: number;
  X509_CERT_REJECTED: number;
  X509_CERT_REVOKED: number;
  X509_CERT_SIGNATURE_FAILURE: number;
  X509_CERT_UNTRUSTED: number;
  X509_CRL_HAS_EXPIRED: number;
  X509_CRL_NOT_YET_VALID: number;
  X509_CRL_PATH_VALIDATION_ERROR: number;
  X509_CRL_SIGNATURE_FAILURE: number;
  X509_DEPTH_ZERO_SELF_SIGNED_CERT: number;
  X509_DIFFERENT_CRL_SCOPE: number;
  X509_ERROR_IN_CERT_NOT_AFTER_FIELD: number;
  X509_ERROR_IN_CERT_NOT_BEFORE_FIELD: number;
  X509_ERROR_IN_CRL_LAST_UPDATE_FIELD: number;
  X509_ERROR_IN_CRL_VITE_UPDATE_FIELD: number;
  X509_EXCLUDED_VIOLATION: number;
  X509_INVALID_CA: number;
  X509_INVALID_EXTENSION: number;
  X509_INVALID_NON_CA: number;
  X509_INVALID_POLICY_EXTENSION: number;
  X509_INVALID_PURPOSE: number;
  X509_KEYUSAGE_NO_CERTSIGN: number;
  X509_KEYUSAGE_NO_CRL_SIGN: number;
  X509_KEYUSAGE_NO_DIGITAL_SIGNATURE: number;
  X509_NO_EXPLICIT_POLICY: number;
  X509_OUT_OF_MEM: number;
  X509_PATH_LENGTH_EXCEEDED: number;
  X509_PERMITTED_VIOLATION: number;
  X509_PROXY_CERTIFICATES_NOT_ALLOWED: number;
  X509_PROXY_PATH_LENGTH_EXCEEDED: number;
  X509_SELF_SIGNED_CERT_IN_CHAIN: number;
  X509_SUBJECT_ISSUER_MISMATCH: number;
  X509_SUBTREE_MINMAX: number;
  X509_UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY: number;
  X509_UNABLE_TO_DECRYPT_CERT_SIGNATURE: number;
  X509_UNABLE_TO_DECRYPT_CRL_SIGNATURE: number;
  X509_UNABLE_TO_GET_CRL: number;
  X509_UNABLE_TO_GET_CRL_ISSUER: number;
  X509_UNABLE_TO_GET_ISSUER_CERT: number;
  X509_UNABLE_TO_GET_ISSUER_CERT_LOCALLY: number;
  X509_UNABLE_TO_VERIFY_LEAF_SIGNATURE: number;
  X509_UNHANDLED_CRITICAL_CRL_EXTENSION: number;
  X509_UNHANDLED_CRITICAL_EXTENSION: number;
  X509_UNNESTED_RESOURCE: number;
  X509_UNSUPPORTED_CONSTRAINT_SYNTAX: number;
  X509_UNSUPPORTED_CONSTRAINT_TYPE: number;
  X509_UNSUPPORTED_EXTENSION_FEATURE: number;
  X509_UNSUPPORTED_NAME_SYNTAX: number;
  valid: boolean;
  value: string;
}

export interface RdnValue {
  rdn: string
  value: string
}

interface CertificateInfo {
  extension: {
    extKeyUsage: string[]
    keyUsage: string[]
  }
  issuer: RdnValue[]
  serialNumber: string
  subject: RdnValue[]
  text: string
  validNotAfter: string
  validNotBefore: string
}

export interface RuTokenPluginInstance {
  BIO_TYPE_NOT_SPECIFIED: number;
  BIO_TYPE_NOT_SUPPORTED: number;
  CERT_CATEGORY_CA: number;
  CERT_CATEGORY_OTHER: number;
  CERT_CATEGORY_UNSPEC: number;
  CERT_CATEGORY_USER: number;
  CERT_INFO_SERIAL_NUMBER: number;
  CIPHER_ALGORITHM_3DES: number;
  CIPHER_ALGORITHM_AES128: number;
  CIPHER_ALGORITHM_AES192: number;
  CIPHER_ALGORITHM_AES256: number;
  CIPHER_ALGORITHM_DES: number;
  CIPHER_ALGORITHM_GOST28147: number;
  DATA_FORMAT_BASE64: number;
  DATA_FORMAT_HASH: number;
  DATA_FORMAT_PLAIN: number;
  DEVICE_DATA_FORMAT_PINPAD2: number;
  DEVICE_DATA_FORMAT_PLAIN: number;
  DEVICE_DATA_FORMAT_RAW: number;
  DEVICE_DATA_FORMAT_SAFETOUCH: number;
  DEVICE_DATA_FORMAT_XML: number;
  ENUMERATE_DEVICES_EVENTS: number;
  ENUMERATE_DEVICES_LIST: number;
  ENUMERATE_DEVICES_UNDEFINED: number;
  HASH_TYPE_GOST3411_12_256: number;
  HASH_TYPE_GOST3411_12_512: number;
  HASH_TYPE_GOST3411_94: number;
  HASH_TYPE_MD5: number;
  HASH_TYPE_SHA1: number;
  HASH_TYPE_SHA256: number;
  HASH_TYPE_SHA512: number;
  INTERFACE_TYPE_BT: number;
  INTERFACE_TYPE_ISO: number;
  INTERFACE_TYPE_NFC: number;
  INTERFACE_TYPE_SD: number;
  INTERFACE_TYPE_UART: number;
  INTERFACE_TYPE_USB: number;
  KEY_INFO_ALGORITHM: number;
  KEY_TYPE_COMMON: number;
  KEY_TYPE_JOURNAL: number;
  PUBLIC_KEY_ALGORITHM_GOST3410_2001: number;
  PUBLIC_KEY_ALGORITHM_GOST3410_2012_256: number;
  PUBLIC_KEY_ALGORITHM_GOST3410_2012_512: number;
  PUBLIC_KEY_ALGORITHM_RSA: number;
  PUBLIC_KEY_ALGORITHM_RSA_1024: number;
  PUBLIC_KEY_ALGORITHM_RSA_1280: number;
  PUBLIC_KEY_ALGORITHM_RSA_1536: number;
  PUBLIC_KEY_ALGORITHM_RSA_1792: number;
  PUBLIC_KEY_ALGORITHM_RSA_2048: number;
  PUBLIC_KEY_ALGORITHM_RSA_4096: number;
  PUBLIC_KEY_ALGORITHM_RSA_512: number;
  PUBLIC_KEY_ALGORITHM_RSA_768: number;
  SECURE_MESSAGING_ENHANCED: number;
  SECURE_MESSAGING_NOT_SPECIFIED: number;
  SECURE_MESSAGING_OFF: number;
  SECURE_MESSAGING_ON: number;
  SECURE_MESSAGING_UNSUPPORTED: number;
  TOKEN_INFO_ALGORITHMS: number;
  TOKEN_INFO_DEVICE_TYPE: number;
  TOKEN_INFO_FEATURES: number;
  TOKEN_INFO_FKN_SUPPORTED: number;
  TOKEN_INFO_FORMATS: number;
  TOKEN_INFO_FREE_MEMORY: number;
  TOKEN_INFO_IS_LOGGED_IN: number;
  TOKEN_INFO_IS_PIN_CACHED: number;
  TOKEN_INFO_LABEL: number;
  TOKEN_INFO_MODEL: number;
  TOKEN_INFO_PINS_INFO: number;
  TOKEN_INFO_PIN_RETRIES_LEFT: number;
  TOKEN_INFO_READER: number;
  TOKEN_INFO_SERIAL: number;
  TOKEN_INFO_SPEED: number;
  TOKEN_INFO_SUPPORTED_MECHANISMS: number;
  TOKEN_TYPE_RUTOKEN_ECP: number;
  TOKEN_TYPE_RUTOKEN_ECP_SC: number;
  TOKEN_TYPE_RUTOKEN_PINPAD_2: number;
  TOKEN_TYPE_RUTOKEN_WEB: number;
  TOKEN_TYPE_UNKNOWN: number;
  valid: boolean;
  value: string;
  version: string;
  errorCodes: ErrorCodes;
  enumerateDevices: (options?: {}) => Promise<number[]>
  getDeviceInfo: (deviceNumber: number, requestType: number) => Promise<{}>
  login: (deviceNumber: number, pin: string) => Promise<any>
  logout: (deviceId: number) => Promise<any>
  enumerateKeys: (deviceId: number, marker?: string) => Promise<string[]>
  getKeyLabel: (deviceId: number, keyId: string) => Promise<string>
  enumerateCertificates: (deviceId: number, category: number) => Promise<string[]>
  getCertificate: (deviceId: number, certId: string) => Promise<{}>
  getCertificateInfo: (deviceId: number, certId: string, option: number) => Promise<{}>
  parseCertificate: (deviceId: number, certId: string) => Promise<CertificateInfo>
}

export interface DeviceList {
  id: number
  mechanisms: {}
  features: {}
  speed: {}
}

export class RuTokenPlugin {
  pluginObject: RuTokenPluginInstance
  tokenInfoRequestTypes: number[] = []

  constructor(plugin: RuTokenPluginInstance) {
    this.pluginObject = plugin
    this.tokenInfoRequestTypes = [
      plugin.TOKEN_INFO_SUPPORTED_MECHANISMS,
      plugin.TOKEN_INFO_FEATURES,
      plugin.TOKEN_INFO_SPEED,
    ]
  }

  getDevices = async (): Promise<DeviceList[]> => {
    return await this.pluginObject.enumerateDevices().then((deviceIds) => {
      if (deviceIds.length === 0) return []
      const getDevice = (id: number) => Promise
        .all(this.tokenInfoRequestTypes.map((requestType) => {
          return this.pluginObject.getDeviceInfo(id, requestType)
        }))
        .then((values) => ({
          id,
          mechanisms: values[0],
          features: values[1],
          speed: values[2],
        }))
      return Promise.all(deviceIds.map((id: number) => getDevice(id)))
    })
  }

  getCertificates = async (deviceId: number) => {
    return await this.pluginObject.enumerateCertificates(deviceId, this.pluginObject.CERT_CATEGORY_USER).then((certIds) => {
      if (certIds.length === 0) return []
      return Promise.all(certIds.map(id =>
        this.pluginObject.parseCertificate(deviceId, id).then(info => ({ ...info, id })),
      ))
    })
  }
}
