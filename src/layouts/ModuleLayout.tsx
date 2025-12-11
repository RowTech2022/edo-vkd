import { PropsWithChildren, useMemo } from "react";
import cn from "classnames";
import { useFetchModulesQuery } from "@services/modulesApi";
import { useLocation, useNavigate } from "react-router";
import { Loading } from "@ui";
import { Link } from "react-router-dom";

type Props = {
  ignoreSub?: boolean;
};

export const ModuleLayout = ({
  children,
  ignoreSub,
}: PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    data: edoModules,
    isFetching,
    isSuccess,
    isError,
  } = useFetchModulesQuery();

  // const [currentModule, setCurrentModule] = useState<EDOModule>();
  // const [currentSubModule, setCurrentSubModule] = useState<EDOModule[]>();

  const [currentModule, currentSubModule] = useMemo(() => {
    if (!isSuccess || !edoModules) return [null, []];

    let str = pathname.substring("/modules/".length);
    let m_modul = "";
    let m_subModul = "";
    let ind = str.indexOf("/");

    if (ind === -1) {
      m_modul = str;
    } else {
      m_modul = str.substring(0, ind).trim();
      let strSub = str.substring(ind + 1).trim();
      let ind2 = strSub.indexOf("/");
      m_subModul = ind2 === -1 ? strSub : strSub.substring(0, ind2).trim();
    }

    let currentModule = edoModules.items.find(
      (module) => module.modulName === m_modul
    );

    if (!currentModule) return [null, []];

    let currentSub = currentModule.subModuls?.find((module) =>
      pathname.includes(
        `/modules/${encodeURIComponent(
          currentModule.modulName
        )}/${encodeURIComponent(module.modulName)}`
      )
    );

    if (currentSub) {
      return [currentModule, currentSub.subModuls];
    }

    for (let t1 of currentModule.subModuls ?? []) {
      let ee = t1.subModuls?.find((sm: any) => sm.modulName === m_subModul);
      if (ee) {
        let currentname2 = currentModule.subModuls?.find(
          (module) => module.modulName === ee.parentModul
        );
        return [currentModule, currentname2?.subModuls ?? []];
      }
    }

    return [currentModule, []];
  }, [isSuccess, edoModules, pathname]);

  const isModuleActive = (moduleName: string) =>
    pathname.split("/")[2] === moduleName;

  const isSubmoduleActive = (submoduleName: string) =>
    pathname.includes(submoduleName) ||
    ((pathname.includes("corIncoming") ||
      pathname.includes("corExecution") ||
      pathname.includes("outcomming")) &&
      submoduleName === "corIncoming");

  const isProfilePage = pathname.startsWith("/users/me/admin/profile");

  return (
    <div className="tw-container">
      {isFetching ? (
        <div className="tw-py-4">
          <Loading />
        </div>
      ) : isError ? (
        <p className="tw-py-4 tw-text-amber-600">
          Не удалось загрузить данные.
        </p>
      ) : (
        <>
          {!isProfilePage &&
            edoModules?.items &&
            edoModules?.items.length > 0 && (
              <>
                <div
                  id="modules-nav"
                  className="tw-py-4 tw-overflow-hidden tw-overflow-x-auto tw-no-scrollbar"
                >
                  <nav className="tw-flex tw-items-center tw-border-b-4 tw-border-b-slate-400">
                    {edoModules?.items
    ?.filter((item: any) => item.mainModul && item.name === "Письма-V4")
    .map((module) => {
      const displayName =
      module.name === "Письма-V4"
        ? "Корреспонденция"
        : module.name;

      return   <Link
      key={module.id}
      to={`/modules/${encodeURIComponent(
        module.modulName
      )}`}
      className={cn(
        "tw-py-4 tw-px-6 -tw-mb-1 hover:tw-bg-slate-100 tw-text-white tw-font-semibold tw-whitespace-nowrap tw-border-b-4 tw-transition hover:tw-text-slate-900 hover:tw-border-b-secondary ",
        {
          "!tw-text-slate-900 !tw-border-b-secondary":
            isModuleActive(module.modulName),
          "tw-border-b-transparent": !isModuleActive(
            module.modulName
          ),
        }
      )}
    >
      {displayName}
    </Link>
    } 
                      
                      )}
                  </nav>
                </div>
                {currentModule?.subModuls &&
                  currentModule?.subModuls.length > 0 && (
                    <div
                      id="submodules-nav"
                      className="tw-mb-4 tw-py-6 tw-px-4 tw-bg-white tw-rounded-lg tw-overflow-hidden tw-overflow-x-auto tw-no-scrollbar tw-shadow-[0_0_4px_0_#00000025]"
                    >
                      <nav className="tw-grid tw-grid-cols-[1fr_1fr_1fr_1fr] tw-h-full tw-gap-3 tw-items-center">
                        {currentModule?.subModuls?.map((submodule, index) => (
                          <Link
                            key={index}
                            to={`/modules/${currentModule.modulName}/${submodule.modulName}`}
                            className={cn(
                              "tw-flex tw-items-center tw-justify-center tw-py-2 tw-px-3 tw-border tw-rounded-lg tw-h-full tw-text-center",
                              {
                                "tw-border-secondary": isSubmoduleActive(
                                  submodule.modulName
                                ),
                                "tw-border-slate-100": !isSubmoduleActive(
                                  submodule.modulName
                                ),
                              }
                            )}
                          >
                            {submodule.name}
                          </Link>
                        ))}
                      </nav>
                      {currentSubModule && currentSubModule?.length > 0 && (
                        <div className="tw-grid tw-grid-cols-[1fr_1fr_1fr_1fr] tw-h-full tw-gap-3 tw-items-center tw-mt-4">
                          {currentSubModule.map((submodule2, i) => {
                            const path = `/modules/${currentModule?.modulName}/${submodule2?.parentModul}/${submodule2?.modulName}`;
                            return (
                              <Link
                                key={i}
                                to={path}
                                className={cn(
                                  "tw-flex tw-items-center tw-justify-center tw-py-2 tw-px-3 tw-border tw-rounded-lg tw-h-full tw-text-center",
                                  {
                                    "!tw-border-secondary":
                                      pathname.includes(path),
                                  }
                                )}
                              >
                                {submodule2.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
              </>
            )}
          <div>{children}</div>
        </>
      )}
    </div>
  );
};
