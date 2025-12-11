import { ModuleCard } from "@components";
import { Loading, EmptyPlaceholder, Firework } from "@ui";
import { motion } from "framer-motion";

import { useFetchModulesQuery } from "@services/modulesApi";
import { useSession } from "@hooks";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const HomePage = () => {
  const { status } = useSession();

  const { data: edomodules, isFetching } = useFetchModulesQuery();
  const navigate = useNavigate();
  
  const BG_ANIMATION = Number(import.meta.env.VITE_PUBLIC_BG_ANIMATION) === 1 ? 'bg-edo' : ''

    useEffect(() => {
    if (status === "authenticated") {
      navigate("/users/me/profile", { replace: true });
    }
  }, [status, navigate]);

  return (
    <>
      <motion.div exit={{ opacity: 0 }}>
        {status === "authenticated" ? (
          <div
            className="tw-container"
            style={{ position: "relative", zIndex: 0 }}
          >
            <img src="/public/images/kasri millat.jpg" />
            <div
              style={{ margin: 2 }}
              className={`tw-bg-white bg-anime tw-rounded-lg tw-pt-[18px] tw-pb-14 tw-px-6 tw-relative tw-min-h-[calc(100vh-550px)] ${BG_ANIMATION}`}
            >
              <div className="tw-bg-white tw-w-fit ">
                {/* <h2 className="tw-mb-8 tw-font-bol">fff</h2> */}
              </div>

              {isFetching ? (
                <div className="tw-absolute tw-top-[50%] tw-left-[50%] tw-translate-x-[-50%] tw-translate-y-[-50%]">
                  <Loading />
                </div>
              ) : (
                <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-6">
                  {edomodules?.items && edomodules?.items.length > 0 ? (
                    <>
                      {edomodules.items
                        .filter((item: any) => item.mainModul)
                        .map((module) => (
                          <Link
                            key={module.name}
                            to={
                              module.disabled
                                ? ""
                                : `/modules/${module.modulName}`
                            }
                          >
                            <ModuleCard
                              title={module.name}
                              description={module.description}
                              disabled={module.disabled}
                              image={
                                module.image ||
                                "/images/" + module.modulName + ".png"
                              }
                              count={module.count}
                            />
                          </Link>
                        ))}
                    </>
                  ) : (
                    <EmptyPlaceholder />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </motion.div>
      <Firework />
    </>
  );
};
