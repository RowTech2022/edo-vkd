import { MFAccessForm } from "@components";
import { Loading, SWRError1 } from "@ui";
import { useParams } from "react-router";
import { useFetchMfAccessFormByIdQuery } from "@services/accessMfApi";

export const MFAccessFormsShowPage = () => {
  const params = useParams();

  const mfAccessFormId = parseInt(params.id as string);

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
