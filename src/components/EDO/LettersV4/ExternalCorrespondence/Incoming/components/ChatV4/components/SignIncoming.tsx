import { FC, useContext, useState } from "react";
import {
  useSignIncomingV4Mutation,
  useSignChildIncomingV4Mutation,
} from "@services/lettersApiV4";
import { CustomButton } from "@root/shared/ui";
import { IncomingCreateV4Context } from "../../../create";

export const SignIncoming: FC<{
  sign?: {
    sign?: string;
    signPicture?: string;
  };
  isChildSign?: boolean;
  disabled?: boolean;
}> = ({ sign, isChildSign = false, disabled }) => {
  const [signIncoming] = useSignIncomingV4Mutation();
  const [signChildIncoming] = useSignChildIncomingV4Mutation();
  const [showPicture, setShowPicture] = useState(
    sign?.signPicture ? true : false
  );

  const { letterId, refetchData } = useContext(IncomingCreateV4Context);

  const handleSign = () => {
    if (isChildSign) {
      signChildIncoming({
        incomingId: letterId,
      }).then(() => {
        refetchData();
      });
    } else {
      signIncoming({
        incomingId: letterId,
      }).then(() => {
        refetchData();
      });
    }
  };

  const handleToggle = () => {
    if (sign.signPicture) {
      setShowPicture((prev) => !prev);
    }
  };

  return (
    <span className="tw-cursor-pointer w-full" onClick={handleToggle}>
      {sign ? (
        <img
          className="tw-max-h-[5rem] tw-w-full"
          src={`data:image/png;base64,${
            showPicture ? sign?.signPicture : sign?.sign
          }`}
        />
      ) : (
        // <CustomButton
        //   disabled={disabled}
        //   variant="text"
        //   withRuToken
        //   onClick={handleSign}
        // >
        //   Подписать
        // </CustomButton>
        <></>
      )}
    </span>
  );
};
