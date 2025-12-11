import { Card, TextareaAutosize } from '@mui/material'
import { FormikProps } from 'formik'
import { FC } from 'react'
import { ContractListInitialValuesType } from '../../helpers/schema'

interface INote {
  canSave?: boolean
  formik: FormikProps<ContractListInitialValuesType>
}

export const Notes: FC<INote> = ({ canSave, formik }) => {
  return (
    <Card title="Примечания">
      <div className="tw-grid tw-grid-cols-1 tw-gap-1">
        <TextareaAutosize
          style={{
            height: 300,
            padding: 20,
            margin: 10,
            border: 'solid 2px #E0E0E0',
          }}
          name="notes"
          disabled={!canSave}
          value={formik.values.notes || ''}
          onChange={formik.handleChange}
        />
      </div>
    </Card>
  )
}
