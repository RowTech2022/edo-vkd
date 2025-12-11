import { ModuleCard } from "@components";
import { Loading } from "@ui";
import { useEffect, useState } from "react";
import { useFetchModulesQuery } from "@services/modulesApi";
import { Link } from "react-router-dom";

export const RequestsModulePage = () => {
  const { data: edoModules, isSuccess } = useFetchModulesQuery();

  const [edoModule, setEdomodule] = useState<EDOModule>();
  const [edoSubmodules = [], setEdosubmodules] = useState<Array<EDOModule>>();

  useEffect(() => {
    const edoModuleName = "requests";

    if (isSuccess) {
      const res = edoModules?.items.find((m) => m.modulName === edoModuleName);
      setEdomodule(res);
      if (res?.subModuls) {
        setEdosubmodules(res.subModuls);
      }
    }
  }, [isSuccess, edoModules]);

  return (
    <div className="tw-container tw-pt-10 tw-pb-24">
      {edoModule ? (
        <>
          <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-6">
            {edoSubmodules.length > 0 ? (
              <>
                {edoSubmodules
                  .filter((item: any) => item.mainModul)
                  .map((module) => (
                    <Link
                      key={module.name}
                      to={`/modules/requestsmodul/${module.modulName}`}
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
