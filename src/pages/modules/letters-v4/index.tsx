import { ModuleCard } from "@components";
import { Loading } from "@ui";
import { useEffect, useMemo, useState } from "react";
import { useFetchModulesQuery } from "@services/modulesApi";
import { Link } from "react-router-dom";

type Props = {};

export const LettersV4ModulePage = (props: Props) => {
  const { data: edoModules, isSuccess } = useFetchModulesQuery();

  const [edoModule, setEdomodule] = useState<EDOModule>();
  const [edoSubmodules = [], setEdosubmodules] = useState<Array<EDOModule>>();

  useEffect(() => {
    const edoModuleName = "letters-v4";

    if (isSuccess) {
      const res = edoModules?.items.find((m) => m.modulName === edoModuleName);
      setEdomodule(res);
      if (res?.subModuls) {
        setEdosubmodules(res.subModuls);
      }
    }
  }, [isSuccess, edoModules]);

  const [module, subModules] = useMemo(() => {
    const res = edoModules?.items.find((m) => m.modulName === "letters-v4");

    return [res, res?.subModuls ?? []];
  }, [isSuccess, edoModules]);

  return (
    <div className="tw-container tw-pt-10 tw-pb-24">
      {module ? (
        <>
          <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-6">
            {subModules.length > 0 ? (
              <>
                {subModules
                  .filter((item: any) => item.mainModul)
                  .map((module) => (
                    <Link
                      key={module.name}
                      to={`/modules/letters-v4/${module.modulName}`}
                    >
                      <ModuleCard
                        title={module.name}
                        description={module.description}
                        disabled={false}
                      />
                    </Link>
                  ))}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
