import EgovFullCreate from "@root/components/EDO/EgovFull/Organisation/create";

import { useParams } from "react-router";
import { ModuleEgovFullLayout } from "@layouts";

export const EgovFullOrganizationShowPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <ModuleEgovFullLayout>
      <EgovFullCreate id={Number(id)} />
    </ModuleEgovFullLayout>
  );
};
