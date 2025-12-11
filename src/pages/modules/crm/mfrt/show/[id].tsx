import { SignatureSample } from "@components";
import { Loading, SWRError } from "@ui";
import { useParams } from "react-router";
import { useFetchSignaturesSampleCardByIdQuery } from "@services/signatureCardApi";

export const CrmMFRTShowPage = () => {
  const params = useParams();
  const signatureId = parseInt(params.id as string);
  const {
    data: application = {} as SignatureSamples.Card,
    isSuccess,
    isFetching,
  } = useFetchSignaturesSampleCardByIdQuery(signatureId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <SignatureSample new={false} entry={application} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
