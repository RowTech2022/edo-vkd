import EgovCreate from "@root/components/EDO/Egov/ApplicationResident";

import { useParams } from "react-router";

export const EgovApplicationOfResidentShowPage = () => {
  const params = useParams();
  const id = params.id as string;
  return <EgovCreate id={Number(id)} />;
};
