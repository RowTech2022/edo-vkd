import { Card , FormGroup, TextField } from '@mui/material'
import React, { FC } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FormikProps } from 'formik'
import { InvoiceListInitialValuesType } from '../../helpers/schema'

interface IMainInfo {
  canSave?: boolean
  formik: FormikProps<InvoiceListInitialValuesType>
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik

  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <TextField
              placeholder="Поставщик*"
              value={values.contract?.supplier?.info?.value}
              disabled
              size="small"
            />
            <TextField
              placeholder="Получатель*"
              value={values.contract?.receiver?.info?.value}
              disabled
              size="small"
            />

            <TextField
              label="Сумма*"
              type="number"
              disabled={true}
              value={values.summa}
              size="small"
              onChange={(event) => {
                setFieldValue('summa', parseFloat(event.target.value))
              }}
            />

            <TextField
              placeholder="Резвизиты поставщика*"
              value={values.contract?.supplier?.requisites}
              disabled
              size="small"
            />

            <TextField
              placeholder="Резвизиты получателя*"
              value={values.contract?.receiver?.requisites}
              disabled
              size="small"
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  )
}
