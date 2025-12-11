import { stringSchema } from "@utils";
import * as Yup from 'yup'

export const validationSchema = Yup.object({
  login: stringSchema(),
  password: stringSchema(),
  phoneOrMail: stringSchema().when('userGroup', {
    is: (value: any) => value == 1 || value == 2,
    then: (schema) => schema.length(12, 'Неправильный формат номера телефона'),
  }),
})
