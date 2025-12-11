import { Menu, Transition } from "@headlessui/react";
import { LogoutIcon, ProfileIcon, ChevronDownIcon } from "@ui";
import { Fragment, PropsWithChildren, useContext } from "react";
import { Avatar, Tooltip } from "@mui/material";
import { useFetchModulesQuery } from "@services/modulesApi";
import { useSession } from "@hooks";
import { RuTokenContext } from "@root/components/auth/RuToken";
import { Link } from "react-router-dom";
import { TokenControllContext } from "@root/components/auth/TokenAuth";
import { signOut } from "../configs";
import { CertificateContext } from "@components";

const ItemWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="tw-p-2 tw-group tw-flex tw-items-center tw-gap-4 tw-w-full tw-rounded-md tw-text-sm tw-transition hover:tw-bg-slate-100">
      {children}
    </div>
  );
};

const IconWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="tw-w-8 tw-h-8 tw-p-1 tw-bg-slate-200 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-blue-400">
      {children}
    </div>
  );
};

export const UserMenuDropdown = ({
  title,
  avatar,
}: PropsWithChildren<{ title?: string; avatar?: string }>) => {
  const rutoken = useContext(RuTokenContext);
  const { data } = useSession();
  const { data: edomodules, isFetching } = useFetchModulesQuery();

  const { resetToken } = useContext(TokenControllContext);
  const certificateControl = useContext(CertificateContext);
  const handleLogout = () => {
    signOut();
    resetToken && resetToken(false);
    certificateControl.resetToken();
    if (rutoken && data?.rutoken?.deviceId) {
      rutoken.pluginObject.logout(data.rutoken.deviceId).then();
    }
  };

  let d: boolean | undefined = edomodules?.items?.some(
    (item) => item.name === "Администрирование"
  );

  return (
    <div>
      <Menu as="div" className="tw-relative">
        {({ open }) => (
          <>
            <ItemWrapper>
              <Menu.Button className="tw-py-2 tw-px-4 tw-flex tw-gap-4 tw-items-center !tw-bg-transparent">
                <Avatar
                  alt={"unkhown"}
                  src={avatar || ""}
                  sx={{ width: 40, height: 40 }}
                />
                <Tooltip
                  title={title && title.length > 19 ? title : ""}
                  placement="bottom-start"
                >
                  <p className="tw-max-w-[140px] tw-truncate">
                    {title || "Профиль"}
                  </p>
                </Tooltip>
                <ChevronDownIcon />
              </Menu.Button>
            </ItemWrapper>
            {open && (
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="tw-z-10 tw-absolute tw-w-56 tw-right-0 tw-mt-2 tw-p-1 tw-border tw-border-slate-100 tw-origin-top-right tw-bg-white tw-shadow-lg tw-divide-y tw-divide-gray-100 tw-rounded-md focus:tw-outline-none"
                >
                  {d && (
                    <Menu.Item>
                      <Link to="/users/me/admin">
                        <ItemWrapper>
                          <IconWrapper>
                            <ProfileIcon />
                          </IconWrapper>
                          Администрирование
                        </ItemWrapper>
                      </Link>
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    <Link to="/users/me/profile">
                      <ItemWrapper>
                        <IconWrapper>
                          <ProfileIcon />
                        </IconWrapper>
                        Профиль
                      </ItemWrapper>
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    as="button"
                    onClick={handleLogout}
                    className="tw-w-full"
                  >
                    <ItemWrapper>
                      <IconWrapper>
                        <LogoutIcon />
                      </IconWrapper>
                      Выход
                    </ItemWrapper>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};
