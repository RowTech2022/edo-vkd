import EgovFullServiceCreate from "@root/components/EDO/EgovFull/Service/create";
import { useParams } from "react-router";
import { ModuleEgovFullLayout } from "@layouts";

export const EgovFullOrganizationServiceCreatePage = () => {
  const query = useParams();
  const orgId = query.fid ? Number(query.fid) : 0;
  const srvId = query.sid ? Number(query.sid) : 0;

  return (
    <ModuleEgovFullLayout>
      <EgovFullServiceCreate orgId={orgId} srvId={srvId} />
    </ModuleEgovFullLayout>
  );
};
