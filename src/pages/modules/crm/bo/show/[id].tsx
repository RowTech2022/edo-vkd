import { MFAccessForm } from "@components";
import { Loading, SWRError1 } from "@ui";
import { useFetchMfAccessFormByIdQuery } from "@services/accessMfApi";
import { useParams } from "react-router";

export const CrmBOShowPage = () => {
  const { id } = useParams();

  const mfAccessFormId = parseInt(id as string);

  const dat = useFetchMfAccessFormByIdQuery(mfAccessFormId);

  return (
    <>
      {dat.isFetching ? (
        <Loading />
      ) : dat.isSuccess ? (
        <MFAccessForm entry={dat.data} />
      ) : (
        <SWRError1 message={(dat.error as any)?.data?.Message} />
      )}
    </>
  );
};
