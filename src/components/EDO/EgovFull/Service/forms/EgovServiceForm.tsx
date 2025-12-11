import { FC } from "react";
import { FormGroup, TextField } from "@mui/material";

import { useSession } from "@hooks";
import { IEgovServiceRequestsCreateResponse } from "src/services";

interface IEgovServiceForm {
  DTO?: IEgovServiceRequestsCreateResponse | null;
  org?: boolean;
}
export const EgovServiceForm: FC<IEgovServiceForm> = (props) => {
  const { DTO, org } = props;
  const { data: session } = useSession();

  if (org) {
    return (
      <div className="tw-p-4 tw-pb-0">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-2 tw-gap-8">
            <TextField
              disabled
              name="orgName"
              label="Наименование организации"
              value={DTO?.orgName || "Неизвестный"}
              size="small"
              required
            />
            <TextField
              disabled
              name="orgINN"
              label="ИНН организации"
              value={DTO?.orgINN || "Не указан инн"}
              size="small"
              required
            />
            <TextField
              disabled
              name="orgAdress"
              label="Адрес оганизации"
              value={DTO?.orgAdress || "Не указан адрес"}
              size="small"
              required
            />
          </div>
        </FormGroup>
      </div>
    );
  }
  return (
    <div className="tw-p-4 tw-pb-0">
      <FormGroup className="tw-mb-4">
        <div className="tw-grid tw-grid-cols-2 tw-gap-8">
          <TextField
            disabled
            name="first_Fio"
            label="ФИО"
            value={DTO?.userInfo?.name || "Неизвестный"}
            size="small"
            required
          />
          <TextField
            disabled
            name="passportNumber"
            label="Номер паспорта"
            value={DTO?.userInfo?.passportNumber || "Не указан серия паспорта"}
            size="small"
            required
          />
          <TextField
            disabled
            name="phone"
            label="Номер телефона"
            value={DTO?.userInfo?.phone || "Не указан номер телефона"}
            size="small"
            required
          />
          <TextField
            disabled
            name="email"
            label="Электронная почта"
            value={DTO?.userInfo?.email || "Не указан адрес электронной почты"}
            size="small"
            required
          />
          <TextField
            disabled
            name="email"
            label="Сумма обработки завяления"
            value={
              DTO?.userInfo?.price || "Не указан сумма обработки завяления"
            }
            size="small"
            required
          />
          <TextField
            disabled
            name="email"
            label="Сумма получение услуги"
            value={
              DTO?.userInfo?.treatmentPrice ||
              "Не указан сумма получение услуги"
            }
            size="small"
            required
          />

          <TextField
            disabled
            name="term"
            label="Срок предоставление услуги"
            value={
              DTO?.userInfo?.term || "Не указан срок предоставление услуги"
            }
            size="small"
            required
          />
          <TextField
            disabled
            name="phoneNumber"
            label="Телефон для справки"
            value={
              DTO?.userInfo?.phoneNumber || "Не указан телефон для справки"
            }
            size="small"
            required
          />
        </div>
      </FormGroup>
    </div>
  );
};
