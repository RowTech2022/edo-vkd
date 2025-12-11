import { Loading } from "@ui";
import { useEffect, useState } from "react";
import { useLazyFetchMyOrganisationsQuery } from "@services/userprofileApi";
import { useSession } from "@hooks";
import { useNavigate } from "react-router";
import { ModuleEgovFullLayout } from "@layouts";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

type Props = {};

export const EgovFullModulePage = (props: Props) => {
  const { data: session } = useSession();
  const { data: details } = useFetchUserDetailsQuery();
  const admin = details?.roles?.includes(1);
  const navigate = useNavigate();

  const [fetchAllOrganisations, { isFetching, isSuccess, isError }] =
    useLazyFetchMyOrganisationsQuery();
  const [orgs, setOrgs] = useState<any>([details?.userCompany]);

  const fetchAllOrgs = async () => {
    const { data } = await fetchAllOrganisations();
    if (data?.items) setOrgs(data.items);
  };

  useEffect(() => {
    if (admin) {
      fetchAllOrgs();
    }
  }, [admin, session]);

  useEffect(() => {
    if (orgs?.length && orgs[0]) {
      navigate(`/modules/egovFull/Organisation/${orgs?.[0]?.id}`);
    }
  }, [orgs]);

  if (isFetching) return <Loading />;

  if (isError) return <div className="tw-bg-red-400">eeee</div>;

  return (
    <ModuleEgovFullLayout>
      <div>По запросу организации ничего не найдено</div>
    </ModuleEgovFullLayout>
  );
};
