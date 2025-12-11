import React from 'react'
import {
  Box,
  Button,
  TextField,
  FormGroup,
  Autocomplete,
  DialogTitle,
} from '@mui/material'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import {
    useFetchEgovBankListQuery,
    useFetchPayStateListQuery,
  } from '@services/generalApi'
  import { useChangePayStateEgovServiceRequestsMutation } from '@services/egovServiceRequests'
  
const saveAlerts = {
  pending: 'Загрузка ...',
  success: 'Статус оплаты изменён',
  error: 'Произошла ошибка',
}

const ChangePatState = ({ onClose, id, timestamp, setDTO }: any) => {
  const [changePayStateEgovServiceRequests] =
    useChangePayStateEgovServiceRequestsMutation()

  const handleSubmit = (values: {
    state: { id: string; value: string } | null
    bankId: { id: string; value: string } | null
    docNo: string
    paidMoney: string
  }) => {
    const promise = changePayStateEgovServiceRequests({
      state: Number(values.state?.id || 0),
      bankId: Number(values.bankId?.id || 0),
      docNo: values.docNo,
      paidMoney: Number(values.paidMoney || 0),
      requestId: id,
      timestamp: timestamp,
    })

    promise
      .then((res: any) => {
        if (!res.error && 'data' in res) {
          onClose && onClose()
        }
      })
      .catch((err) => console.log(err))

    toast.promise(promise, saveAlerts)
  }

  const handleCancel = () => {
    onClose && onClose()
  }

  const payStateList = useFetchPayStateListQuery()
  const egovBankList = useFetchEgovBankListQuery()

  return (
    <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full tw-rounded-2xl tw-overflow-hidden">
        <DialogTitle
          className="tw-bg-primary"
          sx={{
            color: '#fff',
          }}
          textAlign={'center'}
          fontSize={25}
        >
          Изменить статус оплаты
        </DialogTitle>
        <Formik
          initialValues={{
            state: null,
            bankId: null,
            docNo: '',
            paidMoney: '',
          }}
          validate={({ state, bankId, docNo, paidMoney }) => {
            const errors: any = {}

            if (!state) {
              errors.state = 'Обязательное поле'
            }

            if (!bankId) {
              errors.bankId = 'Обязательное поле'
            }

            if (!docNo.length) {
              errors.docNo = 'Обязательное поле'
            }

            if (!paidMoney) {
              errors.paidMoney = 'Обязательное поле'
            }

            return errors
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleChange, touched, errors }) => (
            <Form className="tw-px-12 tw-py-5 tw-bg-white">
              <FormGroup className="tw-gap-6">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={payStateList?.data || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={values.state}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Статус оплаты"
                      required
                      error={touched.state && Boolean(errors.state)}
                      //@ts-ignore
                      helperText={touched.state && errors.state}
                    ></TextField>
                  )}
                  onChange={(event, value) => {
                    setFieldValue('state', value)
                  }}
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={egovBankList?.data || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={values.bankId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Банки"
                      required
                      error={touched.bankId && Boolean(errors.bankId)}
                      //@ts-ignore
                      helperText={touched.bankId && errors.bankId}
                    ></TextField>
                  )}
                  onChange={(event, value) => {
                    setFieldValue('bankId', value)
                  }}
                />
                <TextField
                  size="small"
                  name="docNo"
                  label="Номер документа"
                  value={values.docNo}
                  error={touched.docNo && Boolean(errors.docNo)}
                  helperText={touched.docNo && errors.docNo}
                  onChange={handleChange}
                />

                <TextField
                  size="small"
                  name="paidMoney"
                  label="Сумма"
                  value={values.paidMoney}
                  type="number"
                  error={touched.paidMoney && Boolean(errors.paidMoney)}
                  helperText={touched.paidMoney && errors.paidMoney}
                  onChange={handleChange}
                />
              </FormGroup>
              <Box className="tw-pt-4 tw-flex tw-gap-4 tw-justify-between">
                <Button
                  variant="outlined"
                  sx={{ background: '#e9e9e9 !important' }}
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="outlined">
                  Сохранить
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Box>
  )
}

export default ChangePatState
