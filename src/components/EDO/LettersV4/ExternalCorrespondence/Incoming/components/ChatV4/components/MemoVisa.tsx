import { useState } from "react";
import { SignIncoming } from "./SignIncoming";
import emblem from "@root/assets/emblem.jpg";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const MemoVisa = ({
  item,
  userChats,
  visaListTemp,
  termDate,
  visaStatusTemp,
  sign,
  isEditable,
  openEdit,
  mainDTO,
  openEditVisa,
}) => {
  const visaDate = mainDTO?.visaDate ? new Date(mainDTO.visaDate) : null;
  const day = visaDate ? visaDate.getDate() : "";
  const month = visaDate ? visaDate.getMonth() + 1 : "";
  const year = visaDate ? visaDate.getFullYear() : "";

  const termDateObj = termDate[termDate.length - 1];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (id: number) => {
    setAnchorEl(null);

    if (id === 1) {
      openEdit();
    } else {
      openEditVisa();
    }
  };

  return (
    <div className="wrapper tw-w-full tw-border-[2px] tw-p-[15px] tw-rounded-lg tw-flex tw-flex-col tw-gap-4">
      <header className="tw-flex tw-flex-col tw-items-center tw-gap-2">
        {isEditable ? (
          <div className="tw-w-full tw-flex tw-flex-row tw-justify-end">
            <>
              <IconButton onClick={handleClick}>
                <SettingsOutlinedIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleClose(1)}>
                  Изменить исполнителей
                </MenuItem>
                <MenuItem onClick={() => handleClose(2)}>
                  Изменить визу
                </MenuItem>
              </Menu>
            </>
            {/* <IconButton onClick={() => openEdit()}>
              <SettingsOutlinedIcon />
            </IconButton> */}
          </div>
        ) : (
          <></>
        )}

        <img src={emblem} alt="emblem" className="tw-w-[33%]" />
        <h1 className="tw-uppercase tw-text-center tw-text-[#345581] tw-text-[16px] tw-font-semibold">
          {item?.position}
        </h1>
      </header>
      <main className="tw-flex tw-flex-col tw-items-center tw-gap-2">
        {Array.isArray(userChats) &&
          userChats.map((e) => {
            return (
              <p key={e.id} className="tw-font-semibold">
                {e?.name}
              </p>
            );
          })}
        {visaListTemp.map((e) => {
          return (
            <p key={e.id} className="tw-text-center">
              {e?.name}
            </p>
          );
        })}
        {termDateObj && (
          <p>
            <strong>До:</strong> {termDateObj?.date}
          </p>
        )}
        {visaStatusTemp?.name?.length ? (
          <p>
            <strong>Статус:</strong> {visaStatusTemp?.name}
          </p>
        ) : (
          <></>
        )}
      </main>
      <footer className="tw-flex tw-flex-col tw-gap-2">
        <div className="wrapper-signature tw-flex">
          <div className="signature tw-flex tw-flex-col">
            <SignIncoming sign={sign} />
            <p className="tw-font-semibold tw-text-[#345581]">{item?.name}</p>
          </div>
        </div>
        {visaDate && (
          <div className="term tw-flex tw-gap-2">
            <p className="tw-underline tw-text-[#345581] tw-font-semibold">
              «{day}»
            </p>
            <p className="tw-underline tw-text-[#345581] tw-font-semibold">
              &emsp;&emsp;&emsp;{month}&emsp;&emsp;&emsp;
            </p>
            <p className="tw-text-[#345581] tw-font-semibold">{year}c.</p>
          </div>
        )}
      </footer>
    </div>
  );
};

export default MemoVisa;
