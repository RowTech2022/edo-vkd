import { Card, TextareaAutosize } from '@mui/material'
import { FormikProps } from 'formik'
import { FC } from 'react'
import { InvoiceListInitialValuesType } from '../../helpers/schema'

interface INote {
  canSave?: boolean
  formik: FormikProps<InvoiceListInitialValuesType>
}

export const Notes: FC<INote> = ({ canSave, formik }) => {
  return (
    <Card title="Примечания">
      <div className="tw-grid tw-grid-cols-1 tw-gap-1">
        <TextareaAutosize
          style={{ height: 300, padding: 20 }}
          name="notes"
          disabled={!canSave}
          value={formik.values.notes || ''}
          onChange={formik.handleChange}
        />
      </div>
    </Card>
  )
}
