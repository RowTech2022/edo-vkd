interface ValidatorResponse {
  isValid: boolean
  errorMessage: string
}

// const fileTypes : string[] = [
//     '/application/pdf',
//     '/image/jpeg',
//     'pdf'

// ]

const fileTypess = ['pdf']

async function validateFileType(fileType: string): Promise<ValidatorResponse> {
  const fileTypeValidator = (await import('../Validator/FileTypeValidator'))
    .default

  const validator = new fileTypeValidator(fileType, fileTypess)
  const isValid = validator.validateFileType()

  return {
    isValid,
    errorMessage: isValid ? '' : validator.getErrorMessage(),
  }
}

export { validateFileType }

const fileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx']

async function validateLettersFileType(
  fileType: string
): Promise<ValidatorResponse> {
  const fileTypeValidator = (await import('../Validator/FileTypeValidator'))
    .default

  const validator = new fileTypeValidator(fileType, fileTypes)
  const isValid = validator.validateFileType()

  return {
    isValid,
    errorMessage: isValid ? '' : validator.getErrorMessage(),
  }
}

export { validateLettersFileType }
