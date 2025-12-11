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
import { useFetchEgovRejectReasonsQuery } from '@services/generalApi'
import {
  useRejectDocumentMutation,
  IRejectDocument,
} from '@services/egovServiceRequests'

//const RejectDocument = ({ onClose, onSubmit, ...props }: any) => {
const RejectDocument = ({ onClose, id, timestamp, setDTO }: any) => {
  const [submitRejectMutation] = useRejectDocumentMutation()

  const handleSubmit = ({
    reason = null,
    reasonText = '',
  }: {
    reason: { id: string; value: string } | null
    reasonText: string
  }) => {

    //toast.promise(executeResolution(newData), {

const newData ={ 
      id: id,
      reasonText,
      reasonType: parseInt(reason?.id!),
      timestamp: timestamp,

} 
handleCancel();
    toast.promise(submitRejectMutation(newData), {
      pending: 'Заявление отклоняется',
      success: 'Заявление отклонена',
      error: 'Произошла ошибка',
    }
    // toast.promise(
    //   async () => {
    //     await submitRejectMutation({
    //       id: props.entry.id,
    //       reasonText,
    //       reasonType: parseInt(reason?.id!),
    //       timestamp: props.entry.timestamp,
    //     } as IRejectDocument)
    //     handleCancel()
    //   },
    //   {
    //     pending: 'Заявление отклоняется',
    //     success: 'Заявление отклонена',
    //     error: 'Произошла ошибка',
    //   }
    )
  }

  const handleCancel = () => {
    onClose && onClose()
  }

  const rejectReasonsQuery = useFetchEgovRejectReasonsQuery({ type: 25 })

  return (
    <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
        <DialogTitle
          className="tw-bg-primary tw-rounded-t-lg"
          sx={{
            color: '#fff',
          }}
          textAlign={'left'}
          fontSize={16}
        >
          Причина отказа
        </DialogTitle>
        <Formik
          initialValues={{ reason: null, reasonText: '' }}
          validate={({ reason, reasonText }) => {
            const errors: any = {}
            if (reasonText === '') {
              errors.reasonText = 'Обязательное поле'
            }

            if (!reason) {
              errors.reason = 'Обязательное поле'
            }

            return errors
          }}
          onSubmit={({ reason, reasonText }) => {
            handleSubmit({ reason, reasonText })
          }}
        >
          {({ values, setFieldValue, handleChange, touched, errors }) => (
            <Form className="tw-px-8 tw-py-10 tw-bg-white tw-rounded-b-lg">
              <FormGroup className="tw-gap-6">
                <Autocomplete
                  id="v.reason"
                  disablePortal
                  options={rejectReasonsQuery.data?.items || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={values.reason}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Выберите причину отказа*"
                      error={touched.reason && Boolean(errors.reason)}
                      //@ts-ignore
                      helperText={touched.reason && errors.reason}
                    ></TextField>
                  )}
                  onChange={(event, value) => {
                    setFieldValue('reason', value)
                  }}
                />
                <TextField
                  name="reasonText"
                  label="Комментарий"
                  value={values.reasonText}
                  multiline
                  minRows={4}
                  error={touched.reasonText && Boolean(errors.reasonText)}
                  helperText={touched.reasonText && errors.reasonText}
                  onChange={handleChange}
                />
              </FormGroup>
              <Box className="tw-pt-4 tw-flex tw-gap-4">
                <Button type="submit" variant="contained">
                  Сохранить
                </Button>
                <Button onClick={handleCancel}>Отмена</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Box>
  )
}

export default RejectDocument
