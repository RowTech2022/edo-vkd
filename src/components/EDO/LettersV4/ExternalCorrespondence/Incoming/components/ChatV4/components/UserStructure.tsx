import { Checkbox, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserStructure = ({
  userId,
  userImage,
  userName,
  userPosition,
  handlePostUser,
  setMergerId,
  canChoose,
  checked,
  deleteUser,
  mergedId,
  checkboxVisible,
}: any) => {
  return (
    <div className="wrapper-user tw-mt-[50px] tw-flex tw-flex-col tw-items-center tw-relative">
      {checkboxVisible && (
        <Checkbox
          color="primary"
          className="tw-absolute -tw-top-1.5 tw-left-0"
          checked={checked}
          onChange={(e) => {
            setMergerId(userId);
            handlePostUser({
              id: userId,
              name: userName,
              role: userPosition,
              image: userImage,
            });
            // if (!canChoose) return;

            // if (e.target.checked) {
            //   handlePostUser({
            //     id: userId,
            //     name: userName,
            //     role: userPosition,
            //     image: userImage,
            //   });
            // } else {
            //   deleteUser(userId);
            //   // if (userId === mergerId) {
            //   //   setMergerId(null);
            //   // }
            // }
          }}
        />
      )}
      <>
        {mergedId == userId ? (
          <button
            // onClick={() => {
            //   setMergerId(userId);
            //   handlePostUser({
            //     id: userId,
            //     name: userName,
            //     role: userPosition,
            //     image: userImage,
            //   });
            // }}
            className="tw-bg-blue-600 tw-text-white tw-text-sm tw-px-2 tw-py-1 tw-rounded"
          >
            Главный <br /> исполнитель
          </button>
        ) : (
          <></>
        )}

        <IconButton
          onClick={() =>
            handlePostUser({
              id: userId,
              name: userName,
              role: userPosition,
              image: userImage,
            })
          }
        >
          <div className="wrapper-image tw-w-[80px] tw-relative tw-h-[80px] tw-rounded-full tw-overflow-hidden tw-mb-[20px] tw-border-[3px] tw-border-[transparent] hover:tw-border-[#007cd2] tw-cursor-pointer tw-transition-all tw-duration-100">
            {userImage?.length ? (
              <img
                className="tw-w-full tw-h-full tw-object-center tw-object-cover"
                src={userImage}
                alt="userImage"
              />
            ) : (
              <AccountCircleIcon className="tw-w-full tw-h-full" />
            )}
          </div>
        </IconButton>
      </>
      <div className="wrapper-info tw-bg-[#fff] tw-max-w-[200px] tw-px-[10px] tw-py-[5px] tw-rounded-lg tw-text-center">
        <p className="tw-text-[#007cd2] tw-font-bold tw-text-[14px]">
          {userName}
        </p>
        <p className="tw-text-[#3E3E3E] tw-text-[12px] tw-font-semibold">
          {userPosition}
        </p>
      </div>
    </div>
  );
};

export default UserStructure;
