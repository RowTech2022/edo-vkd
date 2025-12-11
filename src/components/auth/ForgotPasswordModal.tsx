import { AuthForgotPasswordForm } from "@components";
import { Modal } from "@ui";

type Props = {
  modalOpen: boolean;
  setModalOpen: Function;
};

export const AuthForgotPasswordModal = ({ modalOpen, setModalOpen }: Props) => {
  return (
    <Modal open={modalOpen} setOpen={setModalOpen}>
      <div>
        <h1 className="tw-text-primary tw-font-semibold tw-mb-5">
          Восстановление пароля
        </h1>
        <AuthForgotPasswordForm />
      </div>
    </Modal>
  );
};

export default AuthForgotPasswordModal;
