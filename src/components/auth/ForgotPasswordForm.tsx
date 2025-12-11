import { TextInput, PrimaryButton } from "@ui";
import { useState } from "react";

type Props = {};

const ForgotPasswordForm = (props: Props) => {
  const [telOrEmail, setTelOrEmail] = useState("");
  return (
    <form className="tw-flex tw-flex-col tw-gap-6 tw-mb-6">
      <span>
        Для восстановления и сброса пароля, введите мобильный номер или адрес
        эл.почты ниже и нажмите отправить
      </span>
      <TextInput
        value={telOrEmail}
        onChange={(value: string) => setTelOrEmail(value)}
      />
      <PrimaryButton className="tw-w-max">Отправить</PrimaryButton>
    </form>
  );
};

export default ForgotPasswordForm;
