import { Card , FormGroup, TextField } from '@mui/material'
import React, { FC } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FormikProps } from 'formik'
import { ActListInitialValuesType } from '../../helpers/schema'

interface IMainInfo {
  canSave?: boolean
  formik: FormikProps<ActListInitialValuesType>
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik
  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-2">
          <div className="tw-grid tw-grid-cols-10 tw-gap-4">
            <TextField
              placeholder="Исполнитель*"
              className="tw-col-span-4"
              value={values.contract?.supplier?.info?.value}
              disabled
              size="small"
            />

            <TextField
              placeholder="Заказчик*"
              className="tw-col-span-4"
              value={values.contract?.receiver?.info?.value}
              disabled
              size="small"
            />

            <TextField
              className="tw-col-span-4"
              label="Принял"
              value={values.acceptedBy}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue('acceptedBy', event.target.value)
              }}
            />

            <TextField
              className="tw-col-span-4"
              label="Отрустил"
              value={values.passedBy}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue('passedBy', event.target.value)
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  )
}
