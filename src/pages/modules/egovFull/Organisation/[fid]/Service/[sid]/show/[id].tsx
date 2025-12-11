import EgovFullServiceShow from "@root/components/EDO/EgovFull/Service/show";

import { useParams } from "react-router";

export const EgovFullOrganizationServiceShowPage = () => {
  const params = useParams();
  const id = params.id as string;
  return <EgovFullServiceShow id={Number(id)} />;
};
