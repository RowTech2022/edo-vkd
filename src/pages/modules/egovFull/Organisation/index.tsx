import { EgovFullRegistry , EgovFullServiceRegistry } from "@components";
import { Loading } from "@ui";
import { ModuleEgovFullLayout } from "@layouts";

import { useParams } from "react-router";

type Props = {};

export const EgovFullOrganizationRegistryPage = (props: Props) => {
  const query = useParams();
  const orgId = query.fid ? Number(query.fid) : 0;
  const srvId = query.sid ? Number(query.sid) : 0;

  if (!orgId && !srvId) return <Loading />;

  return (
    <ModuleEgovFullLayout>
      {orgId && srvId === 0 ? (
        <EgovFullRegistry orgId={orgId} />
      ) : (
        <EgovFullServiceRegistry orgId={orgId} srvId={srvId} />
      )}
    </ModuleEgovFullLayout>
  );
};
